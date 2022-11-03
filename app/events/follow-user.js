const Server = require("socket.io").Server;
const Socket = require("socket.io").Socket;
const User = require('../models/User');
/**
 * 
 * @param {Server} io 
 * @param {Socket} socket 
 */
function handle(io, socket) {
  return async user_id => {
    var user_op = await User.findById(user_id);
    if(!user_op) return;

    var user = socket.auth.user;

    user.like.push(user_id);

    await User.findByIdAndUpdate(user, {follow: user.like});

  };
}

module.exports = handle;
