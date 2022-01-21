//const { io } = require("socket.io-client");

function pusher(callbacks)
{
  const socket = io();

  socket.on('connection', data => {
    callbacks.connection(data);
  });

  socket.on('private', data => {
    callbacks.private(data);
  });

  socket.once('rooms', room => {
    callbacks.rooms(room);
  });

  socket.on('create_room', room => {
    callbacks.create_room(room);
  });

  return socket;
}
