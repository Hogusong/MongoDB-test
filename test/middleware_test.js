const mongoose = require('mongoose');
const assert = require('assert');
const User = require('../src/user');
const BlogPost = require('../src/blogPost');

describe('Middleware test', () => {
  let joe, young, blogPost;
  beforeEach(done => {
    joe = new User({ name: 'Joseph' });
    young = new User({ name: 'Heonyoung' });

    blogPost = new BlogPost({ title: 'JS is Great', content: 'Yep it really is' });
    joe.blogPosts.push(blogPost);
    blogPost.save();

    blogPost = new BlogPost({ title: 'What about React', content: 'Yep also it is' });
    joe.blogPosts.push(blogPost);
    blogPost.save();

    blogPost = new BlogPost({ title: 'MongoDB is so powerful',  content: 'Completely well'});
    young.blogPosts.push(blogPost);
    blogPost.save();

    Promise.all([joe.save(), young.save()])
      .then(() => done());
  });

  it('Users clean up dangling blogPosts on remove', done => {
    BlogPost.countDocuments().then(count => {
      console.log('Count of BlogPost:', count);
      assert(count == 3);
    });

    joe.remove()
      .then(() => {
        BlogPost.find({})
          .then(posts => console.log('blogPosts:', posts));  
        return BlogPost.countDocuments();
      })
      .then(count => {
        assert(count == 1);
        done();
      })
  })
})