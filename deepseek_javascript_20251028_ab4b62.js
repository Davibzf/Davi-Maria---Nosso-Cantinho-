// Data de início do relacionamento: 09/05/2025 às 19:45
const startDate = new Date('2025-05-09T19:45:00');

// Elementos DOM
const counterElement = document.getElementById('counter');
const carousel = document.getElementById('carousel');
const carouselDots = document.getElementById('carousel-dots');
const backgroundHearts = document.getElementById('background-hearts');
const addPhotoBtn = document.getElementById('add-photo-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

// Elementos do player de música
const audioPlayer = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause-btn');
const progressBar = document.getElementById('progress-bar');
const timeDisplay = document.querySelector('.time');
const volumeSlider = document.getElementById('volume-slider');
const audioMessage = document.getElementById('audio-message');

let currentSlide = 0;
let photos = [];
let carouselInterval;
let isPlaying = false;
let userInteracted = false;

// Atualizar contador
function updateCounter() {
    const now = new Date();
    const diff = startDate - now;
    
    if (diff <= 0) {
        const timePassed = now - startDate;
        showTimePassed(timePassed);
        return;
    }
    
    showCountdown(diff);
}

function showCountdown(diff) {
    const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44));
    const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    counterElement.textContent = 
        `Faltam ${months} meses, ${days} dias, ${hours} horas e ${minutes} minutos para nosso amor começar!`;
    counterElement.style.color = '#ff69b4';
}

function showTimePassed(diff) {
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
    const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (years > 0) {
        counterElement.textContent = 
            `${years} anos, ${months} meses, ${days} dias, ${hours} horas e ${minutes} minutos`;
    } else {
        counterElement.textContent = 
            `${months} meses, ${days} dias, ${hours} horas e ${minutes} minutos`;
    }
    counterElement.style.color = '#ff69b4';
}

// Funções do Carrossel
function nextSlide() {
    if (photos.length === 0) return;
    currentSlide = (currentSlide + 1) % photos.length;
    updateCarousel();
}

function prevSlide() {
    if (photos.length === 0) return;
    currentSlide = (currentSlide - 1 + photos.length) % photos.length;
    updateCarousel();
}

function goToSlide(index) {
    if (index >= 0 && index < photos.length) {
        currentSlide = index;
        updateCarousel();
    }
}

function updateCarousel() {
    if (photos.length === 0) return;
    
    carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function addPhotoToCarousel() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                photos.push(event.target.result);
                updateCarouselDisplay();
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

function updateCarouselDisplay() {
    carousel.innerHTML = '';
    carouselDots.innerHTML = '';
    
    photos.forEach((photo, index) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-item';
        slide.innerHTML = `<img src="${photo}" alt="Nossa foto ${index + 1}">`;
        carousel.appendChild(slide);
        
        const dot = document.createElement('div');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.setAttribute('data-index', index);
        dot.addEventListener('click', () => goToSlide(index));
        carouselDots.appendChild(dot);
    });
    
    if (photos.length === 0) {
        const initialSlide = document.createElement('div');
        initialSlide.className = 'carousel-item';
        initialSlide.innerHTML = `
            <i class="fas fa-heart"></i>
            <p>Clique no botão para adicionar fotos especiais</p>
            <button class="add-photo-btn" id="add-photo-initial-btn">
                <i class="fas fa-plus"></i> Adicionar Foto
            </button>
        `;
        carousel.appendChild(initialSlide);
        
        const dot = document.createElement('div');
        dot.className = 'dot active';
        dot.setAttribute('data-index', 0);
        dot.addEventListener('click', () => goToSlide(0));
        carouselDots.appendChild(dot);

        document.getElementById('add-photo-initial-btn').addEventListener('click', addPhotoToCarousel);
    }
    
    currentSlide = 0;
    updateCarousel();
    startCarouselAutoAdvance();
}

function startCarouselAutoAdvance() {
    if (carouselInterval) {
        clearInterval(carouselInterval);
    }
    
    if (photos.length > 1) {
        carouselInterval = setInterval(() => {
            nextSlide();
        }, 5000);
    }
}

