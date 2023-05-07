import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as process from 'process';
import { NextFunction, Request, Response } from 'express';
import User from '../models/user';
import { RequestCustom } from '../utils/type';
import HttpStatusCode from '../utils/constants';
import updateUserMiddleware from '../middlewares/updateUserMiddleware';
import secretKey from '../utils/keys';

const CustomError = require('../errors/CustomError');

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    return res.json({ data: users });
  } catch (error) {
    return next(error);
  }
};

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      throw CustomError.NotFoundError('Нет пользователя с таким id');
    }
    return res.json({ data: user });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(HttpStatusCode.BAD_REQUEST).send({ message: 'Не верный ID пользователя' });
    }
    return next(error);
  }
};

const getUserInfo = async (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    const owner = req.user?._id;
    const user = await User.findById(owner);
    if (!user) {
      throw CustomError.NotFoundError('Пользователь не найден');
    }
    return res.send({ data: user });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(HttpStatusCode.BAD_REQUEST).send({ message: 'Не верный ID пользователя' });
    }
    return next(error);
  }
};

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name,
      about,
      avatar,
      email,
      password,
    } = req.body;

    const hashPassword = await bcrypt.hash(password, 11);

    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hashPassword,
    });

    return res.status(HttpStatusCode.CREATED).json({
      data: {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      },
    });
  } catch (error: any) {
    if (error.name === 'MongoError' && error.code === 11000) {
      return res.status(HttpStatusCode.CONFLICT).send({ message: 'Пользователь с таким почтовым адресом уже существует' });
    }
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(HttpStatusCode.BAD_REQUEST).send({ message: 'Ошибка в вводе данных пользователя' });
    }
    return next(error);
  }
};

const loginUser = async (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);
    return res.send({
      token: jwt.sign({ _id: user._id }, process.env.TOKEN_ENV as string || secretKey, { expiresIn: '7d' }),
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(HttpStatusCode.BAD_REQUEST).send({ message: 'Ошибка в вводе данных пользователя' });
    }
    return next(error);
  }
};

const updateUser = (req: RequestCustom, res: Response, next: NextFunction) => {
  const handleUpdateUser = true;
  updateUserMiddleware(req, res, next, handleUpdateUser);
};

const updateAvatar = (req: RequestCustom, res: Response, next: NextFunction) => {
  const handleUpdateUser = false;
  updateUserMiddleware(req, res, next, handleUpdateUser);
};

export default {
  getUsers,
  getUserById,
  getUserInfo,
  createUser,
  loginUser,
  updateUser,
  updateAvatar,
};
