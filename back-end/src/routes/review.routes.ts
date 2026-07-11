import { Router } from 'express';
import { ReviewController } from '../controllers/ReviewController';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const controller = new ReviewController();

router.use(authMiddleware);

router.post('/', (req, res) => controller.createReview(req, res));

export default router;
