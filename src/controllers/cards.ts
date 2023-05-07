import mongoose from 'mongoose';
import { NextFunction, Request, Response } from 'express';
import Card from '../models/card';
import { RequestCustom } from '../utils/type';
import HttpStatusCode from '../utils/constants';
import updateLikeCardMiddleware from '../middlewares/updateLikeCardMiddleware';

const CustomError = require('../errors/CustomError');

const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    return res.send({ data: cards });
  } catch (error) {
    return next(error);
  }
};

const createCard = async (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    const { name, link } = req.body;
    const owner = req.user?._id;
    const card = await Card.create({ name, link, owner });
    return res.status(HttpStatusCode.CREATED).json({ data: card });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(HttpStatusCode.BAD_REQUEST).send({ message: 'Ошибка при вводе данных' });
    }
    return next(error);
  }
};

const removeCard = async (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const cardToDelete = await Card.findById(cardId).orFail();
    if (cardToDelete.owner.toString() !== req.user?._id) {
      throw CustomError.Unauthorized('Вы не можете удалить карточку другого пользователя');
    }
    const deleteCard = await cardToDelete.deleteOne();
    return res.status(HttpStatusCode.NO_CONTENT).json({ data: deleteCard });
  } catch (error) {
    if (error instanceof mongoose.Error.DocumentNotFoundError) {
      return res.status(HttpStatusCode.BAD_REQUEST).send({ message: 'Карточка другого пользователя' });
    }
    if (error instanceof mongoose.Error.CastError) {
      return res.status(HttpStatusCode.BAD_REQUEST).send({ message: 'Не верный ID пользователя' });
    }
    return next(error);
  }
};

const putLike = (req: RequestCustom, res: Response, next: NextFunction) => {
  const handlePutLike = true;
  updateLikeCardMiddleware(req, res, next, handlePutLike);
};

const removeLike = (req: RequestCustom, res: Response, next: NextFunction) => {
  const handlePutLike = false;
  updateLikeCardMiddleware(req, res, next, handlePutLike);
};

export default {
  getCards,
  createCard,
  removeCard,
  putLike,
  removeLike,
};
