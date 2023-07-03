const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/user');
const {
  NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} = require('../utils/constants');

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .orFail(() => new Error('Пользователь не найден'))
    .then((user) => {
      bcrypt.compare(String(password), user.password).then((isValidUser) => {
        if (isValidUser) {
          const jwt = jsonWebToken.sign({ _id: user._id }, 'secret-key');
          res.cookie('jwt', jwt, {
            maxAge: 3600000,
            httpOnly: true,
            sameSite: true,
          });
          res.send({ data: user });
        } else {
          res.status(401).send({ message: 'Неверный email или пароль' });
        }
      });
    })
    .catch(next);
};

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

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(String(password), 10)
    .then((hashPassword) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hashPassword,
      })
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
    })
    .catch(next);
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
  login,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
