export interface Review {
  id: string;
  professionalId: string;
  clientName: string;
  clientAvatar?: string;
  rating: number; // 1-5
  comment: string;
  serviceName: string;
  photos?: string[];
  createdAt: string;
  reply?: { content: string; createdAt: string };
}
