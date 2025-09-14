document.addEventListener("DOMContentLoaded", function() {
    fetch("/_includes/footer.html")
        .then(response => response.text())
        .then(data => {
            const footerPlaceholder = document.getElementById("footer-placeholder");
            if (footerPlaceholder) {
                footerPlaceholder.innerHTML = data;
                footerPlaceholder.id = "community";
            }
        })
        .catch(error => console.error('Error loading footer:', error));
});