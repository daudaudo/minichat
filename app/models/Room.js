const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  'id': {
    type: String,
    index: true,
    required: true,
    unique: true,
  },
  'name': {
    type: String,
    required: true,
  },
  'users': {
    type: mongoose.SchemaTypes.Map,
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
});

module.exports = mongoose.model('Room', roomSchema);