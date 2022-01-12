/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
const loginUrl = '/login';

module.exports = function(req, res, next) {
  if (req.session.auth == undefined)
    return res.redirect(loginUrl);
  next();
}