const Server = require("socket.io").Server;
const Socket = require("socket.io").Socket;
const Room = require('../models/Room');
const SHARE_SCREEN_STREAM = 0;
const VIDEO_STREAM = 1;
/**
 * 
 * @param {Server} io 
 * @param {Socket} socket 
 */
function handle(io, socket) {
  return async data => {
    socket.auth.user.streams[data.streamId] = {
      type: data.type,
      peerId: socket.id,
    };
    socket.broadcast.to(data.roomId).emit('room', {
      type: data.type === VIDEO_STREAM ? 'open_camera' : 'share_screen',
      data: {
        streamId: data.streamId,
        user: socket.auth.user
      }
    });
  }
}

module.exports = handle;