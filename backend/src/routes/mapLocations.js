import { Router } from 'express';
import { supabase, isSupabaseConfigured } from '../supabase.js';

export const mapLocationsRouter = Router();

const DEFAULT_MAP_LOCATIONS = [
  {
    id: 'collector-1',
    name: 'Cooperativa Recicla Centro',
    entity_type: 'collector',
    description: 'Cooperativa de catadores com coleta programada para empresas e condomínios.',
    address: 'Rua do Glicério, 210 - Centro',
    neighborhood: 'Centro',
    latitude: -23.5552,
    longitude: -46.6321,
    phone: '(11) 3112-4400',
    service_status: 'active',
    accepted_types: ['plastic', 'paper', 'glass', 'metal'],
    contact_name: 'Maria da Silva'
  },
  {
    id: 'collector-2',
    name: 'Coleta Cidadã Vila Mariana',
    entity_type: 'collector',
    description: 'Catador autônomo cadastrado para rotas de recicláveis secos.',
    address: 'Rua Vergueiro, 1850 - Vila Mariana',
    neighborhood: 'Vila Mariana',
    latitude: -23.5898,
    longitude: -46.6358,
    phone: '(11) 99876-1122',
    service_status: 'active',
    accepted_types: ['plastic', 'paper', 'metal'],
    contact_name: 'João Santos'
  },
  {
    id: 'generator-1',
    name: 'Mercado Municipal Sul',
    entity_type: 'large_generator',
    description: 'Grande gerador de resíduos orgânicos, papelão e óleo de cozinha.',
    address: 'Av. Jabaquara, 3100 - Saúde',
    neighborhood: 'Saúde',
    latitude: -23.6185,
    longitude: -46.6389,
    phone: '(11) 3555-8800',
    service_status: 'active',
    accepted_types: ['organic', 'paper', 'cooking_oil'],
    contact_name: 'Ana Oliveira'
  },
  {
    id: 'generator-2',
    name: 'Shopping Verde Norte',
    entity_type: 'large_generator',
    description: 'Centro comercial com alto volume de papelão, plástico e vidro.',
    address: 'Av. Cruzeiro do Sul, 1550 - Santana',
    neighborhood: 'Santana',
    latitude: -23.5114,
    longitude: -46.6247,
    phone: '(11) 3344-2211',
    service_status: 'active',
    accepted_types: ['plastic', 'paper', 'glass', 'metal'],
    contact_name: 'Carlos Lima'
  },
  {
    id: 'building-1',
    name: 'Edifício Horizonte',
    entity_type: 'building',
    description: 'Condomínio residencial com coleta seletiva para moradores.',
    address: 'Rua Harmonia, 720 - Vila Madalena',
    neighborhood: 'Vila Madalena',
    latitude: -23.5567,
    longitude: -46.6903,
    phone: '(11) 3030-7788',
    service_status: 'active',
    accepted_types: ['plastic', 'paper', 'glass', 'metal'],
    contact_name: 'Síndica Fernanda Costa'
  },
  {
    id: 'building-2',
    name: 'Condomínio Parque das Árvores',
    entity_type: 'building',
    description: 'Condomínio com área de armazenamento temporário de recicláveis.',
    address: 'Rua das Acácias, 95 - Moema',
    neighborhood: 'Moema',
    latitude: -23.6032,
    longitude: -46.6671,
    phone: '(11) 5050-6611',
    service_status: 'pending',
    accepted_types: ['plastic', 'paper', 'glass', 'organic'],
    contact_name: 'Roberto Almeida'
  }
];

mapLocationsRouter.get('/', async (req, res) => {
  try {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('map_locations')
        .select('*')
        .order('name');
      if (!error && data && data.length > 0) {
        return res.json(data);
      }
    }
    return res.json(DEFAULT_MAP_LOCATIONS);
  } catch (err) {
    console.error('Erro ao buscar pontos do mapa:', err);
    return res.status(500).json({ error: 'Erro ao buscar pontos do mapa' });
  }
});
