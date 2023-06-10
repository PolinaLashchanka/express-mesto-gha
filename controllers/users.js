const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({
      message: 'Internal server error',
      err: err.massage,
      stack: err.stack,
    }));
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => new Error('Not found'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(404).send({
          message: 'Запрашиваемый пользователь не найден',
        });
      } else {
        res.status(500).send({
          message: 'Internal server error',
          err: err.massage,
          stack: err.stack,
        });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.message.includes('validation failed')) {
        res.status(400).send({ message: 'Вы ввели некорректные данные' });
      } else {
        res.status(500).send({
          message: 'Internal server error',
          err: err.massage,
          stack: err.stack,
        });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message.includes('Validation failed')) {
        res.status(400).send({ message: 'Вы ввели некорректные данные' });
      } else {
        res.status(500).send({
          message: 'Internal server error',
          err: err.massage,
          stack: err.stack,
        });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
    },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message.includes('Cast to string failed for value')) {
        res.status(400).send({ message: 'Вы ввели некорректные данные' });
      } else {
        res.status(500).send({
          message: 'Internal server error',
          err: err.massage,
          stack: err.stack,
        });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
