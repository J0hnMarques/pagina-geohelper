const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const validator = require('validator');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const NodeCache = require('node-cache');

const app = express();
const cache = new NodeCache({ stdTTL: 120 });



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
    host: 'monorail.proxy.rlwy.net',
    user: 'root',
    password: 'ktBGqKJfvHnnZGMaQKmlkLjeroONdFZt',
    database: 'railway',
    port: 48591
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
            // Renderiza apenas o modal em vez de enviar uma página ou outro conteúdo
            res.send(`
                <!-- Estrutura do modal com classes e IDs personalizados -->
                <div id="loginModal" class="custom-modal">
                  <div class="modal-content">
                    <span class="close-btn">&times;</span>
                    <p>Faça login antes de continuar</p>
                  </div>
                </div>
                
                <style>
                /* Estilos para o modal */
                .custom-modal {
                  display: block; /* Exibir por padrão */
                  position: fixed;
                  z-index: 1;
                  left: 0;
                  top: 0;
                  width: 100%;
                  height: 100%;
                  overflow: auto;
                  background-color: #2f52ee; /* Fundo semi-transparente */
                }
                
                .custom-modal .modal-content {
                  background-color: #fefefe;
                  margin: 15% auto;
                  padding: 20px;
                  border: 1px solid #888;
                  width: 40%;
                  text-align: center;
                }
                
                .custom-modal .close-btn {
                  color: #aaa;
                  float: right;
                  font-size: 28px;
                  font-weight: bold;
                }
                
                .custom-modal .close-btn:hover,
                .custom-modal .close-btn:focus {
                  color: black;
                  text-decoration: none;
                  cursor: pointer;
                }
                </style>
                
                <script>
                // Fechar o modal se clicar no 'x' ou fora dele
                document.addEventListener('DOMContentLoaded', function() {
                  var modal = document.getElementById('loginModal');
                  var closeBtn = document.querySelector('.custom-modal .close-btn');
                  closeBtn.onclick = function() {
                    modal.style.display = 'none';
                    window.location.href = '/'; // Redirecionar após fechar o modal
                  }
                  window.onclick = function(event) {
                    if (event.target == modal) {
                      modal.style.display = 'none';
                      window.location.href = '/'; // Redirecionar se clicar fora do modal
                    }
                  }
                });
                </script>
            `);
        }
    });
});
// Rota para registro de usuário
app.post('/register', async (req, res) => {
    const { name, username, email, password, isAdmin } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const today = getCurrentDate();

    db.query(
        'INSERT INTO users (username, password, name, created_at, is_admin, reset_password_token, reset_password_expires, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
        [username, hashedPassword, name, today, isAdmin, null, null, email], 
        (err, result) => {
            if (err) {
                console.error('Erro ao criar usuário:', err);
                return res.status(500).json({ success: false, message: 'Erro ao criar usuário' });
            }
            console.log('Usuário criado com sucesso:', result);
            res.status(200).json({ success: true, message: 'Usuário criado com sucesso!' });
        }
    );
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
















// Configuração do Nodemailer
const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true, // Usar TLS
    auth: {
        user: 'geohelper@geohelper.xyz',
        pass: 'J0hn_041' // Substitua pela senha real
    }
});

// Rota para enviar email de redefinição de senha
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    // Validar entrada de email
    if (!email || !validator.isEmail(email)) {
        return res.status(400).send('Email inválido');
    }

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
        if (err) {
            console.error('Erro ao buscar usuário:', err);
            return res.status(500).send('Erro ao buscar usuário');
        }

        if (result.length === 0) {
            return res.status(404).send('Usuário não encontrado');
        }

        const user = result[0];
        const token = crypto.randomBytes(20).toString('hex');
        const expireTime = Date.now() + 3600000; // Token expira em 1 hora

        // Salvar token e tempo de expiração no banco de dados
        db.query('UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE email = ?', [token, expireTime, email], (err) => {
            if (err) {
                console.error('Erro ao salvar token:', err);
                return res.status(500).send('Erro ao salvar token');
            }

            // Configurar o email
            const mailOptions = {
                to: user.email,
                from: 'geohelper@geohelper.xyz',
                subject: 'Redefinição de senha',
                text: `Você está recebendo este email porque você (ou alguém) solicitou a redefinição da senha da sua conta.\n\n` +
                      `Por favor, clique no seguinte link para completar o processo:\n\n` +
                      `http://${req.headers.host}/new-password/${token}\n\n` +
                      `Se você não solicitou isso, por favor ignore este email e sua senha permanecerá inalterada.\n`
            };

            // Enviar o email
            transporter.sendMail(mailOptions, (err) => {
                if (err) {
                    console.error('Erro ao enviar email:', err);
                    return res.status(500).send('Erro ao enviar email');
                }

                // Redirecionar para a página email-sent com mensagem de sucesso
                res.redirect('/email-sent');
            });
        });
    });
});

