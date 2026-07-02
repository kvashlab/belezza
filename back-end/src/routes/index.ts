import { Router } from 'express';
import authRoutes from './auth.routes';
import professionalRoutes from './professional.routes';
import appointmentRoutes from './appointment.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/professionals', professionalRoutes);
router.use('/appointments', appointmentRoutes);

export default router;
