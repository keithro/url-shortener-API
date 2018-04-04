const { Url } = require('../models/url');

function createShortUrlCode() {
  return Url.find().sort({ "shortened": -1 }).limit(1).then(last => {
    console.log(last);
    return last.length ? last[0].shortened + 1 : 1000;
  });
}

function checkForDuplicate(url) {
  return Url
    .find({ original: url })
    .then(match => {
      return match[0];
    });
}

function addNewUrl(url) {
  return createShortUrlCode().then(shortCode => {
    const newUrl = {
      original: url,
      shortened: shortCode
    }

    return new Url(newUrl).save()
  })
}

function findByShortUrl(urlCode) {
  return Url
    .find({ shortened: urlCode })
    .then(match => {
      return match.length ? match[0].original : null;
    });
}

module.exports = {
  checkForDuplicate,
  addNewUrl,
  findByShortUrl
}
