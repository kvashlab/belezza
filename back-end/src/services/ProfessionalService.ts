import { prisma } from '../config/prisma';

export class ProfessionalService {
  private async getProfileIdByUserId(userId: string) {
    const profile = await prisma.professionalProfile.findUnique({
      where: { userId },
    });
    if (!profile) {
      throw new Error('Perfil de profissional não encontrado.');
    }
    return profile.id;
  }

  async getProfile(userId: string) {
    return prisma.professionalProfile.findUnique({
      where: { userId },
      include: {
        workingHours: true,
        services: true,
        portfolio: true,
      },
    });
  }

  async getProfessionals(query: any) {
    // simplified search logic for now
    const where: any = {};
    if (query.category) {
      where.categories = { contains: query.category };
    }
    if (query.city) {
      where.city = { contains: query.city };
    }
    if (query.q) {
      where.OR = [
        { businessName: { contains: query.q } },
        { user: { name: { contains: query.q } } }
      ];
    }
    
    return prisma.professionalProfile.findMany({
      where,
      include: { user: { select: { name: true } } }
    });
  }

  async getProfessionalByUsername(username: string) {
    return prisma.professionalProfile.findUnique({
      where: { username },
      include: {
        user: { select: { name: true } },
        services: true,
        workingHours: true,
        portfolio: true,
      }
    });
  }

  async updateProfile(userId: string, data: any) {
    const profileId = await this.getProfileIdByUserId(userId);
    
    return prisma.professionalProfile.update({
      where: { id: profileId },
      data,
    });
  }

  async createService(userId: string, data: any) {
    const profileId = await this.getProfileIdByUserId(userId);

    return prisma.service.create({
      data: {
        ...data,
        professionalId: profileId,
      },
    });
  }

  async getServices(userId: string) {
    const profileId = await this.getProfileIdByUserId(userId);
    return prisma.service.findMany({
      where: { professionalId: profileId },
    });
  }

  async updateService(userId: string, serviceId: string, data: any) {
    const profileId = await this.getProfileIdByUserId(userId);
    
    // Verify ownership
    const service = await prisma.service.findFirst({
      where: { id: serviceId, professionalId: profileId }
    });

    if (!service) {
      throw new Error('Serviço não encontrado ou não pertence a você.');
    }

    return prisma.service.update({
      where: { id: serviceId },
      data,
    });
  }

  async deleteService(userId: string, serviceId: string) {
    const profileId = await this.getProfileIdByUserId(userId);
    
    const service = await prisma.service.findFirst({
      where: { id: serviceId, professionalId: profileId }
    });

    if (!service) {
      throw new Error('Serviço não encontrado ou não pertence a você.');
    }

    return prisma.service.delete({
      where: { id: serviceId },
    });
  }

  async updateWorkingHours(userId: string, hours: any[]) {
    const profileId = await this.getProfileIdByUserId(userId);

    // Delete existing
    await prisma.workingHour.deleteMany({
      where: { professionalId: profileId },
    });

    // Create new
    const created = await prisma.$transaction(
      hours.map(h => prisma.workingHour.create({
        data: {
          professionalId: profileId,
          dayOfWeek: h.dayOfWeek,
          startTime: h.startTime,
          endTime: h.endTime,
          isOpen: h.isOpen,
        }
      }))
    );

    return created;
  }
}
