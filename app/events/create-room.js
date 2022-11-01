const Server = require("socket.io").Server;
const Socket = require("socket.io").Socket;
const Room = require('../models/Room');
/**
 * 
 * @param {Server} io 
 * @param {Socket} socket 
 */
function handle(io, socket) {
  return async room => {
    if (!socket.auth.auth || !room.name.length)
      return;

    let roomObj = new Room();
    roomObj.primary_user = socket.auth.user._id;
    roomObj.name = room.name;
    roomObj.language = room.language;
    roomObj.level = room.level;
    roomObj.password = room.password;

    await roomObj.save();
    await roomObj.populate('primary_user');

    io.sockets.emit('public', {
      type: 'create_room',
      data: roomObj
    });
  };
}

module.exports = handle;
