import express, { Application, json } from 'express';
import mongoose from 'mongoose';

const { PORT = 3000 } = process.env;

const app: Application = express();

app.use(json());

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