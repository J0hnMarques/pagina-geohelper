document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('forgot-password-modal');
    const link = document.getElementById('forgot-password-link');
    const closeButton = document.querySelector('.close-button');

    link.addEventListener('click', function(event) {
        event.preventDefault();
        modal.style.display = 'block';
    });

    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
});
