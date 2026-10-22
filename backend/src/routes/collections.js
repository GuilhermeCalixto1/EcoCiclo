import { Router } from 'express';
import { supabase, isSupabaseConfigured } from '../supabase.js';

export const collectionsRouter = Router();

// Cache em memória para desenvolvimento rápido antes da configuração do Supabase
let inMemoryCollections = [
  {
    id: 'col-101',
    user_name: 'Ana Carolina Silva',
    user_email: 'ana.silva@exemplo.com',
    user_phone: '(11) 98765-4321',
    address: 'Rua das Flores, 142 - Apto 32',
    neighborhood: 'Jardim Primavera',
    city: 'São Paulo',
    waste_type_id: 'plastic',
    estimated_weight_kg: 4.5,
    status: 'scheduled', // pending, scheduled, in_progress, completed, cancelled
    scheduled_date: '2026-10-23',
    scheduled_period: 'manha', // manha, tarde
    notes: 'Dois sacos plásticos azuis identificados na portaria.',
    points_awarded: 67,
    created_at: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'col-102',
    user_name: 'Marcos Vinicius Costa',
    user_email: 'marcos.costa@exemplo.com',
    user_phone: '(11) 97123-8899',
    address: 'Av. Paulista, 1800',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    waste_type_id: 'electronic',
    estimated_weight_kg: 2.0,
    status: 'completed',
    scheduled_date: '2026-10-21',
    scheduled_period: 'tarde',
    notes: '2 monitores antigos e 1 teclado.',
    points_awarded: 100,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 'col-103',
    user_name: 'Beatriz Almeida',
    user_email: 'beatriz.eco@exemplo.com',
    user_phone: '(11) 99345-6677',
    address: 'Rua Harmonia, 310',
    neighborhood: 'Vila Madalena',
    city: 'São Paulo',
    waste_type_id: 'glass',
    estimated_weight_kg: 8.0,
    status: 'pending',
    scheduled_date: '2026-10-24',
    scheduled_period: 'manha',
    notes: 'Vidros de azeite e garrafas limpas bem embaladas em caixa.',
    points_awarded: 160,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

// GET /api/collections - Lista todas as coletas ou filtra por status
collectionsRouter.get('/', async (req, res) => {
  try {
    const { status } = req.query;

    if (isSupabaseConfigured() && supabase) {
      let query = supabase.from('collection_requests').select('*').order('created_at', { ascending: false });
      if (status) {
        query = query.eq('status', status);
      }
      const { data, error } = await query;
      if (!error && data) {
        return res.json(data);
      }
      console.warn('Erro ao buscar collection_requests no Supabase:', error?.message);
    }

    let filtered = inMemoryCollections;
    if (status) {
      filtered = filtered.filter((item) => item.status === status);
    }
    return res.json(filtered);
  } catch (err) {
    console.error('Erro ao listar coletas:', err);
    return res.status(500).json({ error: 'Erro interno ao consultar coletas' });
  }
});

// GET /api/collections/stats - Métricas e resumo para o painel de controle
collectionsRouter.get('/stats', async (req, res) => {
  try {
    let list = inMemoryCollections;

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('collection_requests').select('*');
      if (!error && data) {
        list = data;
      }
    }

    const totalWeight = list.reduce((acc, curr) => acc + (Number(curr.estimated_weight_kg) || 0), 0);
    const totalPoints = list.reduce((acc, curr) => acc + (Number(curr.points_awarded) || 0), 0);
    const completedCount = list.filter((c) => c.status === 'completed').length;
    const pendingCount = list.filter((c) => c.status === 'pending').length;
    const scheduledCount = list.filter((c) => c.status === 'scheduled').length;

    // Estimativa de CO2 evitado (aprox 1.8 kg de CO2 por kg de resíduo reciclado)
    const co2SavedKg = Math.round(totalWeight * 1.82 * 10) / 10;

    return res.json({
      totalCollections: list.length,
      completedCollections: completedCount,
      pendingCollections: pendingCount,
      scheduledCollections: scheduledCount,
      totalWeightRecycledKg: Math.round(totalWeight * 10) / 10,
      totalEcoPointsAwarded: totalPoints,
      co2SavedKg: co2SavedKg,
      wasteBreakdown: {
        plastic: list.filter((c) => c.waste_type_id === 'plastic').length,
        paper: list.filter((c) => c.waste_type_id === 'paper').length,
        glass: list.filter((c) => c.waste_type_id === 'glass').length,
        metal: list.filter((c) => c.waste_type_id === 'metal').length,
        electronic: list.filter((c) => c.waste_type_id === 'electronic').length,
        organic: list.filter((c) => c.waste_type_id === 'organic').length,
        cooking_oil: list.filter((c) => c.waste_type_id === 'cooking_oil').length
      }
    });
  } catch (err) {
    console.error('Erro ao calcular estatísticas:', err);
    return res.status(500).json({ error: 'Erro ao calcular métricas' });
  }
});

// POST /api/collections - Cria um novo pedido de agendamento de coleta
collectionsRouter.post('/', async (req, res) => {
  try {
    const {
      user_name,
      user_email,
      user_phone,
      address,
      neighborhood,
      city,
      waste_type_id,
      estimated_weight_kg,
      scheduled_date,
      scheduled_period,
      notes
    } = req.body;

    if (!user_name || !address || !waste_type_id || !scheduled_date) {
      return res.status(400).json({
        error: 'Campos obrigatórios ausentes: nome, endereço, tipo de resíduo e data de coleta são necessários.'
      });
    }

    // Calcular pontos ecológicos com base no tipo e peso
    const pointsTable = {
      plastic: 15,
      paper: 10,
      glass: 20,
      metal: 25,
      electronic: 50,
      organic: 8,
      cooking_oil: 35
    };
    const rate = pointsTable[waste_type_id] || 10;
    const weight = Number(estimated_weight_kg) || 1;
    const points_awarded = Math.round(weight * rate);

    const newCollection = {
      id: 'col-' + Date.now(),
      user_name,
      user_email: user_email || 'usuario@ecociclo.org',
      user_phone: user_phone || '',
      address,
      neighborhood: neighborhood || 'Centro',
      city: city || 'São Paulo',
      waste_type_id,
      estimated_weight_kg: weight,
      status: 'pending',
      scheduled_date,
      scheduled_period: scheduled_period || 'manha',
      notes: notes || '',
      points_awarded,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('collection_requests')
        .insert([newCollection])
        .select()
        .single();

      if (!error && data) {
        return res.status(201).json(data);
      }
      console.warn('Erro ao salvar no Supabase, salvando em memória:', error?.message);
    }

    inMemoryCollections.unshift(newCollection);
    return res.status(201).json(newCollection);
  } catch (err) {
    console.error('Erro ao criar solicitação de coleta:', err);
    return res.status(500).json({ error: 'Erro ao processar agendamento' });
  }
});

// PATCH /api/collections/:id/status - Atualiza o status de uma coleta (ex: agendada, em rota, concluída)
collectionsRouter.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'scheduled', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Status inválido fornecido.' });
    }

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('collection_requests')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        return res.json(data);
      }
    }

    const index = inMemoryCollections.findIndex((c) => c.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Coleta não encontrada' });
    }

    inMemoryCollections[index].status = status;
    inMemoryCollections[index].updated_at = new Date().toISOString();

    return res.json(inMemoryCollections[index]);
  } catch (err) {
    console.error('Erro ao atualizar status da coleta:', err);
    return res.status(500).json({ error: 'Erro ao atualizar status' });
  }
});
