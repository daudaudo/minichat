var express = require('express');
var router = express.Router();

var homecontroller = require('../app/controllers/home');
var oauthcontroller = require('../app/controllers/oauth');

router.get('/', homecontroller.home);

router.get('/google/oauth', oauthcontroller.oauthGoogle);
router.get('/google/oauth/callback', oauthcontroller.callbackGoogle);

module.exports = router;