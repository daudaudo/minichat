var {
  checkSchema
} = require('express-validator');
var mime = require('mime-types');

module.exports = checkSchema({
  username: {
    exists: true,
    isLength: {
      options: {
        min: 4,
      }
    },
    errorMessage: 'The username field is required and must be at least 4 characters.',
  },
  picture: {
    custom: {
      options: (picture, {req}) => {
        picture = req.files.picture;
        if (!picture || picture.size === 0) 
          return true;
        var ext = mime.extension(picture.type);
        if (!['png', 'jpg', 'jpeg'].includes(ext))
          throw new Error('The image file must have the extension png, jpg or jpeg');
        return true;
      }
    }
  }

}, ['body']);
