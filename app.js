const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(express.json());

const users = [];
let id = 0;

app.get('/users', (req, res) => {
  res.send(users);
});

app.post('/users', (req, res) => {
  id += 1;
  const newUser = {
    id,
    ...req.body,
  };
  users.push(newUser);

  res.send(newUser);
});

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Слушаю порт 3000');
});
