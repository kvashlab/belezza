import { api } from '@/lib/api';

export interface TeamMember {
  id: string;
  professionalId: string;
  name: string;
  avatar?: string;
  role?: string;
  workingHours: any[];
}

export const getTeam = async (): Promise<TeamMember[]> => {
  const response = await api.get('/team');
  return response.data;
};

export const createTeamMember = async (payload: { name: string; role?: string; avatar?: string }): Promise<TeamMember> => {
  const response = await api.post('/team', payload);
  return response.data;
};

export const deleteTeamMember = async (id: string): Promise<void> => {
  await api.delete(`/team/${id}`);
};

export const updateWorkingHours = async (id: string, workingHours: any[]): Promise<void> => {
  await api.put(`/team/${id}/working-hours`, { workingHours });
};
