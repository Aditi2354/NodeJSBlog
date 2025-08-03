const { Schema, model } = require("mongoose");

const commentSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  blogId:{
    type: Schema.Types.ObjectId,
    ref:'blog'
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "user", // make sure your user model is named exactly "user"
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
},{timestamps:true});

const Comment = model("Comment", commentSchema);

module.exports = Comment;
