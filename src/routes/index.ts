import {
  Router,
  NextFunction,
  Request,
  Response,
} from 'express';
import Errors from '../errors/errors';
import userRouter from './users';
import cardRouter from './cards';

const router = Router();

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use((req: Request, res: Response, next: NextFunction) => {
  next(Errors.notFoundError('Страница не найдена'));
});

export default router;
