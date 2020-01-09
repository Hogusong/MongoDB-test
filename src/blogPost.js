const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogPostSchema = new Schema({
  title: {
    type: String,
    validate: {
      validator: (title) => title.length > 2,
      message: 'Title must be longer than 2 characters'
    },
    required: [true, 'Title is required!']
  },
  content: String,
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'comment'
  }]
});

const BlogPost = mongoose.model('blogPost', BlogPostSchema);

module.exports = BlogPost;
