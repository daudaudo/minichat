/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
module.exports = function(req, res, next) {
  var token = req.body.token;
  if(token == req.session.auth.csrf) {
    next();
  } else {
    res.status(419).send('Page expired');
  }
}