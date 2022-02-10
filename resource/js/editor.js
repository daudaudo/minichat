const $ = require('jquery');

/**
 * 
 * @param {String} id 
 */

function editor(id, submit) {
  var editable = $(id).text('');
  var content = $('<p><br></p>');
  editable.append(content);
  editable.on('keydown', function(e) {
    if (e.code !== "Enter") return;
    e.preventDefault();
    if(submit)
      submit(content.text());
    content.text('').append('<br>');
  });
  return editable;
}

module.exports = editor;