import { Client } from './client.types';
import { Service } from './service.types';

// Status do agendamento
export type BookingStatus = 'pendente' | 'confirmado' | 'concluido' | 'cancelado' | 'nao_compareceu';

// Forma de pagamento
export type PaymentMethod = 'pix' | 'cartao' | 'dinheiro' | 'pago_online';

export interface Booking {
  id: string;
  professionalId: string;
  client: Client;
  services: Service[];
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  paymentMethod?: PaymentMethod;
  totalPrice: number;
  notes?: string;
  createdAt: string;
}
