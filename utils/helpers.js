const path = require('path');
const { Url } = require('../models');

// FIXME: Do I need this once deployed?
const port = process.env.PORT || 5000;

function validate(url) {
  const regex = RegExp(/^https?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g);
  return regex.test(url);
}

function createShortUrlCode() {
  return Url.find().sort({ "shortened": -1 }).limit(1).then(last => {
    console.log(last);
    return last.length ? last[0].shortened + 1 : 1000;
  });
}

exports.getIndex = (req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, '../views') });
}

exports.createUrl = (req, res) => {
  const url = req.params.url + req.params['0'];

  // validate url
  if (validate(url)) {
    // Check for duplicates
    Url.find({ original: url })
      .then(match => {
        if (match.length) {
          res.status(200).json({
            originalUrl: match[0].original,
            shortenedUrl: `${req.protocol}://${req.hostname}:${port}/${match[0].shortened}` // will this work when deployed (the ":")?
          })
        } else {
          // If new url add to database
          createShortUrlCode().then(shortCode => {
            const newUrl = new Url({
              original: url,
              shortened: shortCode
            });

            newUrl.save().then(savedUrl => {
              res.status(200).json({
                originalUrl: savedUrl.original,
                shortenedUrl: `${req.protocol}://${req.hostname}:${port}/${savedUrl.shortened}`
              })
            })
            .catch(e => {
              console.log(e);
              res.status(500);
            });
          });
        }
      })
      .catch(e => {
        console.log(e);
        res.status(500);
      })
  } else {
    res.status(400).json({ "error": "Invalide URL" });
  }
}

exports.getUrl = (req, res) => {
  const urlCode = parseInt(req.params.urlCode);

  if (!isNaN(urlCode)) {
    Url.find({ shortened: urlCode })
      .then(match => {
         if (match.length) {
          res.redirect(match[0].original);
        } else {
          res.status(400).send({ "error": "URL does not exist" });
        }
      })
      .catch(e => {
        console.log(e);
        res.status(500);
      });
  } else {
    res.status(400).send({ "error": "Invalide URL" });
  }
}

module.exports = exports;
