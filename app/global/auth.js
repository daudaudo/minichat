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
  var users = await User.find({email: user.email});
  if(!users.length) return false;
  req.session.auth = {
    user: users[0],
    token: uuid.v4(),
  };
  return true;
}

module.exports = {
  login
}