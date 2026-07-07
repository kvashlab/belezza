import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const router = Router();
const authController = new AuthController();

// Fix context issues with bind or arrow functions
router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.post('/google', (req, res) => authController.googleLogin(req, res));
router.post('/sync-user', (req, res) => authController.syncUser(req, res));

export default router;
