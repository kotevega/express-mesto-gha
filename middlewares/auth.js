/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const { ErrorUnauthorized } = require('../utils/error');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new ErrorUnauthorized('Необходима авторизация');
  }

  let payload;
  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    throw new ErrorUnauthorized('Необходима авторизация');
  }
  req.user = payload;
  next();
};

module.exports = auth;
