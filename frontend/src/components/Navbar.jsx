import React from 'react';
import { Recycle, LayoutDashboard, CalendarPlus, ListChecks, MapPin, Award, Truck, Network } from 'lucide-react';

export function Navbar({ activeTab, setActiveTab, onOpenSchedule, isConnected }) {
  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-icon">
          <Recycle size={26} strokeWidth={2.5} />
        </div>
        <div>
          <div className="brand-title">EcoCiclo</div>
          <div className="brand-tagline">Reciclagem & Coleta Seletiva</div>
        </div>
      </div>

      <nav className="nav-tabs" aria-label="Navegação principal">
        <button
          className={`nav-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={17} />
          Painel
        </button>
        <button
          className={`nav-tab-btn ${activeTab === 'collections' ? 'active' : ''}`}
          onClick={() => setActiveTab('collections')}
        >
          <ListChecks size={17} />
          Coletas
        </button>
        <button
          className={`nav-tab-btn ${activeTab === 'tracking' ? 'active' : ''}`}
          onClick={() => setActiveTab('tracking')}
        >
          <Truck size={17} />
          Caminhão
        </button>
        <button
          className={`nav-tab-btn ${activeTab === 'ecopoints' ? 'active' : ''}`}
          onClick={() => setActiveTab('ecopoints')}
        >
          <MapPin size={17} />
          Ecopontos
        </button>
        <button
          className={`nav-tab-btn ${activeTab === 'network-map' ? 'active' : ''}`}
          onClick={() => setActiveTab('network-map')}
        >
          <Network size={17} />
          Mapa da rede
        </button>
        <button
          className={`nav-tab-btn ${activeTab === 'rewards' ? 'active' : ''}`}
          onClick={() => setActiveTab('rewards')}
        >
          <Award size={17} />
          EcoPontos & Prêmios
        </button>
      </nav>

      <div className="header-actions">
        <div className={`status-badge ${isConnected ? 'connected' : 'fallback'}`} title={isConnected ? 'Conectado ao Supabase PostgreSQL' : 'Modo Demonstração Local Ativo'}>
          <span className="status-dot"></span>
          <span>{isConnected ? 'Supabase Online' : 'Modo Local'}</span>
        </div>

        <button className="btn btn-primary" onClick={onOpenSchedule} id="btn-header-schedule">
          <CalendarPlus size={18} />
          <span>Agendar Coleta</span>
        </button>
      </div>
    </header>
  );
}
