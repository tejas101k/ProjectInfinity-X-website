// Detect mobile device
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Optimized particle creation
function createParticles(type, count, containerId) {
    const container = document.getElementById(containerId);
    const colors = type === 'sparkle' ?
        ['#4285f4', '#00c6ff', '#3ddc84', '#fbbc04', '#34a853'] :
        ['#4285f4', '#00c6ff', '#3ddc84'];
    
    // Pre-calculated shaded colors for better performance
    const shadedColors = colors.map(color => ({
        base: color,
        shaded: shadeColor(color, -20)
    }));

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.classList.add(type);

        const left = Math.random() * 100;
        const top = Math.random() * 100;
        particle.style.left = `${left}%`;
        particle.style.top = `${top}%`;

        const colorPair = shadedColors[Math.floor(Math.random() * shadedColors.length)];

        if (type === 'sparkle') {
            particle.style.backgroundColor = colorPair.base;
            particle.style.boxShadow = `0 0 8px 2px ${colorPair.base}`;

            const size = Math.random() * 3 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            const x = (Math.random() - 0.5) * 200;
            const y = (Math.random() - 0.5) * 200;
            particle.style.setProperty('--sparkle-x', `${x}vw`);
            particle.style.setProperty('--sparkle-y', `${y}vh`);

            const duration = Math.random() * 8 + 4;
            const delay = Math.random() * 5;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `${delay}s`;
        } else {
            particle.style.background = `linear-gradient(to bottom, ${colorPair.base}, ${colorPair.shaded})`;

            const width = Math.random() * 8 + 4;
            const height = width * 1.5;
            particle.style.width = `${width}px`;
            particle.style.height = `${height}px`;

            const duration = Math.random() * 6 + 3;
            const delay = Math.random() * 5;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `${delay}s`;
        }

        container.appendChild(particle);
    }
}

// Helper function to shade colors
function shadeColor(color, percent) {
    const num = parseInt(color.slice(1), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, Math.min(255, (num >> 16) + amt));
    const G = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amt));
    const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
    return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
}

// Intersection Observer for scroll animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-on-scroll');
        }
    });
}, {
    threshold: 0.1
});

// Observe all elements that need animation
document.querySelectorAll('.feature-card, .section-title, .feedback-card').forEach(el => {
    observer.observe(el);
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });

            const links = document.getElementById('mobileNavLinks');
            if (links) links.classList.remove('active');
        }
    });
});

// Add a small delay to hero animations for better effect
setTimeout(() => {
    document.querySelector('.hero h1').style.animation = 'fadeUp 1s ease forwards';
    document.querySelector('.hero p').style.animation = 'fadeUp 1s ease 0.2s forwards';
    document.querySelector('.hero-buttons').style.animation = 'fadeUp 1s ease 0.4s forwards';
}, 300);

// Create background elements with optimized counts
document.addEventListener('DOMContentLoaded', () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!reducedMotion) {
        const sparkleCount = isMobile() ? 15 : 40;
        const dropletCount = isMobile() ? 8 : 20;

        createParticles('sparkle', sparkleCount, 'sparkles');
        createParticles('droplet', dropletCount, 'droplets');
    }

    // Build screenshot slides early and hint decoding priorities
    const swiperWrapper = document.querySelector('.swiper-wrapper');
    const screenshotCount = 10;
    for (let i = 1; i <= screenshotCount; i++) {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        const eager = i <= 3 ? 'eager' : 'lazy';
        const fetchPriority = i <= 3 ? 'high' : 'auto';
        slide.innerHTML = `
            <div class="swiper-slide-content">
                <img src="assets/images/ss-${i}.webp" alt="Screenshot ${i}" loading="${eager}" decoding="async" fetchpriority="${fetchPriority}">
            </div>
        `;
        swiperWrapper.appendChild(slide);
    }

    // Initialize Swiper carousel with optimized settings
    const swiperEl = document.querySelector('.swiper');
    if (swiperEl) {
        // Pause background effects during touch for smoother swipes
        swiperEl.addEventListener('touchstart', () => {
            document.body.classList.add('swiper-touching');
        }, { passive: true });
        swiperEl.addEventListener('touchend', () => {
            document.body.classList.remove('swiper-touching');
        }, { passive: true });
        swiperEl.addEventListener('touchcancel', () => {
            document.body.classList.remove('swiper-touching');
        }, { passive: true });
    }

    const swiper = new Swiper('.swiper', {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        loop: true,
        spaceBetween: 20,
        speed: 600,
        resistanceRatio: 0.85,
        longSwipesMs: 250,
        longSwipesRatio: 0.2,
        followFinger: true,
        slideToClickedSlide: false,
        updateOnWindowResize: false,
        observer: false,
        observeParents: false,
        coverflowEffect: {
            rotate: 0,
            stretch: 0,
            depth: 200,
            modifier: 1.5,
            slideShadows: false
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        watchSlidesProgress: true,
        preloadImages: false,
        lazy: {
            loadPrevNext: true,
            loadPrevNextAmount: 2,
        },
        breakpoints: {
            320: {
                slidesPerView: 'auto',
                spaceBetween: 10
            },
            480: {
                slidesPerView: 'auto',
                spaceBetween: 15
            },
            768: {
                slidesPerView: 'auto',
                spaceBetween: 20
            },
            992: {
                slidesPerView: 'auto',
                spaceBetween: 30
            }
        }
    });

});

// Optimize for reduced motion preference
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
    document.documentElement.style.setProperty('--transition-duration', '0.01ms');
}
