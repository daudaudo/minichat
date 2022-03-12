/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
module.exports = function(req, res, next) {
  var csrf = req.body.csrf;
  if (csrf === req.session.auth.token) {
    next();
  } else {
    res.status(419).render('errors/419');
  }
}