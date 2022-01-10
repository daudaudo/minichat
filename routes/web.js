var express = require('express');
var router = express.Router();

var homecontroller = require('../app/controllers/home');
var oauthcontroller = require('../app/controllers/oauth');
var authcontroller = require('../app/controllers/auth');

router.get('/', homecontroller.home);

router.get('/google/oauth', oauthcontroller.oauthGoogle);
router.get('/google/oauth/callback', oauthcontroller.callbackGoogle);

router.get('/login', authcontroller.showLoginForm);

module.exports = router;