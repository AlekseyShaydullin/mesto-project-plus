import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import secretKey from '../utils/keys';

const CustomError = require('../errors/CustomError');

interface IAuthReq extends Request {
  user?: string | JwtPayload
}

const authMiddleware = (req: IAuthReq, res: Response, next: NextFunction) => {
  const { authorization } = req.body;

  if (!authorization || !authorization.startWith('Bearer ')) {
    throw CustomError.Unauthorized('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, process.env.TOKEN_ENV as string || secretKey);
  } catch (error) {
    throw CustomError.Unauthorized('Необходима авторизация');
  }
  req.user = payload as { _id: JwtPayload};
  next();
};

export default authMiddleware;
