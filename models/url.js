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

// Compile Schema into model
const Url = mongoose.model('Url', UrlSchema);

module.exports = Url;
