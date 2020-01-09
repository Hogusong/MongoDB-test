const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    validate: {
      validator: (name) => name.length > 2,
      message: 'Name must be longer than 2 characters'
    }, 
    required: [true, 'Name is required.']
  },
  gender: String,
  postCount: {
    type: Number,
    validate: {
      validator: (postCount) => postCount >= 0,
      message: 'Negative number is not allowed.'
    }
  },
  posts: [{
    type: Schema.Types.ObjectId,
    ref: 'post'
  }],
  blogPosts: [{
    type: Schema.Types.ObjectId,
    ref: 'blogPost'
  }]
});

// define virtual field on Schema
UserSchema.virtual('countPosts').get(function() {
  return this.posts.length
});

const User = mongoose.model('user', UserSchema); 

module.exports = User;
