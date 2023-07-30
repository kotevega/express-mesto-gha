const userRouter = require('express').Router();
const {
  getUser,
  getByIdUser,
  getAboutUser,
  patchUserProfile,
  patchUserAvatar,
} = require('../controllers/users');

userRouter.get('/', getUser);
userRouter.get('/me', getAboutUser);
userRouter.get('/:userId', getByIdUser);
userRouter.patch('/me', patchUserProfile);
userRouter.patch('/me/avatar', patchUserAvatar);

module.exports = userRouter;
