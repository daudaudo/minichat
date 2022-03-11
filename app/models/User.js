const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  'username': {
    type: String,
    index: true,
    required: true,
    unique: true,
  },
  'email': {
    type: String,
    required: true,
    unique: true,
  },
  'introducton': {
    type: String,
  },
  'password': {
    type: String,
  },
  'email_verified_at': {
    type: String,
  },
  'created_at': {
    type: String,
    required: true,
  },
  'picture': {
    type: String,
    default: '/images/user.png',
    required: true
  },
  'role': {
    type: String,
    required: true,
    default: 'user'
  }
});

module.exports = mongoose.model('User', userSchema);