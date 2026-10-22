-- ==============================================================================
-- ECO増CICLO - SCHEMA DO BANCO DE DADOS SUPABASE (PostgreSQL)
-- ==============================================================================
-- Este script cria todas as tabelas, tipos, políticas de segurança (RLS),
-- gatilhos e dados iniciais para o aplicativo EcoCiclo.
-- Cole e execute no Editor SQL do seu painel Supabase (https://supabase.com/dashboard).
-- ==============================================================================

-- 1. Habilitar extensões úteis
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabela de Perfis de Usuários (Cidadãos, Coletores e Administradores)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'citizen' CHECK (role IN ('citizen', 'collector', 'admin')),
    address TEXT,
    neighborhood TEXT,
    city TEXT DEFAULT 'São Paulo',
    eco_points INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Tabela de Tipos de Resíduos
CREATE TABLE IF NOT EXISTS public.waste_types (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    points_per_kg INTEGER NOT NULL DEFAULT 10,
    color VARCHAR(20) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    description TEXT,
    instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Tabela de Pontos de Coleta Físicos (Ecopontos / PEVs)
CREATE TABLE IF NOT EXISTS public.collection_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    address TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    accepted_types TEXT[] NOT NULL DEFAULT '{}',
    operating_hours TEXT,
    phone TEXT,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'maintenance')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Pontos operacionais exibidos no mapa (catadores, geradores e prédios)
CREATE TABLE IF NOT EXISTS public.map_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    entity_type VARCHAR(30) NOT NULL CHECK (entity_type IN ('collector', 'large_generator', 'building')),
    description TEXT,
    address TEXT NOT NULL,
    neighborhood TEXT,
    city TEXT NOT NULL DEFAULT 'São Paulo',
    latitude DOUBLE PRECISION NOT NULL CHECK (latitude BETWEEN -90 AND 90),
    longitude DOUBLE PRECISION NOT NULL CHECK (longitude BETWEEN -180 AND 180),
    phone TEXT,
    service_status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (service_status IN ('active', 'inactive', 'pending')),
    accepted_types TEXT[] NOT NULL DEFAULT '{}',
    contact_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Tabela de Solicitações de Coleta Domiciliar
CREATE TABLE IF NOT EXISTS public.collection_requests (
    id TEXT PRIMARY KEY DEFAULT ('col-' || extract(epoch from now())::bigint),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    user_phone TEXT,
    address TEXT NOT NULL,
    neighborhood TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'São Paulo',
    waste_type_id VARCHAR(50) REFERENCES public.waste_types(id) ON DELETE RESTRICT,
    estimated_weight_kg NUMERIC(6, 2) NOT NULL DEFAULT 1.0,
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'in_progress', 'completed', 'cancelled')),
    scheduled_date DATE NOT NULL,
    scheduled_period VARCHAR(20) NOT NULL DEFAULT 'manha' CHECK (scheduled_period IN ('manha', 'tarde')),
    notes TEXT,
    points_awarded INTEGER DEFAULT 0,
    collector_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. Tabela de Recompensas e Parcerias Ecológicas
CREATE TABLE IF NOT EXISTS public.eco_rewards (
    id TEXT PRIMARY KEY DEFAULT ('rew-' || extract(epoch from now())::bigint),
    title TEXT NOT NULL,
    partner TEXT NOT NULL,
    points_required INTEGER NOT NULL,
    category TEXT NOT NULL,
    icon TEXT DEFAULT 'Gift',
    available BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. Tabela de Histórico de Pontos e Transações Ecológicas
CREATE TABLE IF NOT EXISTS public.eco_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('earned', 'redeemed')),
    points INTEGER NOT NULL,
    collection_id TEXT REFERENCES public.collection_requests(id) ON DELETE SET NULL,
    reward_id TEXT REFERENCES public.eco_rewards(id) ON DELETE SET NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) - Segurança a Nível de Linha
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waste_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.map_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eco_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eco_transactions ENABLE ROW LEVEL SECURITY;

