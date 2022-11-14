var User = require('../models/User');

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
  user,
  setUser
}
