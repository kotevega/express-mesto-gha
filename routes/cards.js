const cardRouter = require('express').Router();
const {
  getCards,
  postCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { validatePostCard, validateLikeCard, validateDisLikeCard } = require('../utils/validate');

cardRouter.get('/', getCards);
cardRouter.post('/', validatePostCard, postCard);
cardRouter.delete('/:cardId', deleteCard);
cardRouter.put('/:cardId/likes', validateLikeCard, likeCard);
cardRouter.delete('/:cardId/likes', validateDisLikeCard, dislikeCard);

module.exports = cardRouter;
