import express, {
  Application,
  NextFunction,
  Response,
  json,
} from 'express';
import mongoose from 'mongoose';
import router from './routes/index';
import { RequestCustom } from './utils/type';
import errorsMiddleware from './middlewares/errors';
import userControllers from './controllers/users';
import authMiddleware from './middlewares/auth';

const server: string = '127.0.0.1:27017';
const db: string = 'mestodb';
const { PORT = 3000 } = process.env;

const app: Application = express();

app.use(json());

app.use((req: RequestCustom, res: Response, next: NextFunction) => {
  req.user = {
    _id: '644e7e7ea07bb507cdb036f7',
  };

  next();
});

app.use('/signin', userControllers.loginUser);
app.use('/signup', userControllers.createUser);
app.use(authMiddleware);
app.use('/', router);

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
