import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, Phone, CheckCircle, ArrowUpRight, Search, Filter } from 'lucide-react';

const STATUS_LABELS = {
  pending: { label: 'Pendente', className: 'status-pending' },
  scheduled: { label: 'Agendada', className: 'status-scheduled' },
  in_progress: { label: 'Em Rota', className: 'status-scheduled' },
  completed: { label: 'Concluída', className: 'status-completed' },
  cancelled: { label: 'Cancelada', className: 'status-pending' }
};

export function CollectionsManager({ collections, wasteTypes, onUpdateStatus, onOpenSchedule }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = collections.filter((item) => {
    const matchesStatus = activeFilter === 'all' || item.status === activeFilter;
    const matchesSearch =
      searchTerm === '' ||
      item.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.neighborhood?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getWasteInfo = (typeId) => {
    return wasteTypes.find((w) => w.id === typeId) || { name: typeId, color: '#34d399' };
  };

  return (
    <section>
      <div className="section-title">
        <div>
          <h2>Gestão de Coletas Agendadas</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Acompanhe em tempo real as coletas solicitadas pelos moradores e rotas dos coletores.
          </p>
        </div>
        <button className="btn btn-primary" onClick={onOpenSchedule}>
          + Nova Coleta
        </button>
      </div>

      {/* Barra de Filtro e Busca */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="filter-bar" style={{ margin: 0 }}>
          <button
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            Todas ({collections.length})
          </button>
          <button
            className={`filter-btn ${activeFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveFilter('pending')}
          >
            Pendentes ({collections.filter((c) => c.status === 'pending').length})
          </button>
          <button
            className={`filter-btn ${activeFilter === 'scheduled' ? 'active' : ''}`}
            onClick={() => setActiveFilter('scheduled')}
          >
            Agendadas ({collections.filter((c) => c.status === 'scheduled').length})
          </button>
          <button
            className={`filter-btn ${activeFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveFilter('completed')}
          >
            Concluídas ({collections.filter((c) => c.status === 'completed').length})
          </button>
        </div>

        <div style={{ position: 'relative', minWidth: '260px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '36px', height: '38px', fontSize: '0.85rem' }}
            placeholder="Buscar por morador ou bairro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Lista de Coletas */}
      {filtered.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '1rem' }}>
            Nenhuma solicitação de coleta encontrada para os filtros selecionados.
          </p>
          <button className="btn btn-outline" onClick={onOpenSchedule}>
            Agendar Primeira Coleta
          </button>
        </div>
      ) : (
        <div className="collections-list">
          {filtered.map((item) => {
            const waste = getWasteInfo(item.waste_type_id);
            const statusConfig = STATUS_LABELS[item.status] || { label: item.status, className: 'status-pending' };

            return (
              <div key={item.id} className="glass-panel collection-item">
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        padding: '0.2rem 0.65rem',
                        borderRadius: '6px',
                        background: `${waste.color}22`,
                        color: waste.color,
                        fontWeight: 700,
                        fontSize: '0.8rem'
                      }}
                    >
                      {waste.name} ({item.estimated_weight_kg} kg)
                    </span>

                    <span className={`collection-status-pill ${statusConfig.className}`}>
                      {statusConfig.label}
                    </span>

                    <span style={{ fontSize: '0.8rem', color: 'var(--emerald-400)', fontWeight: 700 }}>
                      +{item.points_awarded || 0} pts
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem', color: '#fff' }}>
                    {item.user_name}
                  </h3>

                  <div style={{ display: 'flex', gap: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={15} color="var(--emerald-400)" />
                      {item.address} - {item.neighborhood}, {item.city}
                    </span>

                    {item.user_phone && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Phone size={15} color="var(--accent-blue)" />
                        {item.user_phone}
                      </span>
                    )}

                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Calendar size={15} color="var(--accent-amber)" />
                      {new Date(item.scheduled_date).toLocaleDateString('pt-BR')} ({item.scheduled_period === 'manha' ? 'Manhã' : 'Tarde'})
                    </span>
                  </div>

                  {item.notes && (
                    <div style={{ marginTop: '0.65rem', fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      💬 "{item.notes}"
                    </div>
                  )}
                </div>

                {/* Ações de Status */}
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0, flexWrap: 'wrap' }}>
                  {item.status === 'pending' && (
                    <button
                      className="btn btn-secondary"
                      style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
                      onClick={() => onUpdateStatus(item.id, 'scheduled')}
                    >
                      Confirmar Rota
                    </button>
                  )}

                  {item.status !== 'completed' && item.status !== 'cancelled' && (
                    <button
                      className="btn btn-primary"
                      style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
                      onClick={() => onUpdateStatus(item.id, 'completed')}
                    >
                      <CheckCircle size={15} />
                      Concluir Coleta
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
