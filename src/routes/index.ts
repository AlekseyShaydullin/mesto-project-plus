import {
  Router,
  NextFunction,
  Request,
  Response,
} from 'express';
import userRouter from './users';
import cardRouter from './cards';

const CustomError = require('../errors/CustomError');

const router = Router();

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use((req: Request, res: Response, next: NextFunction) => {
  next(CustomError.NotFoundError('Страница не найдена'));
});

export default router;
