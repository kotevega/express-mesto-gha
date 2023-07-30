const userRouter = require('express').Router();
const {
  getUser,
  getByIdUser,
  getAboutUser,
  patchUserProfile,
  patchUserAvatar,
} = require('../controllers/users');
const {
  validatePatchUserProfile,
  validatePatchUserAvatar,
  validateGetByIdUser,
} = require('../utils/validate');

userRouter.get('/', getUser);
userRouter.get('/me', getAboutUser);
userRouter.get('/:userId', validateGetByIdUser, getByIdUser);
userRouter.patch('/me', validatePatchUserProfile, patchUserProfile);
userRouter.patch('/me/avatar', validatePatchUserAvatar, patchUserAvatar);

module.exports = userRouter;
