// Mobile menu toggle
document.getElementById('mobileMenuToggle').addEventListener('click', function(e) {
    e.stopPropagation();
    document.getElementById('mobileNavLinks').classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const mobileNav = document.getElementById('mobileNavLinks');
    const menuToggle = document.getElementById('mobileMenuToggle');
    
    if (mobileNav.classList.contains('active') && 
        !mobileNav.contains(event.target) && 
        !menuToggle.contains(event.target)) {
        mobileNav.classList.remove('active');
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            document.getElementById('mobileNavLinks').classList.remove('active');
        }
    });
});

// Particle animation functions
function isMobile() {
    return window.innerWidth <= 768;
}

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
        } else if (type === 'droplet') {
            particle.style.background = `linear-gradient(to bottom, ${color}, #1e88e5)`;
            particle.style.boxShadow = `0 0 10px ${color}50`;
        }

        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 2;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;

        container.appendChild(particle);
    }
}

// Initialize particles
setTimeout(() => {
    const sparkleCount = isMobile() ? 5 : 15;
    const dropletCount = isMobile() ? 8 : 20;
    
    createParticles('sparkle', sparkleCount, 'sparkles');
    createParticles('droplet', dropletCount, 'droplets');
}, 500);

// Add a small delay to hero animations for better effect
setTimeout(() => {
    document.querySelector('.hero h1').style.animation = 'fadeUp 1s ease forwards';
    document.querySelector('.hero p').style.animation = 'fadeUp 1s ease 0.2s forwards';
    document.querySelector('.hero-buttons').style.animation = 'fadeUp 1s ease 0.4s forwards';
}, 300);
