var getListRooms = require('../global/room-manager').getListRooms;

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

async function index(req, res) {
  var rooms = await getListRooms();
  res.render('chat', {rooms: rooms});
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

async function room(req, res) {
  var roomId = req.params.id;
  var rooms = await getListRooms();
  if(!rooms[roomId]) 
    return res.status(404).send('404 error');
  res.render('room', {roomId: roomId});
}

module.exports = {
  index,
  room
};