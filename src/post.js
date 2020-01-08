const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: {
    type: String,
    validate: {
      validator: (title) => title.length > 2,
      message: 'Title must be longer than 2 characters'
    },
    required: [true, 'Title of post is required.']
  },
  createdAt: Date
});

// const Post = mongoose.model('post', PostSchema);

module.exports = PostSchema;
