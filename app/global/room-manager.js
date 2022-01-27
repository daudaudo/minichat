var redisClient = require('./redis').client;
var uuid = require('uuid');
const Server = require("socket.io").Server;
/**
 * 
 * @returns {Object}
 */
async function getListRooms() {
  try {
    var rooms = await redisClient.get('rooms');
    return JSON.parse(rooms);
  } catch (err) {
    return {};
  }

}

/**
 * 
 * @param {Object} room
 * @param {Object} user
 * @returns {Promise<Object>}
 */
async function appendRoom(room, user) {
  var rooms = await getListRooms();
  var roomId = uuid.v4();
  room.id = roomId;
  room.primary_user = user;
  room.users = {};
  rooms[roomId] = room;
  await redisClient.set('rooms', JSON.stringify(rooms));
  return Promise.resolve(room);
}

/**
 * 
 * @param {String} roomId
 * @param {Object} user
 * @param {String} socketId
 * @returns {Promise<void>}
 */
async function joinRoom(roomId, user, socketId) {
  var rooms = await getListRooms();
  if(rooms[roomId].users[user._id]) {
    var sockets = rooms[roomId].users[user._id].sockets;
    if(!sockets) sockets = [];
    sockets.push(socketId);
    rooms[roomId].users[user._id].sockets = sockets;
  } else {
    user.sockets = [socketId];
    rooms[roomId].users[user._id] = user;
  };
  await redisClient.set('rooms', JSON.stringify(rooms));
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
  var rooms = await getListRooms();
  listRooms.forEach(roomId => {
    if(!rooms[roomId]) return true;
    var room = rooms[roomId];
    if(room.users[currentUser._id]) {
      var user = room.users[currentUser._id];
      user.sockets = user.sockets.filter(id => id !== socketId);
      if(user.sockets.length) {
        room.users[user._id] = user;
      } else {
        delete room.users[user._id];
      }
    }
    if(Object.keys(room.users).length === 0) {
      io.sockets.emit('public', {type: 'delete_room', data: room});
      delete rooms[roomId];
    } else {
      rooms[roomId] = room;
    }
  });
  await redisClient.set('rooms', JSON.stringify(rooms));
  return Promise.resolve();
}

module.exports = {
  getListRooms,
  appendRoom,
  joinRoom,
  leaveRoom
};