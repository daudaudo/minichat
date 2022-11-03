const Server = require("socket.io").Server;
const Socket = require("socket.io").Socket;
const Room = require('../models/Room');
const bcrypt = require('bcrypt');
/**
 * 
 * @param {Server} io 
 * @param {Socket} socket 
 */
function handle(io, socket) {
  return async (data) => {
    var {roomId, password} = data;
    var room = await Room.findById(roomId);
    if(!room) return;

    if (!room.password || bcrypt.compareSync(password ?? '', room.password)) {
      var user = socket.auth.user;
      room.users.set(socket.id, user._id);
      await Room.findByIdAndUpdate(roomId, {users: room.users});
      io.sockets.emit('public', {type: 'join_room', data: {roomId: roomId, user: user}});

      await socket.join(roomId);
      socket.broadcast.to(roomId).emit('room', {type: 'notification', data: {type: 'primary', text: `User ${socket.auth.user.username} has joined this room.`}});
      io.to(roomId).emit('room', {type: 'join_room', data: {user: socket.auth.user}});
      socket.emit('room', {type: 'join_room_success'});
    } else {
      socket.emit('room', {type: 'required_password'});
      if (password) {
        socket.emit('room', {type: 'wrong_password'});
      }
    }

  }
}

module.exports = handle;