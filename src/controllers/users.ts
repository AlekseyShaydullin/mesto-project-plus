import { NextFunction, Request, Response } from 'express';
import Errors from '../errors/errors';
import User from '../models/user';

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    return res.status(200).json({ data: users });
  } catch (error) {
    console.error(error);
    return next(Errors.internalError('На сервере произошла ошибка'));
  }
};

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return next(Errors.authorizationError('Пользователь не найден'));
    }
    return res.status(200).json({ data: user });
  } catch (error) {
    console.error(error);
    return next(Errors.internalError('На сервере произошла ошибка'));
  }
};

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;

  if (!name || !about || !avatar) {
    return next(Errors.badRequestError('Не верные данные пользователя'));
  }

  try {
    const user = await User.create({ name, about, avatar });
    return res.status(201).json({ data: user });
  } catch (error) {
    console.error(error);
    return next(Errors.internalError('На сервере произошла ошибка'));
  }
};

export default { getUsers, getUserById, createUser };