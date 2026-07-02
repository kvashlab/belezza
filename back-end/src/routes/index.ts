import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import professionalRoutes from './professional.routes';
import appointmentRoutes from './appointment.routes';
import clientRoutes from './client.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/clients', clientRoutes);
router.use('/professionals', professionalRoutes);
router.use('/appointments', appointmentRoutes);

export default router;
