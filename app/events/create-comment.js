const Server = require("socket.io").Server;
const Socket = require("socket.io").Socket;
const Comment = require('../models/Comment');
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
      
  
      await commentObj.save();
      await commentObj.populate('user_id');
  
      io.emit('public', {
        type: 'created_comment',
        data: {
          comment : commentObj
        }
      });
    };
  }
  
  module.exports = handle;