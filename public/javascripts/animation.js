/**
 * Notification
 */

$('.notify').on('click', (e) => {
  $(e.target.parentElement).fadeOut('slow', () => $(e.target.parentElement).remove());
});
setTimeout(() => {
  $('.notify').fadeOut('slow', () => $('.notify').remove());
}, 5000);

/**
 * Collapse
 */

$('[collapse-target]').on('click', (e) => {
  var id = e.currentTarget.getAttribute('collapse-target');
  var collapseElement = $(`#${id}`);
  clearTimeout(timeout);

  if (collapseElement.height() == 0) {
    collapseElement.removeClass('hidden');
    var intialHeight = collapseElement.prop('scrollHeight');
    collapseElement.css('height', `${intialHeight}px`);
  } else {
    collapseElement.css('height', '');
    var timeout = setTimeout(() => collapseElement.addClass('hidden'), 450);
  }
});

/**
 * Modal
 */

$('[modal-target]').on('click', (e) => {
  var id = e.currentTarget.getAttribute('modal-target');
  var modalElement = $(`#${id}`);
  modalElement.addClass('show');
  createBackDropElement(id);
});

$('.modal').on('click', function(e) {
  if(e.target !== this) return;
  this.classList.remove('show');
  $(`.backdrop[data-target=${this.id}`).remove();
});

function createBackDropElement(id) {
  var attr = {
    'class': 'backdrop',
    'data-target': id
  };
  var backdropElement = $('<div>', attr);
  backdropElement.appendTo('body');
}