const mongoose = require('mongoose');
const PostSchema = new mongoose.Schema({
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
  'isLiked':{
    type: Boolean,
    default: false ,
  },
  'usernameOnwner': {
    type: String,
    required: true,
  },
  'categoryId': {
    type: String,
    required: true,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});
categoryPostSchema.plugin(AutoIncrement, {id:'categoryId_seq',inc_field: 'categoryId'});
module.exports = mongoose.model('CategoryPost', categoryPostSchema);