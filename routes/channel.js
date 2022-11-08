const Server = require("socket.io").Server;
/**
 * 
 * @param {Server} io
 */
function socket(io) {
  io.use(require('../app/middlewares/socket'));

  io.on('connection', async function(socket) {
    socket.emit('connection', `Hi ${socket.auth.user.username}. Welcome to minichat rooms!`);

    socket.on('signal', require('../app/events/signal')(io, socket));
    socket.on('create_room', require('../app/events/create-room')(io, socket));
    socket.on('join_room', require('../app/events/join-room')(io, socket));
    socket.on('private', require('../app/events/private')(io, socket));
    socket.on('public', require('../app/events/public')(io, socket));
    socket.on('start_stream', require('../app/events/start-stream')(io, socket));
    socket.on('stop_stream', require('../app/events/stop-stream')(io, socket));
    socket.on('toggle_track', require('../app/events/toggle-track')(io, socket));
    socket.on('disconnecting', require('../app/events/disconnecting')(io, socket));
    socket.on('get_rooms_list', require('../app/events/get_rooms_list')(io, socket));
    socket.on('delete_room', require('../app/events/delete-room')(io, socket));
    socket.on('leave_room', require('../app/events/leave-room')(io, socket));
    socket.on('like_user', require('../app/events/like-user')(io, socket));
    socket.on('follow_user', require('../app/events/follow-user')(io, socket));
    socket.on('create_post', require('../app/events/create-post')(io, socket));
    socket.on('get_posts_list', require('../app/events/get_posts_list')(io, socket));
    socket.on('like_post', require('../app/events/like-post')(io, socket));
  });
}

module.exports = socket;
