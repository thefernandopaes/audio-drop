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
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console()
  ]
});

const app = express();
const PORT = process.env.PORT || 3000;

// Redis client para cache
const redisClient = Redis.createClient(process.env.REDIS_URL);

// Queue para processar downloads
const downloadQueue = new Queue('download queue', process.env.REDIS_URL);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // limite de 10 requests por IP
  message: 'Muitas tentativas. Tente novamente em 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

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
    const command = `yt-dlp -x --audio-format mp3 --output "${outputPath}/%(title)s.%(ext)s" "${url}"`;
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        logger.error('Erro no yt-dlp:', error);
        reject(error);
        return;
      }
      
      // Extrair o nome do arquivo da saída
      const match = stdout.match(/\[ExtractAudio\] Destination: (.+)/);
      if (match) {
        resolve(match[1]);
      } else {
        resolve(stdout);
      }
    });
  });
}

// Processamento da Queue
downloadQueue.process(async (job) => {
  const { url, jobId } = job.data;
  
  try {
    logger.info(`Iniciando download: ${url}`);
    
    const outputDir = path.join(__dirname, 'downloads');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const audioFile = await extractAudio(url, outputDir);
    
    // Cache do resultado
    await redisClient.setex(`download:${jobId}`, 3600, JSON.stringify({
      status: 'completed',
      file: audioFile,
      timestamp: Date.now()
    }));
    
    logger.info(`Download concluído: ${audioFile}`);
    return { success: true, file: audioFile };
    
  } catch (error) {
    logger.error(`Erro no download: ${error.message}`);
    
    await redisClient.setex(`download:${jobId}`, 3600, JSON.stringify({
      status: 'failed',
      error: error.message,
      timestamp: Date.now()
    }));
    
    throw error;
  }
});

// Rotas da API
app.post('/api/download', async (req, res) => {
  const { url } = req.body;
  
  if (!url || !isValidUrl(url)) {
    return res.status(400).json({ error: 'URL inválida' });
  }
  
  try {
    // Verificar cache
    const cacheKey = `url:${Buffer.from(url).toString('base64')}`;
    const cached = await redisClient.get(cacheKey);
    
    if (cached) {
      logger.info('Retornando resultado do cache');
      return res.json(JSON.parse(cached));
    }
    
    // Criar job na queue
    const jobId = Date.now().toString();
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

// Iniciar servidor
app.listen(PORT, () => {
  logger.info(`Servidor rodando na porta ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('Recebido SIGTERM, fechando servidor...');
  await downloadQueue.close();
  await redisClient.quit();
  process.exit(0);
});