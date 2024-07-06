function openUniqueOverlay(title, content) {
    document.getElementById('unique-overlay-title').innerText = title;
    document.getElementById('unique-overlay-content').innerText = content;
    document.getElementById('unique-overlay').classList.add('show');
}

function closeUniqueOverlay() {
    document.getElementById('unique-overlay').classList.remove('show');
}
