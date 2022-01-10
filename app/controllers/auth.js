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
    res.send(req.body);
}

module.exports = {
    showLoginForm,
    login,
    showRegisterForm,
    register
}