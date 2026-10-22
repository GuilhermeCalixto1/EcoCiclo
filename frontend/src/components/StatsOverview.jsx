import React from 'react';
import { Scale, CheckCircle2, CloudFog, Sparkles } from 'lucide-react';

export function StatsOverview({ stats }) {
  const items = [
    {
      label: 'Total de Resíduos Reciclados',
      value: `${stats.totalWeightRecycledKg || 0} kg`,
      icon: Scale,
      color: '#34d399',
      bg: 'rgba(16, 185, 129, 0.15)'
    },
    {
      label: 'Coletas Domiciliares Realizadas',
      value: stats.completedCollections || 0,
      icon: CheckCircle2,
      color: '#38bdf8',
      bg: 'rgba(56, 189, 248, 0.15)'
    },
    {
      label: 'Estimativa de CO₂ Evitado',
      value: `${stats.co2SavedKg || 0} kg`,
      icon: CloudFog,
      color: '#a78bfa',
      bg: 'rgba(167, 139, 250, 0.15)'
    },
    {
      label: 'EcoPontos Distribuídos',
      value: stats.totalEcoPointsAwarded || 0,
      icon: Sparkles,
      color: '#fbbf24',
      bg: 'rgba(251, 191, 36, 0.15)'
    }
  ];

  return (
    <div className="stats-grid">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div key={idx} className="glass-panel stat-card">
            <div className="stat-icon-wrapper" style={{ backgroundColor: item.bg, color: item.color }}>
              <Icon size={24} />
            </div>
            <div>
              <div className="stat-number">{item.value}</div>
              <div className="stat-label">{item.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
