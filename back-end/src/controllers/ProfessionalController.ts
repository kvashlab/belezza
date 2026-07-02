import { Request, Response } from 'express';
import { ProfessionalService } from '../services/ProfessionalService';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/auth.middleware';

const professionalService = new ProfessionalService();

const updateProfileSchema = z.object({
  businessName: z.string().optional(),
  avatar: z.string().optional(),
  coverImage: z.string().optional(),
  bio: z.string().optional(),
  categories: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  neighborhood: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  serviceLocation: z.enum(['no_local', 'domicilio', 'ambos']).optional(),
  socialLinks: z.string().optional(),
  requireDeposit: z.boolean().optional(),
});

const serviceSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().min(0),
  duration: z.number().min(1),
  category: z.string(),
});

const workingHoursSchema = z.array(z.object({
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string(),
  endTime: z.string(),
  isOpen: z.boolean(),
}));

export class ProfessionalController {
  async getProfile(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== 'PROFESSIONAL') {
        return res.status(403).json({ error: 'Acesso negado.' });
      }
      const profile = await professionalService.getProfile(req.user.id);
      res.json(profile);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getProfessionals(req: Request, res: Response) {
    try {
      const professionals = await professionalService.getProfessionals(req.query);
      res.json(professionals);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getByUsername(req: Request, res: Response) {
    try {
      const profile = await professionalService.getProfessionalByUsername(req.params.username as string);
      if (!profile) return res.status(404).json({ error: 'Profissional não encontrado' });
      res.json(profile);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateProfile(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== 'PROFESSIONAL') return res.status(403).json({ error: 'Acesso negado.' });
      const data = updateProfileSchema.parse(req.body);
      const updated = await professionalService.updateProfile(req.user.id, data);
      res.json(updated);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors.map(e => e.message).join(', ') });
      }
      res.status(400).json({ error: error.message });
    }
  }

  async createService(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== 'PROFESSIONAL') return res.status(403).json({ error: 'Acesso negado.' });
      const data = serviceSchema.parse(req.body);
      const service = await professionalService.createService(req.user.id, data);
      res.status(201).json(service);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors.map(e => e.message).join(', ') });
      }
      res.status(400).json({ error: error.message });
    }
  }

  async getServices(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== 'PROFESSIONAL') return res.status(403).json({ error: 'Acesso negado.' });
      const services = await professionalService.getServices(req.user.id);
      res.json(services);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateService(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== 'PROFESSIONAL') return res.status(403).json({ error: 'Acesso negado.' });
      const data = serviceSchema.partial().parse(req.body);
      const serviceId = req.params.id as string;
      const updated = await professionalService.updateService(req.user.id, serviceId, data);
      res.json(updated);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors.map(e => e.message).join(', ') });
      }
      res.status(400).json({ error: error.message });
    }
  }

  async deleteService(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== 'PROFESSIONAL') return res.status(403).json({ error: 'Acesso negado.' });
      const serviceId = req.params.id as string;
      await professionalService.deleteService(req.user.id, serviceId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateWorkingHours(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== 'PROFESSIONAL') return res.status(403).json({ error: 'Acesso negado.' });
      const hours = workingHoursSchema.parse(req.body);
      const updated = await professionalService.updateWorkingHours(req.user.id, hours);
      res.json(updated);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors.map(e => e.message).join(', ') });
      }
      res.status(400).json({ error: error.message });
    }
  }
  async getDashboard(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== 'PROFESSIONAL') return res.status(403).json({ error: 'Acesso negado.' });
      const metrics = await professionalService.getDashboardMetrics(req.user.id);
      res.json(metrics);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getClients(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== 'PROFESSIONAL') return res.status(403).json({ error: 'Acesso negado.' });
      const clients = await professionalService.getClients(req.user.id);
      res.json(clients);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getFinances(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== 'PROFESSIONAL') return res.status(403).json({ error: 'Acesso negado.' });
      // In a real app we'd aggregate finance data. Let's return basic data or metrics for now.
      const metrics = await professionalService.getDashboardMetrics(req.user.id);
      res.json({
        totalRevenue: metrics.revenueToday * 30, // Mock for now
        monthlyRevenue: metrics.revenueToday * 30,
        transactions: []
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getPortfolio(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== 'PROFESSIONAL') return res.status(403).json({ error: 'Acesso negado.' });
      const portfolio = await professionalService.getPortfolio(req.user.id);
      res.json(portfolio);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async addPortfolioPhoto(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== 'PROFESSIONAL') return res.status(403).json({ error: 'Acesso negado.' });
      const photo = await professionalService.addPortfolioPhoto(req.user.id, req.body);
      res.status(201).json(photo);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deletePortfolioPhoto(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== 'PROFESSIONAL') return res.status(403).json({ error: 'Acesso negado.' });
      await professionalService.deletePortfolioPhoto(req.user.id, req.params.id as string);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getReviews(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== 'PROFESSIONAL') return res.status(403).json({ error: 'Acesso negado.' });
      const reviews = await professionalService.getReviews(req.user.id);
      res.json(reviews);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
