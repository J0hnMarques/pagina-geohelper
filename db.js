const db = require('./app');

function isAdminUser(username, callback) {
    db.query('SELECT is_admin FROM users WHERE username = ?', [username], (err, result) => {
        if (err) {
            console.error('Erro ao verificar se o usuário é administrador:', err);
            return callback(err, false);
        }
        if (result.length > 0) {
            callback(null, result[0].is_admin === 1); // Considerando que is_admin é um booleano no banco (1 para admin, 0 para não admin)
        } else {
            callback(null, false);
        }
    });
}

module.exports = { isAdminUser };
