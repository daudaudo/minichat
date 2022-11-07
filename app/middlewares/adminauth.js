const loginUrl = "/admin/login";
const Role = require("../models/Role");

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
module.exports = function (req, res, next) {
  if (!req.session.auth.auth) 
    return res.redirect(loginUrl);
  if (req.session.auth.user.role != Role.ADMIN_ROLES)
    return res.redirect(loginUrl);
    
  res.locals.auth = req.session.auth;
  next();
};
