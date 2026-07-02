import { prisma } from '../config/prisma';
import { addMinutes, parse, format, isBefore, isAfter, isEqual } from 'date-fns';
import { NotificationService } from './NotificationService';

const notificationService = new NotificationService();

export class AppointmentService {
  async getAvailableSlots(professionalId: string, serviceId: string, date: string, teamMemberId?: string) {
    // date format: YYYY-MM-DD
    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getUTCDay();

    const workingHourWhere = teamMemberId 
      ? { professionalId, teamMemberId, dayOfWeek, isOpen: true }
      : { professionalId, teamMemberId: null, dayOfWeek, isOpen: true };

    const appointmentWhere = teamMemberId
      ? { professionalId, teamMemberId, date: { gte: new Date(`${date}T00:00:00.000Z`), lt: new Date(`${date}T23:59:59.999Z`) }, status: { not: 'CANCELLED' } }
      : { professionalId, teamMemberId: null, date: { gte: new Date(`${date}T00:00:00.000Z`), lt: new Date(`${date}T23:59:59.999Z`) }, status: { not: 'CANCELLED' } };

    const [workingHour, service, existingAppointments] = await Promise.all([
      prisma.workingHour.findFirst({
        where: workingHourWhere as any,
      }),
      prisma.service.findUnique({
        where: { id: serviceId },
      }),
      prisma.appointment.findMany({
        where: appointmentWhere,
      }),
    ]);

    if (!workingHour || !service) return [];

    // Parse start and end times
    const start = parse(workingHour.startTime, 'HH:mm', targetDate);
    const end = parse(workingHour.endTime, 'HH:mm', targetDate);
    const duration = service.duration;

    const slots: string[] = [];
    let currentSlot = start;

    while (isBefore(addMinutes(currentSlot, duration), end) || isEqual(addMinutes(currentSlot, duration), end)) {
      const slotEnd = addMinutes(currentSlot, duration);

      // Check for overlap with existing appointments
      const isOverlapping = existingAppointments.some(appt => {
        const apptStart = appt.date;
        const apptEnd = addMinutes(apptStart, appt.duration);

        return (
          (isAfter(currentSlot, apptStart) || isEqual(currentSlot, apptStart)) && isBefore(currentSlot, apptEnd) ||
          isAfter(slotEnd, apptStart) && (isBefore(slotEnd, apptEnd) || isEqual(slotEnd, apptEnd)) ||
          (isBefore(currentSlot, apptStart) || isEqual(currentSlot, apptStart)) && (isAfter(slotEnd, apptEnd) || isEqual(slotEnd, apptEnd))
        );
      });

      if (!isOverlapping) {
        // Also check if slot is in the past if it's today
        if (isAfter(currentSlot, new Date())) {
          slots.push(format(currentSlot, 'HH:mm'));
        }
      }

      // Increment by a fixed interval, e.g., 30 mins, or just the duration
      currentSlot = addMinutes(currentSlot, 30);
    }

    return slots;
  }

  async createAppointment(clientId: string, professionalId: string, serviceId: string, dateTime: string, notes?: string, teamMemberId?: string) {
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) throw new Error('Serviço não encontrado');

    // Premium Check: FREE plans can only have 50 appointments per month
    const professional = await prisma.professionalProfile.findUnique({ where: { id: professionalId } });
    if (professional?.plan === 'FREE') {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const appointmentsThisMonth = await prisma.appointment.count({
        where: {
          professionalId,
          createdAt: { gte: startOfMonth }
        }
      });

      if (appointmentsThisMonth >= 50) {
        throw new Error('Este profissional atingiu o limite de agendamentos mensais do plano gratuito.');
      }
    }

    // In a real app, we should verify again if the slot is still available right before saving
    // For simplicity, we just create it here.
    const appointment = await prisma.appointment.create({
      data: {
        clientId,
        professionalId,
        serviceId,
        teamMemberId: teamMemberId || null,
        date: new Date(dateTime),
        price: service.price,
        duration: service.duration,
        notes,
      },
    });

    try {
      const clientProfile = await prisma.clientProfile.findUnique({ where: { id: clientId }, include: { user: true } });
      if (professional && clientProfile) {
        await notificationService.sendNotification(
          professional.userId,
          'Novo Agendamento!',
          `${clientProfile.user.name} agendou ${service.name} para ${format(new Date(dateTime), 'dd/MM/yyyy às HH:mm')}.`,
          'APPOINTMENT'
        );
      }
    } catch (e) {
      console.error('Falha ao enviar notificação de agendamento', e);
    }

    return appointment;
  }

  async getClientAppointments(clientId: string) {
    return prisma.appointment.findMany({
      where: { clientId },
      include: {
        professional: { include: { user: true } },
        service: true,
      },
      orderBy: { date: 'asc' },
    });
  }

  async getProfessionalAppointments(professionalId: string) {
    return prisma.appointment.findMany({
      where: { professionalId },
      include: {
        client: { include: { user: true } },
        service: true,
      },
      orderBy: { date: 'asc' },
    });
  }

  async updateAppointmentStatus(id: string, status: string) {
    const updated = await prisma.appointment.update({
      where: { id },
      data: { status },
      include: {
        client: { include: { user: true } },
        professional: { include: { user: true } },
        service: true
      }
    });

    try {
      if (status === 'CONFIRMED') {
        await notificationService.sendNotification(
          updated.client.userId,
          'Agendamento Confirmado',
          `Seu agendamento de ${updated.service.name} com ${updated.professional.businessName || updated.professional.user.name} foi confirmado!`,
          'APPOINTMENT'
        );
      } else if (status === 'CANCELLED') {
        await notificationService.sendNotification(
          updated.client.userId,
          'Agendamento Cancelado',
          `Seu agendamento de ${updated.service.name} foi cancelado.`,
          'APPOINTMENT'
        );

        // Notify Waitlist
        const dateStr = format(updated.date, 'yyyy-MM-dd');
        const waitlistUsers = await prisma.waitlist.findMany({
          where: { professionalId: updated.professionalId, date: dateStr, status: 'WAITING' },
          include: { client: { include: { user: true } } }
        });
        
        for (const w of waitlistUsers) {
          await notificationService.sendNotification(
            w.client.userId,
            'Horário Disponível!',
            `Um horário com ${updated.professional.businessName || updated.professional.user.name} acabou de vagar no dia ${format(updated.date, 'dd/MM/yyyy')}. Corra no app para agendar!`,
            'WAITLIST'
          );
          await prisma.waitlist.update({ where: { id: w.id }, data: { status: 'NOTIFIED' } });
        }
      }
    } catch (e) {
      console.error('Falha ao enviar notificações de atualização', e);
    }

    return updated;
  }

  async joinWaitlist(clientId: string, professionalId: string, date: string) {
    // Check if already in waitlist
    const existing = await prisma.waitlist.findFirst({
      where: { clientId, professionalId, date }
    });
    if (existing) throw new Error('Você já está na fila de espera para este dia.');

    return prisma.waitlist.create({
      data: {
        clientId,
        professionalId,
        date
      }
    });
  }

  async getWaitlist(professionalId: string, date: string) {
    return prisma.waitlist.findMany({
      where: { professionalId, date, status: 'WAITING' },
      include: {
        client: {
          include: { user: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });
  }
}
