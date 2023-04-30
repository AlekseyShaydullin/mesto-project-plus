import { NextFunction, Request, Response } from 'express';
import Errors from '../errors/errors';
import User from '../models/user';

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    res.status(200).json({ data: users });
  } catch (error) {
    console.error(error);
    next(Errors.internalError('На сервере произошла ошибка'));
  }
};

export default getUsers;