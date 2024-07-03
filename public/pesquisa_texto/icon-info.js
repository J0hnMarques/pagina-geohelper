document.querySelectorAll('.help-icon').forEach(icon => {
    icon.addEventListener('click', function() {
        var helpBox = this.nextElementSibling;
        if (helpBox.style.display === 'none' || helpBox.style.display === '') {
            helpBox.style.display = 'block';
        } else {
            helpBox.style.display = 'none';
        }
    });
});
