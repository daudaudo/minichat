const Server = require("socket.io").Server;
const Socket = require("socket.io").Socket;
const Post = require('../models/Post');
/**
 * 
 * @param {Server} io 
 * @param {Socket} socket 
 */
function handle(io, socket) {
  return async postId => {
    if (!socket.auth.auth)
        return;

    var post = await Post.findById(postId);
    if(!post) return;

    if (post.like.has(socket.auth.user._id)) {
        post.like.delete(socket.auth.user._id);
    } else {
        post.like.set(socket.auth.user._id.toString(), socket.auth.user._id);
    }

    await post.save();
    io.emit('public', {
        type: 'changed_post',
        data: {
            post: post,
        }
    });
  };
}

module.exports = handle;
