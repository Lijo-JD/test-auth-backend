import { Router } from 'express';

import authMiddleware from '../middlewares/authMiddleware';
import { createPostController, deletePostController, editPostController, getPostsController } from '../controllers/postController';

const router = Router();

router.get('/', authMiddleware, getPostsController);
router.post('/create', authMiddleware, createPostController);
router.put('/update/:editId', authMiddleware, editPostController);
router.delete('/delete/:deleteId', authMiddleware, deletePostController);

export default router;