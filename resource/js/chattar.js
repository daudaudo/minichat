const $ = require('./animation');

/**
 * Toolbar for roomchat
 */

$('#openMessageBoxBtn').on('click touch', function(e) {
  $('#messageContainer').toggleClass('hidden flex');
  $(this).toggleClass('bg-sky-700 text-white');
});

$('#fullscreenBtn').on('click', function() {
  $(this).toggleClass('bg-sky-700 text-white');
  var element = document.getElementById('chatroomContainer');
  if (window.innerHeight == screen.height) {
    closeFullscreen();
  } else {
    openFullscreen(element);
  }
});

/**
 * @param {HTMLElement} elem 
 */
function openFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE11 */
    elem.msRequestFullscreen();
  }
}

/**
 * @param {HTMLElement} elem 
 */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE11 */
    document.msExitFullscreen();
  }
}

/**
 * 
 * @param {Object} notify
 * @returns {String} 
 */
function renderNotification(notify) {
  switch (notify.type) {
    case 'primary':
      return `<p class='font-semibold text-sm text-sky-700'>${notify.text}</p>`;
    case 'error':
      return `<p class='font-semibold text-sm text-red-500'>${notify.text}</p>`;
    case 'warn':
      return `<p class='font-semibold text-sm text-yellow-500'>${notify.text}</p>`;
    default:
      return `<p class='font-semibold text-sm text-slate-600'>${notify.text}</p>`;
  }
}

/**
 * 
 * @param {Object} message
 * @returns {String} 
 */
function renderMessage(message, sender) {
  var isMyMessage = sender._id === currentUserId;
  console.log(isMyMessage);
  if (lastSenderId != sender._id)
    return `
      <div class="message w-full flex items-end space-x-4 ${isMyMessage ? 'justify-end' : ''}">
        ${isMyMessage ? '' : `<button><img class="rounded-full w-8 h-8 object-cover" src="/storage/${sender.picture}" alt="" srcset=""></button>`}
        <div class="message-text space-y-2 flex flex-col ${isMyMessage ? 'items-end' : 'items-start'}">
          <p class="block p-2 px-4 rounded-md font-medium ${isMyMessage ? 'text-white bg-sky-700' : 'text-slate-600 bg-slate-100 '}">${message.text}</p>
        </div>
      </div>
    `;
  else
    return `
      <p class="block p-2 px-4 rounded-md font-medium ${isMyMessage ? 'text-white bg-sky-700' : 'text-slate-600 bg-slate-100 '}">${message.text}</p>
    `;
}

function renderUserInRoom(user) {
  var socketId = user.socket_id;
  return `
    <div socket-id="${socketId}" class="w-1/3 p-4">
      <div class="p-2 shadow relative rounded-xl cursor-pointer h-full flex flex-col items-center justify-center">
        <div class="flex justify-center mb-2"><button><img class="rounded-full w-20 h-20 object-cover" src="/storage/${user.picture}" alt="" srcset=""></button></div>
        <p class="text-base font-medium text-slate-700 text-center">${user.username}</p>
      </div>
    </div>
  `
}

/**
 * Callback for socket
 */

const roomId = $('meta[name="chat-room-id"]').attr('content');
const currentUserId = $('meta[name="user-id"]').attr('content');
const peers = {};
const SimplePeer = require('simple-peer');
var lastSenderId = null;

const callbacks = {
  connection: (data) => {
    console.log(data);
  },
  private: (data) => {
    var htmlMessage = renderMessage(data.message, data.sender);
    if (lastSenderId != data.sender._id) {
      $('#messageBox').append(htmlMessage);
    } else {
      $('#messageBox .message:last-child .message-text').append(htmlMessage);
    }
    lastSenderId = data.sender._id;
    $('#messageBox').scrollTop($('#messageBox').prop('scrollHeight'));
  },
  room: (evt) => {
    switch (evt.type) {
      case 'notification':
        $('#messageBox').append(renderNotification(evt.data));
        lastSenderId = null;
        break;
      case 'join_room':
        if(socket.id === evt.data.user.socket_id) {
          return peers[socket.id] = evt.data.user;
        }
        createPeer(true, evt.data.user.socket_id, evt.data.user);
        $('#videoContainer').append(renderUserInRoom(evt.data.user));
        break;
      case 'leave_room':
        delete peers[evt.data.socketId];
        $(`#videoContainer [socket-id="${evt.data.socketId}"]`).remove();
        break;
      case 'users':
        Object.keys(evt.data.users).forEach(socketId => {
          var user = evt.data.users[socketId];
          $('#videoContainer').append(renderUserInRoom(user));
        });
        break;
      default:
        break;
    }
  },
  signal: (data) => {
    if(!peers[data.peerId]) {
      createPeer(false, data.peerId, data.user);
    }
    peers[data.peerId].peer.signal(data.signal);
  }
}

/**
 * Create a new peer
 * @param {Boolean} initiator 
 * @param {String} peerId
 * @param {Object} user
 */
function createPeer(initiator, peerId, user) {
  var peer = new SimplePeer({initiator: initiator});
  peer.on('connect', () => console.log(`Peer connected`));
  peer.on('signal', signal => socket.emit('signal', {signal: signal, roomId: roomId, peerId: peerId}));
  peer.on('error', err => console.error(err));
  peer.on('stream', openSharingScreenStream);
  if(window.isSharingScreen) peer.addStream(window.shareScreenStream);
  peers[peerId] = user;
  peers[peerId].peer = peer;
  return peer;
}

const socket = require('./pusher')(callbacks);
socket.emit('join_room', roomId);

/**
 * Register event for DOM
 */

$('#messageTextInput').on('keydown', function(e) {
  if (e.code !== "Enter") return;
  if ($('#messageTextInput').val().length == 0) return;
  socket.emit('private', {
    room: roomId,
    message: {
      text: $('#messageTextInput').val(),
    }
  });
  $('#messageTextInput').val('');
});

/**
 * Open ShareScreen Stream
 */

window.isSharingScreen = false;

$('#shareScreenBtn').on('click', function(e) {
  if (window.isSharingScreen) return;
  navigator.mediaDevices.getDisplayMedia({
    video: {
      cursor: "always",
    },
    audio: false
  }).then(gotShareScreenStream);
});

/**
 * 
 * @param {MediaStream} stream 
 */
function gotShareScreenStream(stream) {
  window.isSharingScreen = true;
  window.shareScreenStream = stream;
  for(var name in peers) {
    var peer = peers[name].peer;
    if(peer && !peer.destroyed) peer.addStream(stream);
  }
  openSharingScreenStream(stream);
}

/**
 * 
 * @param {MediaStream} stream 
 */
function openSharingScreenStream(stream) {
  var video = $('<video class="w-full rounded-xl h-full" muted autoplay></video>');
  video.prop('srcObject', stream);
  $('<div class="w-1/3 p-4"></div>')
    .append($('<div class="p-2 shadow relative rounded-xl h-full flex items-center justify-center cursor-pointer"></div>').append(video))
    .appendTo('#videoContainer');

  stream.getVideoTracks()[0].onended = () => {
    window.isSharingScreen = false;
    video.parent().parent().remove();
    for(var name in peers) {
      var peer = peers[name].peer;
      if(peer && !peer.destroyed) peer.removeStream(stream);
    }
  };

  stream.onremovetrack = () => {
    video.parent().parent().remove();
  };
}
