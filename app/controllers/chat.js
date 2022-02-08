const Room = require('../models/Room');

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

async function index(req, res) {
  var rooms = await Room.find();
  res.render('chat', {rooms: rooms});
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

async function room(req, res) {
  var roomId = req.params.id;
  var room = await Room.find({id: roomId});
  if(!room.length)
    return res.status(404).send('404');
  res.render('room', {roomId: roomId});
}

module.exports = {
  index,
  room
};