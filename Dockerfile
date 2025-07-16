FROM node:18-alpine

# Instalar dependências do sistema
RUN apk add --no-cache \
    python3 \
    py3-pip \
    ffmpeg \
    && pip3 install --no-cache-dir yt-dlp

# Criar diretório da aplicação
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências do Node.js
RUN npm ci --only=production

# Copiar código da aplicação
COPY . .

# Criar diretório para downloads
RUN mkdir -p downloads

# Expor a porta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]