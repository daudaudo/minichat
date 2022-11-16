const Server = require("socket.io").Server;
const Socket = require("socket.io").Socket;
const Comment = require('../models/Comment');
/**
 * 
 * @param {Server} io 
 * @param {Socket} socket 
 */
function handle(io, socket) {
   return async (filters) => {
    
     var comments = await Comment.find({parent_post: filters, deleted_at:null}).sort({'created_at': -1,}).populate('owner');
        
     socket.emit('public', {
         type: 'get_comment_list',
         data: {
           comments: comments,
           parent_post : filters
         }
      });
   }
}

module.exports = handle;
