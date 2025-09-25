document.addEventListener("DOMContentLoaded", function() {
    // Load shared header
    fetch("/_includes/header.html")
        .then(response => response.text())
        .then(data => {
            const headerPlaceholder = document.getElementById("header-placeholder");
            if (headerPlaceholder) {
                headerPlaceholder.innerHTML = data;
                document.dispatchEvent(new CustomEvent('header:loaded'));
                // Initialize header interactions after loading
                initializeHeaderInteractions();
            }
        })
        .catch(error => console.error('Error loading header:', error));

    // Load shared footer 
    fetch("/_includes/footer.html")
        .then(response => response.text())
        .then(data => {
            const footerPlaceholder = document.getElementById("footer-placeholder");
            if (footerPlaceholder) {
                footerPlaceholder.innerHTML = data;
                footerPlaceholder.id = "community";
                document.dispatchEvent(new CustomEvent('footer:loaded'));
            }
        })
        .catch(error => console.error('Error loading footer:', error));
});

// Centralized header interactions function
function initializeHeaderInteractions() {
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

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target && typeof target.scrollIntoView === 'function') {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                if (links) links.classList.remove('active');
            }
        });
    });
}