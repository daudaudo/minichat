const Server = require("socket.io").Server;
const Socket = require("socket.io").Socket;
const Comment = require('../models/Comment');
const Post = require('../models/Post');

/**
 * 
 * @param {Server} io 
 * @param {Socket} socket 
 */
 function handle(io, socket) {
    return async data => {
      if (!socket.auth.auth)
        return;
        
      var commentObj = new Comment();
      commentObj.content = data.content;
      commentObj.owner = socket.auth.user._id;
      commentObj.parent_post = data.parent_post;
      
  
      var res = await commentObj.save();
      await commentObj.populate('owner');

      var post = await Post.findById(data.parent_post)
      post.comments.set(res._id.toString(), res._id);
      await post.save();
      await post.populate('comments')

  
  
      io.emit('public', {
        type: 'comment_created',
        data: {
          comment : commentObj,
        }
      });
    };
  }
  
  module.exports = handle;