-- Políticas para waste_types (Leitura pública permitida para todos)
CREATE POLICY "Leitura pública de tipos de resíduos"
    ON public.waste_types FOR SELECT
    USING (true);

-- Políticas para collection_points (Leitura pública permitida para todos)
CREATE POLICY "Leitura pública de ecopontos"
    ON public.collection_points FOR SELECT
    USING (true);

CREATE POLICY "Leitura pública de pontos operacionais"
    ON public.map_locations FOR SELECT
    USING (true);

-- Políticas para eco_rewards (Leitura pública de recompensas disponíveis)
CREATE POLICY "Leitura pública de recompensas"
    ON public.eco_rewards FOR SELECT
    USING (true);

-- Políticas para collection_requests (Qualquer pessoa pode criar e consultar para o fluxo aberto)
CREATE POLICY "Permitir inserção de solicitações de coleta"
    ON public.collection_requests FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Permitir visualização de coletas"
    ON public.collection_requests FOR SELECT
    USING (true);

CREATE POLICY "Permitir atualização de status de coletas"
    ON public.collection_requests FOR UPDATE
    USING (true);

-- Políticas para perfis de usuários
CREATE POLICY "Perfis visíveis para usuários autenticados"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar o próprio perfil"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- ==============================================================================
-- DADOS INICIAIS (SEED DATA)
-- ==============================================================================

-- Inserir Tipos de Resíduos Recicláveis
INSERT INTO public.waste_types (id, name, category, points_per_kg, color, icon, description, instructions)
VALUES
    ('plastic', 'Plástico', 'Seco Reciclável', 15, '#ef4444', 'Package', 'Garrafas PET, embalagens, sacolas limpas e potes plásticos.', 'Lave as embalagens e retire tampas e rótulos quando possível.'),
    ('paper', 'Papel & Papelão', 'Seco Reciclável', 10, '#3b82f6', 'FileText', 'Caixas de papelão, jornais, revistas, folhas de caderno.', 'Mantenha secos e dobrados para otimizar o espaço.'),
    ('glass', 'Vidro', 'Seco Reciclável', 20, '#10b981', 'Wine', 'Garrafas, potes de conserva, frascos.', 'Embale peças pontiagudas ou quebradas com jornal para proteção dos coletores.'),
    ('metal', 'Metal & Alumínio', 'Seco Reciclável', 25, '#f59e0b', 'Shield', 'Latinhas de alumínio, tampas metálicas, panelas velhas.', 'Amasse as latinhas para reduzir o volume e escorra líquidos.'),
    ('electronic', 'Eletrônicos (E-Waste)', 'Especial', 50, '#8b5cf6', 'Cpu', 'Celulares antigos, cabos, placas, carregadores e periféricos.', 'Nunca descarte no lixo comum. Remova baterias se for possível.'),
    ('organic', 'Orgânico (Compostagem)', 'Biodegradável', 8, '#84cc16', 'Apple', 'Restos de frutas, cascas de legumes, borra de café.', 'Mantenha separado de carnes, laticínios e embalagens plásticas.'),
    ('cooking_oil', 'Óleo de Cozinha Usado', 'Especial / Líquido', 35, '#eab308', 'Droplet', 'Óleo vegetal usado acondicionado em garrafas PET.', 'Espere esfriar e filtre antes de colocar na garrafa PET bem vedada.')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    points_per_kg = EXCLUDED.points_per_kg,
    description = EXCLUDED.description;

