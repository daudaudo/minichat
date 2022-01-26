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
 * Callback for socket
 */

var listRooms = {};

const callbacks = {
  connection: (data) => {
    console.log(data);
  },
  private: (data) => {
    console.log(data);
  },
  join_room: (user) => {
    $('#messageBox').append(`<p class='font-semibold text-sm text-slate-600'>Welcome ${user.username} join the chat room!</p>`);
  }
}

const socket = pusher(callbacks);
var roomId = $('meta[name="chat-room-id"]').attr('content');
socket.emit('join_room', roomId);