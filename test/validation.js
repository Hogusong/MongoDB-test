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

  it('requires a user name', (done) => {
    const user = new User({  name: undefined,  gender: 'Unknown',  postCount: 0  })
    // user.validate((result) => {
    //   const { message } = result.errors.name;
    //   assert( message === "Name is required.");
    // })
    const validationResult = user.validateSync();
    const message = validationResult.errors.name.message;
    assert( message === "Name is required.");
    done();
  });

  it("requires a user's name longer than 2 characters", (done) => {
    const user = new User({  name: 'ab',  gender: 'Unknown',  postCount: 0  })
    const validationResult = user.validateSync();
    const message = validationResult.errors.name.message;
    assert( message === "Name must be longer than 2 characters");
    done();
  });

  it('disallows invalid record from being saved', (done) => {
    const user = new User({  name: 'ab',  gender: 'Unknown',  postCount: 0  })
    user.save()
      .then(() => {  done();  })
      .catch((result) => {
        const { message } = result.errors.name;
        assert( message === "Name must be longer than 2 characters" || 
                message === "Name is required.")
        done();
      })
  });

  it('Negative number is not allowed for postCount', done => {
    const user = new User({  name: 'young',  gender: 'Male',  postCount: -1 })
    user.save()
      .then(() => {  done();  })
      .catch((result) => {
        const { message } = result.errors.postCount;
        assert( message === "Negative number is not allowed.");
        done();
      })
  });
});