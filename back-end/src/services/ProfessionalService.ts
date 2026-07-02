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
        reviews: { include: { client: { include: { user: true } } } }
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

  // --- DASHBOARD METRICS ---
  async getClients(userId: string) {
    const profileId = await this.getProfileIdByUserId(userId);
    
    // Retrieve distinct clients from appointments
    const appointments = await prisma.appointment.findMany({
      where: { professionalId: profileId },
      include: { client: { include: { user: true } } },
      orderBy: { date: 'desc' }
    });

    const clientsMap = new Map();
    appointments.forEach(a => {
      if (!clientsMap.has(a.clientId)) {
        clientsMap.set(a.clientId, {
          id: a.client.id,
          name: a.client.user?.name || 'Cliente',
          email: a.client.user?.email || '',
          phone: a.client.user?.phone || '(00) 00000-0000',
          avatar: a.client.avatar || '',
          lastVisit: a.date,
          totalSpent: 0
        });
      }
      const clientStats = clientsMap.get(a.clientId);
      if (a.status === 'COMPLETED' || a.status === 'CONFIRMED') {
        clientStats.totalSpent += a.price;
      }
    });

    return Array.from(clientsMap.values());
  }

  async getDashboardMetrics(userId: string) {
    const profileId = await this.getProfileIdByUserId(userId);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const appointments = await prisma.appointment.findMany({
      where: { professionalId: profileId },
      include: { client: { include: { user: true } }, service: true }
    });

    const todaysAppointments = appointments.filter(a => {
      const apptDate = new Date(a.date);
      apptDate.setHours(0,0,0,0);
      return apptDate.getTime() === today.getTime() && a.status !== 'CANCELLED';
    });

    const revenueToday = todaysAppointments
      .filter(a => a.status === 'COMPLETED' || a.status === 'CONFIRMED')
      .reduce((acc, curr) => acc + curr.price, 0);

    // Mock chart data for now, or calculate based on past 7 days
    const chartData = [
      { label: 'Seg', value: 150 },
      { label: 'Ter', value: 300 },
      { label: 'Qua', value: 450 },
      { label: 'Qui', value: 200 },
      { label: 'Sex', value: 800 },
      { label: 'Sáb', value: 1200 },
      { label: 'Dom', value: 0 },
    ];

    return {
      todaysAppointmentsCount: todaysAppointments.length,
      revenueToday,
      upcomingAppointments: appointments
        .filter(a => new Date(a.date) >= today && a.status !== 'CANCELLED')
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 4),
      chartData
    };
  }

  // --- PORTFOLIO ---
  async getPortfolio(userId: string) {
    const profileId = await this.getProfileIdByUserId(userId);
    return prisma.portfolioPhoto.findMany({
      where: { professionalId: profileId }
    });
  }

  async addPortfolioPhoto(userId: string, data: any) {
    const profileId = await this.getProfileIdByUserId(userId);
    
    // Premium check logic can go here (e.g. max 5 photos for FREE plan)
    const profile = await prisma.professionalProfile.findUnique({ where: { id: profileId } });
    if (profile?.plan === 'FREE') {
      const currentPhotos = await prisma.portfolioPhoto.count({ where: { professionalId: profileId } });
      if (currentPhotos >= 5) {
        throw new Error('Limite de fotos atingido no plano gratuito. Faça upgrade para Premium.');
      }
    }

    return prisma.portfolioPhoto.create({
      data: {
        ...data,
        professionalId: profileId
      }
    });
  }

  async deletePortfolioPhoto(userId: string, photoId: string) {
    const profileId = await this.getProfileIdByUserId(userId);
    const photo = await prisma.portfolioPhoto.findFirst({ where: { id: photoId, professionalId: profileId } });
    if (!photo) throw new Error('Foto não encontrada');
    
    await prisma.portfolioPhoto.delete({ where: { id: photoId } });
    return { message: 'Foto deletada' };
  }

  // --- REVIEWS ---
  async getReviews(userId: string) {
    const profileId = await this.getProfileIdByUserId(userId);
    return prisma.review.findMany({
      where: { professionalId: profileId },
      include: { client: { include: { user: true } } }
    });
  }
}
