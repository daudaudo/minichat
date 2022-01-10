var {
  checkSchema
} = require('express-validator');

module.exports = checkSchema({
  username: {
    isString: true,
    exists: true,
    isLength: {
      options: {
        min: 6
      }
    },
  },
  email: {
    isEmail: true,
    exists: true,
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
  }
}, ['body']);