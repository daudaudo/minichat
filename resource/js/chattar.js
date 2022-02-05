const $ = require('./animation');

/**
 * Toolbar for roomchat
 */

$('#fullscreenBtn').on('click', e => {
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
      default:
        break;
    }
  }
}

const socket = pusher(callbacks);
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