const Server = require("socket.io").Server;
const Socket = require("socket.io").Socket;
const User = require('../models/User');
/**
 * 
 * @param {Server} io 
 * @param {Socket} socket 
 */
function handle(io, socket) {
  return async data => {
    var {userId, roomId} = data;
    var userObj = await User.findById(userId);
    if(!userObj) return;

    var currentUser = socket.auth.user;

    if(userId == currentUser._id.toString()) return;

    userObj.like.set(currentUser._id.toString(), currentUser._id);
    await userObj.save();

    io.to(roomId).emit('room', {type: 'notification', data: {type: 'primary', text: `User ${socket.auth.user.username} has just liked ${userObj.username}.`}});
  };
}

module.exports = handle;
