/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  ERROR_VALIDATION,
  ERROR_NOT_FOUND,
  ERROR_UNAUTHORIZED,
  ERROR_DEFAULT,
} = require('../utils/errors');

const getUser = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) =>
      res
        .status(ERROR_DEFAULT)
        .send({ message: `На сервере произошла ошибка: ${err}` })
    );
};

const getByIdUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error('NotFound'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(ERROR_VALIDATION)
          .send({ message: 'Запрашиваемые данные не найдены' });
      } else {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'Переданные некорректные данные' });
      }
    });
};

const getAboutUser = (req, res) => {
  User.findById(req.user._id)
    .orFail(new Error('NotFound'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(ERROR_VALIDATION)
          .send({ message: 'Запрашиваемые данные не найдены' });
      } else {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'Переданные некорректные данные' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) => res.status(201).json(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(ERROR_VALIDATION)
          .send({ message: 'Переданные некорректные данные' });
      }
      res
        .status(ERROR_DEFAULT)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

const patchUserProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(ERROR_VALIDATION)
          .send({ message: 'Переданные некорректные данные' });
      }
      res
        .status(ERROR_DEFAULT)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

const patchUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(ERROR_VALIDATION)
          .send({ message: 'Переданные некорректные данные' });
      }
      res
        .status(ERROR_DEFAULT)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .orFail(() => new Error('NotFound'))
    .then((user) => {
      bcrypt
        .compare(password, user.password)
        .then((matched) => {
          if (matched) {
            const token = jwt.sign({ _id: user._id }, 'secret-key', {
              expiresIn: '7d',
            });
            res.cookie('jwt', token, { httpOnly: true, sameSite: true });
            res.send(user);
          } else {
            res
              .status(ERROR_UNAUTHORIZED)
              .send({ message: 'Неправильные почта или пароль ' });
          }
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(ERROR_VALIDATION)
          .send({ message: 'Запрашиваемые данные не найдены' });
      } else {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'Переданные некорректные данные' });
      }
    });
};

module.exports = {
  getUser,
  getByIdUser,
  getAboutUser,
  createUser,
  patchUserProfile,
  patchUserAvatar,
  login,
};
