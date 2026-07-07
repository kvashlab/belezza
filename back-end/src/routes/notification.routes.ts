import { Router } from 'express';
import { NotificationController } from '../controllers/NotificationController';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const controller = new NotificationController();

router.use(authMiddleware);

router.get('/', (req, res) => controller.getMyNotifications(req, res));
router.put('/:id/read', (req, res) => controller.markAsRead(req, res));

export default router;
