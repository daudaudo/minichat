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
    socket.auth.user.shareScreenStreamId = data.streamId;
    socket.broadcast.to(data.roomId).emit('room', {
      type: 'share_screen',
      data: {
        streamId: data.streamId,
        user: socket.auth.user
      }
    });
  }
}

module.exports = handle;