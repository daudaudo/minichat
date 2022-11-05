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
  'imageUrl':{
    type: String,
    required: false
  },
  'isLiked':{
    type: Boolean,
    default: false ,
  },
  'owner': {
    type: mongoose.SchemaTypes.String,
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