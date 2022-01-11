var express = require('express');
var router = express.Router();

var homecontroller = require('../app/controllers/home');
var oauthcontroller = require('../app/controllers/oauth');
var authcontroller = require('../app/controllers/auth');
var registerValidator = require('../app/validators/register');
var {validateWithRedirect} = require('../app/middlewares/validate');

router.get('/', homecontroller.home);

router.get('/google/oauth', oauthcontroller.oauthGoogle);
router.get('/google/oauth/callback', oauthcontroller.callbackGoogle);

router.get('/register', authcontroller.showRegisterForm);
router.post('/register', registerValidator, authcontroller.register);
router.get('/login', authcontroller.showLoginForm);
router.post('/login', authcontroller.login);

module.exports = router;