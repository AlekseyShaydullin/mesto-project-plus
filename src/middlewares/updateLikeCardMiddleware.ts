import { NextFunction, Response } from 'express';
import mongoose from 'mongoose';
import HttpStatusCode from '../utils/constants';
import { RequestCustom } from '../utils/type';
import Card from '../models/card';

const CustomError = require('../errors/CustomError');

const updateLikeCardMiddleware = async (
  req: RequestCustom,
  res: Response,
  next: NextFunction,
  handleUpdate: boolean,
) => {
  const { cardId } = req.params;
  const id = req.user?._id;
  try {
    if (!cardId) {
      throw CustomError.BadRequest('Нет такой карточки');
    }

    const card = await Card.findByIdAndUpdate(cardId, handleUpdate === true ? {
      $addToSet: {
        likes: id,
      },
    } : {
      $pull: {
        likes: id,
      },
    }, {
      new: true,
      runValidators: true,
    });
    if (!card) {
      throw CustomError.NotFoundError('Карточка не найдена');
    }
    return res.status(HttpStatusCode.CREATED).json({ data: card });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(HttpStatusCode.BAD_REQUEST).send({ message: 'Не верный ID карточки' });
    }
    return next(error);
  }
};

export default updateLikeCardMiddleware;
