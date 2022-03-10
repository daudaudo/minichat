var uuid = require('uuid');
var guest = {
  token: null,
  user: {
    username: 'Guest',
    email: null,
    _id: uuid.v4(),
    role: 'guest',
  },
  auth:false,
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
module.exports = function(req, res, next) {
  if (!req.session.auth) req.session.auth = guest;
  res.locals.auth = req.session.auth;
  res.locals.errors = req.flash('errors')[0] ?? {};
  next();
}
