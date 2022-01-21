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
      socket.auth = session.auth ?? {
        token: null,
        user: {
          username: 'guest',
          email: null
        }
      };
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
      var room = await appendRoom(room);
      await socket.join(room);
      io.sockets.emit('create_room', room);
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
async function getListRooms()
{
  try {
    var rooms = await redisClient.get('rooms');
    return JSON.parse(rooms);
  } catch(err)
  {
    return {};
  }
  
}

/**
 * 
 * @param {Object} room
 */
async function appendRoom(room)
{
  var rooms = await getListRooms();
  var roomId = uuid.v4();
  room.id = roomId;
  rooms[roomId] = room;
  redisClient.set('rooms', JSON.stringify(rooms));
  return Promise.resolve(room);
}

module.exports = socket;