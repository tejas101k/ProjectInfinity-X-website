function wireHeaderInteractions() {
    const toggle = document.getElementById('mobileMenuToggle');
    const links = document.getElementById('mobileNavLinks');
    if (!toggle || !links) return;

    toggle.addEventListener('click', function(e) {
        e.stopPropagation();
        links.classList.toggle('active');
    });

    document.addEventListener('click', function(event) {
        if (links.classList.contains('active') && 
            !links.contains(event.target) && 
            !toggle.contains(event.target)) {
            links.classList.remove('active');
        }
    });
}

if (document.getElementById('mobileMenuToggle')) {
    wireHeaderInteractions();
} else {
    document.addEventListener('header:loaded', wireHeaderInteractions, { once: true });
}

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
            
            const links = document.getElementById('mobileNavLinks');
            if (links) links.classList.remove('active');
        }
    });
});
