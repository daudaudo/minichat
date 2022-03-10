var {
  checkSchema
} = require('express-validator');

module.exports = checkSchema({
  introduction: {
    exists: true,
    isLength: {
      options: {
        min: 1,
      }
    },
    errorMessage: 'The introduction field is required',
  },
  username: {
    exists: true,
    isLength: {
      options: {
        min: 6,
      }
    },
    errorMessage: 'The username field is required',
  }

}, ['body', 'files']);
