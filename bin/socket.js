const Server = require("socket.io").Server;
var cookieParser = require('cookie-parser');
var redisStore = require('./redis').store;
var redisClient = require('./redis').client;
var uuid = require('uuid');

/**
 * 
 * @param {Server} io
 */
function socket(io) {
  io.use((socket, next) => {
    cookieParser('minichat')(socket.handshake, null, next);
  });

  io.use((socket, next) => {
    redisStore.get(socket.handshake.signedCookies['connect.sid'], function(err, session) {
      var guest = {
        token: null,
        user: {
          username: 'guest',
          email: null,
          _id: uuid.v4(),
        }
      }
      if (!session) {
        socket.auth = guest;
        return next();
      }
      socket.auth = session.auth ?? guest;
      next();
    })
  });

  io.on('connection', function(socket) {
    socket.emit('connection', `Hi ${socket.auth.user.username}. Welcome to minichat rooms!`);
    getListRooms().then(rooms => socket.emit('rooms', rooms));

    socket.on('rooms', async function(rooms) {
      socket.emit('rooms', rooms);
    });

    socket.on('create_room', async function(room) {
      var room = await appendRoom(room, socket.auth.user);
      await socket.join(room);
      io.sockets.emit('create_room', room);
    });

    socket.on('join_room', async function(roomId) {
      await joinRoom(roomId, socket.auth.user);
      socket.join(roomId);
      io.to(roomId).emit('join_room', socket.auth.user);
    });

    socket.on('leave_room', async function(room) {
      var room = await leaveRoom(room);
      await socket.leave(room);
      io.sockets.emit('leave_room', room);
    });

    socket.on('private', function(data) {
      io.to(data.room).emit('private', data.message);
    });

    socket.on('public', function(data) {
      io.sockets.emit('public', data);
    });
  });
}

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

module.exports = socket;