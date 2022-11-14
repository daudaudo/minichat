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

    var data;

    var comment = await Comment.findById(commentId);
    var filter = {_id : commentId};
    
    if(!comment) return;

    if (comment.like.includes(socket.auth.user._id)) {
        var index = comment.like.indexOf(socket.auth.user._id);
        comment.like.splice(index, 1);
        await Comment.updateOne(filter, { like: comment.like });
        data = {comment: comment, like:0}
      } else {
        comment.like.push(socket.auth.user._id);
        await Comment.updateOne(filter, { like: comment.like });
        data = {comment: comment, like:1}
      }

    io.emit('public', {
        type: 'like_comment_socket',
        data: {
            comment: data,
        }
    });
  };
}

module.exports = handle;
