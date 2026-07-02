import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { UserService } from '../services/UserService';

const userService = new UserService();

export class UserController {
  async getMe(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id; // Assuming authMiddleware sets req.user
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const user = await userService.getMe(userId);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateMe(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      let avatarUrl = req.body.avatar;
      if (req.file) {
        const { uploadFileToSupabase } = require('../config/supabase');
        avatarUrl = await uploadFileToSupabase(req.file, `avatars/client_${userId}_${Date.now()}.jpg`);
      }

      const bodyData = { ...req.body };
      if (avatarUrl) bodyData.avatar = avatarUrl;

      const user = await userService.updateMe(userId, bodyData);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async changePassword(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const result = await userService.changePassword(userId, req.body);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async addAddress(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const address = await userService.addAddress(userId, req.body);
      res.status(201).json(address);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async removeAddress(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const { id } = req.params;
      const result = await userService.removeAddress(userId, id as string);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
