import React from 'react';
import { CalendarDays, Clock3, MapPin, Navigation, Radio, Route, Truck, UserRound } from 'lucide-react';

const ACTIVE_STATUSES = new Set(['scheduled', 'in_progress']);

const formatPeriod = (period) => (period === 'manha' ? 'Manhã' : 'Tarde');

const formatCollectionDay = (date) => {
  if (!date) return 'Data não informada';

  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit'
  }).format(new Date(`${date}T12:00:00`));
};

const getStreet = (address) => address?.split(',')[0]?.trim() || 'Rua não informada';

export function TruckTracking({ collections, onOpenSchedule }) {
  const activeCollections = collections.filter((collection) => ACTIVE_STATUSES.has(collection.status));
  const scheduledCollections = collections
    .filter((collection) => collection.status !== 'cancelled' && collection.scheduled_date)
    .sort((first, second) => first.scheduled_date.localeCompare(second.scheduled_date));
  const currentCollection = activeCollections[0];
  const routeStops = activeCollections.slice(0, 4);
  const lastUpdate = 'agora';
  const scheduleByDay = scheduledCollections.reduce((days, collection) => {
    const day = days.find((item) => item.date === collection.scheduled_date);
    if (day) {
      if (!day.streets.includes(getStreet(collection.address))) {
        day.streets.push(getStreet(collection.address));
      }
      day.collections.push(collection);
      return days;
    }

    days.push({
      date: collection.scheduled_date,
      streets: [getStreet(collection.address)],
      collections: [collection]
    });
    return days;
  }, []);

  return (
    <section className="tracking-section">
      <div className="section-title">
        <div>
          <h2><Truck size={25} color="var(--emerald-400)" /> Rastreamento do caminhão</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Veja a região atual e as próximas paradas da coleta seletiva.
          </p>
        </div>
        <span className="status-badge connected">
          <Radio size={14} />
          Atualização ativa
        </span>
      </div>

      <div className="tracking-layout">
        <div className="tracking-map glass-panel" role="img" aria-label="Mapa com a localização atual do caminhão de coleta">
          <div className="map-toolbar">
            <span><MapPin size={15} /> São Paulo, SP</span>
            <span className="map-live"><span className="status-dot" /> Ao vivo</span>
          </div>

          <div className="map-canvas">
            <div className="map-road map-road-one" />
            <div className="map-road map-road-two" />
            <div className="map-road map-road-three" />
            <div className="map-route" />
            <span className="map-label map-label-one">Centro</span>
            <span className="map-label map-label-two">Vila Verde</span>
            <span className="map-label map-label-three">Jardim das Flores</span>
            <div className="truck-marker" title="Caminhão EcoCiclo">
              <Truck size={21} />
            </div>
            {routeStops.map((stop, index) => (
              <div className={`route-stop route-stop-${index + 1}`} key={stop.id} title={stop.address}>
                {index + 1}
              </div>
            ))}
            <div className="map-scale">500 m</div>
          </div>

          <div className="map-legend">
            <span><i className="legend-truck"><Truck size={13} /></i> Caminhão</span>
            <span><i className="legend-stop" /> Próxima parada</span>
            <span><i className="legend-route" /> Rota prevista</span>
          </div>
        </div>

        <aside className="tracking-sidebar">
          <div className="glass-panel tracking-status-card">
            <div className="tracking-card-heading">
              <div>
                <span className="eyebrow">Veículo em rota</span>
                <h3>EcoCiclo 01</h3>
              </div>
              <div className="truck-avatar"><Truck size={23} /></div>
            </div>
            <div className="tracking-status-line">
              <span className="status-dot" />
              {currentCollection ? 'Coleta em andamento' : 'Aguardando próxima coleta'}
            </div>
            <div className="tracking-details">
              <div><Clock3 size={16} /><span>Atualizado às {lastUpdate}</span></div>
              <div><Navigation size={16} /><span>{currentCollection?.neighborhood || 'Rota municipal'}</span></div>
              <div><UserRound size={16} /><span>Equipe de coleta EcoCiclo</span></div>
            </div>
          </div>

          <div className="glass-panel route-card">
            <div className="route-card-heading">
              <h3>Próximas paradas</h3>
              <span>{activeCollections.length} paradas</span>
            </div>
            {routeStops.length > 0 ? (
              <ol className="route-stop-list">
                {routeStops.map((stop, index) => (
                  <li key={stop.id}>
                    <span className={`route-list-number ${index === 0 ? 'current' : ''}`}>{index + 1}</span>
                    <div>
                      <strong>{stop.address}</strong>
                      <span>{stop.neighborhood} · {formatPeriod(stop.scheduled_period)}</span>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="empty-route">
                <MapPin size={20} />
                <p>Nenhuma coleta está em rota agora.</p>
                <button className="btn btn-outline" onClick={onOpenSchedule}>Agendar coleta</button>
              </div>
            )}
          </div>
        </aside>
      </div>

      <div className="collection-schedule-panel glass-panel">
        <div className="section-title schedule-panel-title">
          <div>
            <h3><CalendarDays size={21} color="var(--emerald-400)" /> Dias e ruas de coleta</h3>
            <p>Consulte em quais dias o caminhão passa em cada rua cadastrada.</p>
          </div>
          <Route size={25} color="var(--accent-blue)" />
        </div>

        {scheduleByDay.length > 0 ? (
          <div className="collection-days-grid">
            {scheduleByDay.map((day) => (
              <article className="collection-day-card" key={day.date}>
                <div className="collection-day-heading">
                  <div>
                    <span className="eyebrow">Dia de coleta</span>
                    <h4>{formatCollectionDay(day.date)}</h4>
                  </div>
                  <span className="collection-day-count">{day.collections.length} {day.collections.length === 1 ? 'parada' : 'paradas'}</span>
                </div>
                <div className="collection-street-list">
                  {day.streets.map((street) => {
                    const streetCollections = day.collections.filter((collection) => getStreet(collection.address) === street);
                    const periods = [...new Set(streetCollections.map((collection) => formatPeriod(collection.scheduled_period)))];

                    return (
                      <div className="collection-street" key={street}>
                        <MapPin size={16} />
                        <div>
                          <strong>{street}</strong>
                          <span>{periods.join(' e ')} · {streetCollections.length} {streetCollections.length === 1 ? 'coleta' : 'coletas'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-schedule">
            <CalendarDays size={22} />
            <p>Ainda não há dias e ruas de coleta cadastrados.</p>
            <button className="btn btn-outline" onClick={onOpenSchedule}>Cadastrar uma coleta</button>
          </div>
        )}
      </div>
    </section>
  );
}
