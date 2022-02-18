const Server = require("socket.io").Server;
const Socket = require("socket.io").Socket;
const Room = require('../models/Room');
const uuid = require('uuid');
/**
 * 
 * @param {Server} io 
 * @param {Socket} socket 
 */
function handle(io, socket) {
  return async room => {
    if (!socket.auth.auth)
      return;
    room.primary_user = socket.auth.user._id;
    room.id = uuid.v4();
    var room = await Room.create(room);
    io.sockets.emit('public', {
      type: 'create_room',
      data: room
    });
  };
}

module.exports = handle;