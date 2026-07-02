import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const userController = new UserController();

// Apply auth middleware to all user routes
router.use(authMiddleware);

router.get('/me', (req, res) => userController.getMe(req, res));
router.put('/me', (req, res) => userController.updateMe(req, res));
router.put('/me/password', (req, res) => userController.changePassword(req, res));

router.post('/me/addresses', (req, res) => userController.addAddress(req, res));
router.delete('/me/addresses/:id', (req, res) => userController.removeAddress(req, res));

export default router;
