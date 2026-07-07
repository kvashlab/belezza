import { prisma } from '../config/prisma';

export class ReportService {
  async createReport(data: any) {
    const { professionalId, reporterName, reporterEmail, reason, description } = data;

    const professional = await prisma.professionalProfile.findUnique({
      where: { id: professionalId }
    });

    if (!professional) {
      throw new Error('Profissional não encontrado.');
    }

    const report = await prisma.report.create({
      data: {
        professionalId,
        reporterName,
        reporterEmail,
        reason,
        description
      }
    });

    return report;
  }
}
