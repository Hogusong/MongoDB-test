const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);

mongoose.connect('mongodb://localhost/users_test');
mongoose.connection
  .once('open', () => console.log("Good to go!"))
  .on('error', (err) => console.warn('Warning', err));  
