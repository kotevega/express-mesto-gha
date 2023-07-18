/* eslint-disable consistent-return */
const User = require('../models/user');
const {
  ERROR_VALIDATION,
  ERROR_NOT_FOUND,
  ERROR_DEFAULT,
} = require('../utils/errors');

const getUser = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => res
      .status(ERROR_DEFAULT)
      .send({ message: `На сервере произошла ошибка: ${err}` }));
};

const getByIdUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new Error('NotFound'))
    .then((user) => next(res.send({ data: user })))
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

const postUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
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
    { new: true, runValidators: true },
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
    { new: true, runValidators: true },
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

module.exports = {
  getUser,
  getByIdUser,
  postUser,
  patchUserProfile,
  patchUserAvatar,
};
