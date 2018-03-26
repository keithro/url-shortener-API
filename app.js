const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Connect to Mongoose
mongoose.connect('mongodb://localhost/url-shortener')
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile('/views/index.html', { root: __dirname });
});

// Create New Shortened URL
app.get('/new/:url*', (req, res) => {
  const url = req.params.url + req.params['0'];
  const regex = RegExp(/https?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g);

  // validate url
  if(regex.test(url)) {
    res.send('Passed!');
  } else {
    res.send({ "error": "Invalide URL" })
  }
});

/* 
// Redirect from Shortened url
app.get('/:id', (req, res) => {
  // get id

  // retreive id from db

  // redirect to url
});
 */

const port = process.env.PORT || 5000;

app.listen(port, () => {
  `App is listening on port ${port}`;
});
