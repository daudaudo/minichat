const Server = require("socket.io").Server;
var cookieParser = require('cookie-parser');
var redisStore = require('../app/global/redis').store;
var uuid = require('uuid');
var {
  getListRooms,
  appendRoom,
  joinRoom,
  leaveRoom
} = require('../app/global/room-manager');

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

    socket.on('create_room', async function(room) {
      if(socket.auth.user.username == 'guest') 
        return;
      var room = await appendRoom(room, socket.auth.user);
      await socket.join(room);
      io.sockets.emit('public', {type: 'create_room', data: room});
    });

    socket.on('join_room', async function(roomId) {
      await joinRoom(roomId, socket.auth.user, socket.id);
      await socket.join(roomId);
      io.to(roomId).emit('room', {type: 'notification', data: {type: 'primary', text: `User ${socket.auth.user.username} has joined this room.`}});
      io.sockets.emit('public', {type: 'join_room', data: {roomId: roomId, user: socket.auth.user}});
    });

    socket.on('leave_room', async function(room) {
      var room = await leaveRoom(room);
      await socket.leave(room);
      io.sockets.emit('leave_room', room);
    });

    socket.on('private', function(data) {
      if(socket.auth.user.username == 'guest') return;
      io.to(data.room).emit('private', {sender: socket.auth.user, message: data.message});
    });

    socket.on('public', function(data) {
      io.sockets.emit('public', data);
    });

    socket.on('connect', function() {
      console.log(socket.id);
    });

    socket.on('disconnecting',async function() {
      console.log(`${socket.id} is disconnecting`);
      await leaveRoom(socket.rooms, socket.auth.user, socket.id, io);
    });
  });
}

module.exports = socket;