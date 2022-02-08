const Server = require("socket.io").Server;
const Socket = require("socket.io").Socket;
const Room = require('../models/Room');
/**
 * 
 * @param {Server} io 
 * @param {Socket} socket 
 */
function handle(io, socket) {
  return async () => {
    var listRooms = socket.rooms;
    var socketId = socket.id;
    var currentUser = socket.auth.user;

    listRooms.forEach(async roomId => {

      let filter = {id: roomId};
      let room = await Room.findOne(filter);
      if(room) {
        room.users.delete(socketId);
        await Room.updateOne(filter, {users: room.users});
        io.sockets.emit('public', {type: 'leave_room', data: {roomId: roomId, user: currentUser}});
        io.to(roomId).emit('room', {type: 'notification', data: {type: 'primary', text: `User ${currentUser.username} has just leave this room.`}});
        io.to(roomId).emit('room', {type: 'leave_room', data: {socketId: socketId}});
      }

    });

  }
}

module.exports = handle;