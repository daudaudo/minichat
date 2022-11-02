const mongoose = require('mongoose');
var AutoIncrement = require('mongoose-sequence')(mongoose);
const categoryPostSchema = new mongoose.Schema({
  'name': {
    type: String,
    required: true,
    text: true,
  },
  'categoryId':{
    type: Number,
    required: true,
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
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});
categoryPostSchema.plugin(AutoIncrement, {id:'categoryId_seq',inc_field: 'categoryId'});
module.exports = mongoose.model('CategoryPost', categoryPostSchema);
