const Server = require("socket.io").Server;
const Socket = require("socket.io").Socket;
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const bcrypt = require('bcrypt');

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
        commentObj.user_id = socket.auth.user._id;
        commentObj.post_id = data.post_id;
      
  
      var res = await commentObj.save();
      await commentObj.populate('owner');

      var post = await Post.findById(data.post_id)
      post.comment.set(res._id.toString(), res._id);
      await post.save();
      await post.populate('comment')

  
  
      io.sockets.emit('public', {
        type: 'created_comment',
        data: {
          comment : commentObj,
        }
      });
    };
  }
  
  module.exports = handle;