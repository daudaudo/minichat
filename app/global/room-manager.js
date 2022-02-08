const Server = require("socket.io").Server;
const Room = require('../models/Room');

/**
 * 
 * @param {Object} room
 * @param {Object} user
 * @returns {Promise<Object>}
 */
async function appendRoom(room, user) {
  room.primary_user = user._id;
  var roomAppended = await Room.create(room);
  return Promise.resolve(roomAppended);
}

/**
 * 
 * @param {String} roomId
 * @param {Object} user
 * @param {String} socketId
 * @param {Server} io
 * @returns {Promise<void>}
 */
async function joinRoom(roomId, user, socketId, io) {
  var filter = {id: roomId};
  let room = await Room.findOne(filter);
  if(room.users.has(user._id)) {
    return;
  } else {
    room.users.set(socketId, user);
    await Room.updateOne(filter, {users: room.users});
    io.sockets.emit('public', {type: 'join_room', data: {roomId: roomId, user: user}});
  }
  return Promise.resolve();
}

/**
 * 
 * @param {Set} listRooms 
 * @param {Object} currentUser
 * @param {String} socketId
 * @param {Server} io
 * @returns {Promise<void>}
 */
async function leaveRoom(listRooms, currentUser, socketId, io) {
  listRooms.forEach(async roomId => {
    let filter = {id: roomId};
    let room = await Room.findOne(filter);
    if(room) {
      room.users.delete(socketId);
      await Room.updateOne(filter, {users: room.users});
      io.sockets.emit('public', {type: 'leave_room', data: {roomId: roomId, user: currentUser}});
      io.to(roomId).emit('room', {type: 'notification', data: {type: 'primary', text: `User ${currentUser.username} has exited this room.`}});
    }
  });
  return Promise.resolve();
}

module.exports = {
  appendRoom,
  joinRoom,
  leaveRoom
};