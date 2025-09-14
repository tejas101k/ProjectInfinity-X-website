// Project Infinity X - Enhanced Main JavaScript with Modern Interactions
document.addEventListener('DOMContentLoaded', function() {
    // Performance optimization
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Enhanced Header Scroll Effect
    const header = document.querySelector('header');
    let lastScrollY = 0;
    let scrollTimeout;
    
    function handleScroll() {
        const scrollY = window.scrollY;
        
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(() => {
            if (scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Hide/show header on scroll
            if (scrollY > lastScrollY && scrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollY = scrollY;
        }, 10);
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Enhanced Mobile Menu Toggle with Animation
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileNavLinks = document.getElementById('mobileNavLinks');
    
    if (mobileMenuToggle && mobileNavLinks) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const isActive = mobileNavLinks.classList.contains('active');
            
            if (isActive) {
                mobileNavLinks.style.animation = 'slideUp 0.3s ease forwards';
                setTimeout(() => {
                    mobileNavLinks.classList.remove('active');
                    mobileNavLinks.style.animation = '';
                }, 250);
            } else {
                mobileNavLinks.classList.add('active');
                mobileNavLinks.style.animation = 'slideDown 0.3s ease forwards';
            }
            
            mobileMenuToggle.classList.toggle('active');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (mobileNavLinks.classList.contains('active') && 
                !mobileNavLinks.contains(event.target) && 
                !mobileMenuToggle.contains(event.target)) {
                
                mobileNavLinks.style.animation = 'slideUp 0.3s ease forwards';
                setTimeout(() => {
                    mobileNavLinks.classList.remove('active');
                    mobileNavLinks.style.animation = '';
                }, 250);
                mobileMenuToggle.classList.remove('active');
            }
        });
        
        // Close mobile menu when link is clicked
        const mobileLinks = mobileNavLinks.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNavLinks.style.animation = 'slideUp 0.3s ease forwards';
                setTimeout(() => {
                    mobileNavLinks.classList.remove('active');
                    mobileNavLinks.style.animation = '';
                }, 250);
                mobileMenuToggle.classList.remove('active');
            });
        });
    }
    
    // Enhanced Smooth Scrolling with Easing
    function smoothScrollTo(target, duration = 800) {
        const targetElement = document.querySelector(target);
        if (!targetElement) return;
        
        const targetPosition = targetElement.offsetTop - 100;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        function easeInOutCubic(t) {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        }
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const ease = easeInOutCubic(progress);
            
            window.scrollTo(0, startPosition + distance * ease);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }
        
        requestAnimationFrame(animation);
    }
    
    // Enhanced Anchor Link Handling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            
            if (target === '#') return;
            
            smoothScrollTo(target);
            
            // Update URL without triggering scroll
            history.pushState(null, null, target);
        });
    });
    
    // Enhanced Floating Elements Animation
    function createFloatingElements() {
        if (prefersReducedMotion) return;
        
        const sparklesContainer = document.getElementById('sparkles');
        const dropletsContainer = document.getElementById('droplets');
        
        if (!sparklesContainer || !dropletsContainer) return;
        
        // Create sparkles
        for (let i = 0; i < 15; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.animationDelay = Math.random() * 8 + 's';
            sparkle.style.animationDuration = (Math.random() * 4 + 6) + 's';
            sparklesContainer.appendChild(sparkle);
        }
        
        // Create droplets
        for (let i = 0; i < 10; i++) {
            const droplet = document.createElement('div');
            droplet.className = 'droplet';
            droplet.style.top = Math.random() * 100 + '%';
            droplet.style.animationDelay = Math.random() * 6 + 's';
            droplet.style.animationDuration = (Math.random() * 3 + 5) + 's';
            dropletsContainer.appendChild(droplet);
        }
    }
    
    createFloatingElements();
    
    // Enhanced Screenshots Slider
    function initializeScreenshotsSlider() {
        const screenshotsData = [
            { src: 'assets/images/ss-1.webp', alt: 'Infinity X Screenshot 1' },
            { src: 'assets/images/ss-2.webp', alt: 'Infinity X Screenshot 2' },
            { src: 'assets/images/ss-3.webp', alt: 'Infinity X Screenshot 3' },
            { src: 'assets/images/ss-4.webp', alt: 'Infinity X Screenshot 4' },
            { src: 'assets/images/ss-5.webp', alt: 'Infinity X Screenshot 5' },
            { src: 'assets/images/ss-6.webp', alt: 'Infinity X Screenshot 6' },
            { src: 'assets/images/ss-7.webp', alt: 'Infinity X Screenshot 7' },
            { src: 'assets/images/ss-8.webp', alt: 'Infinity X Screenshot 8' },
            { src: 'assets/images/ss-9.webp', alt: 'Infinity X Screenshot 9' },
            { src: 'assets/images/ss-10.webp', alt: 'Infinity X Screenshot 10' }
        ];
        
        const swiperWrapper = document.querySelector('.swiper-wrapper');
        if (!swiperWrapper) return;
        
        // Clear existing slides
        swiperWrapper.innerHTML = '';
        
        // Create slides with enhanced loading
        screenshotsData.forEach((screenshot, index) => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            
            const img = document.createElement('img');
            img.src = screenshot.src;
            img.alt = screenshot.alt;
            img.loading = 'lazy';
            
            // Add enhanced loading animation
            img.addEventListener('load', function() {
                this.style.opacity = '1';
                this.style.transform = 'scale(1)';
            });
            
            img.style.opacity = '0';
            img.style.transform = 'scale(0.9)';
            img.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            slide.appendChild(img);
            swiperWrapper.appendChild(slide);
        });
        
        // Initialize Swiper with enhanced settings
        if (typeof Swiper !== 'undefined') {
            new Swiper('.swiper', {
                slidesPerView: 'auto',
                centeredSlides: true,
                spaceBetween: 30,
                loop: true,
                autoplay: {
                    delay: 4000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                    dynamicBullets: true
                },
                effect: 'coverflow',
                coverflowEffect: {
                    rotate: 20,
                    stretch: 0,
                    depth: 200,
                    modifier: 1,
                    slideShadows: true
                },
                breakpoints: {
                    320: {
                        slidesPerView: 1,
                        spaceBetween: 20
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 25
                    },
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 30
                    }
                }
            });
        }
    }
    
    initializeScreenshotsSlider();
    
    // Enhanced Intersection Observer for Animations
    function createIntersectionObserver() {
        if (prefersReducedMotion) return;
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    
                    // Trigger animations based on element type
                    if (target.classList.contains('section-title')) {
                        target.style.animation = 'fadeInUp 1s ease forwards';
                    } else if (target.classList.contains('feature-card')) {
                        const delay = Array.from(target.parentElement.children).indexOf(target) * 0.1;
                        target.style.animation = `fadeInUp 1s ease ${delay}s forwards`;
                    } else if (target.classList.contains('feedback-card')) {
                        const delay = Array.from(target.parentElement.children).indexOf(target) * 0.1;
                        target.style.animation = `fadeInUp 1s ease ${delay}s forwards`;
                    } else if (target.classList.contains('footer-column')) {
                        const delay = Array.from(target.parentElement.children).indexOf(target) * 0.1;
                        target.style.animation = `fadeInUp 1s ease ${delay}s forwards`;
                    } else {
                        target.style.animation = 'fadeInUp 1s ease forwards';
                    }
                    
                    observer.unobserve(target);
                }
            });
        }, observerOptions);
        
        // Observe elements
        const elementsToObserve = document.querySelectorAll('.section-title, .feature-card, .feedback-card, .footer-column, .download-cta');
        elementsToObserve.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            observer.observe(element);
        });
    }
    
    createIntersectionObserver();
    
    // Enhanced Parallax Effect
    function initParallaxEffect() {
        if (prefersReducedMotion) return;
        
        const parallaxElements = document.querySelectorAll('.hero::before, .features::before, .screenshots::before');
        
        function updateParallax() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            parallaxElements.forEach(element => {
                element.style.transform = `translateY(${rate}px)`;
            });
        }
        
        let ticking = false;
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
                setTimeout(() => ticking = false, 16);
            }
        }
        
        window.addEventListener('scroll', requestTick, { passive: true });
    }
    
    initParallaxEffect();
    
    // Enhanced Button Interactions
    function initButtonInteractions() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            // Add ripple effect
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple-effect');
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
            
            // Add magnetic effect
            button.addEventListener('mousemove', function(e) {
                if (prefersReducedMotion) return;
                
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                this.style.transform = `translateX(${x * 0.1}px) translateY(${y * 0.1}px) scale(1.02)`;
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });
    }
    
    initButtonInteractions();
    
    // Performance monitoring
    function monitorPerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                    
                    if (loadTime > 3000) {
                        console.log('Page load time is high:', loadTime + 'ms');
                        // Disable some animations if performance is poor
                        document.body.classList.add('reduced-animations');
                    }
                }, 1000);
            });
        }
    }
    
    monitorPerformance();
    
    // Add custom CSS for additional animations
    const additionalCSS = `
        @keyframes slideUp {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(-20px);
            }
        }
        
        .ripple-effect {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .reduced-animations * {
            animation-duration: 0.1s !important;
            transition-duration: 0.1s !important;
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = additionalCSS;
    document.head.appendChild(style);
    
    // Theme color detection for mobile browsers
    function updateThemeColor() {
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            const meta = document.createElement('meta');
            meta.name = 'theme-color';
            meta.content = '#667eea';
            document.head.appendChild(meta);
        }
    }
    
    updateThemeColor();
    
    console.log('✨ Project Infinity X website enhanced and loaded successfully!');
});
