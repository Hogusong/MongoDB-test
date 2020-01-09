const assert = require('assert');
const User  = require('../src/user');

describe('Reading users out of the database', () => {
  let joe, narae, clara, randy, marry;

  beforeEach((done) => {
    narae = new User({ name: 'Narae', gender: 'Female' });
    randy = new User({ name: 'Randy', gender: 'Male'});
    marry = new User({ name: 'Marry' });
    clara = new User({ name: 'Narae', gender: 'Unknown' });
    joe = new User({ name: 'Joseph', gender: 'Male' });

    narae.save().then(() => randy.save().then(() => clara.save().then(() => marry.save().then(() => joe.save().then(() => done())))));
    // Promise.all([narae.save(), clara.save(), randy.save(), marry.save(), joe.save()])
    //   .then(() => {  done();  })
  });

  it('find all users with a name of Narae', (done) => {
    User.find({ name: 'Narae' })
      .then((users) => {
        assert(users[0]._id.toString() == narae._id.toString());
        assert(users.length == 2);
        done();
      });
  });

  it('find a user with a particular id', (done) => {
    User.findOne({ _id: joe._id})
      .then((user) => {
        assert(user._id.toString() == joe._id.toString());
        assert(user.name === 'Joseph');
        done();
      })
  })

  it('can skip and limit the result set', (done) => {
    User.find({})
      .sort({ name: -1 })
      .skip(1).limit(3)
      .then((users) => {
        assert(users.length === 3);
        done();
      })
  });
});
