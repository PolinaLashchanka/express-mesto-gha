const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');

const app = express();

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb', {
    useNewUrlParser: true,
  })
  .then((res) => console.log(res))
  .catch((err) => console.log(err));

app.use(express.json());
// app.use((req, res, next) => {
//   req.user = {
//     _id: '64839b5dc1bb79cb5d938288',
//   };

//   next();
// });
app.use(router);

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Слушаю порт 3000');
});
