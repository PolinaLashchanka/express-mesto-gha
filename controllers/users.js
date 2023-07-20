const bcrypt = require("bcryptjs");
const jsonWebToken = require("jsonwebtoken");
const User = require("../models/user");

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(403).send({ message: "Введите данные" });

    return;
  }

  User.findOne({ email })
    .select("+password")
    .orFail(() => new Error("User not found"))
    .then((user) => {
      bcrypt.compare(String(password), user.password).then((isValidUser) => {
        if (isValidUser) {
          const jwt = jsonWebToken.sign({ _id: user._id }, "secret-key");
          res.cookie("jwt", jwt, {
            maxAge: 3600000,
            httpOnly: true,
            sameSite: true,
          });
          res.send({ data: user.deletePassword() });
        } else {
          res.status(403).send({ message: "Неверный email или пароль" });
        }
      });
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
    .orFail(() => new Error("Not found"))
    .then((user) => res.send(user))
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
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
        .then((user) =>
          res
            .status(201)
            .send({
              data: {
                name: user.name,
                about: user.about,
                avatar: user.avatar,
                email: user.email,
              },
            })
        )
        .catch(next);
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
    }
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
    }
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
