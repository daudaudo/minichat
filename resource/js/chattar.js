const $ = require('./animation');
const {openFullscreen, closeFullscreen} = require('./fullscreen');
const Editor = require('./editor');
const edittor = new Editor('#messageTextInput', submitMessage, '#emojDialog');
/**
 * 
 * @param {String} text 
 * @returns 
 */
function submitMessage(text) {
  if (text.length == 0) return;
  text = text.trim();
  socket.emit('private', {
    room: roomId,
    message: {
      text: text,
    }
  });
}

/**
 * Register event for DOM
 */

$('#closeFullScreenVideoBtn').on('click touch', closeViewLargeVideo);

$('#sendMessageBtn').on('click touch', function(e) {
  edittor.submitData();
});

function closeViewLargeVideo() {
  $('#videoFullScreenContainer').addClass('hidden');
  $('#videoFullScreenContainer').removeClass('flex');
  $('#videoFullScreenInfo img').prop('src', '');
  $('#videoFullScreenInfo p').text('');
  window.streamLargeScreenId = null;
}

/**
 * Toolbar for roomchat
 */

var openingMessageBox = false;

$('#openMessageBoxBtn').on('click touch', function(e) {
  $(this).toggleClass('bg-sky-700 text-white');
  $(this).removeClass('has-message-animation');
  if(openingMessageBox) {
    openingMessageBox = false;
    $('#messageContainer').addClass('translate-x-full');
    setTimeout(() => {
      $('#messageContainer').addClass('hidden');
      $('#messageContainer').removeClass('flex');
    }, 150);
  } else {
    openingMessageBox = true;
    $('#messageContainer').removeClass('hidden');
    $('#messageContainer').addClass('flex');
    setTimeout(() => {
      $('#messageContainer').removeClass('translate-x-full');
    }, 25);
  }
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

function notifyHavingMessage() {
  if(!openingMessageBox) {
    $('#openMessageBoxBtn').addClass('has-message-animation');
  }
}

/**
 * Renderer
 */

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
  if (lastSenderId != sender._id)
    return `
      <div class="message w-full flex items-end space-x-4 ${isMyMessage ? 'justify-end' : ''}">
        ${isMyMessage ? '' : `<button><img class="rounded-full w-8 h-8 object-cover" src="/storage/${sender.picture}" alt="" srcset=""></button>`}
        <div class="message-text space-y-2 flex flex-col ${isMyMessage ? 'items-end' : 'items-start'}">
          <p class="block p-2 px-4 font-medium ${isMyMessage ? 'text-white bg-sky-700' : 'text-slate-600 bg-slate-100 '}">${message.text}</p>
        </div>
      </div>
    `;
  else
    return `
      <p class="block p-2 px-4 font-medium ${isMyMessage ? 'text-white bg-sky-700' : 'text-slate-600 bg-slate-100 '}">${message.text}</p>
    `;
}

function renderUserInRoom(user) {
  var socketId = user.socket_id;
  return `
    <div socket-id="${socketId}" class="user-room">
      <div class="user-room-inner">
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
    notifyHavingMessage();
    $('#messageBox').scrollTop($('#messageBox').prop('scrollHeight'));
  },
  room: (evt) => {
    switch (evt.type) {
      case 'notification':
        $('#messageBox').append(renderNotification(evt.data));
        lastSenderId = null;
        notifyHavingMessage();
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
  peer.on('stream', stream => {
    openSharingScreenStream(stream, peerId);
  });
  if(window.isSharingScreen) peer.addStream(window.shareScreenStream);
  peers[peerId] = user;
  peers[peerId].peer = peer;
  return peer;
}

const socket = require('./pusher')(callbacks);
socket.emit('join_room', roomId);

/**
 * Open ShareScreen Stream
 */

window.isSharingScreen = false;
window.streamLargeScreenId = null;

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
  openSharingScreenStream(stream, socket.id);
}

/**
 * 
 * @param {MediaStream} stream 
 */
function openSharingScreenStream(stream, socketId) {
  var video = $('<video class="w-full rounded-xl h-full" muted autoplay></video>');
  video.prop('srcObject', stream);
  $(`<div socket-id="${socketId}" class="user-share-screen"></div>`)
    .append($('<div class="user-share-screen-inner"></div>').append(video))
    .appendTo('#videoContainer')
    .on('click touch', function(e) {
      $('#videoFullScreen').prop('srcObject', stream);
      $('#videoFullScreenContainer').removeClass('hidden');
      $('#videoFullScreenContainer').addClass('flex');
      $('#videoFullScreenInfo img').prop('src', `/storage/${peers[socketId].picture}`);
      $('#videoFullScreenInfo p').text(`${peers[socketId].username} is sharing screen.`);
      window.streamLargeScreenId = stream.id;
    });

  stream.getVideoTracks()[0].onended = () => {
    window.isSharingScreen = false;
    if(window.streamLargeScreenId === stream.id) 
      closeViewLargeVideo();
    video.parent().parent().remove();
    for(var name in peers) {
      var peer = peers[name].peer;
      if(peer && !peer.destroyed) peer.removeStream(stream);
    }
  };

  stream.onremovetrack = () => {
    video.parent().parent().remove();
    if(window.streamLargeScreenId === stream.id) 
      closeViewLargeVideo();
  };
}
