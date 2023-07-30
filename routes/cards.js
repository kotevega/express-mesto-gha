const cardRouter = require('express').Router();
const {
  getCards, postCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const {
  validatePostCard,
} = require('../utils/validate');

cardRouter.get('/', getCards);
cardRouter.post('/', validatePostCard, postCard);
cardRouter.delete('/:cardId', deleteCard);
cardRouter.put('/:cardId/likes', likeCard);
cardRouter.delete('/:cardId/likes', dislikeCard);

module.exports = cardRouter;
