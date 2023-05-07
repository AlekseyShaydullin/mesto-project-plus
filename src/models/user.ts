import {
  model,
  Schema,
  Document,
  Model,
} from 'mongoose';
import bcrypt from 'bcrypt';
import validation from '../utils/validators';

const CustomError = require('../errors/CustomError');

interface IUser extends Document {
  name: string,
  about: string,
  avatar: string,
  email: string,
  password: string,
}

interface IUserDocument extends Document<IUser>{}

interface UserModel extends Model<IUser> {
  // eslint-disable-next-line no-unused-vars
  findUserByCredentials: (email: string, password: string) => Promise<IUserDocument>
}

const userSchema = new Schema<IUser, UserModel>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: validation.linkValidationUser,
  },
  email: {
    type: String,
    required: [true, 'e-mail is required'],
    unique: true,
    validate: validation.emailValidationUser,
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    select: false,
  },
});

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw CustomError.Unauthorized('Неверно введен логин или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((userValid) => {
          if (!userValid) {
            throw CustomError.Unauthorized('Неверно введен логин или пароль');
          }
          return user;
        });
    });
});

export default model<IUser, UserModel>('user', userSchema);
