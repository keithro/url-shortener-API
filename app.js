const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const { Url } = require('./models/url');
const { checkForDuplicate, addNewUrl } = require('./utils/db');
const { validate } = require('./utils/validate');

const app = express();

// Connect to Mongoose
mongoose.connect('mongodb://localhost/url-shortener') // setup mLab and config file
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

app.use(express.static(path.join(__dirname, 'public')));

/* // Url Model/Schema
require('./models/url');
const Url = mongoose.model('urls'); */

// Routes
app.get('/', (req, res) => {
  res.sendFile('/views/index.html', { root: __dirname });
});

// New Url Route
app.get('/new/:url*', (req, res) => {
  const url = req.params.url + req.params['0'];
  
  // validate url
  if (validate(url)) {
    // Check for duplicates
    checkForDuplicate(url)
      .then(match => {
        console.log('Match found!', match);
        if(match) {
          res.status(200).send({
            originalUrl: match.original,
            shortenedUrl: `https://www.myurl.com/${match.shortened}`
          })
        } else {
          // If new url add to database
          console.log('no matches!'); // DELETE ME
          addNewUrl(url)
            .then(savedUrl => {
              res.status(200).send({
                originalUrl: savedUrl.original,
                shortenedUrl: `https://www.myurl.com/${savedUrl.shortened}`
              })
            })
            .catch(e => {
              console.log(e);
            })
        }
      })
      .catch(e => {
        console.log(e);
        res.status(500);
      })
  } else {
    res.status(400).send({ "error": "Invalide URL" })
  }
});


// Redirect from Shortened url
app.get('/:id', (req, res) => {
  res.send('getting url...')
  // get id

  // retreive id from db

  // redirect to url
});


const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
