import express, {
  Application,
  NextFunction,
  Response,
  json,
} from 'express';
import mongoose from 'mongoose';
import router from './routes/index';
import { RequestCustom } from './utils/type';

const { PORT = 3000 } = process.env;

const app: Application = express();

app.use(json());
app.use('/', router);

app.use((req: RequestCustom, res: Response, next: NextFunction) => {
  req.user = {
    _id: '644e7e7ea07bb507cdb036f7',
  };

  next();
});

const connect = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
    console.log('MongoDB connected =)');

    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

connect();