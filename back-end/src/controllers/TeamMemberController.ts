import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export class TeamMemberController {
  async create(req: Request, res: Response) {
    try {
      const { name, role, avatar } = req.body;
      const professionalId = (req as any).professionalId; // from auth middleware
      
      if (!professionalId) {
        return res.status(403).json({ error: 'Apenas profissionais podem gerenciar equipe.' });
      }

      // Check if PREMIUM plan required (business logic)
      const prof = await prisma.professionalProfile.findUnique({ where: { id: professionalId } });
      if (prof?.plan !== 'PREMIUM') {
        return res.status(403).json({ error: 'Funcionalidade exclusiva para assinantes PREMIUM.' });
      }

      const teamMember = await prisma.teamMember.create({
        data: {
          professionalId,
          name,
          role,
          avatar
        }
      });

      // Automatically create default working hours for the new member
      const defaultHours = [];
      for (let day = 1; day <= 5; day++) { // Monday to Friday
        defaultHours.push({
          professionalId,
          teamMemberId: teamMember.id,
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '18:00',
          isOpen: true
        });
      }
      
      await prisma.workingHour.createMany({
        data: defaultHours
      });

      return res.status(201).json(teamMember);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const professionalId = (req as any).professionalId;
      if (!professionalId) {
        return res.status(403).json({ error: 'Apenas profissionais podem listar equipe.' });
      }

      const teamMembers = await prisma.teamMember.findMany({
        where: { professionalId },
        include: {
          workingHours: true
        }
      });

      return res.json(teamMembers);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const professionalId = (req as any).professionalId;
      const id = req.params.id as string;
      
      if (!professionalId) {
        return res.status(403).json({ error: 'Não autorizado.' });
      }

      await prisma.teamMember.delete({
        where: { id, professionalId }
      });

      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async updateWorkingHours(req: Request, res: Response) {
    try {
      const professionalId = (req as any).professionalId;
      const id = req.params.id as string; // teamMemberId
      const { workingHours } = req.body;

      if (!professionalId) {
        return res.status(403).json({ error: 'Não autorizado.' });
      }

      // First check if the member belongs to the professional
      const member = await prisma.teamMember.findFirst({
        where: { id, professionalId }
      });

      if (!member) {
        return res.status(404).json({ error: 'Membro não encontrado.' });
      }

      // Delete old working hours and create new ones
      await prisma.workingHour.deleteMany({
        where: { teamMemberId: id, professionalId }
      });

      const dataToInsert = workingHours.map((wh: any) => ({
        professionalId,
        teamMemberId: id,
        dayOfWeek: wh.dayOfWeek,
        startTime: wh.startTime,
        endTime: wh.endTime,
        isOpen: wh.isOpen
      }));

      await prisma.workingHour.createMany({
        data: dataToInsert
      });

      return res.json({ message: 'Horários atualizados com sucesso.' });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
