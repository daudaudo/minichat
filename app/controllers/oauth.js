var User = require('../models/User');
var {google, oauth2Client} = require('../global/oauth');
var dayjs = require('dayjs');
const Storage = require('../global/storage');
var {login} = require('../global/auth');
var uuid = require('uuid');

const homeUrl = '/';

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
    });
    user = user.data;
    if(!(await login(user, req)))
    {
      user = await User.create({
        username: user.name,
        email: user.email,
        picture: Storage.url(await Storage.fromFolder('public/avatar').putFromUrl(user.picture)),
        password: uuid.v4(),
      });
      await login(user, req);
    }
    res.redirect(homeUrl);
  } catch (err) {
    res.status(500).send(err);
  }
}

module.exports = {
  oauthGoogle,
  callbackGoogle
};
