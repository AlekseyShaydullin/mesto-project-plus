import validator from 'validator';
import urlRegExp from './urlRegExp';

export interface IValidationOptions {
  // eslint-disable-next-line no-unused-vars
  validator: (arg: string) => boolean;
  message: string;
}

const linkValidationUser: IValidationOptions = {
  validator: (link: string) => urlRegExp.test(link),
  message: 'Некорректная ссылка на аватар',
};

const emailValidationUser: IValidationOptions = {
  validator: (v: string) => validator.isEmail(v),
  message: 'Некорректный тип email',
};

export default {
  linkValidationUser,
  emailValidationUser,
};
