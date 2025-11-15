// Configuração do carrossel
const carouselData = [
    {
        image: "https://imagizer.imageshack.com/img922/8818/cd1OAK.jpg",
        caption: "Em cada olhar, encontro o amor que me completa."
    },
    {
        image: "https://imagizer.imageshack.com/img923/6709/5gh5So.png",
        caption: "Nosso amor é a melhor história que já vivi."
    },
    {
        image: "https://imagizer.imageshack.com/img922/6208/HVI2eI.png",
        caption: "Você é o sonho que nunca quis acordar."
    },
    {
        image: "https://imagizer.imageshack.com/img924/8122/Ox0Mv2.jpg",
        caption: "Meu coração bate no ritmo do seu nome."
    },
    {
        image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        caption: "Ao seu lado, cada momento é especial."
    }
];

// Elementos DOM
const carousel = document.getElementById('carousel');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const indicators = document.getElementById('indicators');
const counter = document.getElementById('counter');
const backgroundMusic = document.getElementById('backgroundMusic');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const volumeUpBtn = document.getElementById('volumeUpBtn');
const volumeDownBtn = document.getElementById('volumeDownBtn');

let currentIndex = 0;
let carouselInterval;

// Inicializar carrossel
function initCarousel() {
    carouselData.forEach((item, index) => {
        // Criar item do carrossel
        const carouselItem = document.createElement('div');
        carouselItem.className = 'carousel-item';
        
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = `Imagem ${index + 1}`;
        
        const caption = document.createElement('div');
        caption.className = 'carousel-caption';
        caption.innerHTML = `<p>${item.caption}</p>`;
        
        carouselItem.appendChild(img);
        carouselItem.appendChild(caption);
        carousel.appendChild(carouselItem);
        
        // Criar indicadores
        const indicator = document.createElement('div');
        indicator.className = `indicator ${index === 0 ? 'active' : ''}`;
        indicator.dataset.index = index;
        indicator.addEventListener('click', () => goToSlide(index));
        indicators.appendChild(indicator);
    });
    
    updateCarousel();
}

// Atualizar carrossel
function updateCarousel() {
    carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // Atualizar indicadores
    document.querySelectorAll('.indicator').forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentIndex);
    });
}

// Ir para slide específico
function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
    resetCarouselInterval();
}

// Próximo slide
function nextSlide() {
    currentIndex = (currentIndex + 1) % carouselData.length;
    updateCarousel();
}

// Slide anterior
function prevSlide() {
    currentIndex = (currentIndex - 1 + carouselData.length) % carouselData.length;
    updateCarousel();
}

// Reiniciar intervalo do carrossel automático
function resetCarouselInterval() {
    clearInterval(carouselInterval);
    carouselInterval = setInterval(nextSlide, 5000);
}

// Event listeners para navegação do carrossel
prevBtn.addEventListener('click', () => {
    prevSlide();
    resetCarouselInterval();
});

nextBtn.addEventListener('click', () => {
    nextSlide();
    resetCarouselInterval();
});

// Atualizar contador em tempo real
function updateCounter() {
    // Data de início do relacionamento (substitua pela sua data)
    const startDate = new Date('2025-05-09T00:00:00');
    
    function update() {
        const now = new Date();
        const diff = now - startDate;
        
        const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
        const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
        const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        counter.textContent = `${months} meses, ${days} dias`;
    }
    
    update();
    setInterval(update, 1000);
}

// Efeito de emojis caindo
function createFallingEmoji() {
    const emojis = ['❤️', '💕', '😍', '🥰', '💖', '💘', '💝', '💞', '💓', '💗'];
    const emoji = document.createElement('div');
    emoji.className = 'emoji';
    emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    
    // Posição aleatória
    emoji.style.left = `${Math.random() * 100}vw`;
    emoji.style.top = '-50px';
    
    // Duração e tamanho aleatórios
    const duration = 5 + Math.random() * 5;
    const size = 1 + Math.random() * 2;
    emoji.style.fontSize = `${size}rem`;
    emoji.style.animationDuration = `${duration}s`;
    
    document.body.appendChild(emoji);
    
    // Remover após a animação
    setTimeout(() => {
        if (emoji.parentNode) {
            emoji.remove();
        }
    }, duration * 1000);
}

// Controles de áudio
playBtn.addEventListener('click', () => {
    backgroundMusic.play().catch(e => {
        console.log("Reprodução automática bloqueada pelo navegador. Clique para reproduzir.");
        playBtn.textContent = "▶️ Clique para reproduzir";
    });
});

pauseBtn.addEventListener('click', () => {
    backgroundMusic.pause();
});

volumeUpBtn.addEventListener('click', () => {
    if (backgroundMusic.volume < 1) {
        backgroundMusic.volume = Math.min(1, backgroundMusic.volume + 0.1);
    }
});

volumeDownBtn.addEventListener('click', () => {
    if (backgroundMusic.volume > 0) {
        backgroundMusic.volume = Math.max(0, backgroundMusic.volume - 0.1);
    }
});

// Inicializar a página
window.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    updateCounter();
    
    // Iniciar carrossel automático
    carouselInterval = setInterval(nextSlide, 5000);
    
    // Criar emojis caindo em intervalos regulares
    setInterval(createFallingEmoji, 500);
    
    // Tentar reproduzir música automaticamente (pode ser bloqueado pelos navegadores)
    backgroundMusic.play().catch(e => {
        console.log("Reprodução automática bloqueada pelo navegador. Clique para reproduzir.");
    });
});

// Pausar carrossel quando a página não estiver visível
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        clearInterval(carouselInterval);
    } else {
        resetCarouselInterval();
    }
});
