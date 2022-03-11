var User = require('../models/User');
var uuid = require('uuid');

/**
 * 
 * @param {Object} user 
 * @param {import('express').Request} req 
 * @returns {Promise<Boolean>}
 */
async function login(user, req)
{
  var user = await User.findOne({email: user.email});
  if(!user) return false;
  req.session.auth = {
    user: user,
    token: uuid.v4(),
    auth: true,
  };
  return true;
}

/**
 * 
 * @param {import('express').Request} req 
 */
function user(req) {
  return req.session.auth.user;
}

/**
 * 
 * @param {import('express').Request} req 
 * @param {Object} user 
 */
function setUser(req, user) {
  return req.session.auth.user = user;
}

module.exports = {
  login,
  user,
  setUser
}
