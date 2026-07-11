import { prisma } from '../config/prisma';

export class ReviewService {
  async createReview(userId: string, appointmentId: string, rating: number, comment?: string) {
    // 1. Encontrar o ClientProfile do usuário
    const clientProfile = await prisma.clientProfile.findUnique({ where: { userId } });
    if (!clientProfile) {
      throw new Error('Perfil de cliente não encontrado.');
    }

    // 2. Verificar se o agendamento existe, pertence ao cliente e está concluído
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { professional: true }
    });

    if (!appointment) {
      throw new Error('Agendamento não encontrado.');
    }

    if (appointment.clientId !== clientProfile.id) {
      throw new Error('Este agendamento não pertence a você.');
    }

    if (appointment.status !== 'COMPLETED') {
      throw new Error('Apenas atendimentos concluídos podem ser avaliados.');
    }

    // 3. Verificar se já existe avaliação para este agendamento
    const existingReview = await prisma.review.findUnique({
      where: { appointmentId }
    });

    if (existingReview) {
      throw new Error('Este atendimento já foi avaliado.');
    }

    // 4. Criar a avaliação
    const review = await prisma.review.create({
      data: {
        clientId: clientProfile.id,
        professionalId: appointment.professionalId,
        appointmentId: appointment.id,
        rating,
        comment: comment?.trim() || null,
      }
    });

    // 5. Recalcular a média de avaliações do profissional
    const aggregations = await prisma.review.aggregate({
      where: { professionalId: appointment.professionalId },
      _avg: { rating: true },
      _count: { rating: true }
    });

    const newRating = aggregations._avg.rating ? Number(aggregations._avg.rating.toFixed(1)) : 0;
    const newReviewsCount = aggregations._count.rating || 0;

    // 6. Atualizar o ProfessionalProfile
    await prisma.professionalProfile.update({
      where: { id: appointment.professionalId },
      data: {
        rating: newRating,
        reviewsCount: newReviewsCount
      }
    });

    return review;
  }
}
