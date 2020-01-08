const assert = require('assert');
const User  = require('../src/user');

describe('Reading users out of the database', () => {
  it('can create a subdocument', (done) => {
    const song = new User({ name: 'Young',  gender: 'Male',  postCount: 1,  posts: [{ title: 'Post Title'}] })
    song.save()
      .then(() => User.findOne({ name: 'Young' }))
      .then((user) => {
        assert(user.posts[0].title = "Post Title");
        done();
    });
  }); 

  it('Can add subdocuments to an existing record', (done) => {
    const song = new User({ name: 'Young',  gender: 'Male' })
    song.save()
      .then(() => User.findOne({ name: 'Young' }))
      .then((user) => {
        user.posts.push({ title: 'New Post' });
        user.postCount = (!user.postCount) ? 1 : user.postCount+1;
        return user.save();
      }) 
      .then(() => User.findOne({ name: 'Young' }))
      .then((user) => {
        assert(user.postCount === 1);
        const index = user.posts.length-1 ;
        assert(user.posts[index].title === 'New Post');
        done()
      }) ;
  });

  it('can remove an existing subdocument', (done) => {
    const song = new User({ name: 'Young',  gender: 'Male',  postCount: 1,  posts: [{ title: 'Post Title' }] })
    song.save()
      .then(() => User.findOne({ name: 'Young' }))
      .then((user) => {
        user.posts.push({ title: 'New Post' });
        user.postCount = (!user.postCount) ? 1 : user.postCount+1;
        user.save()
          .then(() => User.findOne({ name: 'Young' }))
          .then((user) => {
            // console.log('before remove:', user)
            let post;
            for (let p of user.posts) {
              if (p.title === 'Post Title') {
                post = p;
                break;
              }
            }
            if (post) {
              post.remove()
              user.postCount -= 1;
              user.save()
                .then(() => User.findOne({ name: 'Young' }))
                .then((user) => {
                  assert(user.postCount === 1);
                  // console.log('after remove:', user)
                  done()    
                })
            }
          })
      });
  })
});