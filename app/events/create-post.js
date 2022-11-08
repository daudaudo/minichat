const Server = require("socket.io").Server;
const Socket = require("socket.io").Socket;
const Post = require('../models/Post');

/**
 * 
 * @param {Server} io 
 * @param {Socket} socket 
 */
function handle(io, socket) {
  return async data => {
    var {content} = data;

    if (!socket.auth.auth)
      return;

    if (!content || !content?.trim().length)
        return;

    var post = new Post();
    post.content = content;
    post.owner = socket.auth.user._id;
    await post.save();
    await post.populate('owner');

    io.emit('public', {
        type: 'post_created',
        data: {
          post: post.toObject(),
        },
    })
    socket.emit('post_created', {});
  };
}

module.exports = handle;
