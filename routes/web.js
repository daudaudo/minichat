var express = require('express');
var router = express.Router();
var homecontroller = require('../app/controllers/home')
var { google } = require('googleapis');
var User = require('../app/model/User')
var oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
)

/* GET home page. */
router.get('/', homecontroller.home);

router.get('/google/oauth', function(req, res) {
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['email']
    });
    res.redirect(url);
});
router.get('/google/oauth/callback', async function(req, res) {
    var {tokens} = await oauth2Client.getToken(req.query.code);
    oauth2Client.setCredentials(tokens);
    var user = await (await google.oauth2('v2').userinfo.get({auth: oauth2Client})).data;
    res.json(user);
});

router.get('/test', function(req, res) {
    User.create({username: 'tienkhach19', email: 'tienkhach19@gmail.com'}).then(function(user){res.send(user)});
});

module.exports = router;