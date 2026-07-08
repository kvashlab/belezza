import { Request, Response } from 'express';
import { z } from 'zod';
import { ReportService } from '../services/ReportService';

const reportService = new ReportService();

const reportSchema = z.object({
  professionalId: z.string().uuid('ID do profissional inválido'),
  reporterName: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  reporterEmail: z.string().email('E-mail inválido'),
  reason: z.string().min(1, 'Motivo é obrigatório'),
  description: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres')
});

export class ReportController {
  async createReport(req: Request, res: Response) {
    try {
      const data = reportSchema.parse(req.body);
      const report = await reportService.createReport(data);
      res.status(201).json(report);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: (error as any).errors[0].message });
      }
      res.status(400).json({ error: error.message });
    }
  }
}
