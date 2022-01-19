var express = require('express');
var router = express.Router();

var homecontroller = require('../app/controllers/home');
var oauthcontroller = require('../app/controllers/oauth');
var authcontroller = require('../app/controllers/auth');
var chatcontroller = require('../app/controllers/chat');

var registerValidator = require('../app/validators/register');
var loginValidator = require('../app/validators/login');
var {validateWithRedirect} = require('../app/middlewares/validate');
var auth = require('../app/middlewares/auth');
var webMiddleware = require('../app/middlewares/web')

router.all('*', webMiddleware);

//Home Router
router.get('/', homecontroller.home);
router.get('/chat', chatcontroller.index);

// Oauth Router
router.get('/google/oauth', oauthcontroller.oauthGoogle);
router.get('/google/oauth/callback', oauthcontroller.callbackGoogle);

// Auth Router
router.get('/register', authcontroller.showRegisterForm);
router.post('/register', registerValidator, validateWithRedirect(), authcontroller.register);
router.get('/login', authcontroller.showLoginForm);
router.post('/login',loginValidator, validateWithRedirect(), authcontroller.login);
router.get('/user',auth , authcontroller.user);
router.get('/logout',auth , authcontroller.logout);

module.exports = router;