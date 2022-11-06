const mongoose = require('mongoose');
const { Schema } = mongoose;
const postSchema = new mongoose.Schema({
  'title': {
    type: String,
    required: true,
    text: true,
  },
  'content':{
    type: String,
    text: true,
    required: true,
  },
  'image_url':{
    type: String,
    required: false
  },
  'is_liked':{
    type: Boolean,
    default: false ,
  },
  'owner': {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
  },
  date:{
    type:String,
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});
module.exports = mongoose.model('Post', postSchema);