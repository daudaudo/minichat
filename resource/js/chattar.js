const $ = require('./animation');
const FullScreen = require('../dependencies/fullscreen');
const Editor = require('../dependencies/editor');
const Dropzone = require('../dependencies/dropzone');
const Streamer = require('../dependencies/streamer');

const fullscreen = new FullScreen(document.getElementById('chatroomContainer'), {
  enter: () => {
    $('#fullscreenBtn').addClass('active');
  },
  exit: () => {
    $('#fullscreenBtn').removeClass('active');
  }
});

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
 * Preload room
 */

async function preloadRoom() {
  var streamer = await Streamer.fromUserMedia({
    onAudioTrackEnable: () => {
      statusGlobal.preloadMic = true;
      $('#preloadMicBtn').addClass('active');
    },
    onAudioTrackDisable: () => {
      statusGlobal.preloadMic = false;
      $('#preloadMicBtn').removeClass('active');
    },
    onVideoTrackEnable: () => {
      statusGlobal.preloadCamera = true;
      $('#preloadPreviewVideoOff').removeClass('bg-slate-900');
      $('#preloadCameraBtn').addClass('active');
    },
    onVideoTrackDisable: () => {
      statusGlobal.preloadCamera = false;
      $('#preloadPreviewVideoOff').addClass('bg-slate-900');
      $('#preloadCameraBtn').removeClass('active');
    },
    onLoad: (videoStream, audioStream) => {
      $('#preloadRoom video').prop('srcObject', videoStream).trigger('play');
    },
    videoInit: false,
    audioInit: false,
  });

  $('#enterRoomBtn').on('click touch', () => {
    socket.emit('join_room', roomId);
    $('#chatroomContainer').removeClass('hidden');
    $('#preloadRoom').remove();
    startUserVideoStream();
  });

  $('#preloadCameraBtn').on('click touch', e => {
    if(streamer)
      streamer.toggleVideoTrack();
  });

  $('#preloadMicBtn').on('click touch', e => {
    if(streamer)
      streamer.toggleAudioTrack();
  });
}

preloadRoom();

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
  $('#videoFullScreen').removeClass('video-flip');
}

/**
 * 
 * @param {Object} options 
 */
 function openLargeScreenStream(options) {
  $('#videoFullScreen').prop('srcObject', options.stream);
  $('#videoFullScreenContainer').removeClass('hidden');
  $('#videoFullScreenContainer').addClass('flex');
  $('#videoFullScreenInfo img').prop('src', options.img);
  $('#videoFullScreenInfo p').text(options.text);
  if(options.flip)
    $('#videoFullScreen').addClass('video-flip');
}

/**
 * 
 * @param {String} socketId 
 */

function hideUserStream(socketId) {
  $(`[user-room][socket-id="${socketId}"]`)
    .removeClass('active')
    .find('video')
    .trigger('stop')
    .prop('srcObject', undefined);
}

/**
 * 
 * @param {MediaStream} stream 
 */

function removeStreamAllPeers(stream) {
  for(var name in peers) {
    var peer = peers[name].peer;
    if(peer && !peer.destroyed) peer.removeStream(stream);
  }
}

/**
 * 
 * @param {MediaStream} stream 
 */

function addStreamAllPeers(stream) {
  for(var name in peers) {
    var peer = peers[name].peer;
    if(peer && !peer.destroyed) peer.addStream(stream);
  }
}

/**
 * Toolbar for roomchat
 */

var openingMessageBox = false;

