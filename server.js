const express = require('express');
const rateLimit = require('express-rate-limit');
const Redis = require('redis');
const Queue = require('bull');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const winston = require('winston');

// Configuração do Logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy para Railway
app.set('trust proxy', true);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rate limiting configurado para Railway
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // limite de 10 requests por IP
  message: 'Muitas tentativas. Tente novamente em 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false,
  trustProxy: true
});

app.use('/api', limiter);

// Redis client para cache
let redisClient;
let downloadQueue;

// Inicialização do Redis
async function initializeRedis() {
  try {
    const redisUrl = process.env.REDIS_URL;
    
    if (!redisUrl) {
      logger.warn('REDIS_URL não configurada, rodando sem cache');
      return false;
    }
    
    logger.info(`Tentando conectar ao Redis: ${redisUrl}`);
    
    redisClient = Redis.createClient({
      url: redisUrl,
      socket: {
        reconnectStrategy: false, // Não tentar reconectar automaticamente
        connectTimeout: 5000
      }
    });

    redisClient.on('error', (err) => {
      logger.error('Erro no Redis:', err.message);
    });

    redisClient.on('connect', () => {
      logger.info('Conectado ao Redis');
    });

    await redisClient.connect();
    
    // Queue para processar downloads
    downloadQueue = new Queue('download queue', redisUrl);
    
    logger.info('Redis e Queue inicializados com sucesso');
    return true;
  } catch (error) {
    logger.error('Erro ao inicializar Redis:', error.message);
    logger.warn('Continuando sem Redis...');
    return false;
  }
}

// Validação de URL
function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

// Função para extrair áudio usando yt-dlp
function extractAudio(url, outputPath) {
  return new Promise((resolve, reject) => {
    // Verificar se yt-dlp está disponível
    exec('which yt-dlp', (error) => {
      if (error) {
        logger.error('yt-dlp não encontrado');
        reject(new Error('yt-dlp não está instalado'));
        return;
      }
      
      const command = `yt-dlp -x --audio-format mp3 --output "${outputPath}/%(title)s.%(ext)s" "${url}"`;
      
      logger.info(`Executando comando: ${command}`);
      
      exec(command, { timeout: 60000 }, (error, stdout, stderr) => {
        logger.info(`stdout: ${stdout}`);
        logger.info(`stderr: ${stderr}`);
        
        if (error) {
          logger.error('Erro no yt-dlp:', error);
          logger.error('stderr:', stderr);
          reject(new Error(`Erro no yt-dlp: ${error.message}`));
          return;
        }
        
        // Extrair o nome do arquivo da saída
        const match = stdout.match(/\[ExtractAudio\] Destination: (.+)/);
        if (match) {
          resolve(match[1]);
        } else {
          // Tentar encontrar arquivos MP3 na pasta
          const fs = require('fs');
          try {
            const files = fs.readdirSync(outputPath).filter(f => f.endsWith('.mp3'));
            if (files.length > 0) {
              resolve(path.join(outputPath, files[0]));
            } else {
              reject(new Error('Nenhum arquivo MP3 encontrado'));
            }
          } catch (fsError) {
            reject(new Error('Erro ao listar arquivos'));
          }
        }
      });
    });
  });
}

// Processamento da Queue
async function setupQueue() {
  if (!downloadQueue) {
    logger.error('Queue não inicializada');
    return;
  }

  downloadQueue.process(async (job) => {
    const { url, jobId } = job.data;
    
    try {
      logger.info(`Iniciando download: ${url}`);
      
      const outputDir = path.join(__dirname, 'downloads');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
        logger.info('Pasta downloads criada');
      }
      
      const audioFile = await extractAudio(url, outputDir);
      
      // Cache do resultado
      if (redisClient && redisClient.isOpen) {
        await redisClient.setex(`download:${jobId}`, 3600, JSON.stringify({
          status: 'completed',
          file: audioFile,
          timestamp: Date.now()
        }));
      }
      
      logger.info(`Download concluído: ${audioFile}`);
      return { success: true, file: audioFile };
      
    } catch (error) {
      logger.error(`Erro no download: ${error.message}`);
      logger.error(`Stack trace: ${error.stack}`);
      
      // Cache do erro
      if (redisClient && redisClient.isOpen) {
        await redisClient.setex(`download:${jobId}`, 3600, JSON.stringify({
          status: 'failed',
          error: error.message,
          timestamp: Date.now()
        }));
      }
      
      throw error;
    }
  });
}

