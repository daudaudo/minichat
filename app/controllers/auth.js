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
    res.render('register', {errors: req.flash('errors')});
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
function register(req, res)
{
    var errors = validationResult(req);
    if(!errors.isEmpty()) {
        req.flash('erros', errors);
        res.redirect('back');
    };
    res.send(req.body);
}

module.exports = {
    showLoginForm,
    login,
    showRegisterForm,
    register
}