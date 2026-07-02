import { Router } from 'express';
import { TeamMemberController } from '../controllers/TeamMemberController';
import { authMiddleware } from '../middlewares/auth.middleware';
import { professionalMiddleware } from '../middlewares/professional.middleware';

const router = Router();
const teamController = new TeamMemberController();

router.use(authMiddleware);
router.use(professionalMiddleware); // only professionals can access these routes

router.post('/', teamController.create);
router.get('/', teamController.list);
router.delete('/:id', teamController.delete);
router.put('/:id/working-hours', teamController.updateWorkingHours);

export default router;
