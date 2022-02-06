const { io } = require("socket.io-client");
const SimplePeer = require('simple-peer');

function pusher(callbacks)
{
  const socket = io();

  for(var channel in callbacks)
  {
    socket.on(channel, callbacks[channel]);
  }

  socket.on('p2p', data => {
    var peerId = data.peerId;

    var peer = new SimplePeer({
      initiator: data.initiator,
      trickle: false
    });

    socket.on('signal', function(data) {
      if (data.peerId == peerId) {
        peer.signal(data.signal);
      }
    });
  
    peer.on('signal', function(data) {
      socket.emit('signal', {
        signal: data,
        peerId: peerId
      });
    });

    peer.on('error', function(e) {
      console.log(e);
    });

    peer.on('connect', function() {
      peer.send("hey peer");
    });
    
    peer.on('data', function(data) {
      console.log(data);
    });

  });

  return socket;
}

module.exports = pusher;