/* eslint-disable max-classes-per-file */
const {
  NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  DUPLICATE_KEY_ERROR,
  ACCESS_ERROR,
} = require('../utils/constants');

class BadRequestError extends Error {
  constructor(err) {
    super(err);
    this.message = 'Вы ввели неверные данные';
    this.statusCode = BAD_REQUEST;
  }
}

class DataNotFound extends Error {
  constructor(err) {
    super(err);
    this.message = 'Данные не найдены';
    this.statusCode = NOT_FOUND;
  }
}

class ServerError extends Error {
  constructor(err) {
    super(err);
    this.message = 'Ошибка сервера';
    this.statusCode = INTERNAL_SERVER_ERROR;
  }
}

class DuplicateKeyError extends Error {
  constructor(err) {
    super(err);
    this.message = 'Такой Email уже зарегистрирован';
    this.statusCode = DUPLICATE_KEY_ERROR;
  }
}

class AccessError extends Error {
  constructor(err) {
    super(err);
    this.message = 'Пользователь не авторизован';
    this.statusCode = ACCESS_ERROR;
  }
}

const errorHandler = (err, req, res, next) => {
  let error;

  if (err.name === 'ValidationError' || err.name === 'CastError') {
    error = new BadRequestError(err);
  } else if (err.message === 'Not found') {
    error = new DataNotFound(err);
  } else if (err.code === 11000) {
    error = new DuplicateKeyError(err);
  } else if (err.name === 'JsonWebTokenError' || err.message === 'User not found') {
    error = new AccessError(err);
  } else {
    error = new ServerError(err);
  }

  res.status(error.statusCode).send({ message: error.message });
  next();
};

module.exports = errorHandler;
