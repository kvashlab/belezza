import { prisma } from '../config/prisma';
import { addMinutes, parse, format, isBefore, isAfter, isEqual } from 'date-fns';
import { NotificationService } from './NotificationService';

const notificationService = new NotificationService();

export class AppointmentService {
  async getAvailableSlots(professionalId: string, serviceIds: string[], date: string, teamMemberId?: string) {
    // date format: YYYY-MM-DD
    const [year, month, day] = date.split('-').map(Number);
    const targetDate = new Date(year, month - 1, day);
    const dayOfWeek = targetDate.getDay();



    const startOfDayLocal = new Date(year, month - 1, day, 0, 0, 0);
    const endOfDayLocal = new Date(year, month - 1, day, 23, 59, 59, 999);

    const appointmentWhere = teamMemberId
      ? { professionalId, teamMemberId, date: { gte: startOfDayLocal, lt: endOfDayLocal }, status: { not: 'CANCELLED' } }
      : { professionalId, teamMemberId: null, date: { gte: startOfDayLocal, lt: endOfDayLocal }, status: { not: 'CANCELLED' } };

    const [services, existingAppointments, customSlots, workingHour] = await Promise.all([
      prisma.service.findMany({
        where: { id: { in: serviceIds } },
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
      }),
      prisma.workingHour.findFirst({
        where: {
          professionalId,
          teamMemberId: teamMemberId || null,
          dayOfWeek
        }
      })
    ]);

    if (!services || services.length === 0) return [];
    
    // If professional is closed on this day, return no slots
    if (!workingHour || !workingHour.isOpen) return [];

    const duration = services.reduce((acc, curr) => acc + curr.duration, 0);
    const potentialDateTimes: Date[] = [];

    // Parse start and end times from workingHour
    const parsedStart = parse(workingHour.startTime, 'HH:mm', targetDate);
    const parsedEnd = parse(workingHour.endTime, 'HH:mm', targetDate);
    
    // Build 30min grid from workingHour.startTime to workingHour.endTime
    let currentInterval = new Date(parsedStart);
    while (isBefore(currentInterval, parsedEnd) || isEqual(currentInterval, parsedEnd)) {
      const slotEndTime = addMinutes(currentInterval, duration);
      // Ensure the slot finishes before or exactly at the end of the working day
      if (isAfter(slotEndTime, parsedEnd)) {
        break; 
      }
      
      if (!potentialDateTimes.some(d => isEqual(d, currentInterval))) {
        potentialDateTimes.push(currentInterval);
      }
      
      currentInterval = addMinutes(currentInterval, 30);
    }

    for (const cSlot of customSlots) {
      const parsed = parse(cSlot.time, 'HH:mm', targetDate);
      if (!potentialDateTimes.some(d => isEqual(d, parsed))) {
        potentialDateTimes.push(parsed);
      }
    }

    potentialDateTimes.sort((a, b) => a.getTime() - b.getTime());

    const slots: string[] = [];
    const now = new Date();

    for (const currentSlot of potentialDateTimes) {
      // Filter out slots that are in the past
      if (isBefore(currentSlot, now)) {
        continue;
      }

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

  async createAppointment(clientId: string | undefined, professionalId: string, serviceIds: string[], dateTime: string, notes?: string, teamMemberId?: string, clientName?: string) {
    const appointmentDate = new Date(dateTime);
    if (isBefore(appointmentDate, new Date())) {
      throw new Error('Não é possível agendar um compromisso no passado.');
    }

    const services = await prisma.service.findMany({ where: { id: { in: serviceIds } } });
    if (!services || services.length === 0) throw new Error('Serviço não encontrado');

    // Premium Check: FREE plans can only have 50 appointments per month
    const professional = await prisma.professionalProfile.findUnique({ where: { id: professionalId }, include: { user: true } });
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

      if (appointmentsThisMonth + services.length > 50) {
        throw new Error('Este profissional atingiu o limite de agendamentos mensais do plano gratuito.');
      }
    }

    // Create the sequential appointments
    const createdAppointments = [];
    let currentStart = new Date(dateTime);

    // To preserve order as sent by client, map them:
    const orderedServices = serviceIds.map(id => services.find(s => s.id === id)).filter(Boolean) as any[];

    // --- Double Booking Protection ---
    const startOfDayLocal = new Date(appointmentDate);
    startOfDayLocal.setHours(0,0,0,0);
    const endOfDayLocal = new Date(appointmentDate);
    endOfDayLocal.setHours(23,59,59,999);

    const existingAppointments = await prisma.appointment.findMany({
      where: { professionalId, date: { gte: startOfDayLocal, lte: endOfDayLocal }, status: { not: 'CANCELLED' } }
    });

    let checkStart = new Date(dateTime);
    for (const service of orderedServices) {
      const checkEnd = addMinutes(checkStart, service.duration);
      
      const isOverlapping = existingAppointments.some(appt => {
        const apptStart = appt.date;
        const apptEnd = addMinutes(apptStart, appt.duration);
        
        return (
          (isAfter(checkStart, apptStart) || isEqual(checkStart, apptStart)) && isBefore(checkStart, apptEnd) ||
          isAfter(checkEnd, apptStart) && (isBefore(checkEnd, apptEnd) || isEqual(checkEnd, apptEnd)) ||
          (isBefore(checkStart, apptStart) || isEqual(checkStart, apptStart)) && (isAfter(checkEnd, apptEnd) || isEqual(checkEnd, apptEnd))
        );
      });

      if (isOverlapping) {
        throw new Error('O horário selecionado não está mais disponível. Por favor, escolha outro horário.');
      }
      checkStart = addMinutes(checkStart, service.duration);
    }
    // --- End Double Booking Protection ---

    for (const service of orderedServices) {
      const appointment = await prisma.appointment.create({
        data: {
          clientId: clientId || null,
          clientName: clientName || null,
          professionalId,
          serviceId: service.id,
          teamMemberId: teamMemberId || null,
          date: new Date(currentStart), // copy to avoid reference issues
          price: service.price,
          duration: service.duration,
          status: professional?.autoConfirm === false ? 'PENDING' : 'CONFIRMED',
          notes,
        },
      });
      createdAppointments.push(appointment);
      currentStart = addMinutes(currentStart, service.duration);
    }

    try {
      if (clientId) {
        const clientProfile = await prisma.clientProfile.findUnique({ where: { id: clientId }, include: { user: true } });
        if (clientProfile && professional) {
          if (professional.autoConfirm === false) {
            // Notify Professional
            await notificationService.sendNotification(
              professional.userId,
              'Nova Solicitação de Agendamento!',
              `${clientProfile.user.name} solicitou ${orderedServices.length} serviço(s) para ${format(new Date(dateTime), 'dd/MM/yyyy às HH:mm')}. Aprovação pendente.`,
              'APPOINTMENT'
            );
            
            // Notify Client (pending)
            await notificationService.sendNotification(
              clientProfile.userId,
              'Solicitação Enviada',
              `Sua solicitação de agendamento de ${orderedServices.length} serviço(s) com ${professional.businessName || professional.user.name} para ${format(new Date(dateTime), 'dd/MM/yyyy às HH:mm')} foi enviada e aguarda confirmação do profissional.`,
              'APPOINTMENT'
            );
          } else {
            // Notify Professional
            await notificationService.sendNotification(
              professional.userId,
              'Novo Agendamento Confirmado!',
              `${clientProfile.user.name} agendou ${orderedServices.length} serviço(s) para ${format(new Date(dateTime), 'dd/MM/yyyy às HH:mm')}.`,
              'APPOINTMENT'
            );
            
            // Notify Client (confirmed)
            await notificationService.sendNotification(
              clientProfile.userId,
              'Agendamento Confirmado',
              `Seu agendamento de ${orderedServices.length} serviço(s) com ${professional.businessName || professional.user.name} foi confirmado para ${format(new Date(dateTime), 'dd/MM/yyyy às HH:mm')}.`,
              'APPOINTMENT'
            );
          }
        }
      }
    } catch (e) {
      console.error('Falha ao enviar notificação de agendamento', e);
    }

    return createdAppointments;
  }

  async getClientAppointments(clientId: string) {
    return prisma.appointment.findMany({
      where: { clientId },
      include: {
        professional: { include: { user: true } },
        service: true,
        review: true,
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
