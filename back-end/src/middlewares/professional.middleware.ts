import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { prisma } from '../config/prisma';

export const professionalMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user || req.user.role !== 'PROFESSIONAL') {
      return res.status(403).json({ error: 'Apenas profissionais podem acessar este recurso.' });
    }

    const professional = await prisma.professionalProfile.findUnique({
      where: { userId: req.user.id }
    });

    if (!professional) {
      return res.status(403).json({ error: 'Perfil profissional não encontrado.' });
    }

    (req as any).professionalId = professional.id;
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Erro de autenticação profissional.' });
  }
};
