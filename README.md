# AudioDrop

Web application for extracting MP3 audio from online videos.
https://audio-drop-production.up.railway.app/

## 🚀 Features

- MP3 audio extraction from YouTube videos and other sites
- Minimalist and responsive interface
- Queue system for processing downloads
- Redis cache for performance optimization
- Rate limiting to prevent overload
- Automatic cleanup of temporary files

## 🛠️ Tech Stack

**Frontend:**
- HTML5 + CSS3 + Vanilla JavaScript
- Tailwind CSS
- Responsive interface

**Backend:**
- Node.js + Express
- Redis (cache and queue)
- Bull (queue management)
- yt-dlp (audio extraction)
- Winston (logs)

## 📦 Installation

### Prerequisites
- Node.js 18+
- Redis
- Python 3 + pip
- FFmpeg

### Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/audiodrop.git
   cd audiodrop
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install yt-dlp:**
   ```bash
   pip install yt-dlp
   ```

4. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```

5. **Start Redis:**
   ```bash
   redis-server
   ```

6. **Run the application:**
   ```bash
   npm run dev
   ```

## 🚀 Deployment

### Railway

1. Connect your repository to Railway
2. Configure environment variables:
   - `REDIS_URL`
   - `PORT`
3. Automatic deployment

### Docker

```bash
docker build -t audiodrop .
docker run -p 3000:3000 audiodrop
```

## 📝 API Endpoints

### POST /api/download
Starts downloading a video.

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
  "message": "Download started..."
}
```

### GET /api/status/:jobId
Checks download status.

**Response:**
```json
{
  "status": "completed",
  "file": "/path/to/audio.mp3",
  "timestamp": 1234567890
}
```

### GET /api/download/:filename
Downloads the audio file.

## ⚠️ Important

- Only use with content you have the right to download
- Respect the terms of use of websites
- This tool is for educational and personal use

## 🤝 Contributing

1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details.
