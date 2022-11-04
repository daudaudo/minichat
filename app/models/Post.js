const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
  'title': {
    type: String,
    required: true,
    text: true,
  },
  'content':{
    type: String,
    required: false,
  },
  'imageUrl':{
    type: String,
    required: false
  },
  'isLiked':{
    type: Boolean,
    default: false ,
  },
  'usernameOnwner': {
    type: String,
    required: true,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});
module.exports = mongoose.model('Post', postSchema);