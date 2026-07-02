export interface Client {
  id: string;
  name: string;
  avatar?: string;
  phone: string;
  email: string;
  totalBookings: number;
  lastVisit?: string;
  tags: string[];
  notes?: string;
}
