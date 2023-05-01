import { Router } from 'express';
import cardControllers from '../controllers/cards';

const router = Router();

router.get('/', cardControllers.getCards);
router.post('/', cardControllers.createCard);
router.delete('/:cardId', cardControllers.removeCard);
router.put('/:cardId/likes', cardControllers.putLike);
router.delete('/:cardId/likes', cardControllers.removeLike);

export default router;
