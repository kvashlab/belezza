import cron from 'node-cron';
import { prisma } from '../config/prisma';
import { NotificationService } from '../services/NotificationService';
import { addHours, subMinutes, addMinutes } from 'date-fns';

const notificationService = new NotificationService();

export function initJobs() {
  console.log('⏳ Inicializando cron jobs...');
  // Executa a cada minuto
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      // Queremos agendamentos que comecem em ~3 horas.
      const targetTime = addHours(now, 3);
      const windowStart = subMinutes(targetTime, 1);
      const windowEnd = addMinutes(targetTime, 2);

      const upcomingAppointments = await prisma.appointment.findMany({
        where: {
          date: {
            gte: windowStart,
            lte: windowEnd
          },
          status: { in: ['CONFIRMED', 'PENDING'] },
          clientId: { not: null }
        },
        include: {
          client: { include: { user: true } },
          professional: { include: { user: true } },
          service: true
        }
      });

      for (const appt of upcomingAppointments) {
        if (!appt.client) continue;

        // Verifica se a notificação já foi enviada (evita envios duplos)
        const alreadyNotified = await prisma.notification.findFirst({
          where: {
            userId: appt.client.userId,
            title: 'Lembrete de Agendamento',
            createdAt: {
              gte: subMinutes(now, 10)
            }
          }
        });

        if (alreadyNotified) continue;

        const timeStr = appt.date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' });
        
        await notificationService.sendNotification(
          appt.client.userId,
          'Lembrete de Agendamento',
          `Seu agendamento de ${appt.service.name} com ${appt.professional.businessName || appt.professional.user.name} é hoje às ${timeStr}.`,
          'REMINDER'
        );
      }
    } catch (error) {
      console.error('Error in reminder cron job:', error);
    }
  });
}
