const mongoose = require('mongoose');
const uuid = require('uuid');

const roomSchema = new mongoose.Schema({
  'id': {
    type: String,
    index: true,
    required: true,
    unique: true,
    default: uuid.v4(),
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