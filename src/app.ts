import express, {
  Application,
  json,
} from 'express';
import mongoose from 'mongoose';
import router from './routes/index';
import errorsMiddleware from './middlewares/errors';
import userControllers from './controllers/users';
import authMiddleware from './middlewares/auth';
import logger from './middlewares/logger';

const server: string = '127.0.0.1:27017';
const db: string = 'mestodb';
const { PORT = 3000 } = process.env;

const app: Application = express();

app.use(json());
app.use(logger.requestLogger);
app.use('/signin', userControllers.loginUser);
app.use('/signup', userControllers.createUser);
app.use(authMiddleware);
app.use('/', router);
app.use(logger.errorLogger);
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
