/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
module.exports = function(req, res, next) {
  res.locals.auth = req.session.auth ?? false;
  res.locals.errors = req.flash('errors') ?? [];
  res.locals.success = req.flash('success') ?? [];
  next();
}