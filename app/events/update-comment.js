const Server = require("socket.io").Server;
const Socket = require("socket.io").Socket;
const Post = require('../models/Post');
const Comment = require('../models/Comment')
/**
 * 
 * @param {Server} io 
 * @param {Socket} socket 
 */
function handle(io, socket) {
    return async (data) => {
        if (!socket.auth.auth)
        return;

        await Comment.findByIdAndUpdate(data.comment_id,{content: data.content}).populate('user_id');
        // await Comment.populate('user_id');


        io.emit('public', {
            type: 'updated_comment',
           
        });
    }
}

module.exports = handle;
