/* eslint-disable consistent-return */
const Card = require('../models/card');
const {
  ERROR_VALIDATION,
  ERROR_NOT_FOUND,
  ERROR_DEFAULT,
} = require('../utils/errors');

const getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch((err) => res
      .status(ERROR_DEFAULT)
      .send({ message: `На сервере произошла ошибка: ${err}` }));
};

const postCard = (req, res, next) => {
  const { name, link } = req.body;
  const id = req.user._id;
  Card.create({ name, link, owner: id })
    .then((card) => res.status(201).send({ data: card }))
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

const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'Запрашиваемые данные не найдены' });
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
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

const likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      return res
        .status(ERROR_NOT_FOUND)
        .send({ message: 'Запрашиваемые данные не найдены' });
    }
    res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res
        .status(ERROR_VALIDATION)
        .send({ message: 'Переданные некорректные данные' });
    }
    next(err);
  })
  .catch((err) => res
    .status(ERROR_DEFAULT)
    .send({ message: `На сервере произошла ошибка: ${err}` }));

const dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      return res
        .status(ERROR_NOT_FOUND)
        .send({ message: 'Запрашиваемые данные не найдены' });
    }
    res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res
        .status(ERROR_VALIDATION)
        .send({ message: 'Переданные некорректные данные' });
    }
    next(err);
  })
  .catch((err) => res
    .status(ERROR_DEFAULT)
    .send({ message: `На сервере произошла ошибка: ${err}` }));

module.exports = {
  getCards,
  postCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
