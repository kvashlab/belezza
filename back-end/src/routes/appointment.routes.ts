import { Router } from 'express';
import { AppointmentController } from '../controllers/AppointmentController';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const controller = new AppointmentController();

// Public route to get slots
router.get('/slots', (req, res) => controller.getAvailableSlots(req, res));

// Protected routes
router.use(authMiddleware);
router.post('/', (req, res) => controller.createAppointment(req, res));
router.get('/me', (req, res) => controller.getMyAppointments(req, res));
router.put('/:id/status', (req, res) => controller.updateStatus(req, res));
router.post('/waitlist', (req, res) => controller.joinWaitlist(req, res));
router.get('/waitlist', (req, res) => controller.getWaitlist(req, res));

export default router;
