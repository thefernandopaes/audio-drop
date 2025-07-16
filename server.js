const express = require('express');
const rateLimit = require('express-rate-limit');
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

// Contador de downloads
let downloadCount = 0;

// Rate limiting mais permissivo
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 5, // 5 requests por IP
  message: { error: 'Muitas tentativas. Tente novamente em 10 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || 'anonymous'
});

app.use('/api/download', limiter);

// Nova rota para obter estatísticas
app.get('/api/stats', (req, res) => {
  res.json({
    totalDownloads: downloadCount,
    status: 'active'
  });
});

// Validação de URL
function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

// Função para gerar nome de arquivo seguro
function sanitizeFilename(filename) {
  return filename
    .replace(/[<>:"/\\|?*]/g, '') // Remove caracteres inválidos
    .replace(/\s+/g, '_')         // Substitui espaços por underscore
    .substring(0, 100);           // Limita tamanho
}

// Rota para download DIRETO
app.post('/api/download', async (req, res) => {
  const { url } = req.body;
  
  if (!url || !isValidUrl(url)) {
    return res.status(400).json({ error: 'URL inválida' });
  }

  try {
    logger.info(`Iniciando download direto: ${url}`);

    // Criar pasta temporária
    const tempDir = path.join(__dirname, 'temp', Date.now().toString());
    fs.mkdirSync(tempDir, { recursive: true });

    // Comando yt-dlp
    const command = `yt-dlp --no-playlist -x --audio-format mp3 --output "${tempDir}/%(title)s.%(ext)s" "${url}"`;
    
    logger.info(`Executando: ${command}`);

    exec(command, { timeout: 180000 }, (error, stdout, stderr) => {
      if (error) {
        logger.error('Erro no yt-dlp:', error);
        
        // Limpar pasta temp
        fs.rmSync(tempDir, { recursive: true, force: true });
        
        return res.status(500).json({ 
          error: 'Erro ao processar vídeo. Verifique a URL.' 
        });
      }

      try {
        // Encontrar arquivo MP3
        const files = fs.readdirSync(tempDir).filter(f => f.endsWith('.mp3'));
        
        if (files.length === 0) {
          fs.rmSync(tempDir, { recursive: true, force: true });
          return res.status(500).json({ error: 'Nenhum arquivo MP3 gerado' });
        }

        const audioFile = files[0];
        const filePath = path.join(tempDir, audioFile);
        const sanitizedName = sanitizeFilename(audioFile);

        logger.info(`Arquivo gerado: ${audioFile}`);

        // Configurar headers para download
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Disposition', `attachment; filename="${sanitizedName}"`);
        
        // Stream do arquivo para o cliente
        const fileStream = fs.createReadStream(filePath);
        
        fileStream.pipe(res);
        
        // Incrementar contador quando download for bem-sucedido
        downloadCount++;
        logger.info(`Download #${downloadCount} concluído: ${audioFile}`);
        
        // Limpar após enviar
        fileStream.on('end', () => {
          logger.info('Arquivo enviado, limpando arquivos temporários');
          setTimeout(() => {
            fs.rmSync(tempDir, { recursive: true, force: true });
          }, 1000);
        });

        fileStream.on('error', (err) => {
          logger.error('Erro no stream:', err);
          fs.rmSync(tempDir, { recursive: true, force: true });
          if (!res.headersSent) {
            res.status(500).json({ error: 'Erro ao enviar arquivo' });
          }
        });

      } catch (err) {
        logger.error('Erro ao processar arquivo:', err);
        fs.rmSync(tempDir, { recursive: true, force: true });
        res.status(500).json({ error: 'Erro ao processar arquivo' });
      }
    });

  } catch (error) {
    logger.error('Erro geral:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota de status (para compatibilidade com frontend)
app.get('/api/status/:jobId', (req, res) => {
  res.json({ 
    status: 'completed',
    message: 'Use o endpoint /api/download diretamente'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Limpeza geral de arquivos temporários
setInterval(() => {
  const tempBaseDir = path.join(__dirname, 'temp');
  
  if (fs.existsSync(tempBaseDir)) {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    
    fs.readdir(tempBaseDir, (err, dirs) => {
      if (err) return;
      
      dirs.forEach(dir => {
        const dirPath = path.join(tempBaseDir, dir);
        const dirTime = parseInt(dir);
        
        if (!isNaN(dirTime) && dirTime < oneHourAgo) {
          fs.rmSync(dirPath, { recursive: true, force: true });
          logger.info(`Pasta temporária removida: ${dir}`);
        }
      });
    });
  }
}, 30 * 60 * 1000); // A cada 30 minutos

// Iniciar servidor
app.listen(PORT, () => {
  logger.info(`Servidor rodando na porta ${PORT}`);
  logger.info('Modo: Download direto (sem Redis/Queue)');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('Recebido SIGTERM, limpando e fechando...');
  
  // Limpar pasta temp
  const tempDir = path.join(__dirname, 'temp');
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  
  process.exit(0);
});