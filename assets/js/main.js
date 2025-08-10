// Performance optimization: Debounce scroll events
let lastScrollY = window.scrollY;
let ticking = false;

window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    if (!ticking) {
        window.requestAnimationFrame(() => {
            ticking = false;
        });
        ticking = true;
    }
});

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

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.classList.add(type);

        const left = Math.random() * 100;
        const top = Math.random() * 100;
        particle.style.left = `${left}%`;
        particle.style.top = `${top}%`;

        const color = colors[Math.floor(Math.random() * colors.length)];

        if (type === 'sparkle') {
            particle.style.backgroundColor = color;
            particle.style.boxShadow = `0 0 8px 2px ${color}`;

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
            particle.style.background = `linear-gradient(to bottom, ${color}, ${shadeColor(color, -20)})`;

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

// Mobile menu toggle
document.getElementById('mobileMenuToggle').addEventListener('click', function (e) {
    e.stopPropagation();
    document.getElementById('mobileNavLinks').classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', function (event) {
    const mobileNav = document.getElementById('mobileNavLinks');
    const menuToggle = document.getElementById('mobileMenuToggle');

    if (mobileNav.classList.contains('active') &&
        !mobileNav.contains(event.target) &&
        !menuToggle.contains(event.target)) {
        mobileNav.classList.remove('active');
    }
});

// Helper function to shade colors
function shadeColor(color, percent) {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;

    return `#${R.toString(16).padStart(2, '0')}${G.toString(16).padStart(2, '0')}${B.toString(16).padStart(2, '0')}`;
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

            document.getElementById('mobileNavLinks').classList.remove('active');
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
window.addEventListener('load', () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!reducedMotion) {
        const sparkleCount = isMobile() ? 15 : 40;
        const dropletCount = isMobile() ? 8 : 20;

        createParticles('sparkle', sparkleCount, 'sparkles');
        createParticles('droplet', dropletCount, 'droplets');
    }

    // Load screenshots in WebP format
    const swiperWrapper = document.querySelector('.swiper-wrapper');
    const screenshotCount = 10;

    for (let i = 1; i <= screenshotCount; i++) {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.innerHTML = `
            <div class="swiper-slide-content">
                <img src="assets/images/ss-${i}.webp" alt="Screenshot ${i}" loading="lazy">
            </div>
        `;
        swiperWrapper.appendChild(slide);
    }

    // Initialize Swiper carousel with optimized settings
    const swiper = new Swiper('.swiper', {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        loop: true,
        spaceBetween: 20,
        coverflowEffect: {
            rotate: 0,
            stretch: 0,
            depth: 200,
            modifier: 1.5,
            slideShadows: true
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

    // Preload critical resources
    const preloadImages = () => {
        const images = [];
        for (let i = 1; i <= 3; i++) {
            images.push(new Image().src = `assets/images/ss-${i}.webp`);
        }
    };

    setTimeout(preloadImages, 1000);
});

// Optimize for reduced motion preference
const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
if (mediaQuery.matches) {
    document.querySelectorAll('*').forEach(el => {
        if (el.style.animation) {
            el.style.animation = 'none';
        }
    });
}
