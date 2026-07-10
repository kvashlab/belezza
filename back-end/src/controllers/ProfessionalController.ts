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

  async checkUsername(req: Request, res: Response) {
    try {
      const { username } = req.query;
      if (!username || typeof username !== 'string') {
        return res.status(400).json({ error: 'Username é obrigatório' });
      }
      const isAvailable = await professionalService.checkUsernameAvailability(username);
      res.json({ available: isAvailable });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async changeUsername(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== 'PROFESSIONAL') return res.status(403).json({ error: 'Acesso negado.' });
      
      const { newUsername } = req.body;
      if (!newUsername || typeof newUsername !== 'string') {
        return res.status(400).json({ error: 'Novo username é obrigatório' });
      }
      
      const updatedProfile = await professionalService.changeUsername(req.user.id, newUsername);
      res.json(updatedProfile);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateProfile(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== 'PROFESSIONAL') return res.status(403).json({ error: 'Acesso negado.' });
      
      let avatarUrl = req.body.avatar || undefined;
      let coverUrl = req.body.coverImage || undefined;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

      // Upload images independently — a Supabase failure must NOT block the text fields save
      if (files?.['avatar']?.[0]) {
        try {
          const { uploadFileToSupabase } = require('../config/supabase');
          avatarUrl = await uploadFileToSupabase(files['avatar'][0], `avatars/prof_${req.user.id}_${Date.now()}.jpg`);
        } catch (uploadErr: any) {
          console.error('[updateProfile] Avatar upload failed:', uploadErr.message);
          return res.status(400).json({ error: `Falha ao enviar foto de perfil: ${uploadErr.message}` });
        }
      }
      if (files?.['coverImage']?.[0]) {
        try {
          const { uploadFileToSupabase } = require('../config/supabase');
          coverUrl = await uploadFileToSupabase(files['coverImage'][0], `covers/prof_${req.user.id}_${Date.now()}.jpg`);
        } catch (uploadErr: any) {
          console.error('[updateProfile] Cover upload failed:', uploadErr.message);
          return res.status(400).json({ error: `Falha ao enviar foto de capa: ${uploadErr.message}` });
        }
      }

      // Build the data object — FormData sends everything as strings, so we coerce types manually
      const rawBody = req.body || {};

      const dataToUpdate: Record<string, any> = {};

      if (rawBody.businessName !== undefined) dataToUpdate.businessName = String(rawBody.businessName);
      if (rawBody.bio !== undefined) dataToUpdate.bio = String(rawBody.bio);
      if (rawBody.categories !== undefined) dataToUpdate.categories = String(rawBody.categories);
      if (rawBody.city !== undefined) dataToUpdate.city = String(rawBody.city);
      if (rawBody.state !== undefined) dataToUpdate.state = String(rawBody.state);
      if (rawBody.neighborhood !== undefined) dataToUpdate.neighborhood = String(rawBody.neighborhood);
      if (rawBody.socialLinks !== undefined) dataToUpdate.socialLinks = String(rawBody.socialLinks);
      if (rawBody.serviceLocation !== undefined) dataToUpdate.serviceLocation = String(rawBody.serviceLocation);
      if (rawBody.lat !== undefined && rawBody.lat !== '') dataToUpdate.lat = parseFloat(rawBody.lat);
      if (rawBody.lng !== undefined && rawBody.lng !== '') dataToUpdate.lng = parseFloat(rawBody.lng);
      if (rawBody.requireDeposit !== undefined) {
        dataToUpdate.requireDeposit = String(rawBody.requireDeposit) === 'true';
      }

      // Attach uploaded image URLs if available
      if (avatarUrl) dataToUpdate.avatar = avatarUrl;
      if (coverUrl) dataToUpdate.coverImage = coverUrl;

      const updated = await professionalService.updateProfile(req.user.id, dataToUpdate);
      res.json(updated);
    } catch (error: any) {
      console.error('[updateProfile] Error:', error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async createService(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== 'PROFESSIONAL') return res.status(403).json({ error: 'Acesso negado.' });
      
      let imageUrl = undefined;
      if (req.file) {
        const { uploadFileToSupabase } = require('../config/supabase');
        imageUrl = await uploadFileToSupabase(req.file, `services/prof_${req.user.id}_${Date.now()}.jpg`);
      }

      const rawBody = req.body || {};
      const parsedData = serviceSchema.parse({
        name: rawBody.name,
        description: rawBody.description,
        price: parseFloat(rawBody.price),
        duration: parseInt(rawBody.duration, 10),
        category: rawBody.category,
      });

      const finalData = { ...parsedData, imageUrl };
      const service = await professionalService.createService(req.user.id, finalData);
      res.status(201).json(service);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: (error as any).errors.map((e: any) => e.message).join(', ') });
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
      
      let imageUrl = undefined;
      if (req.file) {
        const { uploadFileToSupabase } = require('../config/supabase');
        imageUrl = await uploadFileToSupabase(req.file, `services/prof_${req.user.id}_${Date.now()}.jpg`);
      }

      const rawBody = req.body || {};
      const objectToValidate: any = {};
      if (rawBody.name) objectToValidate.name = rawBody.name;
      if (rawBody.description !== undefined) objectToValidate.description = rawBody.description;
      if (rawBody.price) objectToValidate.price = parseFloat(rawBody.price);
      if (rawBody.duration) objectToValidate.duration = parseInt(rawBody.duration, 10);
      if (rawBody.category) objectToValidate.category = rawBody.category;

      const data = serviceSchema.partial().parse(objectToValidate);
      const finalData: any = { ...data };
      if (imageUrl) finalData.imageUrl = imageUrl;
      // If user sends 'null' or empty string as imageUrl explicitly, we clear it (for deletion)
      if (rawBody.imageUrl === 'null' || rawBody.imageUrl === '') {
        finalData.imageUrl = null;
      }

      const serviceId = req.params.id as string;
      const updated = await professionalService.updateService(req.user.id, serviceId, finalData);
      res.json(updated);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: (error as any).errors.map((e: any) => e.message).join(', ') });
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
        return res.status(400).json({ error: (error as any).errors.map((e: any) => e.message).join(', ') });
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

  async createCustomer(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== 'PROFESSIONAL') return res.status(403).json({ error: 'Acesso negado.' });
      const customer = await professionalService.createCustomer(req.user.id, req.body);
      res.status(201).json(customer);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateCustomer(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== 'PROFESSIONAL') return res.status(403).json({ error: 'Acesso negado.' });
      const customerId = req.params.id as string;
      const customer = await professionalService.updateCustomer(req.user.id, customerId, req.body);
      res.json(customer);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteCustomer(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== 'PROFESSIONAL') return res.status(403).json({ error: 'Acesso negado.' });
      const customerId = req.params.id as string;
      const result = await professionalService.deleteCustomer(req.user.id, customerId);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getFinances(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== 'PROFESSIONAL') return res.status(403).json({ error: 'Acesso negado.' });
      const finances = await professionalService.getFinances(req.user.id);
      res.json(finances);
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
      
      let photoUrl = req.body.url;
      if (req.file) {
        const { uploadFileToSupabase } = require('../config/supabase');
        photoUrl = await uploadFileToSupabase(req.file, `portfolio/prof_${req.user.id}_${Date.now()}.jpg`);
      }
      if (!photoUrl) return res.status(400).json({ error: 'Nenhuma foto fornecida.' });

      const bodyData = { ...req.body, url: photoUrl };
      if (bodyData.isBeforeAfter !== undefined) bodyData.isBeforeAfter = bodyData.isBeforeAfter === 'true';

      const photo = await professionalService.addPortfolioPhoto(req.user.id, bodyData);
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

  async upgradePlan(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const updatedProfile = await professionalService.upgradePlan(userId);
      res.json({ message: 'Plano atualizado para Premium com sucesso!', profile: updatedProfile });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

