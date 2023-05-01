import { Router } from 'express';
import cardControllers from '../controllers/cards';

const router = Router();

router.get('/', cardControllers.getCards);
router.post('/', cardControllers.createCard);

export default router;