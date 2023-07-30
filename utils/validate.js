const { celebrate, Joi } = require('celebrate');

const regex =  /^(https?):\/\/(?:www\.)?[0-9a-zA-Z-._~:\/?!#\[\]@&'()\*,;=\.\+\$]\.?\/?[0-9a-zA-Z-._~:\/?!#\[\]@&'()\*,;=\.\+\$#]/; // eslint-disable-line

const validatePostCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }),
});

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().pattern(regex),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validatePatchUserProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

const validatePatchUserAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(regex),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports = {
  validatePostCard,
  validateCreateUser,
  validatePatchUserProfile,
  validatePatchUserAvatar,
  validateLogin,
};
