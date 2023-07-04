const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  console.log('PATH', req.path, req.headers);
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    next(err);
  }

  req.user = payload;
  next();
};

module.exports = auth;
