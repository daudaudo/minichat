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
    var userObj = await User.findById(userId);
    if(!userObj) return;

    var currentUser = socket.auth.user;

    if(userId == currentUser._id.toString()) return;

    if (!userObj.like.contains(currentUser._id)) {
      userObj.like.push(currentUser._id);
    }

    await User.findByIdAndUpdate(userId, {like: userObj.like});
  };
}

module.exports = handle;
