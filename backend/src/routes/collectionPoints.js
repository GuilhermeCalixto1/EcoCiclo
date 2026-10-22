import { Router } from 'express';
import { supabase, isSupabaseConfigured } from '../supabase.js';

export const collectionPointsRouter = Router();

const DEFAULT_ECOPOINTS = [
  {
    id: 'eco-1',
    name: 'Ecoponto Central - Parque da Cidade',
    address: 'Av. das Nações, 450 - Centro',
    accepted_types: ['plastic', 'paper', 'glass', 'metal', 'electronic', 'cooking_oil'],
    operating_hours: 'Seg a Sáb: 08:00 às 18:00',
    latitude: -23.55052,
    longitude: -46.633308,
    phone: '(11) 3214-5500',
    status: 'open'
  },
  {
    id: 'eco-2',
    name: 'Ponto Verde - Vila Madalena',
    address: 'Rua Fradique Coutinho, 980',
    accepted_types: ['plastic', 'paper', 'glass', 'organic'],
    operating_hours: 'Ter a Dom: 09:00 às 17:00',
    latitude: -23.55745,
    longitude: -46.68912,
    phone: '(11) 3031-8822',
    status: 'open'
  },
  {
    id: 'eco-3',
    name: 'Ecoponto Eletrônicos & Sucata - Moema',
    address: 'Al. dos Maracatins, 1200',
    accepted_types: ['electronic', 'metal', 'cooking_oil'],
    operating_hours: 'Seg a Sex: 08:30 às 17:30',
    latitude: -23.60621,
    longitude: -46.66115,
    phone: '(11) 5052-1144',
    status: 'open'
  }
];

// GET /api/collection-points - Retorna ecopontos físicos
collectionPointsRouter.get('/', async (req, res) => {
  try {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('collection_points').select('*');
      if (!error && data && data.length > 0) {
        return res.json(data);
      }
    }
    return res.json(DEFAULT_ECOPOINTS);
  } catch (err) {
    console.error('Erro ao buscar ecopontos:', err);
    return res.status(500).json({ error: 'Erro ao buscar ecopontos' });
  }
});