$('#openMessageBoxBtn').on('click touch', function(e) {
  $(this).toggleClass('active');
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

$('#closeMessageBoxBtn').on('click touch', e => {
  if(openingMessageBox) {
    openingMessageBox = false;
    $('#messageContainer').addClass('translate-x-full');
    setTimeout(() => {
      $('#messageContainer').addClass('hidden');
      $('#messageContainer').removeClass('flex');
    }, 150);
    $('#openMessageBoxBtn').removeClass('active');
  }
});

$('#fullscreenBtn').on('click', function() {
  fullscreen.toggleScreen();
});

function notifyHavingMessage() {
  if(!openingMessageBox) {
    $('#openMessageBoxBtn').addClass('has-message-animation');
  }
}

$('#turnOnCameraBtn').on('click touch', e => {
  if(statusGlobal.userStreamer) {
    statusGlobal.userStreamer.toggleVideoTrack();
  }
});

$('#turnOnMicBtn').on('click touch', e => {
  if(statusGlobal.userStreamer) {
    statusGlobal.userStreamer.toggleAudioTrack();
  }
});

function getIdStreamViewLarge() {
  var stream = $('#videoFullScreen').prop('srcObject');
  if (stream) 
    return stream.id;
  return null;
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

function renderUserInRoom(user) {
  var socketId = user.socket_id;
  var userInRoom = $(`
    <div user-room socket-id="${socketId}" class="user-room">
      <div class="user-room-inner">
        <div class="user-room-info transition-all z-20 w-full h-full flex flex-col items-center justify-center">
          ${user.role == 'guest' ? `<div class="flex justify-center mb-2"><button class="w-20 h-20 rounded-full border border-slate-500 border-dashed flex justify-center items-center font-medium">Guest ?</button></div>` : `<div class="flex justify-center mb-2"><button><img class="rounded-full w-20 h-20 object-cover" src="${user.picture}" alt="" srcset=""></button></div>`}
          <p class="text-base font-medium text-slate-700 text-center">${user.username}</p>
        </div>
        <div class="absolute left-0 top-0 bottom-0 right-0 p-2 z-10">
          <video class="w-full h-full rounded-xl"></video>
          <audio></audio>
        </div
      </div>
    </div>
  `);
  
  if (socketId === socket.id) {
    userInRoom.find('video').prop('muted', true);
    userInRoom.find('audio').prop('muted', true);
  }

  userInRoom.on('click touch', e => {
    var stream = userInRoom.find('video').prop('srcObject');
    if(!stream) return;
    if (!streams[stream.id].videoTrack) return;
    openLargeScreenStream({
      img: peers[socketId].picture,
      text: peers[socketId].username,
      stream: stream,
      flip: true
    });
  });
  return userInRoom;
}

/**
 * Callback for socket
 */

const roomId = $('meta[name="chat-room-id"]').attr('content');
const currentUserId = $('meta[name="user-id"]').attr('content');
const SHARE_SCREEN_STREAM = 0;
const VIDEO_TRACK = 0;
const VIDEO_STREAM = 1;
const AUDIO_STREAM = 2;
const AUDIO_TRACK = 1;
const peers = {};
var streams = {};
const statusGlobal = {preloadCamera: false, preloadMic: false,};
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
        $('#videoContainer').append(renderUserInRoom(evt.data.user));
        if(socket.id === evt.data.user.socket_id) {
          return peers[socket.id] = evt.data.user;
        }
        createPeer(true, evt.data.user.socket_id, evt.data.user);
        break;
      case 'leave_room':
        delete peers[evt.data.socketId];
        $(`#videoContainer [socket-id="${evt.data.socketId}"]`).remove();
        break;
      default:
        break;
    }
  },
  signal: (data) => {
    if(!peers[data.peerId]) {
      $('#videoContainer').append(renderUserInRoom(data.user));
      createPeer(false, data.peerId, data.user);
    }
    peers[data.peerId].peer.signal(data.signal);
  },
  toggle_track: (data) => {
    if(data.typeTrack === VIDEO_TRACK) {
      if (streams[data.streamId])
        streams[data.streamId].videoTrack = data.enabled;
      if(data.enabled)
        $(`[user-room][socket-id="${data.socketId}"]`).addClass('active');
      else {
        $(`[user-room][socket-id="${data.socketId}"]`).removeClass('active');
        if(getIdStreamViewLarge() === data.streamId) 
          closeViewLargeVideo();
      }
    }
  },
  start_stream: (data) => {
    if (streams[data.streamId]) {
      streams[data.streamId].type = data.type;
      streams[data.streamId].peerId = data.user.socket_id;
      streams[data.streamId].videoTrack = data.videoTrack;
      if(data.type === SHARE_SCREEN_STREAM)
        openSharingScreenStream(streams[data.streamId].stream, data.user.socket_id);
      else if (data.type === VIDEO_STREAM)
        openVideoStream(streams[data.streamId].stream, data.user.socket_id, data.videoTrack);
      else if (data.type === AUDIO_STREAM) {
        openAudioStream(streams[data.streamId].stream, data.user.socket_id);
      }
    } else {
      streams[data.streamId] = {
        type: data.type,
        peerId: data.user.socket_id,
        videoTrack: data.videoTrack
      }
    }
  },
  stop_stream: (data) => {
    delete streams[data.streamId];
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
      if(streams[stream.id].type === VIDEO_STREAM) {
        openVideoStream(stream, peerId, streams[stream.id].videoTrack);
      }
      if(streams[stream.id].type === AUDIO_STREAM) {
        openAudioStream(stream, peerId);
      }
    } else {
      streams[stream.id] = {
        stream: stream,
      };
    }
  });
  if(statusGlobal.displayStream) peer.addStream(statusGlobal.displayStream);
  if(statusGlobal.userStreamer) {
    if (statusGlobal.userStreamer.getVideoStream())
      peer.addStream(statusGlobal.userStreamer.getVideoStream());

    if (statusGlobal.userStreamer.getAudioStream())
      peer.addStream(statusGlobal.userStreamer.getAudioStream());
  }
  peers[peerId] = user;
  peers[peerId].peer = peer;
  return peer;
}

