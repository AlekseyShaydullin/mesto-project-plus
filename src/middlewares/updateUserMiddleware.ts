import { NextFunction, Response } from 'express';
import mongoose from 'mongoose';
import HttpStatusCode from '../utils/constants';
import { RequestCustom } from '../utils/type';
import User from '../models/user';

const CustomError = require('../errors/CustomError');

const updateUserMiddleware = async (
  req: RequestCustom,
  res: Response,
  next: NextFunction,
  handleUpdate: boolean,
) => {
  const { name, about, avatar } = req.body;
  const id = req.user?._id;
  try {
    const user = await User.findByIdAndUpdate(id, handleUpdate === true ? {
      name,
      about,
    } : {
      avatar,
    }, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      throw CustomError.NotFoundError('Нет пользователя с таким id');
    }
    return res.status(HttpStatusCode.CREATED).json({ data: user });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return next(CustomError.BadRequest('Ошибка в вводе данных пользователя'));
    }
    return next(error);
  }
};

export default updateUserMiddleware;
