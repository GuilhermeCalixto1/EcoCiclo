import React, { useMemo, useState } from 'react';
import { Building2, ExternalLink, Factory, MapPin, Phone, Recycle, UserRound } from 'lucide-react';

const FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'collector', label: 'Catadores', icon: UserRound },
  { id: 'large_generator', label: 'Grandes geradores', icon: Factory },
  { id: 'building', label: 'Prédios e condomínios', icon: Building2 }
];

const TYPE_CONFIG = {
  collector: { label: 'Catador', color: 'var(--emerald-400)', icon: UserRound },
  large_generator: { label: 'Grande gerador', color: 'var(--accent-amber)', icon: Factory },
  building: { label: 'Prédio / condomínio', color: 'var(--accent-blue)', icon: Building2 }
};

export function OperationalMap({ locations }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const filteredLocations = useMemo(
    () => locations.filter((location) => activeFilter === 'all' || location.entity_type === activeFilter),
    [activeFilter, locations]
  );
  const mapPositions = useMemo(() => {
    if (filteredLocations.length === 0) return new Map();
    const latitudes = filteredLocations.map((location) => location.latitude);
    const longitudes = filteredLocations.map((location) => location.longitude);
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);
    const latRange = Math.max(maxLat - minLat, 0.001);
    const lngRange = Math.max(maxLng - minLng, 0.001);

    return new Map(filteredLocations.map((location) => [
      location.id,
      {
        left: `${12 + ((location.longitude - minLng) / lngRange) * 76}%`,
        top: `${12 + ((maxLat - location.latitude) / latRange) * 76}%`
      }
    ]));
  }, [filteredLocations]);

  return (
    <section>
      <div className="section-title">
        <div>
          <h2>Mapa da rede de reciclagem</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Conecte catadores, grandes geradores e prédios para organizar as rotas de coleta.
          </p>
        </div>
      </div>

      <div className="map-filter-bar" role="group" aria-label="Filtrar pontos do mapa">
        {FILTERS.map(({ id, label, icon: Icon }) => (
          <button key={id} className={`map-filter ${activeFilter === id ? 'active' : ''}`} onClick={() => setActiveFilter(id)}>
            {Icon && <Icon size={16} />}
            {label}
          </button>
        ))}
      </div>

      <div className="operational-map-layout">
        <div className="operational-map glass-panel" role="img" aria-label="Mapa operacional da rede de reciclagem">
          {filteredLocations.map((location) => {
            const config = TYPE_CONFIG[location.entity_type];
            const Icon = config.icon;
            return (
              <a
                key={location.id}
                className="map-location-pin"
                style={{ ...mapPositions.get(location.id), '--pin-color': config.color }}
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                title={`${location.name} - abrir no Google Maps`}
              >
                <Icon size={17} />
              </a>
            );
          })}
          <div className="map-compass">N</div>
          <div className="map-scale">2 km</div>
        </div>

        <div className="operational-map-list">
          {filteredLocations.map((location) => {
            const config = TYPE_CONFIG[location.entity_type];
            const Icon = config.icon;
            return (
              <article className="glass-panel map-location-card" key={location.id}>
                <div className="map-location-heading">
                  <span className="map-location-icon" style={{ color: config.color, background: `${config.color}20` }}>
                    <Icon size={18} />
                  </span>
                  <div>
                    <h3>{location.name}</h3>
                    <span style={{ color: config.color, fontSize: '0.78rem', fontWeight: 700 }}>{config.label}</span>
                  </div>
                  <span className={`status-badge ${location.service_status === 'active' ? 'connected' : 'fallback'}`}>
                    {location.service_status === 'active' ? 'Ativo' : 'Pendente'}
                  </span>
                </div>
                <p className="map-location-description">{location.description}</p>
                <div className="map-location-detail"><MapPin size={15} /> {location.address}</div>
                {location.contact_name && <div className="map-location-detail"><Recycle size={15} /> Responsável: {location.contact_name}</div>}
                {location.phone && <div className="map-location-detail"><Phone size={15} /> {location.phone}</div>}
                <a className="map-location-link" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`} target="_blank" rel="noopener noreferrer">
                  Abrir rota <ExternalLink size={14} />
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
