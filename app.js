const express = require('express');
const path = require('path');

const { Url } = require('./models');
const { checkForDuplicates, addNewUrl, findByShortUrl } = require('./utils/db');
const { validate } = require('./utils/validate');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'public')));

//   Routes
app.get('/', (req, res) => {
  res.sendFile('/views/index.html', { root: __dirname });
});

// New Url Route
app.get('/new/:url*', (req, res) => {
  const url = req.params.url + req.params['0'];
  
  // validate url
  if (validate(url)) {
    checkForDuplicates(url)
      .then(match => {
        if(match) {
          res.status(200).json({
            originalUrl: match.original,
            shortenedUrl: `${req.protocol}://${req.hostname}:${port}/${match.shortened}` // will this work when deployed (the ":")?
          })
        } else {
          // If new url add to database
          addNewUrl(url)
            .then(savedUrl => {
              res.status(200).json({
                originalUrl: savedUrl.original,
                shortenedUrl: `${req.protocol}://${req.hostname}:${port}/${savedUrl.shortened}`
              })
            })
            .catch(e => {
              console.log(e);
              res.status(500);
            })
        }
      })
      .catch(e => {
        console.log(e);
        res.status(500);
      })
  } else {
    res.status(400).json({ "error": "Invalide URL" });
  }
});


// Redirect from Shortened url
app.get('/:urlCode', (req, res) => {
  const urlCode = parseInt(req.params.urlCode);

  if(!isNaN(urlCode)) {
    findByShortUrl(urlCode)
      .then(url => {
        if(url) {
          res.redirect(url);
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
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
