const User = require('../models/user');
const {
  NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} = require('../utils/constants');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({
      message: 'На сервере произошла ошибка',
    }));
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => new Error('Not found'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(NOT_FOUND).send({
          message: 'Запрашиваемый пользователь не найден',
        });
      } else if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({
          message: 'Вы ввели некорректные данные',
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({
          message: 'На сервере произошла ошибка',
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
        res
          .status(BAD_REQUEST)
          .send({ message: 'Вы ввели некорректные данные' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({
          message: 'На сервере произошла ошибка',
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
    },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(BAD_REQUEST)
          .send({ message: 'Вы ввели некорректные данные' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({
          message: 'На сервере произошла ошибка',
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
      runValidators: true,
    },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(BAD_REQUEST)
          .send({ message: 'Вы ввели некорректные данные' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({
          message: 'На сервере произошла ошибка',
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
