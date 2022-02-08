const Server = require("socket.io").Server;
const Socket = require("socket.io").Socket;
/**
 * 
 * @param {Server} io 
 * @param {Socket} socket 
 */
function handle(io, socket) {
  return data => {
    io.sockets.sockets.get(data.peerId).emit('signal', {peerId: socket.id, signal: data.signal});
  };
}

module.exports = handle;