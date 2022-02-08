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

/**
 * Callback for socket
 */

const roomId = $('meta[name="chat-room-id"]').attr('content');
const currentUserId = $('meta[name="user-id"]').attr('content');
const SimplePeer = require('simple-peer');
var lastSenderId = null;
window.peers = {};

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
        var peer = new SimplePeer({initiator: true});
        if(window.isSharingScreen) peer.addStream(window.shareScreenStream);
        peer.on('signal', signal => {
          socket.emit('signal', {signal: signal, roomId: roomId, peerId: evt.data.peerId});
        });
        peer.on('connect', () => console.log(`Hey peer from dream`));
        peer.on('error', err => console.log(err));
        peer.on('stream', openSharingScreenStream);
        window.peers[evt.data.peerId] = peer;
        break;
      default:
        break;
    }
  },
  signal: (data) => {
    var peer = window.peers[data.peerId];
    if(!peer) {
      var peer = new SimplePeer();
      peer.on('connect', () => console.log(`Hey peer from dream`));
      peer.on('signal', signal => socket.emit('signal', {signal: signal, roomId: roomId, peerId: data.peerId}));
      peer.on('error', err => console.log(err));
      peer.on('stream', openSharingScreenStream);
      window.peers[data.peerId] = peer;
    }
    peer.signal(data.signal);
  }
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
  for(var name in window.peers) {
    var peer = window.peers[name];
    if(!peer.destroyed) peer.addStream(stream);
  }
  openSharingScreenStream(stream);
}

/**
 * 
 * @param {MediaStream} stream 
 */
function openSharingScreenStream(stream) {
  var video = $('<video class="w-full rounded-xl" muted autoplay></video>');
  video.prop('srcObject', stream);
  $('<div class="w-1/3 p-4"></div>').append($('<div class="p-2 shadow relative rounded-xl h-fit cursor-pointer"></div>').append(video)).appendTo('#videoContainer');
  stream.getVideoTracks()[0].onended = () => {
    window.isSharingScreen = false;
    video.parent().remove();
  };
}
