const { io } = require("socket.io-client");
const SimplePeer = require('simple-peer');

function pusher(callbacks)
{
  const socket = io();

  for(var channel in callbacks)
  {
    socket.on(channel, callbacks[channel]);
  }

  return socket;
}

module.exports = pusher;