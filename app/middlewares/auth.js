/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
module.exports = function(req, res, next)
{
    if(req.session.user.id == undefined)
        res.redirect('/');
    next();
}