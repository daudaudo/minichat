const Server = require("socket.io").Server;
const Socket = require("socket.io").Socket;
const Room = require('../models/Room');
/**
 * 
 * @param {Server} io 
 * @param {Socket} socket 
 */
function handle(io, socket) {
  return async data => {
    
    if (!socket.auth.auth)
      return;

    io.to(data.room).emit('private', {
      sender: socket.auth.user,
      message: data.message
    });

  }
}

module.exports = handle;