import mongoose from 'mongoose';
import { NextFunction, Request, Response } from 'express';
import User from '../models/user';
import { RequestCustom } from '../utils/type';
import HttpStatusCode from '../utils/constants';
import updateUserMiddleware from '../middlewares/updateUserMiddleware';

const CustomError = require('../errors/CustomError');

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    return res.status(HttpStatusCode.OK).json({ data: users });
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
    return res.status(HttpStatusCode.OK).json({ data: user });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(HttpStatusCode.BAD_REQUEST).send({ message: 'Не верный ID пользователя' });
    }
    return next(error);
  }
};

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    return res.status(HttpStatusCode.CREATED).json({ data: user });
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
  createUser,
  updateUser,
  updateAvatar,
};
