const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({
  original: {
    type: String,
    required: true
  },
  shortened: {
    type: Number,
    required: true
  }
});

const Url = mongoose.model('urls', UrlSchema);

module.exports = { Url };
