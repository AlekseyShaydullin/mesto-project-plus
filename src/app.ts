import express, {
  Application,
  json,
} from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import router from './routes/index';
import errorsMiddleware from './middlewares/errors';
import userControllers from './controllers/users';
import authMiddleware from './middlewares/auth';
import logger from './middlewares/logger';
import validation from './validation/userValidation';

const server: string = '127.0.0.1:27017';
const db: string = 'mestodb';
const { PORT = 3000 } = process.env;

const app: Application = express();

app.use(json());
app.use(logger.requestLogger);
app.use('/signin', validation.loginUserValidation, userControllers.loginUser);
app.use('/signup', validation.createUserValidation, userControllers.createUser);
app.use(authMiddleware);
app.use('/', router);
app.use(logger.errorLogger);
app.use(errors());
app.use(errorsMiddleware);

const connect = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(`mongodb://${server}/${db}`);
    console.log('MongoDB connected =)');

    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

connect();
