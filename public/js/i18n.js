// Internationalization (i18n) System for AudioDrop
class I18n {
    constructor() {
        this.currentLocale = this.getDefaultLocale();
        this.translations = {
            'en': {
                // Header
                'title': 'AudioDrop - Download MP3 Audio',
                'subtitle': 'Transform videos into MP3 audio instantly',
                
                // Form
                'pasteUrl': 'Paste the video URL',
                'urlPlaceholder': 'https://www.youtube.com/watch?v=...',
                'downloadButton': 'Download MP3',
                'processingButton': 'Processing...',
                
                // Status Messages
                'processing': 'Processing your audio...',
                'processingSubtitle': 'Extracting the best possible audio ✨',
                'readyForDownload': 'Ready for download!',
                'downloadSuccess': 'Your MP3 audio was downloaded successfully 🎵',
                'pasteAnotherUrl': 'Paste another URL to download more audio!',
                'downloadFile': 'Download',
                'errorTitle': 'Oops! Something went wrong',
                'errorMessage': 'Try again in a few seconds',
                'requestError': 'Request error',
                'processingError': 'Processing error',
                'statusCheckError': 'Error checking status',
                
                // Features
                'superFast': 'Super Fast',
                'superFastDesc': 'Converts videos in seconds',
                'highQuality': 'High Quality',
                'highQualityDesc': 'Crystal clear MP3 audio',
                'safe': '100% Safe',
                'safeDesc': 'Your data protected',
                
                // Footer
                'statistics': '📊 Statistics',
                'downloadsCompleted': '🎵 Downloads completed:',
                'loading': 'Loading...',
                'warning': '⚠️ Only use with content you have the right to download',
                'compatibility': 'Works with YouTube, Vimeo, SoundCloud and much more',
                
                // Comments
                'loadInitialCounter': 'Load initial counter',
                'updateCounter': 'Update counter every 30 seconds',
                'addVisualEffects': 'Add visual effects to input',
                'directDownload': 'Direct download',
                'extractFilename': 'Extract filename from header or use default',
                'createTempLink': 'Create temporary link and download',
                'cleanupUrl': 'Clean up temporary URL',
                'resetInput': 'RESET INPUT',
                'updateCounter': 'Update counter',
                'noNeedForButton': 'No need for button anymore, download already happened',
                'initializeApp': 'Initialize the application'
            },
            'pt-BR': {
                // Header
                'title': 'AudioDrop - Baixar Áudio MP3',
                'subtitle': 'Transforme vídeos em áudio MP3 instantaneamente',
                
                // Form
                'pasteUrl': 'Cole a URL do vídeo',
                'urlPlaceholder': 'https://www.youtube.com/watch?v=...',
                'downloadButton': 'Baixar MP3',
                'processingButton': 'Processando...',
                
                // Status Messages
                'processing': 'Processando seu áudio...',
                'processingSubtitle': 'Extraindo o melhor áudio possível ✨',
                'readyForDownload': 'Pronto para download!',
                'downloadSuccess': 'Seu áudio MP3 foi baixado com sucesso 🎵',
                'pasteAnotherUrl': 'Cole outra URL para baixar mais áudios!',
                'downloadFile': 'Download',
                'errorTitle': 'Ops! Algo deu errado',
                'errorMessage': 'Tente novamente em alguns segundos',
                'requestError': 'Erro na requisição',
                'processingError': 'Erro no processamento',
                'statusCheckError': 'Erro ao verificar status',
                
                // Features
                'superFast': 'Super Rápido',
                'superFastDesc': 'Converte vídeos em segundos',
                'highQuality': 'Alta Qualidade',
                'highQualityDesc': 'Áudio MP3 cristalino',
                'safe': '100% Seguro',
                'safeDesc': 'Seus dados protegidos',
                
                // Footer
                'statistics': '📊 Estatísticas',
                'downloadsCompleted': '🎵 Downloads realizados:',
                'loading': 'Carregando...',
                'warning': '⚠️ Use apenas com conteúdo que você tem direito de baixar',
                'compatibility': 'Funciona com YouTube, Vimeo, SoundCloud e muito mais',
                
                // Comments
                'loadInitialCounter': 'Carregar contador inicial',
                'updateCounter': 'Atualizar contador a cada 30 segundos',
                'addVisualEffects': 'Adicionar efeitos visuais ao input',
                'directDownload': 'Download direto',
                'extractFilename': 'Extrair nome do arquivo do header ou usar padrão',
                'createTempLink': 'Criar link temporário e fazer download',
                'cleanupUrl': 'Limpar URL temporária',
                'resetInput': 'RESETAR O INPUT',
                'updateCounter': 'Atualizar contador',
                'noNeedForButton': 'Não precisa mais de botão, o download já aconteceu',
                'initializeApp': 'Inicializar a aplicação'
            },
            'es': {
                // Header
                'title': 'AudioDrop - Descargar Audio MP3',
                'subtitle': 'Transforma videos en audio MP3 instantáneamente',
                
                // Form
                'pasteUrl': 'Pega la URL del video',
                'urlPlaceholder': 'https://www.youtube.com/watch?v=...',
                'downloadButton': 'Descargar MP3',
                'processingButton': 'Procesando...',
                
                // Status Messages
                'processing': 'Procesando tu audio...',
                'processingSubtitle': 'Extrayendo el mejor audio posible ✨',
                'readyForDownload': '¡Listo para descargar!',
                'downloadSuccess': 'Tu audio MP3 fue descargado exitosamente 🎵',
                'pasteAnotherUrl': '¡Pega otra URL para descargar más audio!',
                'downloadFile': 'Descargar',
                'errorTitle': '¡Ups! Algo salió mal',
                'errorMessage': 'Intenta de nuevo en unos segundos',
                'requestError': 'Error en la solicitud',
                'processingError': 'Error en el procesamiento',
                'statusCheckError': 'Error al verificar estado',
                
                // Features
                'superFast': 'Súper Rápido',
                'superFastDesc': 'Convierte videos en segundos',
                'highQuality': 'Alta Calidad',
                'highQualityDesc': 'Audio MP3 cristalino',
                'safe': '100% Seguro',
                'safeDesc': 'Tus datos protegidos',
                
                // Footer
                'statistics': '📊 Estadísticas',
                'downloadsCompleted': '🎵 Descargas completadas:',
                'loading': 'Cargando...',
                'warning': '⚠️ Solo usa con contenido que tienes derecho a descargar',
                'compatibility': 'Funciona con YouTube, Vimeo, SoundCloud y mucho más',
                
                // Comments
                'loadInitialCounter': 'Cargar contador inicial',
                'updateCounter': 'Actualizar contador cada 30 segundos',
                'addVisualEffects': 'Agregar efectos visuales al input',
                'directDownload': 'Descarga directa',
                'extractFilename': 'Extraer nombre del archivo del header o usar predeterminado',
                'createTempLink': 'Crear enlace temporal y descargar',
                'cleanupUrl': 'Limpiar URL temporal',
                'resetInput': 'RESETEAR INPUT',
                'updateCounter': 'Actualizar contador',
                'noNeedForButton': 'No necesita botón, la descarga ya ocurrió',
                'initializeApp': 'Inicializar la aplicación'
            }
        };
        
        this.init();
    }

