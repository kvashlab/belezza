import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import professionalRoutes from './professional.routes';
import appointmentRoutes from './appointment.routes';
import clientRoutes from './client.routes';
import teamRoutes from './team.routes';
import notificationRoutes from './notification.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/clients', clientRoutes);
router.use('/professionals', professionalRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/team', teamRoutes);
router.use('/notifications', notificationRoutes);

export default router;
