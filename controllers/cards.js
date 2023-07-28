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
    .catch((err) =>
      res
        .status(ERROR_DEFAULT)
        .send({ message: `На сервере произошла ошибка: ${err}` })
    );
};

const postCard = (req, res) => {
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
      res
        .status(ERROR_DEFAULT)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

const deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .orFail(new Error('NotFound'))
    .then((card) => {
      if (card.owner === req.user._id) {
        card.deleteOne(card);
      } else {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'Переданные некорректные данные' });
      }
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

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(new Error('NotFound'))
    .then((card) => res.send({ data: card }))
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

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(new Error('NotFound'))
    .then((card) => res.send({ data: card }))
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
  getCards,
  postCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
