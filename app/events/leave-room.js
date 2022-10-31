const Server = require("socket.io").Server;
const Socket = require("socket.io").Socket;
const Room = require('../models/Room');
/**
 * 
 * @param {Server} io 
 * @param {Socket} socket 
 */
function handle(io, socket) {
  return async (roomId) => {
    var socketId = socket.id;
    var currentUser = socket.auth.user;

    try {
        let room = await Room.findById(roomId);
        if(room) {
            await socket.leave(roomId);

            room.users.delete(socketId);
            await Room.findByIdAndUpdate(roomId, {users: room.users});

            io.sockets.emit('public', {type: 'leave_room', data: {roomId: roomId, user: currentUser}});
            io.to(roomId).emit('room', {type: 'notification', data: {type: 'error', text: `User ${currentUser.username} has just leave this room.`}});
            io.to(roomId).emit('room', {type: 'leave_room', data: {socketId: socketId}});

            socket.emit('leaved_room');
        }
    }
    catch(e) {

    }

  }
}

module.exports = handle;
