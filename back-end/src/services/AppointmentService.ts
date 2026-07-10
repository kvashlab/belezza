import { prisma } from '../config/prisma';
import { addMinutes, parse, format, isBefore, isAfter, isEqual } from 'date-fns';
import { NotificationService } from './NotificationService';

const notificationService = new NotificationService();

export class AppointmentService {
  async getAvailableSlots(professionalId: string, serviceId: string, date: string, teamMemberId?: string) {
    // date format: YYYY-MM-DD
    const [year, month, day] = date.split('-').map(Number);
    const targetDate = new Date(year, month - 1, day);
    const dayOfWeek = targetDate.getDay();



    const startOfDayLocal = new Date(year, month - 1, day, 0, 0, 0);
    const endOfDayLocal = new Date(year, month - 1, day, 23, 59, 59, 999);

    const appointmentWhere = teamMemberId
      ? { professionalId, teamMemberId, date: { gte: startOfDayLocal, lt: endOfDayLocal }, status: { not: 'CANCELLED' } }
      : { professionalId, teamMemberId: null, date: { gte: startOfDayLocal, lt: endOfDayLocal }, status: { not: 'CANCELLED' } };

    const [service, existingAppointments, customSlots] = await Promise.all([
      prisma.service.findUnique({
        where: { id: serviceId },
      }),
      prisma.appointment.findMany({
        where: appointmentWhere,
      }),
      prisma.customTimeSlot.findMany({
        where: {
          professionalId,
          OR: [
            { date: null },
            { date: { gte: startOfDayLocal, lt: endOfDayLocal } }
          ]
        }
      })
    ]);

    if (!service) return [];

    const duration = service.duration;
    const potentialDateTimes: Date[] = [];

    // Build 30min grid from 8 to 20 (matching professional agenda logic)
    for (let hour = 8; hour <= 20; hour++) {
      const timeStr = `${hour.toString().padStart(2, '0')}:00`;
      const parsed = parse(timeStr, 'HH:mm', targetDate);
      if (!potentialDateTimes.some(d => isEqual(d, parsed))) {
        potentialDateTimes.push(parsed);
      }
      
      if (hour !== 20) {
        const timeStr30 = `${hour.toString().padStart(2, '0')}:30`;
        const parsed30 = parse(timeStr30, 'HH:mm', targetDate);
        if (!potentialDateTimes.some(d => isEqual(d, parsed30))) {
          potentialDateTimes.push(parsed30);
        }
      }
    }

    for (const cSlot of customSlots) {
      const parsed = parse(cSlot.time, 'HH:mm', targetDate);
      if (!potentialDateTimes.some(d => isEqual(d, parsed))) {
        potentialDateTimes.push(parsed);
      }
    }

    potentialDateTimes.sort((a, b) => a.getTime() - b.getTime());

    const slots: string[] = [];

    for (const currentSlot of potentialDateTimes) {
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
        slots.push(format(currentSlot, 'HH:mm'));
      }
    }

    return slots;
  }

  async createAppointment(clientId: string | undefined, professionalId: string, serviceId: string, dateTime: string, notes?: string, teamMemberId?: string, clientName?: string) {
    const appointmentDate = new Date(dateTime);
    if (isBefore(appointmentDate, new Date())) {
      throw new Error('Não é possível agendar um compromisso no passado.');
    }

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

    // Create the appointment
    const appointment = await prisma.appointment.create({
      data: {
        clientId: clientId || null,
        clientName: clientName || null,
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
      if (clientId && professional) {
        const clientProfile = await prisma.clientProfile.findUnique({ where: { id: clientId }, include: { user: true } });
        if (clientProfile) {
          await notificationService.sendNotification(
            professional.userId,
            'Novo Agendamento!',
            `${clientProfile.user.name} agendou ${service.name} para ${format(new Date(dateTime), 'dd/MM/yyyy às HH:mm')}.`,
            'APPOINTMENT'
          );
        }
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
      if (updated.client) {
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
        }
      }

      if (status === 'CANCELLED') {
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
