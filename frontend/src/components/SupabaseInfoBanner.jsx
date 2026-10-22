import React, { useState } from 'react';
import { Database, ExternalLink, ChevronDown, ChevronUp, CheckCircle, Copy, Info } from 'lucide-react';

export function SupabaseInfoBanner({ isConnected }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  return (
    <div
      style={{
        background: isConnected
          ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))'
          : 'linear-gradient(90deg, rgba(245, 158, 11, 0.12), rgba(56, 189, 248, 0.05))',
        border: `1px solid ${isConnected ? 'rgba(52, 211, 153, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
        borderRadius: '12px',
        padding: '0.9rem 1.25rem',
        marginBottom: '2rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Database size={20} color={isConnected ? '#34d399' : '#fbbf24'} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#fff' }}>
              {isConnected
                ? 'Conectado com o Supabase PostgreSQL'
                : 'EcoCiclo pronto para uso (Modo Local / Demonstração Ativo)'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {isConnected
                ? 'Todas as alterações de coletas e resíduos estão sendo salvas no seu banco de dados em tempo real.'
                : 'O aplicativo já está 100% funcional! Você pode conectar seu próprio banco Supabase quando quiser.'}
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="btn btn-secondary"
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', gap: '0.35rem' }}
        >
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {isOpen ? 'Ocultar Guia Supabase' : 'Como Conectar ao Supabase'}
        </button>
      </div>

      {isOpen && (
        <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.86rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', color: 'var(--text-secondary)' }}>
            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: '8px' }}>
              <strong style={{ color: '#fff', display: 'block', marginBottom: '0.35rem' }}>1. Crie seu projeto</strong>
              Acesse <a href="https://supabase.com" target="_blank" rel="noreferrer" style={{ color: 'var(--emerald-400)' }}>supabase.com</a> e crie um projeto gratuito.
            </div>
            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: '8px' }}>
              <strong style={{ color: '#fff', display: 'block', marginBottom: '0.35rem' }}>2. Execute o schema.sql</strong>
              Abra o arquivo <code>supabase/schema.sql</code> gerado nesta pasta e execute no SQL Editor do Supabase.
            </div>
            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: '8px' }}>
              <strong style={{ color: '#fff', display: 'block', marginBottom: '0.35rem' }}>3. Cole as chaves nos .env</strong>
              Copie o <code>Project URL</code> e <code>anon key</code> para os arquivos <code>frontend/.env</code> e <code>backend/.env</code>.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
