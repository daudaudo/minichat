const { io } = require("socket.io-client");

function pusher(callbacks)
{
  const socket = io();

  socket.on('connection', data => {
    if(!callbacks.connection) return;
    callbacks.connection(data);
  });

  socket.on('private', data => {
    if(!callbacks.private) return;
    callbacks.private(data);
  });

  socket.on('public', data => {
    if(!callbacks.public) return;
    callbacks.public(data);
  });

  socket.on('room', data => {
    if(!callbacks.room) return;
    callbacks.room(data);
  });

  socket.on('create_room', room => {
    if(!callbacks.create_room) return;
    callbacks.create_room(room);
  });

  socket.on('join_room', room => {
    if(!callbacks.join_room) return;
    callbacks.join_room(room);
  });

  return socket;
}

module.exports = pusher;