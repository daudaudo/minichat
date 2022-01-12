const loginUrl = '/login';

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
module.exports = function(req, res, next) {
  if (req.session.auth == undefined)
    return res.redirect(loginUrl);

  res.locals.auth = req.session.auth;
  next();
}