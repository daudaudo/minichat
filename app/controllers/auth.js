function showLoginForm(req, res)
{
    res.render('login');
}

function login(req, res)
{
    res.send(req.body);
}

function showRegisterForm(req, res)
{

}

function register(req, res)
{

}

module.exports = {
    showLoginForm,
    login,
    showRegisterForm,
    register
}