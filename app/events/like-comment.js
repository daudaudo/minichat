const Server = require("socket.io").Server;
const Socket = require("socket.io").Socket;

const Comment = require('../models/Comment')
/**
 * 
 * @param {Server} io 
 * @param {Socket} socket 
 */
function handle(io, socket) {
  return async commentId => {
    if (!socket.auth.auth)
        return;

    var comment = await Comment.findById(commentId);
    if(!comment) return;

    var liked = 0;

    if (comment.like.has(socket.auth.user._id)) {
        comment.like.delete(socket.auth.user._id);
    } else {
      
      comment.like.set(socket.auth.user._id.toString(), socket.auth.user._id);
      liked = 1;
    }

    await comment.save();
    io.emit('public', {
        type: 'changed_comment',
        data: {
            comment: comment,
            like:liked,
        }
    });
  };
}

module.exports = handle;
