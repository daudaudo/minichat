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
      videoTrack: data.videoTrack,
    };

    io.to(data.roomId).emit('start_stream', {
      streamId: data.streamId,
      user: socket.auth.user,
      type: data.type,
      videoTrack: data.videoTrack,
  });
  }
}

module.exports = handle;
