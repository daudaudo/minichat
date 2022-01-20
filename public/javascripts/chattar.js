/**
 * Toolbar for roomchat
 */

$('#fullscreenBtn').on('click', e => {
  var element = document.getElementById('chatroomContainer');
  if(window.innerHeight == screen.height) {
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
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}

/**
 * @param {HTMLElement} elem 
 */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  }
}