// Funções do Player de Música
function setupAudioPlayer() {
    // Configurar volume inicial
    audioPlayer.volume = 0.7;
    volumeSlider.value = 0.7;
    
    // Event listeners do áudio
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('play', () => {
        isPlaying = true;
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        showAudioMessage('🎵 Música tocando...');
    });
    
    audioPlayer.addEventListener('pause', () => {
        isPlaying = false;
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    });
    
    audioPlayer.addEventListener('ended', () => {
        // Reiniciar quando terminar (loop)
        audioPlayer.currentTime = 0;
        audioPlayer.play();
    });
    
    audioPlayer.addEventListener('error', (e) => {
        console.error('Erro no áudio:', e);
        showAudioMessage('❌ Erro ao carregar a música. Verifique o link.');
    });
    
    audioPlayer.addEventListener('loadstart', () => {
        showAudioMessage('⏳ Carregando música...');
    });
    
    audioPlayer.addEventListener('canplay', () => {
        showAudioMessage('✅ Música carregada! Clique para reproduzir.');
    });
    
    // Controles do player
    playPauseBtn.addEventListener('click', togglePlayPause);
    document.querySelector('.progress-container').addEventListener('click', seek);
    volumeSlider.addEventListener('input', updateVolume);
    
    // Tentar reprodução automática após interação do usuário
    setupAutoplay();
}

function setupAutoplay() {
    // Mostrar instrução para o usuário
    showAudioMessage('🎵 Clique em qualquer lugar para iniciar a música');
    
    // Tentar reproduzir quando o usuário interagir com a página
    const tryPlay = () => {
        if (!userInteracted) {
            userInteracted = true;
            audioPlayer.play().then(() => {
                console.log('Reprodução iniciada com sucesso');
                showAudioMessage('🎵 Música tocando...');
            }).catch(error => {
                console.log('Reprodução automática bloqueada:', error);
                showAudioMessage('▶️ Clique no botão play para reproduzir');
            });
        }
    };
    
    // Adicionar event listeners para interação do usuário
    document.addEventListener('click', tryPlay);
    document.addEventListener('touchstart', tryPlay);
    document.addEventListener('keydown', tryPlay);
}

function togglePlayPause() {
    if (isPlaying) {
        audioPlayer.pause();
    } else {
        audioPlayer.play().catch(error => {
            console.log('Erro ao reproduzir:', error);
            showAudioMessage('❌ Erro ao reproduzir. Tente novamente.');
        });
    }
}

function updateProgress() {
    const duration = audioPlayer.duration;
    const currentTime = audioPlayer.currentTime;
    
    if (duration && isFinite(duration)) {
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        
        const minutes = Math.floor(currentTime / 60);
        const seconds = Math.floor(currentTime % 60);
        timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}

function seek(e) {
    const progressContainer = document.querySelector('.progress-container');
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    
    if (duration && isFinite(duration)) {
        audioPlayer.currentTime = (clickX / width) * duration;
    }
}

function updateVolume() {
    audioPlayer.volume = volumeSlider.value;
}

function showAudioMessage(message) {
    audioMessage.textContent = message;
    setTimeout(() => {
        if (audioMessage.textContent === message) {
            audioMessage.textContent = '';
        }
    }, 3000);
}

// Criar corações flutuantes
function createFloatingHearts() {
    const heartsCount = 25;
    
    for (let i = 0; i < heartsCount; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerHTML = '❤️';
        
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const delay = Math.random() * 5;
        const size = Math.random() * 1.5 + 0.5;
        const duration = Math.random() * 3 + 5;
        
        heart.style.left = `${left}%`;
        heart.style.top = `${top}%`;
        heart.style.animationDelay = `${delay}s`;
        heart.style.fontSize = `${size}rem`;
        heart.style.animationDuration = `${duration}s`;
        
        backgroundHearts.appendChild(heart);
    }
}

// Inicialização
function init() {
    updateCounter();
    createFloatingHearts();
    updateCarouselDisplay();
    setupAudioPlayer();

    // Event Listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    addPhotoBtn.addEventListener('click', addPhotoToCarousel);

    // Atualizar contador a cada minuto
    setInterval(updateCounter, 60000);
}

// Iniciar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', init);