const redis = require('../../bin/redis');

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

function index(req, res) {
  res.render('chat');
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

async function room(req, res) {
  var roomId = req.params.id;
  var rooms = await redis.client.get('rooms');
  rooms = JSON.parse(rooms);
  if(!rooms[roomId]) 
    return res.status(404).send('404 error');
  res.render('room', {roomId: roomId});
}

module.exports = {
  index,
  room
};