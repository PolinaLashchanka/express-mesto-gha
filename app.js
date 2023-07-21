const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
// eslint-disable-next-line import/no-extraneous-dependencies
const { errors } = require('celebrate');
const router = require('./routes');
const { errorHandler } = require('./middlewares/error');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());

app.use(cookieParser());
app.use(router);
app.use(errors());
app.use((req, res) => {
  res.status(404);
  res.json({ message: 'Not found' });
});
app.use(errorHandler);

app.listen(3000);
