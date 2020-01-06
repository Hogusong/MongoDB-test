const assert = require('assert');
const User = require('../src/user');

describe('Deleting a user', () => {
  let joe, narae, clara;

  beforeEach((done) => {
    narae = new User({ name: 'Narae', gender: 'Female' });
    narae.save();
    clara = new User({ name: 'Narae', gender: 'Unknown' });
    clara.save();
    joe = new User({ name: 'Joseph', gender: 'Male' });
    joe.save()
      .then(() => {  done();  })
  });

  it('model instance remove', (done) => {
    joe.remove()
      .then(() => User.findOne({ name: 'Joseph' }))
      .then((user) => {
        assert( user === null );
        done()
      })
  });

  it('class method remove', (done) => {
    User.deleteMany({  name: 'Narae' })
      .then(() => User.find({ name: 'Narae' }))
      .then((users) => {
        assert( users.length === 0 );
        done()
      })
  });

  it('class method findOneAndRemove', (done) => {
    User.findOneAndDelete({  name: 'Narae', gender: 'Unknown' })
      .then(() => User.find({ name: 'Narae', gender: 'Unknown' }))
      .then((users) => {
        assert( users.length === 0 );
        done()
      })
  });

  it('class method findByIdAndRemove', (done) => {
    User.findByIdAndDelete(joe._id)
      .then(() => User.find({ name: 'Joseph' }))
      .then((users) => {
        assert( users.length === 0 );
        done()
      })
  });
});
