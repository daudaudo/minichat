const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  'name': {
    type: String,
    required: true,
    text: true,
  },
  'users': {
    type: mongoose.SchemaTypes.Map,
    of: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    default: {},
    required: true,
  },
  'primary_user': {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
  },
  'password': {
    type: String,
  },
  'language': {
    type: String,
    default: 'Any',
    required: true,
  },
  'level': {
    type: String,
    default: 'Any',
    required: true,
  },
  'maximum_people': {
    type: Number,
    default: -1,
    required: true,
  }, 
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});

module.exports = mongoose.model('Room', roomSchema);
