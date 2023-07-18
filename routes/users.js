const userRouter = require('express').Router();
const {
  getUser, getByIdUser, postUser, patchUserProfile, patchUserAvatar,
} = require('../controllers/users');

userRouter.get('/', getUser);
userRouter.get('/:userId', getByIdUser);
userRouter.post('/', postUser);
userRouter.patch('/me', patchUserProfile);
userRouter.patch('/me/avatar', patchUserAvatar);

module.exports = userRouter;
