const Server = require("socket.io").Server;
const Room = require("../app/models/Room");
/**
 * 
 * @param {Server} io
 */
function socket(io) {
  io.use(require('../app/middlewares/socket'));

  io.on('connection', async function(socket) {
    socket.emit('connection', `Hi ${socket.auth.user.username}. Welcome to minichat rooms!`);
    socket.emit('public', {
      type: 'rooms',
      data: {
        rooms: await Room.find(),
      }
    });

    socket.on('signal', require('../app/events/signal')(io, socket));
    socket.on('create_room', require('../app/events/create-room')(io, socket));
    socket.on('join_room', require('../app/events/join-room')(io, socket));
    socket.on('private', require('../app/events/private')(io, socket));
    socket.on('public', require('../app/events/public')(io, socket));
    socket.on('start_stream', require('../app/events/start-stream')(io, socket));
    socket.on('stop_stream', require('../app/events/stop-stream')(io, socket));
    socket.on('disconnecting', require('../app/events/disconnecting')(io, socket));
  });
}

module.exports = socket;