// Rotas da API
app.post('/api/download', async (req, res) => {
  const { url } = req.body;
  
  if (!url || !isValidUrl(url)) {
    return res.status(400).json({ error: 'URL inválida' });
  }
  
  try {
    // Verificar se Redis está conectado
    if (!redisClient || !redisClient.isOpen) {
      logger.error('Redis não está conectado');
      return res.status(500).json({ error: 'Serviço temporariamente indisponível' });
    }
    
    // Verificar cache
    const cacheKey = `url:${Buffer.from(url).toString('base64')}`;
    const cached = await redisClient.get(cacheKey);
    
    if (cached) {
      logger.info('Retornando resultado do cache');
      return res.json(JSON.parse(cached));
    }
    
    // Criar job na queue
    const jobId = Date.now().toString();
    
    if (!downloadQueue) {
      logger.error('Queue não está disponível');
      return res.status(500).json({ error: 'Serviço de download não disponível' });
    }
    
    const job = await downloadQueue.add({ url, jobId });
    
    logger.info(`Job criado: ${jobId} para URL: ${url}`);
    
    res.json({
      jobId,
      status: 'processing',
      message: 'Download iniciado. Use /api/status/:jobId para verificar o progresso.'
    });
    
  } catch (error) {
    logger.error('Erro ao processar download:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/api/status/:jobId', async (req, res) => {
  const { jobId } = req.params;
  
  try {
    if (!redisClient || !redisClient.isOpen) {
      return res.status(500).json({ error: 'Serviço temporariamente indisponível' });
    }
    
    const result = await redisClient.get(`download:${jobId}`);
    
    if (!result) {
      return res.status(404).json({ error: 'Job não encontrado' });
    }
    
    res.json(JSON.parse(result));
    
  } catch (error) {
    logger.error('Erro ao verificar status:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/api/download/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, 'downloads', filename);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Arquivo não encontrado' });
  }
  
  res.download(filePath, (err) => {
    if (err) {
      logger.error('Erro ao fazer download:', err);
      res.status(500).json({ error: 'Erro ao fazer download' });
    }
  });
});

// Limpeza de arquivos antigos (executar a cada hora)
setInterval(() => {
  const downloadDir = path.join(__dirname, 'downloads');
  const oneHourAgo = Date.now() - (60 * 60 * 1000);
  
  fs.readdir(downloadDir, (err, files) => {
    if (err) return;
    
    files.forEach(file => {
      const filePath = path.join(downloadDir, file);
      fs.stat(filePath, (err, stats) => {
        if (err) return;
        
        if (stats.mtime.getTime() < oneHourAgo) {
          fs.unlink(filePath, (err) => {
            if (err) logger.error('Erro ao deletar arquivo:', err);
            else logger.info(`Arquivo deletado: ${file}`);
          });
        }
      });
    });
  });
}, 60 * 60 * 1000); // 1 hora

// Inicializar servidor
async function startServer() {
  try {
    // Inicializar Redis primeiro
    const redisOk = await initializeRedis();
    
    if (!redisOk) {
      logger.warn('Redis não conectou, mas servidor continuará sem cache');
    }
    
    // Configurar queue se Redis estiver disponível
    if (redisClient && redisClient.isOpen) {
      await setupQueue();
    }
    
    // Iniciar servidor
    app.listen(PORT, () => {
      logger.info(`Servidor rodando na porta ${PORT}`);
    });
    
  } catch (error) {
    logger.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('Recebido SIGTERM, fechando servidor...');
  try {
    if (downloadQueue) {
      await downloadQueue.close();
    }
    if (redisClient && redisClient.isOpen) {
      await redisClient.quit();
    }
  } catch (error) {
    logger.error('Erro no shutdown:', error);
  }
  process.exit(0);
});

// Iniciar aplicação
startServer();