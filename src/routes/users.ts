import { Router } from 'express';
import usersControllers from '../controllers/users';

const router = Router();

router.get('/', usersControllers.getUsers);
router.get('/:id', usersControllers.getUserById);
router.get('/me', usersControllers.getUserInfo);
router.patch('/me', usersControllers.updateUser);
router.patch('/me/avatar', usersControllers.updateAvatar);

export default router;
