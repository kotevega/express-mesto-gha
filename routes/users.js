const userRouter = require('express').Router();
const {
  getUser, getByIdUser, createUser, patchUserProfile, patchUserAvatar,
} = require('../controllers/users');

userRouter.get('/', getUser);
userRouter.get('/:userId', getByIdUser);
userRouter.post('/', createUser);
userRouter.patch('/me', patchUserProfile);
userRouter.patch('/me/avatar', patchUserAvatar);

module.exports = userRouter;
