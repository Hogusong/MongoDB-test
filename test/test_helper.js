const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);

before(done => {
  mongoose.connect('mongodb://localhost/users_test');
  mongoose.connection
    .once('open', () => {
      console.log("Good to go!");
      done();
    })
    .on('error', (err) => console.warn('Warning', err));    
});

beforeEach((done) => {
  // 'done()' is a callback function. It notifies all the test parts when this process is done.
  const { users, posts } = mongoose.connection.collections;
  if (users) users.drop();
  if (posts) {
    posts.drop(() => done())
  } else done();
});
