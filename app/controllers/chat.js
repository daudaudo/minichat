/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

function index(req, res, next) {
  res.render('chat');
}

module.exports = {
  index
};