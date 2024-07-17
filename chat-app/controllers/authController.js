const User = require('../dao/models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const register = async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashedPassword });
    res.redirect('/');
};

const login = passport.authenticate('local', {
    successRedirect: '/api/products',
    failureRedirect: '/',
    failureFlash: true
});

const loginWithGithub = passport.authenticate('github');

const githubCallback = passport.authenticate('github', {
    failureRedirect: '/',
    successRedirect: '/api/products'
});

const logout = (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
};

const ensureAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.username === process.env.ADMIN_EMAIL && bcrypt.compareSync(process.env.ADMIN_PASSWORD, req.user.password)) {
        req.user.role = 'admin';
    }
    next();
};

module.exports = {
    register,
    login,
    loginWithGithub,
    githubCallback,
    logout,
    ensureAdmin
};
