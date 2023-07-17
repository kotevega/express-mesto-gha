/* eslint-disable consistent-return */
const User = require('../models/user');
const {
  ERROR_VALIDATION,
  ERROR_NOT_FOUND,
  ERROR_DEFAULT,
} = require('../utils/errors');

const getUser = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(ERROR_VALIDATION)
          .send({ message: 'Переданные некорректные данные' });
      }
      next(err);
    })
    .catch((err) => res
      .status(ERROR_DEFAULT)
      .send({ message: `На сервере произошла ошибка: ${err}` }));
};

const getByIdUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res
          .status(ERROR_VALIDATION)
          .send({ message: 'Переданные некорректные данные' });
      }
      next(res.send({ data: user }));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'Запрашиваемые данные не найдены' });
      }
      next(err);
    })
    .catch((err) => res
      .status(ERROR_DEFAULT)
      .send({ message: `На сервере произошла ошибка: ${err}` }));
};

const createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(ERROR_VALIDATION)
          .send({ message: 'Переданные некорректные данные' });
      }
      next(err);
    })
    .catch((err) => res
      .status(ERROR_DEFAULT)
      .send({ message: `На сервере произошла ошибка: ${err}` }));
};

const patchUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(ERROR_VALIDATION)
          .send({ message: 'Переданные некорректные данные' });
      }
      next(err);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'Запрашиваемые данные не найдены' });
      }
      next(err);
    })
    .catch((err) => res
      .status(ERROR_DEFAULT)
      .send({ message: `На сервере произошла ошибка: ${err}` }));
};

const patchUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(ERROR_VALIDATION)
          .send({ message: 'Переданные некорректные данные' });
      }
      next(err);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'Запрашиваемые данные не найдены' });
      }
      next(err);
    })
    .catch((err) => res
      .status(ERROR_DEFAULT)
      .send({ message: `На сервере произошла ошибка: ${err}` }));
};

module.exports = {
  getUser,
  getByIdUser,
  createUser,
  patchUserProfile,
  patchUserAvatar,
};
