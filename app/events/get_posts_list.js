const Server = require("socket.io").Server;
const Socket = require("socket.io").Socket;
const Post = require('../models/Post');
/**
 * 
 * @param {Server} io 
 * @param {Socket} socket 
 */
function handle(io, socket) {
    return async (filter) => {
        filter = filter ?? {};
        filter.deleted_at = null;
        var posts = await Post.find(filter).sort({'created_at': -1}).populate(
            [{
                path:'owner',
            },{
                path:'comments.$*',
                populate: 'owner',
            }]
        );

        socket.emit('public', {
            type: 'get_posts_list',
            data: {
                posts: posts,
            }
        });
    }
}

module.exports = handle;
