import { model, Schema, Document } from 'mongoose';
import validation from '../utils/validators';

interface IUser extends Document {
  name: string,
  about: string,
  avatar: string,
  email: string,
  password: string,
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
    validate: validation.nameValidationUser,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь',
    validate: validation.aboutValidationUser,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: validation.avatarValidationUser,
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

export default model('user', userSchema);