    getDefaultLocale() {
        // Try to get locale from localStorage
        const savedLocale = localStorage.getItem('audiodrop_locale');
        if (savedLocale && this.translations[savedLocale]) {
            return savedLocale;
        }
        
        // Try to get from browser language
        const browserLang = navigator.language || navigator.userLanguage;
        const shortLang = browserLang.split('-')[0];
        
        // Map browser language to supported locales
        const langMap = {
            'pt': 'pt-BR',
            'es': 'es',
            'en': 'en'
        };
        
        return langMap[shortLang] || 'en';
    }

    init() {
        this.updatePageLanguage();
        this.createLanguageSelector();
    }

    setLocale(locale) {
        if (!this.translations[locale]) {
            console.warn(`Locale ${locale} not supported, falling back to en`);
            locale = 'en';
        }
        
        this.currentLocale = locale;
        localStorage.setItem('audiodrop_locale', locale);
        this.updatePageLanguage();
    }

    t(key) {
        const translation = this.translations[this.currentLocale]?.[key];
        if (!translation) {
            console.warn(`Translation key "${key}" not found for locale "${this.currentLocale}"`);
            return this.translations['en']?.[key] || key;
        }
        return translation;
    }

    updatePageLanguage() {
        // Update document language
        document.documentElement.lang = this.currentLocale;
        
        // Update title
        document.title = this.t('title');
        
        // Update all translatable elements
        this.updateTranslatableElements();
    }

