import { Router } from 'express';
import { ProfessionalController } from '../controllers/ProfessionalController';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const controller = new ProfessionalController();

router.get('/', (req, res) => controller.getProfessionals(req, res));
router.get('/public/:username', (req, res) => controller.getByUsername(req, res));
router.get('/check-username', (req, res) => controller.checkUsername(req, res));

import { upload } from '../middlewares/upload.middleware';

router.use(authMiddleware);

router.get('/me', (req, res) => controller.getProfile(req, res));
router.put('/me', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }]), (req, res) => controller.updateProfile(req, res));
router.put('/me/username', (req, res) => controller.changeUsername(req, res));

router.get('/services', (req, res) => controller.getServices(req, res));
router.post('/services', upload.single('image'), (req, res) => controller.createService(req, res));
router.put('/services/:id', upload.single('image'), (req, res) => controller.updateService(req, res));
router.delete('/services/:id', (req, res) => controller.deleteService(req, res));

router.put('/working-hours', (req, res) => controller.updateWorkingHours(req, res));

router.get('/me/dashboard', (req, res) => controller.getDashboard(req, res));
router.get('/clients', (req, res) => controller.getClients(req, res));
router.post('/customers', (req, res) => controller.createCustomer(req, res));
router.put('/customers/:id', (req, res) => controller.updateCustomer(req, res));
router.delete('/customers/:id', (req, res) => controller.deleteCustomer(req, res));
router.get('/finances', (req, res) => controller.getFinances(req, res));

router.get('/portfolio', (req, res) => controller.getPortfolio(req, res));
router.post('/portfolio', upload.single('photo'), (req, res) => controller.addPortfolioPhoto(req, res));
router.delete('/portfolio/:id', (req, res) => controller.deletePortfolioPhoto(req, res));

router.get('/reviews', (req, res) => controller.getReviews(req, res));

router.get('/custom-slots', (req, res) => controller.getCustomSlots(req, res));
router.post('/custom-slots', (req, res) => controller.createCustomSlot(req, res));
router.delete('/custom-slots/:id', (req, res) => controller.deleteCustomSlot(req, res));

router.post('/upgrade', (req, res) => controller.upgradePlan(req, res));

export default router;
