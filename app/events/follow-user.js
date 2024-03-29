const Server = require("socket.io").Server;
const Socket = require("socket.io").Socket;
const User = require('../models/User');
/**
 * 
 * @param {Server} io 
 * @param {Socket} socket 
 */
function handle(io, socket) {
  return async userId => {
    var currentUser = socket.auth.user;
    var userCurObj = await User.findById(currentUser);

    if(!userCurObj) return;

    if(userId == currentUser._id.toString()) return;

    userCurObj.follow.set(currentUser._id.toString(), currentUser._id);

    await User.findByIdAndUpdate(currentUser, {follow: userCurObj.follow});
    socket.emit('room', {type: 'like_success', data: "Follow success!!!"});
  };
}

module.exports = handle;
