import { NextFunction, Request, Response } from 'express';
import { IError } from '../errors/CustomError';

// eslint-disable-next-line no-unused-vars
const errorsMiddleware = (err: IError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
};

export default errorsMiddleware;
