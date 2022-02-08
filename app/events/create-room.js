const Server = require("socket.io").Server;
const Socket = require("socket.io").Socket;
const Room = require('../models/Room');
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
    var room = await Room.create(room);
    io.sockets.emit('public', {
      type: 'create_room',
      data: room
    });
  };
}

module.exports = handle;