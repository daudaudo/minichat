var {
  checkSchema
} = require('express-validator');

module.exports = checkSchema({
  email: {
    isEmail: true,
    exists: true,
    errorMessage: 'The email field must be valid email address !'
  },
  password: {
    isString: true,
    exists: true,
    isLength: {
      options: {
        min: 6,
        max: 20
      }
    },
    errorMessage: 'The password field must be at least 6 and not be greater than 20 character !'
  }
}, ['body']);