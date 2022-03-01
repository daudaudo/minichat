const $ = require('./animation');
const {openFullscreen, closeFullscreen} = require('./fullscreen');
const Editor = require('./editor');
const Dropzone = require('../dependencies/dropzone');

const dropable = new Dropzone('#messageContainer > div', {
  preview: '#previewFileMessage',
  uploadUrl: '/room/files',
  uploaded: (data) => {
    socket.emit('private', {
      room: roomId,
      message: {
        files: data,
      }
    });
  }
});

const edittor = new Editor('#messageTextInput', {
  submit: submitMessage,
  emojDialogId: '#emojDialog',
  submitFiles: submitFiles
});

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

function submitFiles() {
  if (dropable.existFiles()) {
    dropable.upload();
  }
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

$('#turnOnCameraBtn').on('click touch', e => {
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  }).then(gotUserVideoStream);
});

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

function renderUserInRoom(user) {
  var socketId = user.socket_id;
  return `
    <div user-room socket-id="${socketId}" class="user-room">
      <div class="user-room-inner">
        <div class="user-room-info transition-all z-20 w-full h-full flex flex-col items-center justify-center">
          <div class="flex justify-center mb-2"><button><img class="rounded-full w-20 h-20 object-cover" src="${user.picture}" alt="" srcset=""></button></div>
          <p class="text-base font-medium text-slate-700 text-center">${user.username}</p>
        </div>
        <div class="absolute left-0 top-0 bottom-0 right-0 p-2 z-10">
          <video class="w-full h-full rounded-xl"></video>
        </div
      </div>
    </div>
  `;
}

/**
 * Callback for socket
 */

const roomId = $('meta[name="chat-room-id"]').attr('content');
const currentUserId = $('meta[name="user-id"]').attr('content');
const SHARE_SCREEN_STREAM = 0;
const VIDEO_STREAM = 1;
const peers = {};
var streams = {};
var isSharingScreen = false;
const SimplePeer = require('simple-peer');
var lastSenderId = null;

