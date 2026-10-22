import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { wasteTypesRouter } from './routes/wasteTypes.js';
import { collectionsRouter } from './routes/collections.js';
import { pointsRouter } from './routes/points.js';
import { collectionPointsRouter } from './routes/collectionPoints.js';
import { isSupabaseConfigured } from './supabase.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Rota de status / health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'EcoCiclo API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    supabaseConnected: isSupabaseConfigured()
  });
});

// Rotas da API
app.use('/api/waste-types', wasteTypesRouter);
app.use('/api/collections', collectionsRouter);
app.use('/api/points', pointsRouter);
app.use('/api/collection-points', collectionPointsRouter);

// Tratamento 404
app.use((req, res) => {
  res.status(404).json({ error: `Rota não encontrada: ${req.method} ${req.originalUrl}` });
});

// Tratamento de erros globais
app.use((err, req, res, next) => {
  console.error('Erro no servidor:', err);
  res.status(500).json({ error: 'Erro interno no servidor EcoCiclo' });
});

app.listen(PORT, () => {
  console.log(`\n🌱 EcoCiclo Backend rodando em: http://localhost:${PORT}`);
  console.log(`🔗 API Health: http://localhost:${PORT}/api/health`);
  console.log(`📡 Supabase configurado: ${isSupabaseConfigured() ? 'SIM ✅' : 'NÃO (usando modo fallback mock) ⚠️'}\n`);
});
