const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = {
  // Obter tipos de resíduos
  async getWasteTypes() {
    try {
      const res = await fetch(`${API_URL}/waste-types`);
      if (!res.ok) throw new Error('Falha ao buscar tipos de resíduos');
      return await res.json();
    } catch (err) {
      console.warn('API indisponível, usando tipos padrão:', err.message);
      return [
        { id: 'plastic', name: 'Plástico', category: 'Seco Reciclável', points_per_kg: 15, color: '#ef4444', icon: 'Package', description: 'PET, potes, sacolas limpas.' },
        { id: 'paper', name: 'Papel & Papelão', category: 'Seco Reciclável', points_per_kg: 10, color: '#3b82f6', icon: 'FileText', description: 'Caixas de papelão, cadernos, jornais.' },
        { id: 'glass', name: 'Vidro', category: 'Seco Reciclável', points_per_kg: 20, color: '#10b981', icon: 'Wine', description: 'Garrafas, frascos e potes limpos.' },
        { id: 'metal', name: 'Metal & Alumínio', category: 'Seco Reciclável', points_per_kg: 25, color: '#f59e0b', icon: 'Shield', description: 'Latinhas, tampas, panelas velhas.' },
        { id: 'electronic', name: 'Eletrônicos (E-Waste)', category: 'Especial', points_per_kg: 50, color: '#8b5cf6', icon: 'Cpu', description: 'Celulares, cabos, placas e teclados.' },
        { id: 'organic', name: 'Orgânico (Compostagem)', category: 'Biodegradável', points_per_kg: 8, color: '#84cc16', icon: 'Apple', description: 'Restos de frutas, cascas de legumes.' },
        { id: 'cooking_oil', name: 'Óleo de Cozinha', category: 'Líquido / Especial', points_per_kg: 35, color: '#eab308', icon: 'Droplet', description: 'Óleo usado armazenado em garrafa PET.' }
      ];
    }
  },

  // Obter solicitações de coleta
  async getCollections(status) {
    try {
      const url = status ? `${API_URL}/collections?status=${status}` : `${API_URL}/collections`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Falha ao buscar coletas');
      return await res.json();
    } catch (err) {
      console.warn('API indisponível, usando coletas em memória:', err.message);
      return [];
    }
  },

  // Criar nova solicitação de agendamento de coleta
  async createCollection(collectionData) {
    const res = await fetch(`${API_URL}/collections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(collectionData)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Erro ao registrar solicitação de coleta');
    }
    return await res.json();
  },

  // Atualizar status de coleta
  async updateStatus(id, newStatus) {
    const res = await fetch(`${API_URL}/collections/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    if (!res.ok) throw new Error('Falha ao atualizar status');
    return await res.json();
  },

  // Obter métricas de impacto ecológico
  async getStats() {
    try {
      const res = await fetch(`${API_URL}/collections/stats`);
      if (!res.ok) throw new Error('Falha ao buscar métricas');
      return await res.json();
    } catch (err) {
      return {
        totalCollections: 0,
        completedCollections: 0,
        pendingCollections: 0,
        scheduledCollections: 0,
        totalWeightRecycledKg: 0,
        totalEcoPointsAwarded: 0,
        co2SavedKg: 0,
        wasteBreakdown: {}
      };
    }
  },

  // Obter Ecopontos físicos
  async getCollectionPoints() {
    try {
      const res = await fetch(`${API_URL}/collection-points`);
      if (!res.ok) throw new Error('Falha ao buscar ecopontos');
      return await res.json();
    } catch (err) {
      return [];
    }
  },

  // Obter recompensas e ranking
  async getRewards() {
    try {
      const res = await fetch(`${API_URL}/points/rewards`);
      if (!res.ok) throw new Error('Falha ao buscar recompensas');
      return await res.json();
    } catch (err) {
      return [];
    }
  },

  async getLeaderboard() {
    try {
      const res = await fetch(`${API_URL}/points/leaderboard`);
      if (!res.ok) throw new Error('Falha ao buscar ranking');
      return await res.json();
    } catch (err) {
      return [];
    }
  }
};
