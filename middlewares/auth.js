/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const { ERROR_UNAUTHORIZED } = require('../utils/errors');

const auth = (req, res, next) => {
  let token;
  try {
    token = req.cookies.jwt;
  } catch (err) {
    return res
      .status(ERROR_UNAUTHORIZED)
      .send({ message: 'Необходима авторизация' });
  }
  let payload;

  try {
    payload = jwt.verify(token, 'SECRET');
  } catch (err) {
    return res
      .status(ERROR_UNAUTHORIZED)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload;
  next();
  // const token = req.cookies.jwt;
  // if (!token) {
  //   return res
  //     .status(ERROR_UNAUTHORIZED)
  //     .send({ message: 'Необходима авторизация' });
  // }

  // let payload;

  // try {
  //   payload = jwt.verify(token, 'secret-key');
  // } catch (err) {
  //   return res
  //     .status(ERROR_UNAUTHORIZED)
  //     .send({ message: 'Необходима авторизация' });
  // }
  // req.user = payload;

  // next();
};

module.exports = auth;
