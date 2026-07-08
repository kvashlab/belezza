import { Request, Response } from 'express';
import { AppointmentService } from '../services/AppointmentService';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/auth.middleware';

const appointmentService = new AppointmentService();

const createAppointmentSchema = z.object({
  professionalId: z.string().uuid(),
  serviceId: z.string().uuid(),
  dateTime: z.string(), // ISO string
  notes: z.string().optional(),
  teamMemberId: z.string().uuid().optional(),
  clientName: z.string().optional(),
});

export class AppointmentController {
  async getAvailableSlots(req: Request, res: Response) {
    try {
      const { professionalId, serviceId, date, teamMemberId } = req.query;
      
      if (!professionalId || !serviceId || !date) {
        return res.status(400).json({ error: 'Parâmetros ausentes' });
      }

      const slots = await appointmentService.getAvailableSlots(
        professionalId as string,
        serviceId as string,
        date as string,
        teamMemberId as string | undefined
      );
      
      res.json(slots);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async createAppointment(req: AuthRequest, res: Response) {
    try {
      const { prisma } = require('../config/prisma');
      const data = createAppointmentSchema.parse(req.body);
      
      let clientId: string | undefined = undefined;

      if (req.user?.role === 'CLIENT') {
        const clientProfile = await prisma.clientProfile.findUnique({
          where: { userId: req.user.id }
        });
        if (!clientProfile) return res.status(400).json({ error: 'Perfil de cliente não encontrado.' });
        clientId = clientProfile.id;
      } else if (req.user?.role === 'PROFESSIONAL') {
        const professionalProfile = await prisma.professionalProfile.findUnique({
          where: { userId: req.user.id }
        });
        if (!professionalProfile) return res.status(400).json({ error: 'Perfil profissional não encontrado.' });
        
        // Ensure the professional is scheduling for themselves
        if (professionalProfile.id !== data.professionalId) {
          return res.status(403).json({ error: 'Você só pode criar agendamentos para sua própria agenda.' });
        }
        
        if (!data.clientName) {
          return res.status(400).json({ error: 'Nome do cliente é obrigatório para agendamentos manuais.' });
        }
      } else {
        return res.status(403).json({ error: 'Acesso negado.' });
      }
      
      const appointment = await appointmentService.createAppointment(
        clientId,
        data.professionalId,
        data.serviceId,
        data.dateTime,
        data.notes,
        data.teamMemberId,
        data.clientName
      );
      
      res.status(201).json(appointment);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: (error as any).errors.map((e: any) => e.message).join(', ') });
      }
      res.status(400).json({ error: error.message });
    }
  }

  async getMyAppointments(req: AuthRequest, res: Response) {
    try {
      const { prisma } = require('../config/prisma');
      
      if (req.user?.role === 'CLIENT') {
        const profile = await prisma.clientProfile.findUnique({ where: { userId: req.user.id } });
        if (!profile) return res.json([]);
        const appts = await appointmentService.getClientAppointments(profile.id);
        return res.json(appts);
      } 
      
      if (req.user?.role === 'PROFESSIONAL') {
        const profile = await prisma.professionalProfile.findUnique({ where: { userId: req.user.id } });
        if (!profile) return res.json([]);
        const appts = await appointmentService.getProfessionalAppointments(profile.id);
        return res.json(appts);
      }
      
      res.status(403).json({ error: 'Papel não suportado' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateStatus(req: AuthRequest, res: Response) {
    try {
      const { prisma } = require('../config/prisma');
      const { id } = req.params;
      const status = req.body.status as string;

      // Validate status value
      const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Status inválido.' });
      }

      // Fetch the appointment to verify ownership
      const appointment = await prisma.appointment.findUnique({
        where: { id },
        include: {
          client: true,
          professional: true,
        }
      });

      if (!appointment) {
        return res.status(404).json({ error: 'Agendamento não encontrado.' });
      }

      // Ownership check: only the professional or the booked client can update
      if (req.user?.role === 'PROFESSIONAL') {
        const professionalProfile = await prisma.professionalProfile.findUnique({
          where: { userId: req.user.id }
        });
        if (!professionalProfile || appointment.professionalId !== professionalProfile.id) {
          return res.status(403).json({ error: 'Acesso negado. Este agendamento não pertence a você.' });
        }
      } else if (req.user?.role === 'CLIENT') {
        const clientProfile = await prisma.clientProfile.findUnique({
          where: { userId: req.user.id }
        });
        if (!clientProfile || appointment.clientId !== clientProfile.id) {
          return res.status(403).json({ error: 'Acesso negado.' });
        }
        // Clients can only cancel their own appointments
        if (status !== 'CANCELLED') {
          return res.status(403).json({ error: 'Clientes só podem cancelar agendamentos.' });
        }
      } else {
        return res.status(403).json({ error: 'Acesso negado.' });
      }

      const appt = await appointmentService.updateAppointmentStatus(id as string, status);
      res.json(appt);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async joinWaitlist(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== 'CLIENT') {
        return res.status(403).json({ error: 'Apenas clientes podem entrar na fila.' });
      }
      const { prisma } = require('../config/prisma');
      const clientProfile = await prisma.clientProfile.findUnique({
        where: { userId: req.user.id }
      });
      if (!clientProfile) return res.status(400).json({ error: 'Perfil de cliente não encontrado.' });

      const { professionalId, date } = req.body;
      if (!professionalId || !date) return res.status(400).json({ error: 'Parâmetros ausentes' });

      const waitlist = await appointmentService.joinWaitlist(clientProfile.id, professionalId, date);
      res.json(waitlist);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getWaitlist(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== 'PROFESSIONAL') {
        return res.status(403).json({ error: 'Apenas profissionais podem ver a fila.' });
      }
      const { prisma } = require('../config/prisma');
      const professionalProfile = await prisma.professionalProfile.findUnique({
        where: { userId: req.user.id }
      });
      if (!professionalProfile) return res.status(400).json({ error: 'Perfil não encontrado.' });

      const { date } = req.query;
      if (!date) return res.status(400).json({ error: 'Parâmetro date ausente' });

      const waitlist = await appointmentService.getWaitlist(professionalProfile.id, date as string);
      res.json(waitlist);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
