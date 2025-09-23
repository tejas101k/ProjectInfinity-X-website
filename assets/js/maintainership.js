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
