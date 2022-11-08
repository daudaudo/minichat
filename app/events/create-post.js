const Server = require("socket.io").Server;
const Socket = require("socket.io").Socket;
const Post = require('../models/Post');
const maxLengthContent = 300;

/**
 * 
 * @param {Server} io 
 * @param {Socket} socket 
 */
function handle(io, socket) {
  return async data => {

    if (!socket.auth.auth)
      return;

    var {content} = data;
    content = content ? content.toString().trim() : '';

    if (!content || !content.length || content.length > maxLengthContent)
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