-- Inserir Ecopontos Físicos
INSERT INTO public.collection_points (name, address, latitude, longitude, accepted_types, operating_hours, phone, status)
VALUES
    ('Ecoponto Central - Parque da Cidade', 'Av. das Nações, 450 - Centro', -23.55052, -46.633308, ARRAY['plastic', 'paper', 'glass', 'metal', 'electronic', 'cooking_oil'], 'Seg a Sáb: 08:00 às 18:00', '(11) 3214-5500', 'open'),
    ('Ponto Verde - Vila Madalena', 'Rua Fradique Coutinho, 980', -23.55745, -46.68912, ARRAY['plastic', 'paper', 'glass', 'organic'], 'Ter a Dom: 09:00 às 17:00', '(11) 3031-8822', 'open'),
    ('Ecoponto Eletrônicos & Sucata - Moema', 'Al. dos Maracatins, 1200', -23.60621, -46.66115, ARRAY['electronic', 'metal', 'cooking_oil'], 'Seg a Sex: 08:30 às 17:30', '(11) 5052-1144', 'open');

-- Inserir pontos operacionais para o mapa
INSERT INTO public.map_locations
    (name, entity_type, description, address, neighborhood, latitude, longitude, phone, service_status, accepted_types, contact_name)
VALUES
    ('Cooperativa Recicla Centro', 'collector', 'Cooperativa de catadores com coleta programada para empresas e condomínios.', 'Rua do Glicério, 210 - Centro', 'Centro', -23.55520, -46.63210, '(11) 3112-4400', 'active', ARRAY['plastic', 'paper', 'glass', 'metal'], 'Maria da Silva'),
    ('Coleta Cidadã Vila Mariana', 'collector', 'Catador autônomo cadastrado para rotas de recicláveis secos.', 'Rua Vergueiro, 1850 - Vila Mariana', 'Vila Mariana', -23.58980, -46.63580, '(11) 99876-1122', 'active', ARRAY['plastic', 'paper', 'metal'], 'João Santos'),
    ('Mercado Municipal Sul', 'large_generator', 'Grande gerador de resíduos orgânicos, papelão e óleo de cozinha.', 'Av. Jabaquara, 3100 - Saúde', 'Saúde', -23.61850, -46.63890, '(11) 3555-8800', 'active', ARRAY['organic', 'paper', 'cooking_oil'], 'Ana Oliveira'),
    ('Shopping Verde Norte', 'large_generator', 'Centro comercial com alto volume de papelão, plástico e vidro.', 'Av. Cruzeiro do Sul, 1550 - Santana', 'Santana', -23.51140, -46.62470, '(11) 3344-2211', 'active', ARRAY['plastic', 'paper', 'glass', 'metal'], 'Carlos Lima'),
    ('Edifício Horizonte', 'building', 'Condomínio residencial com coleta seletiva para moradores.', 'Rua Harmonia, 720 - Vila Madalena', 'Vila Madalena', -23.55670, -46.69030, '(11) 3030-7788', 'active', ARRAY['plastic', 'paper', 'glass', 'metal'], 'Síndica Fernanda Costa'),
    ('Condomínio Parque das Árvores', 'building', 'Condomínio com área de armazenamento temporário de recicláveis.', 'Rua das Acácias, 95 - Moema', 'Moema', -23.60320, -46.66710, '(11) 5050-6611', 'pending', ARRAY['plastic', 'paper', 'glass', 'organic'], 'Roberto Almeida');

-- Inserir Catálogo de Recompensas
INSERT INTO public.eco_rewards (id, title, partner, points_required, category, icon, available)
VALUES
    ('rew-1', 'Desconto de R$ 20 no Hortifruti Orgânico', 'HortiVerde Parceiro', 150, 'Alimentação Saudável', 'Apple', true),
    ('rew-2', 'Kit Sacolas Ecológicas & Compostagem', 'EcoCiclo Brasil', 200, 'Sustentabilidade', 'Package', true),
    ('rew-3', 'Muda Nativa de Ipê Amarelo para Plantio', 'Secretaria do Meio Ambiente', 100, 'Florestamento Urbano', 'Leaf', true),
    ('rew-4', 'Crédito de 15% na Fatura de Água/Saneamento', 'Programa IPTU & Tarifa Verde', 400, 'Economia Municipal', 'Droplet', true)
ON CONFLICT (id) DO NOTHING;
