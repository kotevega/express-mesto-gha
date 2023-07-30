/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  ErrorValidation,
  ErrorNotFound,
  ErrorConflict,
  ErrorUnauthorized,
} = require('../utils/error');

const getUser = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(next);
};

const getByIdUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new ErrorNotFound('Данные не найдены'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorValidation('Переданные некорректные данные'));
      } else {
        next(new ErrorNotFound('Данные не найдены'));
      }
    });
};

const getAboutUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new Error('NotFound'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorValidation('Запрашиваемые данные не найдены'));
      } else {
        next(new ErrorNotFound('Переданные некорректные данные'));
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(201).json(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.code === 11000) {
        next(new ErrorConflict('Переданные некорректные данные'));
      }
    });
};

const patchUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorValidation('Переданные некорректные данные'));
      }
    });
};

const patchUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorValidation('Переданные некорректные данные'));
      }
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
            res.send({ data: user });
          } else {
            next(new ErrorUnauthorized('Неправильные почта или пароль'));
          }
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorNotFound('Данные не найдены'));
      } else {
        next(new ErrorValidation('Переданные некорректные данные'));
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
