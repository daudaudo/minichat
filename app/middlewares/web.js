var uuid = require('uuid');
var guest = {
  token: uuid.v4(),
  user: {
    username: 'Guest',
    email: null,
    _id: uuid.v4(),
    role: 'guest',
  },
  auth:false,
}
const User = require('../models/User');

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
module.exports = async function(req, res, next) {
  if (!req.session.auth) req.session.auth = guest;
  if (req.session.auth.auth) {
    var user = await User.findById(req.session.auth.user._id);
    if (!user || user.deleted_at) 
      req.session.auth = guest;
    else 
      req.session.auth.user = user;
  }
  res.locals.auth = req.session.auth;
  res.locals.errors = req.flash('errors')[0] ?? {};
  res.locals.success = req.flash('success')[0] ?? {};
  res.locals.csrf = `<input type="hidden" name="csrf" value="${req.session.auth.token}">`;
  next();
}
