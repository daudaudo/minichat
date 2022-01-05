var express = require('express');
var router = express.Router();
var homecontroller = require('../app/controllers/home')
var oauthcontroller = require('../app/controllers/oauth')
var User = require('../app/model/User')

router.get('/', homecontroller.home);

router.get('/google/oauth', oauthcontroller.oauthGoogle);
router.get('/google/oauth/callback', oauthcontroller.callbackGoogle);

router.get('/test', function(req, res) {
    User.create({username: 'tienkhach19', email: 'tienkhach19@gmail.com'}).then(function(user){res.send(user)});
});

module.exports = router;