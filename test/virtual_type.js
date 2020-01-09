const assert = require('assert');
const User = require('../src/user');
const Post = require('../src/post');

describe('Virtual types', () => {
  it('postCount returns number of posts', (done) => {
    const post = new Post({ title: 'Post Title', data: new Date() });
    post.save();
    const song = new User({ name: 'Young',  gender: 'Male', posts: [post._id] })
    song.save()
      .then(() => User.findOne({ name: 'Young' }))
      .then((user) => {
        // countPOsts is a virtual field of user.
        assert(user.countPosts === 1);
        done();
      })
  })
});
