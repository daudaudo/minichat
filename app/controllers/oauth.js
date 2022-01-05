var { google } = require('googleapis');
var oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
)

function oauthGoogle(req, res) {
    var url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['email']
    });
    res.redirect(url);
}

async function callbackGoogle(req, res) {
    var {tokens} = await oauth2Client.getToken(req.query.code);
    oauth2Client.setCredentials(tokens);
    var user = await (await google.oauth2('v2').userinfo.get({auth: oauth2Client})).data;
    res.json(user);
}

module.exports = {
  oauthGoogle,
  callbackGoogle
};