const socket = require('../dependencies/pusher')(callbacks);

/**
 * Open Stream
 */

$('#shareScreenBtn').on('click', function(e) {
  if (statusGlobal.displayStream) return;
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
  $(`#shareScreenBtn`).addClass('active');
  statusGlobal.displayStream = stream;
  streams[stream.id] = {stream: stream, };
  addStreamAllPeers(stream);

  stream.getVideoTracks()[0].onended = () => {
    $(`#shareScreenBtn`).removeClass('active');
    delete statusGlobal.displayStream;
    $(`[stream-id="${stream.id}"]`).remove();
    socket.emit('stop_stream', {streamId: stream.id, roomId: roomId, type: SHARE_SCREEN_STREAM});
    removeStreamAllPeers(stream);
    if (!$('#videoFullScreen').prop('srcObject')) return;
    if(getIdStreamViewLarge() === stream.id) 
      closeViewLargeVideo();
  };

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
      openLargeScreenStream({
        img: peers[socketId].picture,
        text: `${peers[socketId].username} is sharing screen.`,
        stream: stream,
      });
    });

  stream.onremovetrack = () => {
    $(`[stream-id="${stream.id}"]`).remove();
    if (!$('#videoFullScreen').prop('srcObject')) return;
    if(getIdStreamViewLarge() === stream.id) 
      closeViewLargeVideo();
  };
}

async function startUserVideoStream() {
  statusGlobal.userStreamer = await Streamer.fromUserMedia({
    onLoad: (videoStream, audioStream) => {
      if (videoStream) {
        streams[videoStream.id] = {stream: videoStream, };
        socket.emit('start_stream', {streamId: videoStream.id, roomId: roomId, type: VIDEO_STREAM, videoTrack: false});
        addStreamAllPeers(videoStream);
      }

      if (audioStream) {
        streams[audioStream.id] = {stream: audioStream, };
        socket.emit('start_stream', {streamId: audioStream.id, roomId: roomId, type: AUDIO_STREAM});
        addStreamAllPeers(audioStream);
      }
    },
    onAudioTrackEnable: (stream) => {
      socket.emit('toggle_track', {
        roomId: roomId,
        typeTrack: AUDIO_TRACK,
        streamId: stream.id,
        enabled: true,
      });
      $(`#turnOnMicBtn`).addClass('active');
    },
    onAudioTrackDisable: (stream) => {
      socket.emit('toggle_track', {
        roomId: roomId,
        typeTrack: AUDIO_TRACK,
        streamId: stream.id,
        enabled: false,
      });
      $(`#turnOnMicBtn`).removeClass('active');
    },
    onVideoTrackEnable: (stream) => {
      socket.emit('toggle_track', {
        roomId: roomId,
        typeTrack: VIDEO_TRACK,
        streamId: stream.id,
        enabled: true,
      });
      $(`#turnOnCameraBtn`).addClass('active');
    },
    onVideoTrackDisable: (stream) => {
      socket.emit('toggle_track', {
        roomId: roomId,
        typeTrack: VIDEO_TRACK,
        streamId: stream.id,
        enabled: false,
      });
      $(`#turnOnCameraBtn`).removeClass('active');
    },
    onVideoEnded: (stream) => {
      $(`#turnOnCameraBtn`).removeClass('active');
      hideUserStream(socket.id);
      socket.emit('stop_stream', {streamId: stream.id, roomId: roomId, type: VIDEO_STREAM});
      removeStreamAllPeers(stream);
      if(getIdStreamViewLarge() === stream.id) 
        closeViewLargeVideo();
    },
    onAudioEnded: (stream) => {
      $(`#turnOnMicBtn`).removeClass('active');
      socket.emit('stop_stream', {streamId: stream.id, roomId: roomId, type: AUDIO_STREAM});
      removeStreamAllPeers(stream);
    },
    videoInit: statusGlobal.preloadCamera,
    audioInit: statusGlobal.preloadMic
  });
}

/**
 * 
 * @param {MediaStream} stream 
 * @param {String} socketId 
 * @param {Boolean} active 
 */

function openVideoStream(stream, socketId, active) {
  var userInRoom = $(`[user-room][socket-id="${socketId}"]`);
  userInRoom.find('video').prop('srcObject', stream).trigger('play');

  if(active)
    userInRoom.addClass('active');

  stream.onremovetrack = () => {
    hideUserStream(socketId);
    if (!$('#videoFullScreen').prop('srcObject')) return;
    if(getIdStreamViewLarge() === stream.id) 
      closeViewLargeVideo();
  };
}

function openAudioStream(stream, socketId) {
  var audio = $(`[user-room][socket-id="${socketId}"] audio`)
              .prop('srcObject', stream)
              .trigger('play');

  stream.onremovetrack = () => {
    audio.prop('srcObject', null);
  };
}
