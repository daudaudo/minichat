const $ = require('jquery');
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

$('[collapse-target]').on('click', function(e) {
  var id = $(this).attr('collapse-target');
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

$('[modal-target]').on('click', function(e) {
  var id = $(this).attr('modal-target');
  var modalElement = $(`#${id}`);
  modalElement.addClass('show');
  createBackDropElement(id);
});

$('.modal').on('click', function(e) {
  if (e.target !== this) return;
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

/**
 * Menu Mobile
 */

$('#openMenuMobile').on('click', e => {
  var menuElement = $('#menuMobile');
  if (menuElement.hasClass('show')) {
    menuElement.removeClass('show');
    setTimeout(() => menuElement.css('display', 'none'), 250);
  } else {
    menuElement.css('display', 'block');
    setTimeout(() => menuElement.addClass('show'), 10);
  }
});

/**
 * Select Dropdown
 */

$('.dropdown').each(function() {
  var list = $('<ul />');
  var defaultText = $(this).attr('data-default') ?? 'Please choose an option!';
  $(this).find('option').each(function() {
    var li = $('<li />').append($('<a />').text($(this).text()));
    li.attr('data-value', $(this).attr('value') ?? $(this).text());
    list.append(li);
  });
  list.appendTo(this);
  $(this).append($('<span>').text(defaultText));
});

$('.dropdown > span').on('click touch', e => {
  e.target.parentElement.classList.toggle('show');
});

$('.dropdown > ul > li').on('click touch', function(e) {
  var dropdownElement = $(this.parentElement.parentElement);
  dropdownElement.children('select').val($(this).attr('data-value'));
  dropdownElement.removeClass('show');
  dropdownElement.children('span').text(e.currentTarget.innerText);
  dropdownElement.attr('data-value', $(this).attr('data-value'));
});

/**
 * Dialog
 */

$('[dialog-target]').on('click', function(e) {
  var id = $(this).attr('dialog-target');
  var dialog = $(`#${id}`);
  dialog.toggleClass('hidden');
});

module.exports = $;