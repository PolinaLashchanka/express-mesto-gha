/* eslint-disable max-classes-per-file */
const {
  NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  DUPLICATE_KEY_ERROR,
  ACCESS_ERROR,
  FORBIDDEN_ERROR,
} = require('../utils/constants');

class BadRequestError extends Error {
  constructor(message = 'Вы ввели неверные данные') {
    super(message);
    this.statusCode = BAD_REQUEST;
  }
}

class DataNotFound extends Error {
  constructor(message = 'Данные не найдены') {
    super(message);
    this.statusCode = NOT_FOUND;
  }
}

class ServerError extends Error {
  constructor(message = 'Ошибка сервера') {
    super(message);
    this.statusCode = INTERNAL_SERVER_ERROR;
  }
}

class DuplicateKeyError extends Error {
  constructor(message = 'Такой Email уже зарегистрирован') {
    super(message);
    this.statusCode = DUPLICATE_KEY_ERROR;
  }
}

class AccessError extends Error {
  constructor(message = 'Пользователь не авторизован') {
    super(message);
    this.statusCode = ACCESS_ERROR;
  }
}

class ForbiddenError extends Error {
  constructor(message = 'У вас нету доступа к данному действию') {
    super(message);
    this.statusCode = FORBIDDEN_ERROR;
  }
}

const knownErrorCodes = [NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  DUPLICATE_KEY_ERROR,
  ACCESS_ERROR,
  FORBIDDEN_ERROR];

const errorHandler = (err, req, res, next) => {
  let error;

  if (err.statusCode && knownErrorCodes.indexOf(err.statusCode) !== -1) {
    error = err;
  } else if (err.name === 'ValidationError' || err.name === 'CastError') {
    error = new BadRequestError();
  } else if (err.name === 'JsonWebTokenError' || err.message === 'User not found') {
    error = new AccessError();
  } else {
    error = new ServerError();
  }

  res.status(error.statusCode).send({ message: error.message });
  next();
};

module.exports = { errorHandler, DataNotFound, ForbiddenError, AccessError, DuplicateKeyError };