const callbacks = {
  connection: (data) => {
    console.log(data);
  },
  private: (data) => {
    if(data.message.text)
      appendTextMessage(data);
    if(data.message.files)
      appendFilesMessage(data);
    notifyHavingMessage();
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
      case 'share_screen':
        if (streams[evt.data.streamId]) {
          streams[evt.data.streamId].type = SHARE_SCREEN_STREAM;
          streams[evt.data.streamId].peerId = evt.data.user.socket_id;
          openSharingScreenStream(streams[evt.data.streamId].stream, evt.data.user.socket_id)
        } else {
          streams[evt.data.streamId] = {
            type: SHARE_SCREEN_STREAM,
            peerId: evt.data.user.socket_id
          }
        }
        break;
      case 'stop_share_screen':
        delete streams[evt.data.streamId];
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
 * 
 * Render messages and append it
 */

/**
 * 
 * @param {Object} data 
 */
function appendTextMessage(data) {
  var isMyMessage = data.sender._id === currentUserId;
  if (lastSenderId != data.sender._id) {
    var htmlMessage = `
      <div class="message w-full flex items-end space-x-4 ${isMyMessage ? 'justify-end' : ''}">
        ${isMyMessage ? '' : `<button><img class="rounded-full w-8 h-8 object-cover" src="/storage/${data.sender.picture}" alt="" srcset=""></button>`}
        <div class="message-text space-y-2 flex flex-col ${isMyMessage ? 'items-end' : 'items-start'}">
          <p class="block p-2 px-4 font-medium ${isMyMessage ? 'text-white bg-sky-700' : 'text-slate-600 bg-slate-100 '}">${data.message.text}</p>
        </div>
      </div>
    `;
    $('#messageBox').append(htmlMessage);
  } else {
    var htmlMessage = `<p class="block p-2 px-4 font-medium ${isMyMessage ? 'text-white bg-sky-700' : 'text-slate-600 bg-slate-100 '}">${data.message.text}</p>`;
    $('#messageBox .message:last-child .message-text').append(htmlMessage);
  }
  lastSenderId = data.sender._id;
  $('#messageBox').scrollTop($('#messageBox').prop('scrollHeight'));
}

function appendFilesMessage(data) {
  var isMyMessage = data.sender._id === currentUserId;
  for(var fileId of Object.keys(data.message.files)) {
    var file = data.message.files[fileId];
    if (lastSenderId != data.sender._id) {
      var htmlMessage = `
        <div class="message w-full flex items-end space-x-4 ${isMyMessage ? 'justify-end' : ''}">
          ${isMyMessage ? '' : `<button><img class="rounded-full w-8 h-8 object-cover" src="/storage/${data.sender.picture}" alt="" srcset=""></button>`}
          <div class="message-text space-y-2 flex flex-col ${isMyMessage ? 'items-end' : 'items-start'}">
            <a href="${file.url}" target="_blank" class="block">
              ${renderFileMessage(file)}
            </a>
          </div>
        </div>
      `;
      $('#messageBox').append(htmlMessage);
    } else {
      var htmlMessage = `
        <a href="${file.url}" target="_blank" class="block">
          ${renderFileMessage(file)}
        </a>
      `;
      $('#messageBox .message:last-child .message-text').append(htmlMessage);
    }
  }
  lastSenderId = data.sender._id;
  $('#messageBox').scrollTop($('#messageBox').prop('scrollHeight'));
}

function renderFileMessage(file) {
  var html = null;
  switch(file.ext) {
    case "png":
    case "jpeg":
    case "jpg":
      html = `<img src="${file.url}" class="object-contain"/>`;
      break;
    default:
      html = `
        <div class="flex items-center space-x-2 p-2">
          <img src="/images/filetypes/file.png" class="object-contain w-8 h-8"/>
          <div>
            <p class="font-semibold text-sm text-slate-700 block">${file.name}</p>
            <p class="font-semibold text-sm text-slate-700">${file.size}</p>
          </div>
        </div>
      `;
      break;
  }
  return html;
}

/**
 * Create a new peer
 * @param {Boolean} initiator 
 * @param {String} peerId
 * @param {Object} user
 */
function createPeer(initiator, peerId, user) {
  streams = {...streams, ...user.streams};
  var peer = new SimplePeer({initiator: initiator});
  peer.on('connect', () => console.log(`Peer connected`));
  peer.on('signal', signal => socket.emit('signal', {signal: signal, roomId: roomId, peerId: peerId}));
  peer.on('error', err => console.error(err));
  peer.on('stream', stream => {
    if(streams[stream.id]) {
      streams[stream.id].stream = stream;
      if(streams[stream.id].type === SHARE_SCREEN_STREAM) {
        openSharingScreenStream(stream, peerId);
      }
    } else {
      streams[stream.id] = {
        stream: stream,
      };
    }
  });
  if(isSharingScreen) peer.addStream(window.shareScreenStream);
  peers[peerId] = user;
  peers[peerId].peer = peer;
  return peer;
}

const socket = require('./pusher')(callbacks);
socket.emit('join_room', roomId);

/**
 * Open ShareScreen Stream
 */

isSharingScreen = false;
window.streamLargeScreenId = null;

$('#shareScreenBtn').on('click', function(e) {
  if (isSharingScreen) return;
  navigator.mediaDevices.getDisplayMedia({
    video: {
      cursor: "always",
    },
    audio: true
  }).then(gotShareScreenStream);
});

/**
 * 
 * @param {MediaStream} stream 
 */
function gotShareScreenStream(stream) {
  $(`#shareScreenBtn`).addClass('bg-sky-700').addClass('text-white');
  isSharingScreen = true;
  window.shareScreenStream = stream;
  for(var name in peers) {
    var peer = peers[name].peer;
    if(peer && !peer.destroyed) peer.addStream(stream);
  }

  stream.getVideoTracks()[0].onended = () => {
    $(`#shareScreenBtn`).removeClass('bg-sky-700').removeClass('text-white');
    isSharingScreen = false;
    $(`[stream-id="${stream.id}"]`).remove();
    socket.emit('stop_stream', {streamId: stream.id, roomId: roomId, type: SHARE_SCREEN_STREAM});
    for(var name in peers) {
      var peer = peers[name].peer;
      if(peer && !peer.destroyed) peer.removeStream(stream);
    }
    if (!$('#videoFullScreen').prop('srcObject')) return;
    if($('#videoFullScreen').prop('srcObject').id === stream.id) 
      closeViewLargeVideo();
  };

  openSharingScreenStream(stream, socket.id);
  socket.emit('start_stream', {streamId: stream.id, roomId: roomId, type: SHARE_SCREEN_STREAM});
}

/**
 * 
 * @param {MediaStream} stream 
 */
function openSharingScreenStream(stream, socketId) {
  var video = $(`<div socket-id="${socketId}" stream-id="${stream.id}" class="user-share-screen"></div>`)
    .append(
      $('<div class="user-share-screen-inner"></div>')
      .append($('<video class="w-full rounded-xl h-full" muted autoplay></video>').prop('srcObject', stream))
    )
    .appendTo('#videoContainer')
    .on('click touch', function(e) {
      $('#videoFullScreen').prop('srcObject', stream);
      $('#videoFullScreenContainer').removeClass('hidden');
      $('#videoFullScreenContainer').addClass('flex');
      $('#videoFullScreenInfo img').prop('src', `${peers[socketId].picture}`);
      $('#videoFullScreenInfo p').text(`${peers[socketId].username} is sharing screen.`);
    });

  stream.onremovetrack = () => {
    $(`[stream-id="${stream.id}"]`).remove();
    if (!$('#videoFullScreen').prop('srcObject')) return;
    if($('#videoFullScreen').prop('srcObject').id === stream.id) 
      closeViewLargeVideo();
  };
}

/**
 * 
 * @param {MediaStream} stream 
 */
function gotUserVideoStream(stream) {
  var userRoom = $(`[user-room][socket-id="${socket.id}"]`);
  userRoom.find('video').prop('srcObject', stream).trigger('play');
  userRoom.addClass('opening-video');
}