    updateTranslatableElements() {
        // Header
        const subtitle = document.querySelector('.text-indigo-100.text-lg');
        if (subtitle) subtitle.textContent = this.t('subtitle');
        
        // Form
        const urlLabel = document.querySelector('label[for="url"] .flex.items-center.gap-2');
        if (urlLabel) urlLabel.lastChild.textContent = this.t('pasteUrl');
        
        const urlInput = document.getElementById('url');
        if (urlInput) urlInput.placeholder = this.t('urlPlaceholder');
        
        const btnText = document.getElementById('btnText');
        if (btnText) btnText.textContent = this.t('downloadButton');
        
        // Status messages
        const processingText = document.querySelector('#status .text-indigo-800.font-medium');
        if (processingText) processingText.textContent = this.t('processing');
        
        const processingSubtitle = document.querySelector('#status .text-indigo-600.text-sm');
        if (processingSubtitle) processingSubtitle.textContent = this.t('processingSubtitle');
        
        // Success message
        const readyText = document.querySelector('#result .text-green-800.font-semibold');
        if (readyText) readyText.textContent = this.t('readyForDownload');
        
        const successText = document.querySelector('#result .text-green-600.text-sm');
        if (successText) successText.textContent = this.t('downloadSuccess');
        
        const pasteAnotherText = document.querySelector('#result .text-green-500.text-xs');
        if (pasteAnotherText) pasteAnotherText.textContent = this.t('pasteAnotherUrl');
        
        const downloadLinkText = document.querySelector('#downloadLink .flex.items-center.gap-2');
        if (downloadLinkText) downloadLinkText.lastChild.textContent = this.t('downloadFile');
        
        // Error message
        const errorTitle = document.querySelector('#error .text-red-800.font-medium');
        if (errorTitle) errorTitle.textContent = this.t('errorTitle');
        
        const errorMessage = document.getElementById('errorMessage');
        if (errorMessage) errorMessage.textContent = this.t('errorMessage');
        
        // Features
        const features = document.querySelectorAll('.bg-white\\/10.backdrop-blur-md.rounded-xl h3');
        if (features.length >= 3) {
            features[0].textContent = this.t('superFast');
            features[1].textContent = this.t('highQuality');
            features[2].textContent = this.t('safe');
        }
        
        const featureDescs = document.querySelectorAll('.bg-white\\/10.backdrop-blur-md.rounded-xl .text-sm.text-indigo-100');
        if (featureDescs.length >= 3) {
            featureDescs[0].textContent = this.t('superFastDesc');
            featureDescs[1].textContent = this.t('highQualityDesc');
            featureDescs[2].textContent = this.t('safeDesc');
        }
        
        // Footer
        const statistics = document.querySelector('.text-sm.font-medium');
        if (statistics) statistics.textContent = this.t('statistics');
        
        const downloadsText = document.querySelector('#downloadCounter');
        if (downloadsText) {
            const countSpan = downloadsText.querySelector('span');
            downloadsText.innerHTML = `${this.t('downloadsCompleted')} <span id="countNumber">${this.t('loading')}</span>`;
        }
        
        const warning = document.querySelector('.text-sm:not(.font-medium)');
        if (warning) warning.textContent = this.t('warning');
        
        const compatibility = document.querySelector('.text-xs.mt-2.text-white\\/60');
        if (compatibility) compatibility.textContent = this.t('compatibility');
    }

    createLanguageSelector() {
        const header = document.querySelector('.text-center.mb-8');
        if (!header) return;
        
        const languageSelector = document.createElement('div');
        languageSelector.className = 'absolute top-4 right-4';
        languageSelector.innerHTML = `
            <div class="relative inline-block text-left">
                <button id="languageBtn" class="bg-white/20 backdrop-blur-md text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/30 transition-all duration-200 flex items-center gap-2">
                    <span id="currentLang">${this.getLanguageName(this.currentLocale)}</span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>
                <div id="languageDropdown" class="hidden absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg z-50">
                    <div class="py-1">
                        <button class="language-option w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-lang="en">English</button>
                        <button class="language-option w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-lang="pt-BR">Português</button>
                        <button class="language-option w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-lang="es">Español</button>
                    </div>
                </div>
            </div>
        `;
        
        header.style.position = 'relative';
        header.appendChild(languageSelector);
        
        // Add event listeners
        const languageBtn = document.getElementById('languageBtn');
        const languageDropdown = document.getElementById('languageDropdown');
        const currentLang = document.getElementById('currentLang');
        
        languageBtn.addEventListener('click', () => {
            languageDropdown.classList.toggle('hidden');
        });
        
        document.addEventListener('click', (e) => {
            if (!languageBtn.contains(e.target) && !languageDropdown.contains(e.target)) {
                languageDropdown.classList.add('hidden');
            }
        });
        
        document.querySelectorAll('.language-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const lang = e.target.dataset.lang;
                this.setLocale(lang);
                currentLang.textContent = this.getLanguageName(lang);
                languageDropdown.classList.add('hidden');
            });
        });
    }

    getLanguageName(locale) {
        const names = {
            'en': 'English',
            'pt-BR': 'Português',
            'es': 'Español'
        };
        return names[locale] || 'English';
    }
}

// Export for use in other files
window.I18n = I18n; 