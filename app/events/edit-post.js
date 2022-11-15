const Server = require("socket.io").Server;
const Socket = require("socket.io").Socket;
const Post = require('../models/Post');
/**
 * 
 * @param {Server} io 
 * @param {Socket} socket 
 */
function handle(io, socket) {
  return async (postId,content) => {
    var post = await Post.findById(postId);
    if (!post || post.owner != socket.auth.user._id) {
        return;
    }
    
    post.content = content;
    await post.save();
    io.sockets.emit('public', {
        type: 'edit_post',
        data: {
            id: post.id,
        }
    });
  };
}

module.exports = handle;
