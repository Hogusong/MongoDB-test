const assert = require('assert');
const User  = require('../src/user');
const Post = require('../src/post');

describe('Reading users out of the database', () => {
  it('can create a subdocument', (done) => {
    const post = new Post({ title: 'Post Title', data: new Date() });
    post.save();
    const song = new User({ name: 'Young',  gender: 'Male',  postCount: 1,  posts: [post._id] })
    song.save()
      .then(() => User.findOne({ name: 'Young' }))
      .then((user) => {
        const pID = user.posts[0];
        Post.findById(pID).then(post => {
          assert(post.title == "Post Title");
          done();  
        })
    });
  }); 

  it('Can add subdocuments to an existing record', (done) => {
    const song = new User({ name: 'Young',  gender: 'Male' })
    song.save()
      .then(() => User.findOne({ name: 'Young' }))
      .then((user) => {
        const id = user._id;
        const post = new Post({ title: 'New Post', date: new Date() });
        post.save().then(() => {
          user.posts.push(post._id);
          user.postCount = (!user.postCount) ? 1 : user.postCount+1;
          user.save()
            .then(() => User.findOne({ name: 'Young' }))
            .then((user) => {
              assert(user.postCount === 1);
              const index = user.posts.length-1 ;
              const pID = user.posts[index];
              Post.findById(pID).then(post => {
                assert(post.title == 'New Post');
                done()  
              })
            })
        });
      }) 
  });

  it('can remove an existing subdocument', (done) => {
    let post = new Post({ title: 'Post Title', data: new Date() });
    const newPost = new Post({ title: 'New Post', data: new Date() });
    post.save()
    newPost.save().then(() => {
      const song = new User({ name: 'Young',  gender: 'Male',  postCount: 2,  posts: [post._id, newPost._id] })
      song.save()
        .then(() => User.findOne({ name: 'Young' }))
        .then((user) => {
          const index = user.posts.findIndex(id => id == post._id);
          if (index >= 0) {
            user.posts = [...user.posts.slice(0, index), ...user.posts.slice(index+1)];
            user.postCount = user.postCount - 1;
            user.save();
            post.remove();
            Post.find()
              .then(posts => {
                assert(posts.length == 1);
                assert(posts[0].title == 'New Post');
                User.findOne({ name: 'Young' })
                  .then(user => {
                    assert(user.posts.length == 1);
                    const pID = user.posts[0];
                    for (let p of posts) {
                      if (p._id == pID) {
                        assert(p.title == 'New Post');
                        done();
                        break
                      }
                    }
                    done();
                  })
                done();
              })
          } else done();
        })
      });
  })
});
