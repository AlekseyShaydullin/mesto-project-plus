import { Router } from 'express';
import usersControllers from '../controllers/users';
import validation from '../validation/userValidation';

const router = Router();

router.get('/', usersControllers.getUsers);
router.get('/:id', validation.getUserByIdValidation, usersControllers.getUserById);
router.get('/me', usersControllers.getUserInfo);
router.patch('/me', validation.updateUserValidation, usersControllers.updateUser);
router.patch('/me/avatar', validation.updateAvatarValidation, usersControllers.updateAvatar);

export default router;
