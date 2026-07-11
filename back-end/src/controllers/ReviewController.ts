import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/auth.middleware';
import { ReviewService } from '../services/ReviewService';

const reviewService = new ReviewService();

const createReviewSchema = z.object({
  appointmentId: z.string().uuid(),
  rating: z.number().int().min(0).max(5),
  comment: z.string().optional(),
});

export class ReviewController {
  async createReview(req: AuthRequest, res: Response) {
    try {
      if (!req.user || req.user.role !== 'CLIENT') {
        return res.status(403).json({ error: 'Acesso negado. Apenas clientes podem avaliar.' });
      }

      const { appointmentId, rating, comment } = createReviewSchema.parse(req.body);

      const review = await reviewService.createReview(req.user.id, appointmentId, rating, comment);
      
      res.status(201).json(review);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const zodErr = error as any;
        return res.status(400).json({ error: zodErr.errors.map((e: any) => e.message).join(', ') });
      }
      res.status(400).json({ error: error.message });
    }
  }
}
