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
    if (socket.auth.user.streams[data.streamId]) {
      if(data.typeTrack === VIDEO_TRACK)
        socket.auth.user.streams[data.streamId].videoTrack = data.enabled;

      if(data.typeTrack === AUDIO_TRACK)
        socket.auth.user.streams[data.streamId].audioTrack = data.enabled;
    }

    io.to(data.roomId).emit('toggle_track', {
      socketId: socket.id,
      enabled: data.enabled,
      streamId: data.streamId,
      typeTrack: data.typeTrack
    });
  }
}

module.exports = handle;
