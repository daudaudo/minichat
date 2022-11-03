const Server = require("socket.io").Server;
const Socket = require("socket.io").Socket;
const Room = require('../models/Room');
/**
 * 
 * @param {Server} io 
 * @param {Socket} socket 
 */
function handle(io, socket) {
  return async (roomId, type, password) => {
    var room = await Room.findById(roomId);
    if(!room) return;

    if(type == "enterBtn") {
      if(!room.password) {
        var user = socket.auth.user;
        room.users.set(socket.id, user);
        await Room.findByIdAndUpdate(roomId, {users: room.users});
        io.sockets.emit('public', {type: 'join_room', data: {roomId: roomId, user: user}});

        await socket.join(roomId);
        socket.broadcast.to(roomId).emit('room', {type: 'notification', data: {type: 'primary', text: `User ${socket.auth.user.username} has joined this room.`}});
        io.to(roomId).emit('room', {type: 'join_room', data: {user: socket.auth.user}});
        socket.emit('room', {type: 'users', data: {users: room.users}});
      } else {
        socket.emit('room', {type: 'have_password'});
      }
    } else {
      if (password == room.password) {
        var user = socket.auth.user;
        room.users.set(socket.id, user);
        await Room.findByIdAndUpdate(roomId, {users: room.users});
        io.sockets.emit('public', {type: 'join_room', data: {roomId: roomId, user: user}});

        await socket.join(roomId);
        socket.broadcast.to(roomId).emit('room', {type: 'notification', data: {type: 'primary', text: `User ${socket.auth.user.username} has joined this room.`}});
        io.to(roomId).emit('room', {type: 'join_room', data: {user: socket.auth.user}});
        socket.emit('room', {type: 'users', data: {users: room.users}});
      }
    }
  }
}

module.exports = handle;