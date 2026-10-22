import React from 'react';
import { MapPin, Clock, Phone, Navigation, Check } from 'lucide-react';

export function EcopointsMap({ ecopoints, wasteTypes }) {
  const getWasteName = (id) => {
    const item = wasteTypes.find((w) => w.id === id);
    return item ? item.name : id;
  };

  return (
    <section>
      <div className="section-title">
        <div>
          <h2>Ecopontos & Pontos de Entrega Voluntária (PEVs)</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Prefere levar seus materiais recicláveis pessoalmente? Localize o ponto mais próximo de você.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {ecopoints.map((point) => (
          <div key={point.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span className="status-badge connected" style={{ fontSize: '0.75rem' }}>
                  Aberto para Entrega
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ponto Oficial</span>
              </div>

              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem', color: '#fff' }}>
                {point.name}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <MapPin size={17} color="var(--emerald-400)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{point.address}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={16} color="var(--accent-amber)" />
                  <span>{point.operating_hours}</span>
                </div>

                {point.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Phone size={16} color="var(--accent-blue)" />
                    <span>{point.phone}</span>
                  </div>
                )}
              </div>

              {/* Materiais Aceitos */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Materiais Aceitos
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {point.accepted_types.map((typeId) => (
                    <span
                      key={typeId}
                      style={{
                        fontSize: '0.75rem',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        color: '#e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <Check size={12} color="var(--emerald-400)" />
                      {getWasteName(typeId)}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(point.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{ width: '100%', textDecoration: 'none' }}
            >
              <Navigation size={16} />
              Como Chegar (Google Maps)
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
