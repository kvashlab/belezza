import { Router } from 'express';
import { ReportController } from '../controllers/ReportController';

const router = Router();
const controller = new ReportController();

router.post('/', (req, res) => controller.createReport(req, res));

export default router;
