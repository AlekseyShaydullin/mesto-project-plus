import { Router } from 'express';
import usersControllers from '../controllers/users';

const router = Router();

router.get('/', usersControllers.getUsers);
router.get('/:id', usersControllers.getUserById);
router.post('/', usersControllers.createUser);

export default router;