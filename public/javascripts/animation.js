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

  if (collapseElement.height() == 0) {
    var intialHeight = collapseElement.prop('scrollHeight');
    collapseElement.css('height', `${intialHeight}px`);
    collapseElement.addClass('mt-2');
  } else {
    collapseElement.css('height', '');
    collapseElement.removeClass('mt-2');
  }
});