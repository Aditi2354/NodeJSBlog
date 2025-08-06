const { Schema, model } = require('mongoose');

const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  coverImageURL: {
    type: String,
    required: false,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
}, { timestamps: true });

const Blog = model('blog', blogSchema, 'blogs');  // ⬅ third argument = exact collection name


module.exports = Blog;
