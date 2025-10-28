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

let currentSlide = 0;
let photos = [];
let carouselInterval;

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

    // Event Listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    addPhotoBtn.addEventListener('click', addPhotoToCarousel);

    // Atualizar contador a cada minuto
    setInterval(updateCounter, 60000);
}

// Iniciar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', init);
