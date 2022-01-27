var redisStore = require('./redis').store;
var redisClient = require('./redis').client;
var uuid = require('uuid');

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
  room.users = {};
  room.users[user._id] = user;
  rooms[roomId] = room;
  await redisClient.set('rooms', JSON.stringify(rooms));
  return Promise.resolve(room);
}

/**
 * 
 * @param {String} roomId
 * @param {Object} user
 * @returns {Promise<void>}
 */
async function joinRoom(roomId, user) {
  var rooms = await getListRooms();
  rooms[roomId].users[user._id] = user;
  await redisClient.set('rooms', JSON.stringify(rooms));
}

/**
 * 
 * @param {String} roomId 
 * @param {String} userId 
 * @returns {Promise<Object>}
 */
async function leaveRoom(roomId, userId) {
  var rooms = await getListRooms();
  var room = rooms[roomId];

  return Promise.resolve(room);
}

module.exports = {
  getListRooms,
  appendRoom,
  joinRoom,
  leaveRoom
};