const mongoose = require('mongoose');
const Role = require('./Role');

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
  'picture': {
    type: String,
    default: '/images/user.png',
    required: true
  },
  'like': {
    type: mongoose.SchemaTypes.Map,
    of: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    default: {},
  },
  'follow': {
    type: mongoose.SchemaTypes.Map,
    of: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    default: {},
  },
  'role': {
    type: String,
    default: Role.NORMAL_ROLES,
    enum: Role.USER_ROLES,
  },
  'suspended_at': {
    type: mongoose.SchemaTypes.Date,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});

module.exports = mongoose.model('User', userSchema);
