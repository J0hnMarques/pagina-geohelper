function login() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    // Suponha que o login seja bem-sucedido se o usuário e senha não estiverem vazios
    if (username && password) {
        document.getElementById('login-form').style.display = 'none';
        document.querySelector('.container2').style.display = 'block';

        // Adiciona o evento de clique ao ícone de perfil
        document.getElementById('profile-icon').addEventListener('click', function() {
            window.location.href = '/profile';
        });
    } else {
        alert('Please enter a username and password.');
    }
}

function toggleLogin() {
    // Código para alternar a exibição do formulário de login, se necessário
}