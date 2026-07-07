import { Response } from 'express';
import { NotificationService } from '../services/NotificationService';
import { AuthRequest } from '../middlewares/auth.middleware';

const notificationService = new NotificationService();

export class NotificationController {
  async getMyNotifications(req: AuthRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Não autenticado' });
      const notifications = await notificationService.getNotifications(req.user.id);
      res.json(notifications);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async markAsRead(req: AuthRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Não autenticado' });
      const updated = await notificationService.markAsRead(req.user.id, req.params.id);
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
