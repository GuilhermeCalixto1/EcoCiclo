import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { StatsOverview } from './components/StatsOverview';
import { WasteCategorySelector } from './components/WasteCategorySelector';
import { ScheduleModal } from './components/ScheduleModal';
import { CollectionsManager } from './components/CollectionsManager';
import { EcopointsMap } from './components/EcopointsMap';
import { RewardsView } from './components/RewardsView';
import { TruckTracking } from './components/TruckTracking';
import { SupabaseInfoBanner } from './components/SupabaseInfoBanner';
import { OperationalMap } from './components/OperationalMap';
import { api } from './services/api';
import { isSupabaseConfigured } from './services/supabase';
import { Sparkles, Calendar, ArrowRight, Truck } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [wasteTypes, setWasteTypes] = useState([]);
  const [collections, setCollections] = useState([]);
  const [stats, setStats] = useState({
    totalCollections: 3,
    completedCollections: 1,
    pendingCollections: 1,
    scheduledCollections: 1,
    totalWeightRecycledKg: 14.5,
    totalEcoPointsAwarded: 327,
    co2SavedKg: 26.4
  });
  const [ecopoints, setEcopoints] = useState([]);
  const [mapLocations, setMapLocations] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedWasteTypeId, setSelectedWasteTypeId] = useState('plastic');
  const [supabaseConnected, setSupabaseConnected] = useState(false);

  // Carregar dados iniciais
  const loadInitialData = async () => {
    try {
      const types = await api.getWasteTypes();
      setWasteTypes(types);

      const colList = await api.getCollections();
      if (colList && colList.length > 0) {
        setCollections(colList);
      }

      const st = await api.getStats();
      if (st && st.totalCollections) {
        setStats(st);
      }

      const pointsList = await api.getCollectionPoints();
      setEcopoints(pointsList);

      const locationsList = await api.getMapLocations();
      setMapLocations(locationsList);

      const rewList = await api.getRewards();
      setRewards(rewList);

      const leadList = await api.getLeaderboard();
      setLeaderboard(leadList);

      setSupabaseConnected(isSupabaseConfigured());
    } catch (err) {
      console.warn('Erro ao carregar dados:', err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleOpenScheduleForType = (typeId) => {
    setSelectedWasteTypeId(typeId);
    setIsScheduleOpen(true);
  };

  const handleCreateCollection = async (formData) => {
    const created = await api.createCollection(formData);
    // Atualiza estado local de imediato
    setCollections((prev) => [created, ...prev]);

    // Recalcular métricas
    const updatedStats = await api.getStats();
    if (updatedStats) {
      setStats(updatedStats);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const updated = await api.updateStatus(id, newStatus);
      setCollections((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      );
      const updatedStats = await api.getStats();
      if (updatedStats) {
        setStats(updatedStats);
      }
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
    }
  };

  return (
    <div className="app-container">
      {/* Barra de Navegação Superior */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSchedule={() => setIsScheduleOpen(true)}
        isConnected={supabaseConnected}
      />

      {/* Banner Informativo do Supabase */}
      <SupabaseInfoBanner isConnected={supabaseConnected} />

      {/* Visão: DASHBOARD PRINCIPAL */}
      {activeTab === 'dashboard' && (
        <main>
          {/* Hero Banner */}
          <div className="hero-banner">
            <div className="hero-content">
              <h1>Coleta Seletiva Inteligente na Porta da Sua Casa</h1>
              <p>
                Agende a retirada de recicláveis, acompanhe o trajeto dos coletores e transforme resíduos descartados em EcoPontos com descontos em estabelecimentos parceiros.
              </p>
              <div className="hero-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => setIsScheduleOpen(true)}
                  id="btn-hero-schedule"
                >
                  <Calendar size={18} />
                  Agendar Coleta Agora
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setActiveTab('tracking')}
                >
                  <Truck size={18} />
                  Ver Rotas e Coletas
                </button>
              </div>
            </div>

            <div style={{
              background: 'rgba(0,0,0,0.3)',
              padding: '1.5rem',
              borderRadius: '16px',
              border: '1px solid rgba(52, 211, 153, 0.25)',
              minWidth: '240px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Status da Sua Região</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399', margin: '0.4rem 0' }}>
                Coletas Ativas Hoje
              </div>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                {stats.pendingCollections + stats.scheduledCollections} agendamentos em andamento
              </div>
            </div>
          </div>

          {/* Cards de Métricas Ambientais */}
          <StatsOverview stats={stats} />

          {/* Catálogo de Resíduos */}
          <WasteCategorySelector
            wasteTypes={wasteTypes}
            onSelectType={handleOpenScheduleForType}
          />
        </main>
      )}

      {/* Visão: GESTÃO DE COLETAS */}
      {activeTab === 'collections' && (
        <CollectionsManager
          collections={collections}
          wasteTypes={wasteTypes}
          onUpdateStatus={handleUpdateStatus}
          onOpenSchedule={() => setIsScheduleOpen(true)}
        />
      )}

      {/* Visão: RASTREAMENTO DO CAMINHÃO */}
      {activeTab === 'tracking' && (
        <TruckTracking
          collections={collections}
          onOpenSchedule={() => setIsScheduleOpen(true)}
        />
      )}

      {/* Visão: ECOPONTOS FÍSICOS */}
      {activeTab === 'ecopoints' && (
        <EcopointsMap
          ecopoints={ecopoints}
          wasteTypes={wasteTypes}
        />
      )}

      {activeTab === 'network-map' && (
        <OperationalMap locations={mapLocations} />
      )}

      {/* Visão: RECOMPENSAS E RANKING */}
      {activeTab === 'rewards' && (
        <RewardsView
          rewards={rewards}
          leaderboard={leaderboard}
          userPoints={stats.totalEcoPointsAwarded || 320}
        />
      )}

      {/* Modal de Agendamento */}
      <ScheduleModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        wasteTypes={wasteTypes}
        initialWasteTypeId={selectedWasteTypeId}
        onSuccess={handleCreateCollection}
      />
    </div>
  );
}

export default App;
