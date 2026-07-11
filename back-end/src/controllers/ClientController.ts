import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { ClientService } from '../services/ClientService';

const clientService = new ClientService();

export class ClientController {
  async getFavorites(req: AuthRequest, res: Response) {
    try {
      const clientId = req.user?.id;
      if (!clientId) return res.status(403).json({ error: 'Only clients can have favorites' });

      const favorites = await clientService.getFavorites(clientId);
      res.json(favorites);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async addFavorite(req: AuthRequest, res: Response) {
    try {
      const clientId = req.user?.id;
      if (!clientId) return res.status(403).json({ error: 'Only clients can have favorites' });

      const { professionalId } = req.body;
      const favorite = await clientService.addFavorite(clientId, professionalId);
      res.status(201).json(favorite);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async removeFavorite(req: AuthRequest, res: Response) {
    try {
      const clientId = req.user?.id;
      if (!clientId) return res.status(403).json({ error: 'Only clients can have favorites' });

      const { professionalId } = req.params;
      const result = await clientService.removeFavorite(clientId, professionalId as string);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

}
