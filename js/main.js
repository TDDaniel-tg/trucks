// ========================================
// ОСНОВНЫЕ ФУНКЦИИ И ИНИЦИАЛИЗАЦИЯ
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех компонентов
    initMobileMenu();
    initSmoothScroll();
    initGallerySlider();
    initPartnersSlider();
    initScrollAnimations();
    initModals();
    initScrollTop();
    initYandexMap();
    initTiltEffect();
    
    // Удаление прелоадера после загрузки
    window.addEventListener('load', function() {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
                document.body.style.overflow = 'auto';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, 1200);
        }
    });
    
    // Отключение скролла во время загрузки
    document.body.style.overflow = 'hidden';
});

// ========================================
// МОБИЛЬНОЕ МЕНЮ
// ========================================

function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Закрытие меню при клике на ссылку
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Закрытие меню при клике вне его
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// ========================================
// ПЛАВНАЯ ПРОКРУТКА
// ========================================

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Проверяем, что это не просто "#"
            if (href && href !== '#' && href.length > 1) {
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// ========================================
// СЛАЙДЕР ГАЛЕРЕИ
// ========================================

function initGallerySlider() {
    const slider = document.querySelector('.gallery-slider');
    if (!slider) return;
    
    const track = slider.querySelector('.gallery-track');
    const slides = track.querySelectorAll('.gallery-item');
    const prevBtn = slider.querySelector('.gallery-prev');
    const nextBtn = slider.querySelector('.gallery-next');
    const dotsContainer = document.querySelector('.gallery-dots');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Создание точек навигации
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('gallery-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
    
    const dots = dotsContainer.querySelectorAll('.gallery-dot');
    
    // Функция перехода к слайду
    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        track.style.transform = `translateX(-${slideIndex * 100}%)`;
        
        // Обновление активной точки
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === slideIndex);
        });
    }
    
    // Следующий слайд
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        goToSlide(currentSlide);
    }
    
    // Предыдущий слайд
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        goToSlide(currentSlide);
    }
    
    // События кнопок
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    // Автопрокрутка
    let autoplayInterval = setInterval(nextSlide, 5000);
    
    // Пауза автопрокрутки при наведении
    slider.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    slider.addEventListener('mouseleave', () => {
        autoplayInterval = setInterval(nextSlide, 5000);
    });
    
    // Свайп для мобильных
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    slider.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) nextSlide();
        if (touchEndX > touchStartX + 50) prevSlide();
    }
    
    // Открытие изображения в модальном окне
    slides.forEach(slide => {
        slide.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (img) {
                openImageModal(img.src, img.alt);
            }
        });
    });
}

// ========================================
// СЛАЙДЕР ПАРТНЕРОВ
// ========================================

function initPartnersSlider() {
    const partnersTrack = document.querySelector('.partners-track');
    if (!partnersTrack) return;
    
    // Дублируем элементы для бесконечной прокрутки
    const items = partnersTrack.querySelectorAll('.partner-item');
    items.forEach(item => {
        const clone = item.cloneNode(true);
        partnersTrack.appendChild(clone);
    });
}

// ========================================
// АНИМАЦИИ ПРИ СКРОЛЛЕ
// ========================================

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.service-card, .advantage-item, .testimonial-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in', 'visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });
    
    // Анимация для заголовков секций
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        title.classList.add('fade-in');
        observer.observe(title);
    });
}

// ========================================
// МОДАЛЬНЫЕ ОКНА
// ========================================

function initModals() {
    // Модальное окно для изображений
    const imageModal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const modalCloses = document.querySelectorAll('.modal-close');
    
    // Закрытие модальных окон
    modalCloses.forEach(close => {
        close.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Закрытие по клику на фон
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal[style*="block"]');
            if (openModal) {
                closeModal(openModal);
            }
        }
    });
    
    // Открытие модальных окон по data-modal
    document.querySelectorAll('[data-modal]').forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId + '-modal');
            if (modal) {
                openModal(modal);
            }
        });
    });
}

// Функция открытия модального окна
function openModal(modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Функция закрытия модального окна
function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

// Функция открытия изображения в модальном окне
function openImageModal(src, alt) {
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    
    modalImage.src = src;
    modalImage.alt = alt;
    openModal(modal);
}

// ========================================
// КНОПКА "НАВЕРХ"
// ========================================

function initScrollTop() {
    // Создание кнопки
    const scrollTopBtn = document.createElement('div');
    scrollTopBtn.className = 'scroll-top';
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollTopBtn);
    
    // Показ/скрытие кнопки при скролле
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    // Прокрутка наверх при клике
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========================================
// ЯНДЕКС КАРТЫ
// ========================================

function initYandexMap() {
    // Функция упрощена, так как используем iframe вместо API
    const mapFrame = document.querySelector('.yandex-map');
    if (mapFrame) {
        // Можем добавить дополнительную логику для iframe если нужно
        console.log('Карта загружена через iframe');
    }
}

// ========================================
// ИЗМЕНЕНИЕ ШАПКИ ПРИ СКРОЛЛЕ
// ========================================

let lastScrollTop = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Добавление класса scrolled при скролле
    if (scrollTop > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Активная навигация
    updateActiveNavigation();
    
    lastScrollTop = scrollTop;
});

// ========================================
// АКТИВНАЯ НАВИГАЦИЯ
// ========================================

function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

// ========================================
// ПАРАЛЛАКС ЭФФЕКТ ДЛЯ HERO
// ========================================

window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero-bg-image');
    
    if (parallax) {
        const speed = scrolled * 0.5;
        parallax.style.transform = `translateY(${speed}px)`;
    }
});



// ========================================
// ЭФФЕКТ НАКЛОНА КАРТОЧЕК
// ========================================

function initTiltEffect() {
    const tiltElements = document.querySelectorAll('.service-card, .testimonial-card, .advantage-item');
    
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });
} 