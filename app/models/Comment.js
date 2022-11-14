const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    'content': {
      type: String,
      required: true,
    },
    'user_id': {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    'post_id': {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "Post",
    },
    'like_count': {
      type: Number,
      default: 0,
      required: true,
    },
    'deleted_at': {
      type: mongoose.SchemaTypes.Date,
    },
    'like': {
      type: [
        {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "User",
        },
      ],
      required: true,
      default:[]
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
