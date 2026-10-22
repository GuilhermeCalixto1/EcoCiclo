import React, { useState } from 'react';
import { X, Calendar, Clock, Weight, MapPin, User, Sparkles, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export function ScheduleModal({ isOpen, onClose, wasteTypes, initialWasteTypeId, onSuccess }) {
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    user_phone: '',
    address: '',
    neighborhood: '',
    city: 'São Paulo',
    waste_type_id: initialWasteTypeId || (wasteTypes[0]?.id || 'plastic'),
    estimated_weight_kg: 3,
    scheduled_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    scheduled_period: 'manha',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const selectedWaste = wasteTypes.find((w) => w.id === formData.waste_type_id) || wasteTypes[0];
  const pointsRate = selectedWaste ? selectedWaste.points_per_kg : 10;
  const estimatedPoints = Math.round(formData.estimated_weight_kg * pointsRate);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'estimated_weight_kg' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.user_name || !formData.address || !formData.scheduled_date) {
      setErrorMsg('Por favor, preencha todos os campos obrigatórios (*).');
      return;
    }

    setLoading(true);
    try {
      await onSuccess(formData);

      // Trigger Confetti Celebration!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback if canvas is restricted
      }

      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Erro ao processar agendamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Agendar Coleta de Resíduos</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Nosso coletor parceiro passará no seu endereço no dia e período escolhidos.
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Fechar modal">
            <X size={18} />
          </button>
        </div>

        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#f87171',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.88rem'
          }}>
            <AlertCircle size={18} />
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Seção 1: Dados do Solicitante */}
          <div className="form-group">
            <label className="form-label">Nome Completo *</label>
            <input
              type="text"
              name="user_name"
              required
              className="form-input"
              placeholder="Ex: Ana Carolina Silva"
              value={formData.user_name}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">E-mail</label>
              <input
                type="email"
                name="user_email"
                className="form-input"
                placeholder="seu.email@exemplo.com"
                value={formData.user_email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">WhatsApp / Telefone</label>
              <input
                type="tel"
                name="user_phone"
                className="form-input"
                placeholder="(11) 98765-4321"
                value={formData.user_phone}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Seção 2: Localização */}
          <div className="form-group">
            <label className="form-label">Endereço de Coleta (Rua, Número, Compl.) *</label>
            <input
              type="text"
              name="address"
              required
              className="form-input"
              placeholder="Ex: Rua das Flores, 142 - Apto 32"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Bairro</label>
              <input
                type="text"
                name="neighborhood"
                className="form-input"
                placeholder="Ex: Pinheiros"
                value={formData.neighborhood}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Cidade</label>
              <input
                type="text"
                name="city"
                className="form-input"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Seção 3: Resíduos e Agendamento */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tipo de Material *</label>
              <select
                name="waste_type_id"
                className="form-select"
                value={formData.waste_type_id}
                onChange={handleChange}
              >
                {wasteTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name} (+{type.points_per_kg} pts/kg)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Peso Estimado: {formData.estimated_weight_kg} kg</label>
              <input
                type="range"
                name="estimated_weight_kg"
                min="0.5"
                max="50"
                step="0.5"
                style={{ width: '100%', accentColor: 'var(--emerald-400)', marginTop: '0.6rem' }}
                value={formData.estimated_weight_kg}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Data da Coleta *</label>
              <input
                type="date"
                name="scheduled_date"
                required
                className="form-input"
                value={formData.scheduled_date}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Turno de Preferência</label>
              <select
                name="scheduled_period"
                className="form-select"
                value={formData.scheduled_period}
                onChange={handleChange}
              >
                <option value="manha">Manhã (08:00 às 12:00)</option>
                <option value="tarde">Tarde (13:00 às 17:30)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Instruções para o Coletor (Opcional)</label>
            <textarea
              name="notes"
              rows={2}
              className="form-textarea"
              placeholder="Ex: Interfone 32, lixo identificado com saco azul na lixeira térrea..."
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          {/* Estimativa de EcoPontos */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(52, 211, 153, 0.05))',
            border: '1px solid rgba(52, 211, 153, 0.3)',
            borderRadius: '10px',
            padding: '1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Sparkles size={20} color="var(--emerald-400)" />
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Recompensa Estimada</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#34d399' }}>
                  +{estimatedPoints} EcoPontos
                </div>
              </div>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'right' }}>
              Crédito validado na pesagem do coletor
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.85rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading} id="btn-submit-collection">
              {loading ? 'Agendando...' : 'Confirmar Agendamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
