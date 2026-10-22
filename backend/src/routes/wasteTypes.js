import { Router } from 'express';
import { supabase, isSupabaseConfigured } from '../supabase.js';

export const wasteTypesRouter = Router();

// Tipos padrão de resíduos recicláveis com pontuação ecológica
export const DEFAULT_WASTE_TYPES = [
  {
    id: 'plastic',
    name: 'Plástico',
    category: 'Seco Reciclável',
    points_per_kg: 15,
    color: '#ef4444',
    icon: 'Package',
    description: 'Garrafas PET, embalagens, sacolas limpas, potes plásticos.',
    instructions: 'Lave as embalagens e retire tampas e rótulos quando possível.'
  },
  {
    id: 'paper',
    name: 'Papel & Papelão',
    category: 'Seco Reciclável',
    points_per_kg: 10,
    color: '#3b82f6',
    icon: 'FileText',
    description: 'Caixas de papelão, jornais, revistas, folhas de caderno.',
    instructions: 'Mantenha secos e dobrados para otimizar o espaço.'
  },
  {
    id: 'glass',
    name: 'Vidro',
    category: 'Seco Reciclável',
    points_per_kg: 20,
    color: '#10b981',
    icon: 'Wine',
    description: 'Garrafas, potes de conserva, frascos.',
    instructions: 'Embale peças pontiagudas ou quebradas com jornal para proteção dos coletores.'
  },
  {
    id: 'metal',
    name: 'Metal & Alumínio',
    category: 'Seco Reciclável',
    points_per_kg: 25,
    color: '#f59e0b',
    icon: 'Shield',
    description: 'Latinhas de alumínio, tampas metálicas, panelas velhas.',
    instructions: 'Amasse as latinhas para reduzir o volume e escorra líquidos.'
  },
  {
    id: 'electronic',
    name: 'Eletrônicos (E-Waste)',
    category: 'Especial',
    points_per_kg: 50,
    color: '#8b5cf6',
    icon: 'Cpu',
    description: 'Celulares antigos, cabos, placas, carregadores e teclados.',
    instructions: 'Nunca descarte no lixo comum. Remova baterias se for possível.'
  },
  {
    id: 'organic',
    name: 'Orgânico (Compostagem)',
    category: 'Biodegradável',
    points_per_kg: 8,
    color: '#84cc16',
    icon: 'Apple',
    description: 'Restos de frutas, cascas de legumes, borra de café.',
    instructions: 'Mantenha separado de carnes, laticínios e embalagens plásticas.'
  },
  {
    id: 'cooking_oil',
    name: 'Óleo de Cozinha Usado',
    category: 'Especial / Líquido',
    points_per_kg: 35,
    color: '#eab308',
    icon: 'Droplet',
    description: 'Óleo vegetal usado acondicionado em garrafas PET.',
    instructions: 'Espere esfriar e filtre antes de colocar na garrafa PET bem vedada.'
  }
];

// GET /api/waste-types
wasteTypesRouter.get('/', async (req, res) => {
  try {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('waste_types')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.warn('Erro ao consultar waste_types no Supabase:', error.message);
        return res.json(DEFAULT_WASTE_TYPES);
      }

      if (data && data.length > 0) {
        return res.json(data);
      }
    }

    return res.json(DEFAULT_WASTE_TYPES);
  } catch (err) {
    console.error('Erro na rota /api/waste-types:', err);
    return res.status(500).json({ error: 'Erro ao buscar tipos de resíduos' });
  }
});
