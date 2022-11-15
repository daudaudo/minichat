const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    'content': {
      type: String,
      required: true,
    },
    'owner': {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    'parent_post': {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "Post",
    },
    'deleted_at': {
      type: mongoose.SchemaTypes.Date,
    },
    'like': {
      type: mongoose.SchemaTypes.Map,
      of: {
          type: mongoose.SchemaTypes.ObjectId,
      },
      default: {},
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports = mongoose.model("Comment", commentSchema);
