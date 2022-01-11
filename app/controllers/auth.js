var {validationResult} = require('express-validator');

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
function showLoginForm(req, res)
{
    res.render('login');
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
function login(req, res)
{
    res.send(req.body);
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
function showRegisterForm(req, res)
{
    res.render('register');
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
function register(req, res)
{
    var errors = validationResult(req);
    if(errors.array.length) res.redirect();
}

module.exports = {
    showLoginForm,
    login,
    showRegisterForm,
    register
}