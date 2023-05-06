import { Router } from 'express';
import cardControllers from '../controllers/cards';
import validation from '../validation/cardValidation';

const router = Router();

router.get('/', cardControllers.getCards);
router.post('/', validation.createCardValidation, cardControllers.createCard);
router.delete('/:cardId', validation.getCardValidation, cardControllers.removeCard);
router.put('/:cardId/likes', validation.getCardValidation, cardControllers.putLike);
router.delete('/:cardId/likes', validation.getCardValidation, cardControllers.removeLike);

export default router;
