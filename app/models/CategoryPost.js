const mongoose = require('mongoose');
const CategoryPostSchema = new mongoose.Schema({
  'title': {
    type: String,
    required: true,
    text: true,
  },
  'desc': {
    type: String,
    required: false,
  },
  'content':{
    type: String,
    required: false,
  },
  'imageUrl':{
    type: String,
    required: false
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});
module.exports = mongoose.model('CategoryPost', CategoryPostSchema);