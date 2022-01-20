const { Server } = require("socket.io");

/**
 * 
 * @param {Server} io
 */
function socket(io)
{
  io.on('connection', function(socket) {

    socket.on('private', function(data) {
      io.sockets.emit('private', data);
    });
  
    socket.on('public', function(data) {
      io.sockets.emit('public', data);
    });

  });
}

module.exports = socket