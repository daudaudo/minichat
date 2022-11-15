const Server = require("socket.io").Server;
const Socket = require("socket.io").Socket;
const Post = require('../models/Post');
const Comment = require('../models/Comment');
/**
 * 
 * @param {Server} io 
 * @param {Socket} socket 
 */
function handle(io, socket) {
  return async commentId => {

    var comment = await Comment.findOne({_id:commentId});
    var post_id = comment.post_id;
    comment.deleted_at = new Date();
    await comment.save();
    
    var post = await Post.findById(post_id);
    post.comments.delete(commentId)
    await post.save()
    
    
    io.sockets.emit('public', {
        type: 'delete_comment',
        data: {
            id: comment.id,
        }
    });
  };
}

module.exports = handle;
