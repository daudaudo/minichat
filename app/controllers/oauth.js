var User = require('../models/User');
var {google, oauth2Client} = require('../global/oauth');
const Storage = require('../global/storage');
const uuid = require('uuid');
const bcrypt = require('bcrypt');

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
    var userGoogle = await google.oauth2('v2').userinfo.get({
      auth: oauth2Client
    });
    userGoogle = userGoogle.data;
    var user = await User.findOne({email: userGoogle.email});
    if (user) {
      if (user.deleted_at) {
        return redirectLoginWithMessage(req, res, "Your account has been deleted !!");
      }
      if (user.suspended_at) {
        return redirectLoginWithMessage(req, res, "Your account has been suspended !!");
      }
    } else {
      user = await User.create({
        username: userGoogle.name,
        email: userGoogle.email,
        picture: Storage.url(await Storage.fromFolder('public/avatar').putFromUrl(userGoogle.picture)),
        password: bcrypt.hashSync(uuid.v4(), 10),
      });
    }
    req.session.auth = {
      user: user,
      token: uuid.v4(),
      auth: true,
    };
    res.redirect(homeUrl);
  } catch (err) {
    res.status(500).send(err);
  }
}

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {Object} msg
 */

function redirectLoginWithMessage(req, res, msg) {
  req.flash("errors", {
    auth: { msg },
  });
  res.redirect("/login");
}

module.exports = {
  oauthGoogle,
  callbackGoogle
};
