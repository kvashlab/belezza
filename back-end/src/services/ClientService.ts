import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ClientService {
  async addFavorite(clientId: string, professionalId: string) {
    const favorite = await prisma.favorite.create({
      data: {
        clientId,
        professionalId,
      },
      include: {
        professional: {
          include: { user: true }
        }
      }
    });
    return favorite;
  }

  async removeFavorite(clientId: string, professionalId: string) {
    await prisma.favorite.delete({
      where: {
        clientId_professionalId: {
          clientId,
          professionalId
        }
      }
    });
    return { message: 'Favorito removido' };
  }

  async getFavorites(clientId: string) {
    const favorites = await prisma.favorite.findMany({
      where: { clientId },
      include: {
        professional: {
          include: {
            user: { select: { id: true, name: true, email: true } }
          }
        }
      }
    });
    return favorites;
  }

  async addReview(clientId: string, data: any) {
    const { professionalId, appointmentId, rating, comment } = data;

    const review = await prisma.review.create({
      data: {
        clientId,
        professionalId,
        appointmentId,
        rating,
        comment
      }
    });

    // Update professional rating
    const reviews = await prisma.review.findMany({ where: { professionalId } });
    const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    const avgRating = totalRating / reviews.length;

    await prisma.professionalProfile.update({
      where: { id: professionalId },
      data: {
        rating: avgRating,
        reviewsCount: reviews.length
      }
    });

    return review;
  }
}
