const $ = require('./animation');
const FileInput = require('../dependencies/fileinput');

new FileInput('#pictureInput', {
  change: (file) => {
    $('#picturePreview').attr('src', URL.createObjectURL(file));
  },
  accept: ['png', 'jpg', 'jpeg'],
});
