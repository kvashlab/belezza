// Categorias de serviço/especialidade
export type ServiceCategory =
  | 'manicure' | 'pedicure' | 'nail_designer'
  | 'cabeleireira' | 'maquiagem' | 'sobrancelhas'
  | 'lash_designer' | 'micropigmentacao' | 'esteticista'
  | 'depilacao' | 'podologa' | 'massoterapia' | 'outros';

// Tipo de atendimento
export type ServiceLocation = 'no_local' | 'domicilio' | 'ambos';

export interface WorkingHour {
  dayOfWeek: number; // 0-6
  startTime: string; // "09:00"
  endTime: string;   // "19:00"
  isOpen: boolean;
}

export interface Professional {
  id: string;
  username: string;           // usado na URL @username
  name: string;
  businessName?: string;
  avatar: string;
  coverImage: string;
  bio: string;
  categories: ServiceCategory[];
  rating: number;
  reviewsCount: number;
  address?: {
    city: string;
    state: string;
    neighborhood: string;
    lat: number;
    lng: number;
  };
  city?: string;
  state?: string;
  neighborhood?: string;
  lat?: number;
  lng?: number;
  serviceLocation: ServiceLocation;
  verified: boolean;
  socialLinks?: { instagram?: string; whatsapp?: string; tiktok?: string };
  workingHours: WorkingHour[];
  createdAt: string;
}

export interface PortfolioPhoto {
  id: string;
  professionalId: string;
  url: string;
  category: ServiceCategory;
  description?: string;
  isBeforeAfter: boolean;
}
