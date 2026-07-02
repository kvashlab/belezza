'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Users, Plus, Trash2, Clock } from 'lucide-react';
import { getTeam, createTeamMember, deleteTeamMember, TeamMember } from '@/services/api/team';
import { useUIStore } from '@/stores/ui.store';
import { useAuthStore } from '@/stores/auth.store';

export default function EquipePage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', role: '' });
  
  const { addToast } = useUIStore();
  const { user } = useAuthStore();

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const data = await getTeam();
      setTeam(data);
    } catch (error: any) {
      addToast({ type: 'error', title: 'Erro', message: 'Não foi possível carregar a equipe.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTeamMember(newMember);
      addToast({ type: 'success', title: 'Sucesso', message: 'Membro adicionado!' });
      setIsAdding(false);
      setNewMember({ name: '', role: '' });
      fetchTeam();
    } catch (error: any) {
      addToast({ type: 'error', title: 'Atenção', message: error.response?.data?.error || 'Erro ao adicionar.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente remover este membro?')) return;
    try {
      await deleteTeamMember(id);
      addToast({ type: 'success', title: 'Removido', message: 'Membro removido da equipe.' });
      fetchTeam();
    } catch (error: any) {
      addToast({ type: 'error', title: 'Erro', message: 'Falha ao remover membro.' });
    }
  };

  if (loading) return <div className="p-8 animate-pulse bg-gray-50 h-full">Carregando equipe...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />
            Minha Equipe
          </h1>
          <p className="text-gray-500">Gerencie os profissionais do seu salão.</p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Membro
          </Button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleAddMember} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-end">
          <div className="flex-1">
            <Input 
              label="Nome do Profissional" 
              placeholder="Ex: Ana Silva"
              value={newMember.name}
              onChange={e => setNewMember({...newMember, name: e.target.value})}
              required
            />
          </div>
          <div className="flex-1">
            <Input 
              label="Cargo / Especialidade" 
              placeholder="Ex: Manicure"
              value={newMember.role}
              onChange={e => setNewMember({...newMember, role: e.target.value})}
              required
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={() => setIsAdding(false)}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      )}

      {team.length === 0 && !isAdding ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Você ainda não tem uma equipe</h3>
          <p className="text-gray-500 mt-2">Adicione funcionários para que os clientes possam agendar com eles.</p>
          <p className="text-xs text-indigo-600 mt-4 font-semibold">Exclusivo para Plano PREMIUM</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {team.map(member => (
            <div key={member.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => alert('Configuração de horários individual em breve')}>
                  <Clock className="w-4 h-4 mr-2" /> Horários
                </Button>
                <Button variant="secondary" size="sm" onClick={() => handleDelete(member.id)} className="text-red-600 border-red-100 hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
