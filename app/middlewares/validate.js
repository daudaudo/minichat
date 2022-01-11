var {validationResult} = require('express-validator');

const redirectPathDefault = 'back';

function validateWithRedirect(redirectPath) {
  if (!redirectPath) redirectPath = redirectPathDefault;
  /**
   * 
   * @param {import("express").Request} req 
   * @param {import("express").Response} res 
   * @param {import("express").NextFunction} next 
   */
  return function(req, res, next) {
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('errors' ,errors.array());
      return res.redirect(redirectPath);
    };
    next();
  }
}

module.exports = {
  validateWithRedirect
}