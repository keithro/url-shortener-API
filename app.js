const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const { validate } = require('./utils/validate')

const app = express();

// Connect to Mongoose
mongoose.connect('mongodb://localhost/url-shortener') // setup mLab and config file
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

app.use(express.static(path.join(__dirname, 'public')));

// Url Model/Schema
require('./models/url');
const Url = mongoose.model('urls');

// Routes
app.get('/', (req, res) => {
  res.sendFile('/views/index.html', { root: __dirname });
});

// Create New Shortened URL
app.get('/new/:url*', (req, res) => {
  const url = req.params.url + req.params['0'];
  

  // validate url
  if (validate(url)) {
    res.send('Passed!'); // for dev only DELETE
    new Url({ url })
      .save()
      .then(item => {
        res.send(item);
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
  `App is listening on port ${port}`;
});
