const assert = require('assert');
const User  = require('../src/user');

describe('Reading users out of the database', () => {
  let joe, narae, clara;

  beforeEach((done) => {
    narae = new User({ name: 'Narae', gender: 'Female', postCount: 3 });
    narae.save();
    clara = new User({ name: 'Narae', gender: 'Unknown', postCount: 10 });
    clara.save();
    joe = new User({ name: 'Joseph', gender: 'Male', postCount: 0 });
    joe.save()
      .then(() => {  done();  })
  });

  function assertUser(operation, data, done) {
    operation
      .then(() => User.find({ name: data.name}))
      .then((users) => {
        assert(users.length === 1);
        assert(users[0].name === data.name);
        assert(users[0].gender === data.gender);
        done();
      });
  }

  // something wrong with instance type using set n save.
  it('instance type using set n save', (done) => {
    clara.set({ name: 'Clara' });
    clara.save()
      .then(() => User.find({ name: 'Clara' }))
      .then((users) => {
        assert(users.length === 1);
        assert(users[0].name === 'Clara');
        done();
      });
  });

  it('A model instance can update', (done) => {
    const data = { name: 'Clara N Song', gender: 'MyGirl'};
    assertUser(clara.updateOne(data), data, done);
  });

  it('A model class update', (done) => {
    const data = { name: 'Annie', gender: 'Female' }
    assertUser(User.updateOne({ name: 'Narae', gender: "Unknown" }, data), data, done);
  });

  it('A model class update one record', (done) => {
    const data = { name: 'Clara', gender: 'Daughter' }
    assertUser(User.findOneAndUpdate({ name: 'Narae', gender: "Unknown" }, data), data, done);
  })

  it('A model class find a record with an ID and update', (done) => {
    const data = { name: 'Clara', gender: 'MyGirl' };
    assertUser(User.findByIdAndUpdate(clara._id, data), data, done) ;
  })

  it('A user can have their postCount incremented by 1', (done) => {
    User.find().then(users => {
      users.forEach(user => {
        if (user.postCount < 5) {     // conditional update
          const id = user._id;
          User.updateOne({ _id: id }, { $inc: { postCount: 1 }})
            .then(() => User.findOne({ _id: id }))
            .then(newuser => {
            });
        }
      })
      User.findOne({ name: 'Joseph' })
        .then(joe => {
          assert(joe.postCount === 1);
        });
      User.findOne({ name: 'Narae', gender: 'Unknown' })
        .then(narae => {
          assert(narae.postCount === 10);
        });
      done();
    })
  })
});
