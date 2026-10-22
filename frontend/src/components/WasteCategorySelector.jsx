import React from 'react';
import { Package, FileText, Wine, Shield, Cpu, Apple, Droplet, ArrowRight, Award } from 'lucide-react';

const ICON_MAP = {
  Package,
  FileText,
  Wine,
  Shield,
  Cpu,
  Apple,
  Droplet
};

export function WasteCategorySelector({ wasteTypes, onSelectType }) {
  return (
    <section style={{ marginBottom: '2.5rem' }}>
      <div className="section-title">
        <div>
          <h2>Tipos de Resíduos Aceitos</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Descubra como separar corretamente seus materiais e acumular EcoPontos a cada quilo reciclado.
          </p>
        </div>
      </div>

      <div className="waste-grid">
        {wasteTypes.map((waste) => {
          const IconComponent = ICON_MAP[waste.icon] || Package;
          return (
            <div
              key={waste.id}
              className="glass-panel waste-card"
              style={{ '--card-color': waste.color }}
              onClick={() => onSelectType(waste.id)}
              role="button"
              tabIndex={0}
              id={`waste-card-${waste.id}`}
            >
              <div className="waste-card-header">
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: `${waste.color}22`,
                    color: waste.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <IconComponent size={22} />
                </div>
                <span className="waste-badge">{waste.category}</span>
              </div>

              <h3 className="waste-title">{waste.name}</h3>
              <p className="waste-desc">{waste.description}</p>

              {waste.instructions && (
                <div style={{
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  background: 'rgba(0,0,0,0.25)',
                  padding: '0.5rem 0.65rem',
                  borderRadius: '6px',
                  marginBottom: '0.85rem'
                }}>
                  💡 <strong>Dica:</strong> {waste.instructions}
                </div>
              )}

              <div className="waste-footer">
                <div className="points-pill">
                  <Award size={16} />
                  <span>+{waste.points_per_kg} pts / kg</span>
                </div>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                  Agendar <ArrowRight size={14} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
