const API_URL = 'http://localhost:3333/team';

const getHeaders = () => {
  const token = localStorage.getItem('@belezza:token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export interface TeamMember {
  id: string;
  professionalId: string;
  name: string;
  avatar?: string;
  role?: string;
  workingHours: any[];
}

export const getTeam = async (): Promise<TeamMember[]> => {
  const res = await fetch(API_URL, { headers: getHeaders() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const createTeamMember = async (payload: { name: string; role?: string; avatar?: string }): Promise<TeamMember> => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Erro ao criar');
  }
  return res.json();
};

export const deleteTeamMember = async (id: string): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error(await res.text());
};

export const updateWorkingHours = async (id: string, workingHours: any[]): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}/working-hours`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ workingHours })
  });
  if (!res.ok) throw new Error(await res.text());
};
