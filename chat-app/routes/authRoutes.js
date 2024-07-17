const express = require('express');
const router = express.Router();
const { register, login, loginWithGithub, githubCallback, logout, ensureAdmin } = require('../controllers/authController');

// Mostrar la página de registro
router.get('/register', (req, res) => {
    res.render('register', { title: 'Registro' });
});

// Mostrar la página de inicio de sesión
router.get('/login', (req, res) => {
    res.render('login', { title: 'Iniciar Sesión' });
});

// Manejar el registro
router.post('/register', register);

// Manejar el inicio de sesión
router.post('/login', ensureAdmin, login);

// Manejar el inicio de sesión con GitHub
router.get('/github', loginWithGithub);
router.get('/github/callback', githubCallback);

// Manejar el cierre de sesión
router.get('/logout', logout);

module.exports = router;
