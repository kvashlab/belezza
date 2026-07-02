const API_URL = 'http://localhost:3333/api/users';

const getHeaders = () => {
  const token = localStorage.getItem('@belezza:token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const updateProfile = async (data: any) => {
  const res = await fetch(`${API_URL}/me`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Erro ao atualizar perfil');
  }
  return res.json();
};

export const changePassword = async (data: any) => {
  const res = await fetch(`${API_URL}/me/password`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Erro ao alterar senha');
  }
  return res.json();
};

export const addAddress = async (data: any) => {
  const res = await fetch(`${API_URL}/me/addresses`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Erro ao adicionar endereço');
  }
  return res.json();
};

export const removeAddress = async (id: string) => {
  const res = await fetch(`${API_URL}/me/addresses/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Erro ao remover endereço');
  }
  return res.json();
};
