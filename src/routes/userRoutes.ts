import { Router } from 'express';

import { changePasswordController, loginController, registerUserController } from '../controllers/userController';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', registerUserController);
router.post('/login', loginController);
router.put('/change-password', authMiddleware, changePasswordController);

export default router;