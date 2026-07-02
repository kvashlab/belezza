import { Router } from 'express';
import { ClientController } from '../controllers/ClientController';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const clientController = new ClientController();

router.use(authMiddleware);

router.get('/favorites', (req, res) => clientController.getFavorites(req, res));
router.post('/favorites', (req, res) => clientController.addFavorite(req, res));
router.delete('/favorites/:professionalId', (req, res) => clientController.removeFavorite(req, res));

router.post('/reviews', (req, res) => clientController.addReview(req, res));

export default router;
