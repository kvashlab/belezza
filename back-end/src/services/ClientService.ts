import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ClientService {
  async addFavorite(userId: string, professionalId: string) {
    const client = await prisma.clientProfile.findUnique({ where: { userId } });
    if (!client) throw new Error('Perfil de cliente não encontrado');
    const clientId = client.id;
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

  async removeFavorite(userId: string, professionalId: string) {
    const client = await prisma.clientProfile.findUnique({ where: { userId } });
    if (!client) throw new Error('Perfil de cliente não encontrado');
    const clientId = client.id;
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

  async getFavorites(userId: string) {
    const client = await prisma.clientProfile.findUnique({ where: { userId } });
    if (!client) return [];
    const clientId = client.id;
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

}
