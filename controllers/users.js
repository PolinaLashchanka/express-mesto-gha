const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/user');
const { DataNotFound, AccessError, DuplicateKeyError } = require('../middlewares/error');

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .orFail(() => new AccessError('Неверное имя пользователя или пароль'))
    .then((user) => {
      bcrypt.compare(String(password), user.password)
        .then((isValidUser) => {
          if (isValidUser) {
            const jwt = jsonWebToken.sign({ _id: user._id }, 'secret-key');
            res.cookie('jwt', jwt, {
              maxAge: 3600000,
              httpOnly: true,
              sameSite: true,
            });
            res.send({ data: user.deletePassword() });
          } else {
            throw new AccessError('Неверное имя пользователя или пароль');
          }
        })
        .catch(next);
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => new DataNotFound())
    .then((user) => res.send(user))
    .catch(next);
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
        .then((user) => res
          .status(201)
          .send({
            data: {
              _id: user._id,
              name: user.name,
              about: user.about,
              avatar: user.avatar,
              email: user.email,
            },
          }))
        .catch((err) => {
          if (err.code === 11000) {
            next(new DuplicateKeyError('Такой Email уже зарегистрирован'));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
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
    .catch(next);
};

const updateAvatar = (req, res, next) => {
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
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

module.exports = {
  login,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  getUserInfo,
};
