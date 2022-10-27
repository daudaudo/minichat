const Server = require("socket.io").Server;
const Socket = require("socket.io").Socket;
const Room = require('../models/Room');
/**
 * 
 * @param {Server} io 
 * @param {Socket} socket 
 */
function handle(io, socket) {
  return async roomId => {
    var room = await Room.findById(roomId);
    if (!room || room.primary_user != socket.auth.user._id) {
        return;
    }
    
    await Room.findByIdAndDelete(roomId);
    io.sockets.emit('public', {
        type: 'delete_room',
        data: {
            id: room.id,
        }
    });
  };
}

module.exports = handle;
