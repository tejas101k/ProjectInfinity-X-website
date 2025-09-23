document.addEventListener("DOMContentLoaded", function() {
    // Load shared header
    fetch("/_includes/header.html")
        .then(response => response.text())
        .then(data => {
            const headerPlaceholder = document.getElementById("header-placeholder");
            if (headerPlaceholder) {
                headerPlaceholder.innerHTML = data;
                document.dispatchEvent(new CustomEvent('header:loaded'));
            }
        })
        .catch(error => console.error('Error loading header:', error));

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