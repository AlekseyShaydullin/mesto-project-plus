import { Joi, celebrate, Segments } from 'celebrate';
import { urlRegExp } from '../config';

const getUserByIdValidation = celebrate({
  [Segments.PARAMS]: Joi.object({
    userId: Joi.string().length(24).hex().required,
  }),
});

const updateUserValidation = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(200).required(),
  }),
});

const updateAvatarValidation = celebrate({
  [Segments.BODY]: Joi.object({
    avatar: Joi.string().pattern(urlRegExp).required(),
  }),
});

const createUserValidation = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().pattern(urlRegExp),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const loginUserValidation = celebrate({
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
});

export default {
  getUserByIdValidation,
  updateUserValidation,
  updateAvatarValidation,
  createUserValidation,
  loginUserValidation,
};
