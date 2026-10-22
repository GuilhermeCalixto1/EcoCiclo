# 🌿 Configuração do Supabase para o EcoCiclo

Este guia explica passo a passo como conectar seu projeto EcoCiclo ao Supabase para persistência de dados em tempo real, autenticação e gerenciamento de coletas.

---

## 1. Criar um Projeto no Supabase
1. Acesse [supabase.com](https://supabase.com) e faça login ou crie uma conta gratuita.
2. Clique em **"New Project"**.
3. Escolha o nome (ex: `ecociclo`), defina uma senha forte para o banco de dados e selecione a região mais próxima (ex: *São Paulo - sa-east-1*).
4. Aguarde cerca de 1 a 2 minutos até que o projeto seja provisionado.

---

## 2. Executar o Script SQL (Tabelas, RLS e Seeds)
1. No painel lateral do Supabase, clique no ícone **SQL Editor** (ou acesse a aba SQL).
2. Clique em **"New query"**.
3. Abra o arquivo [`supabase/schema.sql`](file:///c:/Users/Guica/Documents/Estudos/EcoCiclo/supabase/schema.sql) deste projeto.
4. Copie todo o conteúdo e cole no editor SQL do Supabase.
5. Clique no botão **"Run"** (ou aperte `Ctrl + Enter`).
6. Você verá as tabelas criadas:
   - `profiles` (Perfis de usuários, coletores e pontuação)
   - `waste_types` (Tipos de resíduos com pontuações ecológicas)
   - `collection_points` (Ecopontos físicos e PEVs na cidade)
   - `collection_requests` (Solicitações de coleta domiciliar agendadas)
   - `eco_rewards` (Catálogo de recompensas e cupons para troca)
   - `eco_transactions` (Extrato de pontos e créditos verdes)

---

## 3. Obter as Chaves de API do Supabase
1. No painel do Supabase, vá em **Project Settings** (ícone de engrenagem no canto inferior esquerdo) > **API**.
2. Copie os seguintes valores:
   - **Project URL** (ex: `https://abcdefghijklm.supabase.co`)
   - **Project API Keys**:
     - `anon` / `public` (Chave pública para o frontend e backend)
     - `service_role` (Chave secreta de administrador para o backend - nunca compartilhe no frontend)

---

## 4. Configurar as Variáveis de Ambiente no EcoCiclo

### No Frontend (`frontend/.env`):
Crie o arquivo `frontend/.env` com:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica-aqui
VITE_API_URL=http://localhost:3001/api
```

### No Backend (`backend/.env`):
Edite o arquivo `backend/.env` com:
```env
PORT=3001
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anon-publica-aqui
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role-aqui
CLIENT_ORIGIN=http://localhost:5173
```

---

## 5. Modo de Demonstração / Fallback Automático
O EcoCiclo foi programado com **resiliência total**:
- Caso você ainda não tenha colocado as chaves do Supabase, o sistema funcionará imediatamente em modo **Mock Local / Demonstração**, permitindo cadastrar coletas, visualizar o dashboard, calcular pontos e testar todas as funcionalidades na interface!
- Assim que você adicionar as chaves do Supabase, o sistema conecta automaticamente ao seu banco PostgreSQL.
