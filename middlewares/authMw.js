const jwt = require('jsonwebtoken');
const User = require('../models/User');

function authMiddleware(req, res, next) {
    const token = req.cookies?.jwt;
    if (!token)
        return res.redirect('/login');
    const data = jwt.verify(token, 'jwtsecret')
    if (!data)
        return res.redirect('/login')
    next();
}

async function checkUser(req, res, next) {
    const token = req.cookies?.jwt;
    res.locals.user = null;
    if (!token)
        return next();

    try {
        const data = jwt.verify(token, 'jwtsecret')
        if (!data) return next();
        res.locals.user = await User.findById(data.id)
        next();
    } catch (e) {
        console.error(e)
    }
}

module.exports = { authMiddleware, checkUser }