import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import User from '../models/user';
import { RequestCustom } from '../utils/type';
import HttpStatusCode from '../utils/constants';
import updateUserMiddleware from '../middlewares/updateUserMiddleware';
import { JWT_SECRET } from '../config';
import searchUser from '../utils/wrappers';

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
    const auth = false;
    return searchUser(req, res, next, auth);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(CustomError.BadRequest('Не верный ID пользователя'));
    }
    return next(error);
  }
};

const getUserInfo = async (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    const auth = true;
    return searchUser(req, res, next, auth);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(CustomError.BadRequest('Не верный ID пользователя'));
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
      return next(CustomError.Conflict('Пользователь с таким почтовым адресом уже существует'));
    }
    if (error instanceof mongoose.Error.ValidationError) {
      return next(CustomError.BadRequest('Ошибка в вводе данных пользователя'));
    }
    return next(error);
  }
};

const loginUser = async (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);
    return res.send({
      token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' }),
    });
  } catch (error) {
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
