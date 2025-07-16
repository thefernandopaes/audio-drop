# AudioDrop

Aplicação web para extração de áudio MP3 de vídeos online.

## 🚀 Funcionalidades

- Extração de áudio MP3 de vídeos do YouTube e outros sites
- Interface minimalista e responsiva
- Sistema de queue para processar downloads
- Cache Redis para otimizar performance
- Rate limiting para evitar sobrecarga
- Limpeza automática de arquivos temporários

## 🛠️ Stack Tecnológica

**Frontend:**
- HTML5 + CSS3 + JavaScript Vanilla
- Tailwind CSS
- Interface responsiva

**Backend:**
- Node.js + Express
- Redis (cache e queue)
- Bull (gerenciamento de filas)
- yt-dlp (extração de áudio)
- Winston (logs)

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- Redis
- Python 3 + pip
- FFmpeg

### Configuração Local

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/audiodrop.git
   cd audiodrop
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Instale yt-dlp:**
   ```bash
   pip install yt-dlp
   ```

4. **Configure as variáveis de ambiente:**
   ```bash
   cp .env.example .env
   ```

5. **Inicie o Redis:**
   ```bash
   redis-server
   ```

6. **Execute a aplicação:**
   ```bash
   npm run dev
   ```

## 🚀 Deploy

### Railway

1. Conecte seu repositório ao Railway
2. Configure as variáveis de ambiente:
   - `REDIS_URL`
   - `PORT`
3. Deploy automático

### Docker

```bash
docker build -t audiodrop .
docker run -p 3000:3000 audiodrop
```

## 📝 API Endpoints

### POST /api/download
Inicia o download de um vídeo.

**Body:**
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Response:**
```json
{
  "jobId": "1234567890",
  "status": "processing",
  "message": "Download iniciado..."
}
```

### GET /api/status/:jobId
Verifica o status do download.

**Response:**
```json
{
  "status": "completed",
  "file": "/path/to/audio.mp3",
  "timestamp": 1234567890
}
```

### GET /api/download/:filename
Baixa o arquivo de áudio.

## ⚠️ Importante

- Use apenas com conteúdo que você tem direito de baixar
- Respeite os termos de uso dos sites
- Esta ferramenta é para uso educacional e pessoal

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.