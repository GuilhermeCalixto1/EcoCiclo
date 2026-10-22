import React, { useState } from 'react';
import { Award, Gift, Sparkles, TrendingUp, Check, Users } from 'lucide-react';
import confetti from 'canvas-confetti';

export function RewardsView({ rewards, leaderboard, userPoints = 320, onRedeemSuccess }) {
  const [points, setPoints] = useState(userPoints);
  const [redeemed, setRedeemed] = useState([]);

  const handleRedeem = (reward) => {
    if (points < reward.points_required) {
      alert(`Você precisa de ${reward.points_required} EcoPontos para resgatar este benefício. Atualmente você tem ${points} pts.`);
      return;
    }

    setPoints((prev) => prev - reward.points_required);
    setRedeemed((prev) => [...prev, reward.id]);

    try {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.5 }
      });
    } catch (e) {}

    alert(`🎉 Parabéns! Cupom resgatado com sucesso para "${reward.title}". Código do voucher gerado.`);
    if (onRedeemSuccess) onRedeemSuccess(reward);
  };

  return (
    <section>
      {/* Saldo de EcoPontos */}
      <div
        className="glass-panel"
        style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 78, 59, 0.4))',
          borderColor: 'rgba(52, 211, 153, 0.35)',
          marginBottom: '2.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--emerald-400)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
            <Sparkles size={18} />
            PROGRAMA DE INCENTIVO ECOLÓGICO
          </div>
          <h2 style={{ fontSize: '2rem', color: '#fff' }}>Seu Saldo: {points} EcoPontos</h2>
          <p style={{ color: '#cbd5e1', fontSize: '0.92rem', maxWidth: '500px', marginTop: '0.35rem' }}>
            Continue agendando coletas seletivas para acumular mais pontos e trocar por benefícios em parceiros locais sustentáveis.
          </p>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Nível de Cidadão</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fbbf24', marginTop: '0.2rem' }}>
            Guardião Verde 🌳
          </div>
        </div>
      </div>

      {/* Grid de Recompensas */}
      <div className="section-title">
        <div>
          <h2>Catálogo de Recompensas Sustentáveis</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Troque seus pontos por descontos, produtos ecológicos e ações ambientais na cidade.
          </p>
        </div>
      </div>

      <div className="rewards-grid" style={{ marginBottom: '3rem' }}>
        {rewards.map((reward) => {
          const isRedeemed = redeemed.includes(reward.id);
          const canAfford = points >= reward.points_required;

          return (
            <div key={reward.id} className="glass-panel reward-card">
              <div>
                <div className="reward-header">
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--emerald-400)', background: 'rgba(16, 185, 129, 0.1)', padding: '0.25rem 0.6rem', borderRadius: '6px' }}>
                    {reward.category}
                  </span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Award size={18} />
                    {reward.points_required} pts
                  </div>
                </div>

                <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '0.4rem' }}>
                  {reward.title}
                </h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  Parceiro: <strong>{reward.partner}</strong>
                </div>
              </div>

              <button
                className={`btn ${isRedeemed ? 'btn-secondary' : canAfford ? 'btn-primary' : 'btn-outline'}`}
                style={{ width: '100%' }}
                disabled={isRedeemed}
                onClick={() => handleRedeem(reward)}
              >
                {isRedeemed ? (
                  <>
                    <Check size={16} /> Resgatado
                  </>
                ) : (
                  <>
                    <Gift size={16} /> {canAfford ? 'Resgatar Recompensa' : `Faltam ${reward.points_required - points} pts`}
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Leaderboard da Comunidade */}
      <div className="section-title">
        <div>
          <h2>Ranking da Comunidade (EcoLeaderboard)</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Moradores que mais destinaram resíduos corretamente neste mês.
          </p>
        </div>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>Posição</th>
              <th>Cidadão</th>
              <th>Bairro</th>
              <th>Reciclado</th>
              <th>Pontuação</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user) => {
              const rankClass = user.rank === 1 ? 'rank-1' : user.rank === 2 ? 'rank-2' : user.rank === 3 ? 'rank-3' : 'rank-other';
              return (
                <tr key={user.rank}>
                  <td>
                    <span className={`rank-badge ${rankClass}`}>
                      {user.rank}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: '#fff' }}>{user.name}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{user.neighborhood}</td>
                  <td style={{ color: 'var(--emerald-400)', fontWeight: 700 }}>{user.total_kg} kg</td>
                  <td style={{ color: '#fbbf24', fontWeight: 700 }}>{user.points} pts</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
