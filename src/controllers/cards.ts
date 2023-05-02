import mongoose from 'mongoose';
import { NextFunction, Request, Response } from 'express';
import Card from '../models/card';
import { RequestCustom } from '../utils/type';
import HttpStatusCode from '../utils/constants';

const CustomError = require('../errors/CustomError');

const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    return res.status(HttpStatusCode.OK).send({ data: cards });
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
    return res.status(HttpStatusCode.NO_CONTENT).json({ data: cardToDelete });
  } catch (error) {
    if (error instanceof mongoose.Error.DocumentNotFoundError) {
      return res.status(HttpStatusCode.BAD_REQUEST).send({ message: 'Карточка другого пользователя' });
    }
    return next(error);
  }
};

const putLike = async (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const id = req.user?._id;

    if (!cardId) {
      throw CustomError.BadRequest('Нет такой карточки');
    }

    const card = await Card.findByIdAndUpdate(cardId, {
      $addToSet: {
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

const removeLike = async (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const id = req.user?._id;

    if (!cardId) {
      throw CustomError.BadRequest('Не корректные данные');
    }

    const card = await Card.findByIdAndUpdate(cardId, {
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
    return res.status(HttpStatusCode.NO_CONTENT).json({ data: card });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(HttpStatusCode.BAD_REQUEST).send({ message: 'Не верный ID карточки' });
    }
    return next(error);
  }
};

export default {
  getCards,
  createCard,
  removeCard,
  putLike,
  removeLike,
};
