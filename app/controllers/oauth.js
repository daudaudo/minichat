var {
  google
} = require('googleapis');
var User = require('../model/User');
var oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
)

function oauthGoogle(req, res) {
  var url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'openid',
      'profile',
      'email',
    ]
  });
  res.redirect(url);
}

function callbackGoogle(req, res) {
  oauth2Client
    .getToken(req.query.code)
    .then(({
      tokens
    }) => {
      oauth2Client.setCredentials(tokens);
      google.oauth2('v2').userinfo.get({
          auth: oauth2Client,
          url: 'https://www.googleapis.com/oauth2/v3/userinfo',
        })
        .then((user) => {
          res.json(user)
        })
    })
    .catch(err => res.send(err, 500))
}

module.exports = {
  oauthGoogle,
  callbackGoogle
};