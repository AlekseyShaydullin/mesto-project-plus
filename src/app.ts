import express, { Application } from 'express';
import mongoose from 'mongoose';

const { PORT = 3000 } = process.env;

const app: Application = express();

const connect = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/mestodb');
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

connect();