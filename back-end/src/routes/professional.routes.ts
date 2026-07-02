import { Router } from 'express';
import { ProfessionalController } from '../controllers/ProfessionalController';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const controller = new ProfessionalController();

router.get('/', (req, res) => controller.getProfessionals(req, res));
router.get('/public/:username', (req, res) => controller.getByUsername(req, res));

import { upload } from '../middlewares/upload.middleware';

router.use(authMiddleware);

router.get('/me', (req, res) => controller.getProfile(req, res));
router.put('/me', upload.single('avatar'), (req, res) => controller.updateProfile(req, res));

router.get('/services', (req, res) => controller.getServices(req, res));
router.post('/services', (req, res) => controller.createService(req, res));
router.put('/services/:id', (req, res) => controller.updateService(req, res));
router.delete('/services/:id', (req, res) => controller.deleteService(req, res));

router.put('/working-hours', (req, res) => controller.updateWorkingHours(req, res));

router.get('/me/dashboard', (req, res) => controller.getDashboard(req, res));
router.get('/clients', (req, res) => controller.getClients(req, res));
router.get('/finances', (req, res) => controller.getFinances(req, res));

router.get('/portfolio', (req, res) => controller.getPortfolio(req, res));
router.post('/portfolio', upload.single('photo'), (req, res) => controller.addPortfolioPhoto(req, res));
router.delete('/portfolio/:id', (req, res) => controller.deletePortfolioPhoto(req, res));

router.get('/reviews', (req, res) => controller.getReviews(req, res));

export default router;
