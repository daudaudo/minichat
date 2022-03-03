const Server = require("socket.io").Server;
const Socket = require("socket.io").Socket;
const Room = require('../models/Room');
const VIDEO_TRACK = 0;
const AUDIO_TRACK = 1;

/**
 * 
 * @param {Server} io 
 * @param {Socket} socket 
 */
function handle(io, socket) {
  return async data => {
    socket.auth.user.streams[data.streamId].videoTrack = data.enabled;
    io.to(data.roomId).emit('toggle_track', {
      socketId: socket.id,
      enabled: data.enabled,
      streamId: data.streamId,
      typeTrack: data.typeTrack
    });
  }
}

module.exports = handle;
