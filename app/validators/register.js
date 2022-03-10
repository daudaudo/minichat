var checkSchema = require('express-validator').checkSchema;
const { user } = require('../controllers/auth');
const User = require('../models/User');

module.exports = checkSchema({
  username: {
    isString: true,
    exists: true,
    isLength: {
      options: {
        min: 6
      }
    },
    errorMessage: 'The username field must be at least 6 character !'
  },
  email: {
    isEmail: true,
    exists: true,
    custom: {
      options: async (email) => {
        var user = await User.findOne({email: email});
        if (user) 
          return Promise.reject();
        return Promise.resolve();
      },
      errorMessage: 'The email has already have been taken !'
    },
    errorMessage: 'The email field must be valid email address!'
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
