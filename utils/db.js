const { Url } = require('../models/url');

// Create short url code
function createShortUrlCode() {
  return Url.find().sort({ "shortened": -1 }).limit(1).then(last => {
    console.log(last);
    return last ? last[0].shortened + 1 : 1000;
  });
}

function checkForDuplicate(url) {
  return Url
    .find({ original: url })
    .then(match => {
      return match[0] || null;
      // return match ? match[0] : null;
    });
}

function addNewUrl(url) {
  return createShortUrlCode().then(shortCode => {
    const newUrl = {
      original: url,
      shortened: shortCode
    }

    return new Url(newUrl) // Does this not return a promise?
      .save()
      // .then(savedUrl => {
      //   console.log(savedUrl);
      //   return savedUrl;
      // });
  })
}

module.exports = {
  checkForDuplicate,
  addNewUrl
}

/* 
module.exports = {
  // checkForDuplicate
  checkForDuplicate: function(url) {
    return Url
      .findOne({ original: url })
      .then(match => {
        return match;
      });
  },

  addNewUrl: function(url) {
    createShortUrlCode().then(shortCode => {
      const newUrl = {
        original: url,
        shortened: shortCode
      }

      return new Url(newUrl)
        .save()
        .then(savedUrl => {
          return savedUrl;
        });
    })
  }
}
 */
