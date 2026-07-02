import { Request, Response } from 'express';
import { ClientService } from '../services/ClientService';

const clientService = new ClientService();

export class ClientController {
  async getFavorites(req: Request, res: Response) {
    try {
      const clientId = req.user?.clientProfile?.id;
      if (!clientId) return res.status(403).json({ error: 'Only clients can have favorites' });

      const favorites = await clientService.getFavorites(clientId);
      res.json(favorites);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async addFavorite(req: Request, res: Response) {
    try {
      const clientId = req.user?.clientProfile?.id;
      if (!clientId) return res.status(403).json({ error: 'Only clients can have favorites' });

      const { professionalId } = req.body;
      const favorite = await clientService.addFavorite(clientId, professionalId);
      res.status(201).json(favorite);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async removeFavorite(req: Request, res: Response) {
    try {
      const clientId = req.user?.clientProfile?.id;
      if (!clientId) return res.status(403).json({ error: 'Only clients can have favorites' });

      const { professionalId } = req.params;
      const result = await clientService.removeFavorite(clientId, professionalId);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async addReview(req: Request, res: Response) {
    try {
      const clientId = req.user?.clientProfile?.id;
      if (!clientId) return res.status(403).json({ error: 'Only clients can leave reviews' });

      const review = await clientService.addReview(clientId, req.body);
      res.status(201).json(review);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
