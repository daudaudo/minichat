var checkSchema = require('express-validator').checkSchema;

module.exports = checkSchema({
  title: {
    isString: true,
    exists: true,
    isLength: {
      options: {
        min: 6
      }
    },
    errorMessage: 'The title field must be at least 6 character !'
  },
  content: {
    isString: true,
    exists: true,
    isLength: {
      options: {
        min: 20
      }
    },
    errorMessage: 'The content field must be at least 20 character !'
  }
}, ['body']);
