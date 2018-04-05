const mongoose = require('mongoose');

// Connect to Mongoose
mongoose.set('debug', true); // for easy debugging
mongoose.connect('mongodb://localhost/url-shortener') // setup mLab and config file
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// mongoose.Promise = Promise; // don't think this is relevant anymore

module.exports.Url = require('./url');
