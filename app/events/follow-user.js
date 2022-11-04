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

    userCurObj.follow.addToSet(currentUser);

    await User.findByIdAndUpdate(currentUser, {follow: userCurObj.follow});

  };
}

module.exports = handle;
