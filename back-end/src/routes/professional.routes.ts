import { Router } from 'express';
import { ProfessionalController } from '../controllers/ProfessionalController';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const controller = new ProfessionalController();

router.get('/', (req, res) => controller.getProfessionals(req, res));
router.get('/public/:username', (req, res) => controller.getByUsername(req, res));

router.use(authMiddleware);

router.get('/me', (req, res) => controller.getProfile(req, res));
router.put('/me', (req, res) => controller.updateProfile(req, res));

router.get('/services', (req, res) => controller.getServices(req, res));
router.post('/services', (req, res) => controller.createService(req, res));
router.put('/services/:id', (req, res) => controller.updateService(req, res));
router.delete('/services/:id', (req, res) => controller.deleteService(req, res));

router.put('/working-hours', (req, res) => controller.updateWorkingHours(req, res));

export default router;
