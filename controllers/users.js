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
          message: 'User not found',
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
    .catch((err) => res.status(500).send({
      message: 'Internal server error',
      err: err.massage,
      stack: err.stack,
    }));
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
};
