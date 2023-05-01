import { NextFunction, Request, Response } from 'express';
import Card from '../models/card';
import Errors from '../errors/errors';
import { RequestCustom } from '../type';

const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({});
    return res.status(200).send({ data: cards });
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
    const card = await Card.create({ name, link, owner });
    return res.status(201).json({ data: card });
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
    return res.status(204).json({ data: card });
  } catch (error) {
    console.error(error);
    return next(Errors.internalError('На сервере произошла ошибка'));
  }
};

export default { getCards, createCard, removeCard };