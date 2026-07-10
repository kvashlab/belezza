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
      where.categories = { contains: query.category, mode: 'insensitive' };
    }
    if (query.city) {
      where.city = { contains: query.city, mode: 'insensitive' };
    }
    if (query.q) {
      where.OR = [
        { businessName: { contains: query.q, mode: 'insensitive' } },
        { user: { name: { contains: query.q, mode: 'insensitive' } } },
        { categories: { contains: query.q, mode: 'insensitive' } },
        { neighborhood: { contains: query.q, mode: 'insensitive' } }
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
        teamMembers: true,
        reviews: { include: { client: { include: { user: true } } } }
      }
    });
  }

  async checkUsernameAvailability(username: string) {
    const regex = /^[a-zA-Z0-9_]+$/;
    if (!regex.test(username) || username.length < 3 || username.length > 30) {
      return false;
    }
    const existing = await prisma.professionalProfile.findUnique({ where: { username } });
    return !existing;
  }

  async changeUsername(userId: string, newUsername: string) {
    const regex = /^[a-zA-Z0-9_]+$/;
    if (!regex.test(newUsername) || newUsername.length < 3 || newUsername.length > 30) {
      throw new Error('O username deve ter entre 3 e 30 caracteres e conter apenas letras, números e underlines.');
    }

    const profileId = await this.getProfileIdByUserId(userId);
    const profile = await prisma.professionalProfile.findUnique({ where: { id: profileId } });
    if (!profile) throw new Error('Perfil não encontrado.');

    if (profile.username === newUsername) {
      throw new Error('Este já é o seu username atual.');
    }

    const isAvailable = await this.checkUsernameAvailability(newUsername);
    if (!isAvailable) {
      throw new Error('Este username não está disponível.');
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentChanges = await prisma.usernameChangeLog.count({
      where: {
        professionalId: profileId,
        changedAt: { gte: thirtyDaysAgo }
      }
    });

    const maxChanges = profile.plan === 'PREMIUM' ? 3 : 1;

    if (recentChanges >= maxChanges) {
      throw new Error(`Limite atingido. O seu plano (${profile.plan}) permite alterar o username ${maxChanges} vez(es) a cada 30 dias.`);
    }

    // Process change
    const updated = await prisma.$transaction([
      prisma.professionalProfile.update({
        where: { id: profileId },
        data: { username: newUsername }
      }),
      prisma.usernameChangeLog.create({
        data: {
          professionalId: profileId,
          oldUsername: profile.username,
          newUsername: newUsername
        }
      })
    ]);

    return updated[0];
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
  async createCustomer(userId: string, data: any) {
    const profileId = await this.getProfileIdByUserId(userId);
    return prisma.customer.create({
      data: {
        ...data,
        professionalId: profileId
      }
    });
  }

  async updateCustomer(userId: string, customerId: string, data: any) {
    const profileId = await this.getProfileIdByUserId(userId);
    const customer = await prisma.customer.findFirst({
      where: { id: customerId, professionalId: profileId }
    });
    if (!customer) throw new Error('Cliente não encontrado ou não pertence a você.');

    return prisma.customer.update({
      where: { id: customerId },
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        notes: data.notes,
      }
    });
  }

  async deleteCustomer(userId: string, customerId: string) {
    const profileId = await this.getProfileIdByUserId(userId);
    const customer = await prisma.customer.findFirst({
      where: { id: customerId, professionalId: profileId }
    });
    if (!customer) throw new Error('Cliente não encontrado ou não pertence a você.');

    await prisma.customer.delete({ where: { id: customerId } });
    return { message: 'Cliente removido com sucesso.' };
  }

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
      // Use clientId if available, fallback to clientName for manual appointments
      const mapKey = a.clientId || a.clientName;
      if (mapKey) {
        if (!clientsMap.has(mapKey)) {
          clientsMap.set(mapKey, {
            id: a.clientId || `manual_${mapKey}`,
            name: a.client?.user?.name || a.clientName || 'Cliente',
            email: a.client?.user?.email || '',
            phone: a.client?.user?.phone || '(00) 00000-0000',
            avatar: a.client?.avatar || '',
            lastVisit: a.date,
            totalSpent: 0
          });
        }
        const clientStats = clientsMap.get(mapKey);
        if (a.status === 'COMPLETED') {
          clientStats.totalSpent += a.price;
        }
      }
    });

    const manualCustomers = await prisma.customer.findMany({
      where: { professionalId: profileId }
    });

    manualCustomers.forEach(c => {
      // Try to merge with manual appointment entry if name matches exactly, else create new
      const mapKey = c.name;
      if (!clientsMap.has(mapKey)) {
        clientsMap.set(mapKey, {
          id: c.id,
          name: c.name,
          email: c.email || '',
          phone: c.phone || '',
          avatar: '',
          lastVisit: c.createdAt, // Just to show some date
          totalSpent: 0,
          isManual: true
        });
      } else {
        // If we found a match by name (from an appointment), use the customer ID instead of manual_ string
        const existing = clientsMap.get(mapKey);
        existing.id = c.id;
        if (c.email) existing.email = c.email;
        if (c.phone) existing.phone = c.phone;
        existing.isManual = true;
      }
    });

    return Array.from(clientsMap.values());
  }

  async getDashboardMetrics(userId: string) {
    const profileId = await this.getProfileIdByUserId(userId);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

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

    // Chart Data (Last 7 Days Revenue)
    const chartData = [];
    const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    for (let i = 0; i <= 6; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      const label = daysOfWeek[d.getDay()];
      
      const dayRevenue = appointments
        .filter(a => {
          const aDate = new Date(a.date);
          aDate.setHours(0,0,0,0);
          return aDate.getTime() === d.getTime() && (a.status === 'COMPLETED' || a.status === 'CONFIRMED');
        })
        .reduce((acc, curr) => acc + curr.price, 0);

      chartData.push({ label, value: dayRevenue });
    }

    // New Clients (Unique clients in the last 30 days)
    const recentAppointments = appointments.filter(a => {
      return new Date(a.date) >= thirtyDaysAgo && new Date(a.date) <= new Date(today.getTime() + 86400000);
    });
    
    const uniqueRecentClients = new Set();
    recentAppointments.forEach(a => {
      if (a.clientId) uniqueRecentClients.add(a.clientId);
      else if (a.clientName) uniqueRecentClients.add(a.clientName);
    });
    const newClients = uniqueRecentClients.size;

    // Average Rating
    const reviews = await prisma.review.findMany({
      where: { professionalId: profileId }
    });
    
    let averageRating = 0;
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
      averageRating = Number((totalRating / reviews.length).toFixed(1));
    }

    return {
      todaysAppointmentsCount: todaysAppointments.length,
      revenueToday,
      upcomingAppointments: appointments
        .filter(a => {
          if (a.status === 'COMPLETED' || a.status === 'CANCELLED') return false;
          return new Date(a.date) >= new Date();
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 4),
      chartData,
      newClients,
      averageRating
    };
  }

  // --- FINANCES ---
  async getFinances(userId: string) {
    const profileId = await this.getProfileIdByUserId(userId);

    const appointments = await prisma.appointment.findMany({
      where: { professionalId: profileId, status: { not: 'CANCELLED' } },
      include: { client: { include: { user: true } }, service: true },
      orderBy: { date: 'desc' }
    });

    let totalRevenue = 0;
    let pendingRevenue = 0;
    const transactions: any[] = [];

    appointments.forEach(a => {
      const clientName = a.clientName || a.client?.user?.name || 'Cliente';
      const serviceName = a.service?.name || 'Serviço';
      
      let statusStr = 'Pendente';
      
      if (a.status === 'COMPLETED') {
        totalRevenue += a.price;
        statusStr = 'Recebido';
      } else if (a.status === 'CONFIRMED' || a.status === 'PENDING') {
        pendingRevenue += a.price;
      }

      transactions.push({
        id: a.id,
        date: a.date,
        client: clientName,
        service: serviceName,
        status: statusStr,
        amount: a.price
      });
    });

    return {
      totalRevenue,
      pendingRevenue,
      transactions
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

  async upgradePlan(userId: string) {
    const profileId = await this.getProfileIdByUserId(userId);
    
    return prisma.professionalProfile.update({
      where: { id: profileId },
      data: { plan: 'PREMIUM' }
    });
  }
}
