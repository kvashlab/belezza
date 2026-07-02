import { ServiceCategory } from './professional.types';

export interface Service {
  id: string;
  professionalId: string;
  name: string;
  category: ServiceCategory;
  description: string;
  duration: number;      // em minutos
  price: number;
  promotionalPrice?: number;
  images: string[];
}

export interface Package {
  id: string;
  professionalId: string;
  name: string;
  serviceIds: string[];
  totalPrice: number;
  discountPercent: number;
}
