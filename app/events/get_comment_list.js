const Server = require("socket.io").Server;
const Socket = require("socket.io").Socket;
const Comment = require('../models/Comment');
const User = require('../models/User');
/**
 * 
 * @param {Server} io 
 * @param {Socket} socket 
 */
function handle(io, socket) {
    return async (filters) => {
        console.log(filters);
        var comments = await Comment.find({post_id: filters, deleted_at:null}).sort({'created_at': -1,}).populate('user_id');
        console.log(comments);
        socket.emit('public', {
            type: 'get_comment_list',
            data: {
                comments: comments,
                post_id : filters
            }
        });
    }
}

module.exports = handle;
