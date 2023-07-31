const Card = require('../models/card');
const {
  ErrorValidation,
  ErrorForbidden,
  ErrorNotFound,
} = require('../utils/error');

const getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(next);
};

const postCard = (req, res, next) => {
  const { name, link } = req.body;
  const id = req.user._id;
  Card.create({ name, link, owner: id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ErrorValidation('Переданные некорректные данные'));
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new ErrorNotFound('Данные не найдены'))
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        card
          .deleteOne(card)
          .then((cards) => res.send({ data: cards }))
          .catch(next);
      } else {
        next(new ErrorForbidden('Нет доступа'));
      }
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new ErrorNotFound('Данные не найдены'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorValidation('Переданные некорректные данные'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new ErrorNotFound('Данные не найдены'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorValidation('Переданные некорректные данные'));
      } else {
        next(err);
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