// Rota para página de sucesso após enviar o email de redefinição
app.get('/email-sent', (req, res) => {
    res.render('email-sent');
});

// Rota para página de nova senha após redefinição
app.get('/new-password/:token', (req, res) => {
    const token = req.params.token;

    db.query('SELECT * FROM users WHERE reset_password_token = ? AND reset_password_expires > ?', [token, Date.now()], (err, result) => {
        if (err) {
            console.error('Erro ao buscar token:', err);
            return res.status(500).send('Erro ao buscar token');
        }

        if (result.length === 0) {
            return res.status(400).send('Token de redefinição de senha é inválido ou expirou');
        }

        // Renderiza a página para definir a nova senha, passando o token como parâmetro
        res.render('new-password', { token });
    });
});

// Rota para processar a alteração de senha
app.post('/reset-password/:token', (req, res) => {
    const { token } = req.params;
    const { newPassword, confirmNewPassword } = req.body;

    // Validar se as senhas coincidem
    if (newPassword !== confirmNewPassword) {
        return res.status(400).send('As senhas não coincidem');
    }

    // Verificar se o token é válido e ainda está dentro do prazo
    db.query('SELECT * FROM users WHERE reset_password_token = ? AND reset_password_expires > ?', [token, Date.now()], (err, result) => {
        if (err) {
            console.error('Erro ao buscar token:', err);
            return res.status(500).send('Erro ao buscar token');
        }

        if (result.length === 0) {
            return res.status(400).send('Token de redefinição de senha é inválido ou expirou');
        }

        // Atualizar a senha no banco de dados
        const user = result[0];
        const hashedPassword = bcrypt.hashSync(newPassword, 10); // Hash da nova senha

        db.query('UPDATE users SET password = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE id = ?', [hashedPassword, user.id], (err) => {
            if (err) {
                console.error('Erro ao atualizar senha:', err);
                return res.status(500).send('Erro ao atualizar senha');
            }

            // Redirecionar para a página de login ou para página de sucesso de redefinição de senha
            res.redirect('/password-reset-success'); // Rota para página de sucesso de redefinição de senha
        });
    });
});

// Rota para página de sucesso de redefinição de senha
app.get('/password-reset-success', (req, res) => {
    res.render('password-reset-success');
});













// Rota para o formulário de contato
app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;

    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Message:', message);

    // Verificar se todos os campos estão presentes
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios' });
    }

    // Verificar se o email já enviou uma mensagem nos últimos 2 minutos
    if (cache.has(email)) {
        return res.status(429).json({ success: false, message: 'Por favor, espere 2 minutos antes de enviar outra mensagem.' });
    }

    // Armazenar o email no cache com um TTL de 2 minutos
    cache.set(email, true);

    // Configurar o Nodemailer com Zoho
    const transporter = nodemailer.createTransport({
        host: 'smtp.zoho.com',
        port: 465,
        secure: true, // Usar TLS
        auth: {
            user: 'geohelper@geohelper.xyz',
            pass: 'J0hn_041' // Substitua pela senha real
        }
    });

    // Configurar o email
    const mailOptions = {
        from: 'geohelper@geohelper.xyz', // Endereço de email do domínio
        to: 'geohelper@geohelper.xyz',
        subject: 'Novo Contato Recebido',
        text: `Nome: ${name}\nEmail: ${email}\n\nMensagem:\n${message}`
    };

    // Enviar o email
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('Erro ao enviar email:', err);
            return res.status(500).json({ success: false, message: 'Erro ao enviar email' });
        }

        console.log('Email enviado:', info.response);
        res.status(200).json({ success: true, message: 'Email enviado com sucesso' });
    });
});
// Rota para exibir o formulário de contato
app.get('/contact', (req, res) => {
    res.render('contact');
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
