import { NextFunction, Request, Response } from 'express';
import Card from '../models/card';
import Errors from '../errors/errors';
import { RequestCustom } from '../utils/type';
import CODE from '../utils/constants';

const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    return res.status(CODE.OK).send({ data: cards });
  } catch (error) {
    console.error(error);
    return next(Errors.internalError('На сервере произошла ошибка'));
  }
};

const createCard = async (req: RequestCustom, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const owner = req.user?._id;

  if (!name || !link || !owner) {
    return next(Errors.badRequestError('Не верные данные пользователя'));
  }

  try {
    const card = await Card.create({ name, link, owner }); /* owner = { user } */
    return res.status(CODE.CREATED).json({ data: card });
  } catch (error) {
    console.error(error);
    return next(Errors.internalError('На сервере произошла ошибка'));
  }
};

const removeCard = async (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;

  try {
    const card = await Card.findByIdAndRemove(cardId);
    if (!card) {
      return next(Errors.authorizationError('Вы не можете удалить карточку другого пользователя'));
    }
    return res.status(CODE.NO_CONTENT).json({ data: card });
  } catch (error) {
    console.error(error);
    return next(Errors.internalError('На сервере произошла ошибка'));
  }
};

const putLike = async (req: RequestCustom, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const id = req.user?._id;

  if (!cardId) {
    return next(Errors.badRequestError('Не верные данные пользователя'));
  }

  try {
    const card = await Card.findByIdAndUpdate(cardId, {
      $addToSet: {
        likes: id,
      },
    }, {
      new: true,
      runValidators: true,
    }); /* owner = { user } */
    if (!card) {
      return next(Errors.notFoundError('Карточка не найдена'));
    }
    return res.status(CODE.CREATED).json({ data: card });
  } catch (error) {
    console.error(error);
    return next(Errors.internalError('На сервере произошла ошибка'));
  }
};

const removeLike = async (req: RequestCustom, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const id = req.user?._id;

  if (!cardId) {
    return next(Errors.badRequestError('Не верные данные пользователя'));
  }

  try {
    const card = await Card.findByIdAndUpdate(cardId, {
      $pull: {
        likes: id,
      },
    }, {
      new: true,
      runValidators: true,
    });
    if (!card) {
      return next(Errors.notFoundError('Карточка не найдена'));
    }
    return res.status(CODE.NO_CONTENT).json({ data: card });
  } catch (error) {
    console.error(error);
    return next(Errors.internalError('На сервере произошла ошибка'));
  }
};

export default {
  getCards,
  createCard,
  removeCard,
  putLike,
  removeLike,
};
