import { Router } from 'express';
import { createCategory, deleteCategory } from '../controllers/categoryController';

const router = Router();

router.route('/').post(createCategory);
router.route('/:id').delete(deleteCategory);

export default router;