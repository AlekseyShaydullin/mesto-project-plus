import crypto from 'crypto';

require('dotenv').config();

const server: string = '127.0.0.1:27017';
const db: string = 'mestodb';
const { PORT = 3000 } = process.env;

const secretKey = crypto.randomBytes(32).toString('hex');
const JWT_SECRET = process.env.TOKEN_ENV as string || secretKey;

const defaultUser = {
  NAME: 'Жак-Ив Кусто',
  ABOUT: 'Исследователь',
  AVATAR: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
};

const urlRegExp: RegExp = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;

export {
  server,
  db,
  PORT,
  JWT_SECRET,
  defaultUser,
  urlRegExp,
};
