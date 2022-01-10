var google = require('googleapis').google;
var User = require('../model/User');
var oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
)

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
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

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
async function callbackGoogle(req, res) {
  try {
    var {tokens} = await oauth2Client.getToken(req.query.code);
    oauth2Client.setCredentials(tokens);
    var user = await google.oauth2('v2').userinfo.get({
      auth: oauth2Client
    })
    user = user.data;
    await User.create({
      username: user.name,
      email: user.email,
    });
    res.send(user)
  } catch (err) {
    res.send(err);
  }

}

module.exports = {
  oauthGoogle,
  callbackGoogle
};