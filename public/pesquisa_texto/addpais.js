
function toggleForm() {
    var formSection = document.getElementById('add-country-section');
    formSection.classList.toggle('active'); // Alternando a classe 'active' para mostrar/ocultar
}





function toggleMenu() {
    var menu = document.querySelector('.header-nav');
    menu.classList.toggle('active');
}

document.querySelector('.fechar-menu').addEventListener('click', function() {
    document.querySelector('.hamburguer-nav').classList.remove('active');
    // Outras ações necessárias, como remover a classe 'active' do botão hambúrguer
});























// Função para mostrar/esconder o menu hambúrguer
function toggleMenu() {
    var menu = document.querySelector('.hamburguer-nav');
    menu.classList.toggle('active');
}

// Função para fechar o menu ao clicar fora dele (opcional)
window.onclick = function(event) {
    var menu = document.querySelector('.hamburguer-nav');
    if (event.target == menu) {
        menu.classList.remove('active');
    }
}


document.addEventListener('DOMContentLoaded', function () {
    const imageInput = document.getElementById('countryImage');
    const imagePreview = document.getElementById('imagePreview');

    if (imageInput && imagePreview) {
        imageInput.addEventListener('change', function (event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'block'; // Torna a imagem visível
                };
                reader.readAsDataURL(file);
            } else {
                imagePreview.src = '#';
                imagePreview.style.display = 'none'; // Esconde a imagem se nenhum arquivo for selecionado
            }
        });
    }
});


