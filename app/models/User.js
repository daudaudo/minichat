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
  'introduction': {
    type: String,
  },
  'password': {
    type: String,
    select: false,
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
  'like': {
    type: [String],
    default: '',
    required: true,
  },
  'follow': {
    type: [String],
    default: '',
    required: true,
  },
  'role': {
    type: String,
    required: true,
    default: 'user'
  }
});

module.exports = mongoose.model('User', userSchema);
