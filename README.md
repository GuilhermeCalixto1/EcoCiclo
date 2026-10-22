# 🌱 EcoCiclo - Plataforma Inteligente de Coleta Seletiva & Reciclagem

O **EcoCiclo** é uma solução completa (Fullstack) criada para conectar cidadãos, coletores e cooperativas de reciclagem. O sistema permite agendar coletas seletivas domiciliares, localizar ecopontos na cidade, acumular **EcoPontos** a cada quilo reciclado e resgatar benefícios sustentáveis em estabelecimentos parceiros.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
  - Design System moderno em Vanilla CSS (tema escuro Eco-Tech, Glassmorphism, tipografia com Google Fonts *Outfit* & *Plus Jakarta Sans*)
  - Ícones vetoriais com [Lucide React](https://lucide.dev/)
  - Animações e micro-interações de celebração com [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
  - Integração direta com o cliente [@supabase/supabase-js](https://supabase.com/docs/reference/javascript)
- **Backend**: [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
  - API RESTful modular (rotas para coletas, resíduos, ecopontos e recompensas)
  - Integração segura com o Supabase (PostgreSQL)
  - Fallback automático para modo de demonstração local caso o banco ainda não esteja conectado
  - Logging HTTP com Morgan e suporte a CORS
- **Banco de Dados**: [Supabase](https://supabase.com/) (PostgreSQL)
  - Script DDL completo com tabelas, chaves estrangeiras, Row Level Security (RLS) e dados iniciais (*seeds*)

---

## 📁 Estrutura do Projeto

```text
EcoCiclo/
├── backend/                        # API Node.js com Express e Supabase
│   ├── src/
│   │   ├── routes/
│   │   │   ├── collections.js      # Rotas de agendamento e status de coletas
│   │   │   ├── wasteTypes.js       # Catálogo de tipos de materiais recicláveis
│   │   │   ├── points.js           # Recompensas e ranking da comunidade
│   │   │   └── collectionPoints.js # Ecopontos físicos e PEVs na cidade
│   │   ├── index.js                # Ponto de entrada do servidor Express
│   │   └── supabase.js             # Conexão e inicialização do cliente Supabase
│   ├── .env.example                # Modelo de variáveis de ambiente do backend
│   └── package.json
│
├── frontend/                       # Aplicação Web React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Topbar com navegação e status do Supabase
│   │   │   ├── StatsOverview.jsx   # Métricas (Kg reciclados, CO2 evitado, EcoPontos)
│   │   │   ├── WasteCategorySelector.jsx # Catálogo visual de resíduos aceitos
│   │   │   ├── ScheduleModal.jsx   # Modal de agendamento de coleta domiciliar
│   │   │   ├── CollectionsManager.jsx    # Painel de gestão e filtro de coletas
│   │   │   ├── EcopointsMap.jsx    # Mapa e listagem de ecopontos físicos
│   │   │   ├── RewardsView.jsx     # Catálogo de prêmios e EcoLeaderboard
│   │   │   └── SupabaseInfoBanner.jsx # Guia inline de conexão com Supabase
│   │   ├── services/
│   │   │   ├── api.js              # Serviço de comunicação com o Backend
│   │   │   └── supabase.js         # Cliente Supabase para o Frontend
│   │   ├── App.jsx                 # Componente raiz da interface
│   │   └── index.css               # Design System completo em Vanilla CSS
│   ├── .env.example                # Modelo de variáveis de ambiente do frontend
│   └── package.json
│
├── supabase/                       # Arquivos e Migrações do Banco de Dados
│   ├── schema.sql                  # Script SQL com tabelas, RLS e dados iniciais
│   └── README.md                   # Guia passo a passo de configuração do Supabase
│
├── .env.example                    # Referência global de variáveis
├── package.json                    # Scripts do workspace para rodar tudo junto
└── README.md                       # Documentação principal do projeto
```

---

## 🚀 Como Executar o Projeto

Você pode iniciar o **Backend e o Frontend juntos** com um único comando na raiz da pasta `EcoCiclo`:

```bash
# 1. Iniciar tanto o Backend (porta 3001) quanto o Frontend (porta 5173) simultaneamente:
npm run dev
```

Ou se preferir iniciar individualmente em terminais separados:

```bash
# Iniciar apenas o Backend Node.js:
npm run dev:backend

# Iniciar apenas o Frontend React:
npm run dev:frontend
```

Abra o seu navegador em [http://localhost:5173](http://localhost:5173) para ver o EcoCiclo funcionando!

---

## ⚡ Conectando ao Supabase

O projeto já funciona imediatamente em modo **Demonstração Local**. Para conectar ao seu banco de dados Supabase real:

1. Acesse [supabase.com](https://supabase.com) e crie um projeto gratuito.
2. No painel do Supabase, vá em **SQL Editor** > **New Query**, cole todo o conteúdo do arquivo [`supabase/schema.sql`](file:///c:/Users/Guica/Documents/Estudos/EcoCiclo/supabase/schema.sql) e clique em **Run**.
3. Em **Project Settings** > **API**, copie sua `Project URL` e a chave pública `anon`.
4. Configure nos arquivos `.env`:
   - No `frontend/.env`:
     ```env
     VITE_SUPABASE_URL=https://seu-projeto.supabase.co
     VITE_SUPABASE_ANON_KEY=sua-chave-anon
     VITE_API_URL=http://localhost:3001/api
     ```
   - No `backend/.env`:
     ```env
     PORT=3001
     SUPABASE_URL=https://seu-projeto.supabase.co
     SUPABASE_ANON_KEY=sua-chave-anon
     SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role
     CLIENT_ORIGIN=http://localhost:5173
     ```
5. Pronto! Ao reiniciar (`npm run dev`), o status no topo mudará automaticamente para **"Supabase Online"**.

---

## 🔌 Rotas da API Node.js

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api/health` | Status da API e verificação de conexão com Supabase |
| `GET` | `/api/waste-types` | Lista tipos de resíduos e pontuações por kg |
| `GET` | `/api/collections` | Lista coletas (com filtro opcional `?status=pending`) |
| `POST` | `/api/collections` | Registra nova solicitação de coleta domiciliar |
| `PATCH`| `/api/collections/:id/status` | Atualiza status da coleta (`scheduled`, `completed`) |
| `GET` | `/api/collections/stats` | Métricas de impacto (kg reciclados, CO2 evitado, pontos) |
| `GET` | `/api/collection-points` | Lista ecopontos físicos e horários de funcionamento |
| `GET` | `/api/points/rewards` | Catálogo de recompensas e cupons para troca |
| `GET` | `/api/points/leaderboard`| Ranking dos maiores recicladores da comunidade |

---

## 💡 Principais Funcionalidades

- **Agendamento Inteligente**: Moradores informam endereço, data, período e peso estimado.
- **Calculadora de EcoPontos**: Estimativa automática de pontos gerados conforme o material.
- **Gestão Operacional de Coletas**: Filtros por status, alteração para *Agendada*, *Em Rota* ou *Concluída*.
- **Painel de Impacto Ambiental**: Estimativa em tempo real de emissões de CO₂ evitadas.
- **Ecopontos Físicos (PEVs)**: Guia de locais para entrega voluntária com integração ao Google Maps.
- **Gamificação & Recompensas**: Resgate de benefícios em parceiros locais e ranking da vizinhança.
