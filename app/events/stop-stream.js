const Server = require("socket.io").Server;
const Socket = require("socket.io").Socket;
const Room = require('../models/Room');
const SHARE_SCREEN_STREAM = 0;
/**
 * 
 * @param {Server} io 
 * @param {Socket} socket 
 */
function handle(io, socket) {
  return async data => {
    delete socket.auth.user.streams[data.streamId];
    io.to(data.roomId).emit('stop_stream', {
      streamId: data.streamId,
      user: socket.auth.user
    });
  }
}

module.exports = handle;