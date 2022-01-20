/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

function index(req, res, next) {
  res.render('chat');
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

function room(req, res, next) {
  res.render('room');
}

module.exports = {
  index,
  room
};