const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(session({
    secret: 'a_long_and_complex_string_that_is_hard_to_guess',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Configuração do MySQL
const db = mysql.createConnection({
    host: '10.94.1.3',
    user: 'admin',
    password: '12345',
    database: 'geohelper',
    port: 3306
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;

    return `${year}-${month}-${day}`;
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public', 'pesquisa_texto')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware para verificar se o usuário é administrador
function isAdminUser(username, callback) {
    db.query('SELECT is_admin FROM users WHERE username = ?', [username], (err, result) => {
        if (err) {
            console.error('Erro ao verificar permissões de administrador:', err);
            return callback(err, false);
        }
        
        if (result.length > 0 && result[0].is_admin === 1) {
            callback(null, true); // Usuário é administrador
        } else {
            callback(null, false); // Usuário não é administrador
        }
    });
}

// Rota para página de países
app.get('/Simples', (req, res) => {
    const username = req.session.username;

    // Consulta SQL para obter dados do usuário, incluindo a flag isAdmin
    db.query('SELECT name, created_at AS createdAt, username, is_admin FROM users WHERE username = ?', [username], (err, result) => {
        if (err) {
            console.error('Erro ao buscar dados do usuário:', err);
            return res.status(500).send('Erro ao buscar dados do usuário');
        }

        if (result.length > 0) {
            const { name, createdAt, username, is_admin } = result[0];
            // Renderiza a página Paises, passando isAdmin como variável
            res.render('Paises', { name, createdAt, username, isAdmin: is_admin === 1 });
        } else {
            res.status(404).send('Usuário não encontrado');
        }
    });
});

// Rota para registro de usuário
app.post('/register', async (req, res) => {
    const { name, username, password, isAdmin } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const today = getCurrentDate();

    db.query('INSERT INTO users (username, password, name, created_at, is_admin) VALUES (?, ?, ?, ?, ?)', [username, hashedPassword, name, today, isAdmin], (err, result) => {
        if (err) {
            console.error('Erro ao criar usuário:', err);
            return res.status(500).json({ success: false, message: 'Erro ao criar usuário' });
        }
        console.log('Usuário criado com sucesso:', result);
        res.status(200).json({ success: true, message: 'Usuário criado com sucesso!' });
    });
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT name, password, created_at FROM users WHERE username = ?', [username], async (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            const isMatch = await bcrypt.compare(password, result[0].password);
            if (isMatch) {
                req.session.username = username;
                req.session.name = result[0].name;
                req.session.created_at = result[0].created_at;
                return res.json({ success: true, message: 'Login realizado com sucesso!' });
            }
        }
        res.status(401).json({ success: false, message: 'Credenciais inválidas!' });
    });
});

app.get('/', (req, res) => {
    const username = req.session.username;
    const name = req.session.name;
    const createdAt = req.session.created_at;

    const formattedDate = new Date(createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    res.render('index', { username, name, createdAt: formattedDate });
});

app.get('/change-password', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'change-password.html'));
});

app.post('/change-password', async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const username = req.session.username;

    if (!username) {
        return res.status(401).json({ success: false, message: 'Usuário não autenticado!' });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ success: false, message: 'Nova senha e confirmação não coincidem!' });
    }

    db.query('SELECT password FROM users WHERE username = ?', [username], async (err, result) => {
        if (err) {
            console.error('Erro ao buscar senha atual do usuário:', err);
            return res.status(500).json({ success: false, message: 'Erro ao buscar senha atual do usuário' });
        }

        if (result.length === 0) {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado!' });
        }

        const isMatch = await bcrypt.compare(currentPassword, result[0].password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Senha atual incorreta!' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        db.query('UPDATE users SET password = ? WHERE username = ?', [hashedPassword, username], (err, result) => {
            if (err) {
                console.error('Erro ao atualizar senha do usuário:', err);
                return res.status(500).json({ success: false, message: 'Erro ao atualizar senha do usuário' });
            }
            res.status(200).json({ success: true, message: 'Senha alterada com sucesso!' });
        });
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Rota para verificar se o usuário é admin
app.get('/is-admin', (req, res) => {
    const username = req.session.username;

    if (!username) {
        return res.status(401).json({ isAdmin: false, message: 'Usuário não autenticado!' });
    }

    db.query('SELECT is_admin FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error('Erro ao consultar o banco de dados:', err.message);
            return res.status(500).json({ error: 'Erro interno ao verificar permissões.' });
        }

        if (results.length > 0) {
            const isAdmin = results[0].is_admin === 1;
            res.json({ isAdmin });
        } else {
            res.json({ isAdmin: false });
        }
    });
});


app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
});
