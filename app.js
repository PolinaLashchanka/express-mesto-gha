const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const router = require('./routes');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());

app.use(cookieParser());
app.use(router);
app.use((req, res) => {
  res.status(404);
  res.json({ message: 'Not found' });
});

app.listen(3000);
