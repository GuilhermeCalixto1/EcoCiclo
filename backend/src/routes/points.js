import { Router } from 'express';
import { supabase, isSupabaseConfigured } from '../supabase.js';

export const pointsRouter = Router();

// Catálogo de recompensas ecológicas que o usuário pode resgatar com seus EcoPontos
const REWARDS_CATALOG = [
  {
    id: 'rew-1',
    title: 'Desconto de R$ 20 no Hortifruti Orgânico',
    partner: 'HortiVerde Parceiro',
    points_required: 150,
    category: 'Alimentação Saudável',
    icon: 'Apple',
    available: true
  },
  {
    id: 'rew-2',
    title: 'Kit Sacolas Ecológicas & Compostagem',
    partner: 'EcoCiclo Brasil',
    points_required: 200,
    category: 'Sustentabilidade',
    icon: 'Package',
    available: true
  },
  {
    id: 'rew-3',
    title: 'Muda Nativa de Ipê Amarelo para Plantio',
    partner: 'Secretaria do Meio Ambiente',
    points_required: 100,
    category: 'Florestamento Urbano',
    icon: 'Leaf',
    available: true
  },
  {
    id: 'rew-4',
    title: 'Crédito de 15% na Fatura de Água/Saneamento',
    partner: 'Programa IPTU & Tarifa Verde',
    points_required: 400,
    category: 'Economia Municipal',
    icon: 'Droplet',
    available: true
  }
];

// Ranking de recicladores locais
const LOCAL_LEADERBOARD = [
  { rank: 1, name: 'Clara Vasconcelos', neighborhood: 'Pinheiros', total_kg: 84.5, points: 1420 },
  { rank: 2, name: 'Rodrigo Mendonça', neighborhood: 'Vila Mariana', total_kg: 68.0, points: 1150 },
  { rank: 3, name: 'Ana Carolina Silva', neighborhood: 'Jardim Primavera', total_kg: 52.2, points: 890 },
  { rank: 4, name: 'Lucas Farias', neighborhood: 'Moema', total_kg: 44.0, points: 720 },
  { rank: 5, name: 'Mariana Duarte', neighborhood: 'Perdizes', total_kg: 38.8, points: 610 }
];

// GET /api/points/rewards - Lista recompensas disponíveis
pointsRouter.get('/rewards', (req, res) => {
  return res.json(REWARDS_CATALOG);
});

// GET /api/points/leaderboard - Ranking de impacto
pointsRouter.get('/leaderboard', (req, res) => {
  return res.json(LOCAL_LEADERBOARD);
});
