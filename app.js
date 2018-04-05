const express = require('express');
const path = require('path');

const helpers = require('./utils/helpers');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'public')));

// Index Route
app.get('/', helpers.getIndex);

// New Route
app.get('/new/:url*', helpers.createUrl);

// Get / Redirect Route
app.get('/:urlCode', helpers.getUrl);

// Server
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
