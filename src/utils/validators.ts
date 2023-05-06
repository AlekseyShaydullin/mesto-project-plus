import validator from 'validator';
import urlRegExp from './urlRegExp';

export interface IValidationOptions {
  // eslint-disable-next-line no-unused-vars
  validator: (arg: string) => boolean;
  message: string;
}

const nameValidationUser: IValidationOptions = {
  validator: (name: string) => name.length > 2 && name.length <= 30,
  message: 'Имя пользователя должно быть неменее 2 символов или неболее 30',
};

const aboutValidationUser: IValidationOptions = {
  validator: (about: string) => about.length > 2 && about.length <= 200,
  message: 'Описание пользователя должно быть неменее 2 символов и небольее 200',
};

const avatarValidationUser: IValidationOptions = {
  validator: (link: string) => urlRegExp.test(link),
  message: 'Некорректная ссылка на аватар',
};

const emailValidationUser: IValidationOptions = {
  validator: (v: string) => validator.isEmail(v),
  message: 'Некорректный тип email',
};

export default {
  nameValidationUser,
  aboutValidationUser,
  avatarValidationUser,
  emailValidationUser,
};
