import { PrismaClient } from '@prisma/client';
import { getIO } from '../config/socket';

const prisma = new PrismaClient();

export class NotificationService {
  async sendNotification(userId: string, title: string, message: string, type: string = 'INFO') {
    // 1. Save to database
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type
      }
    });

    // 2. Emit via WebSocket
    try {
      const io = getIO();
      io.to(userId).emit('notification', notification);
    } catch (error) {
      console.warn(`Could not send WebSocket notification to ${userId}: Socket.io not initialized or error occurred.`);
    }

    // 3. (Mock) Dispatch external communication if applicable
    this.mockExternalDispatch(userId, title, message, type);

    return notification;
  }

  async getNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async markAsRead(userId: string, notificationId: string) {
    return prisma.notification.update({
      where: { id: notificationId, userId },
      data: { read: true }
    });
  }

  private async mockExternalDispatch(userId: string, title: string, message: string, type: string) {
    // Busca informações de contato do usuário
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    if (type === 'APPOINTMENT') {
      if (user.phone) {
        console.log(`[Twilio/Z-API Mock] 📩 Enviando SMS/WhatsApp para ${user.phone}: ${title} - ${message}`);
      }
      console.log(`[SendGrid Mock] 📧 Enviando E-mail para ${user.email}: ${title} - ${message}`);
    }
  }
}
