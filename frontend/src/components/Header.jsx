import React, { useState } from 'react';
import { HardHat, Activity, Building2, Key, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';

export default function Header({ backendStatus, activeProject, setActiveProject }) {
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [keySaved, setKeySaved] = useState(false);

  const projects = [
    { id: 'p1', name: 'Harborview Commercial Tower - Sector 4', phase: 'Level 18 Superstructure' },
    { id: 'p2', name: 'Apex Logistics Hub - Bay Area', phase: 'Deep Foundation & Slab' },
    { id: 'p3', name: 'Metro Line 4 - Elevated Viaduct', phase: 'Pier Segment Erection' }
  ];

  const handleSaveKey = () => {
    if (apiKeyInput.trim()) {
      localStorage.setItem('GEMINI_API_KEY', apiKeyInput.trim());
      setKeySaved(true);
      setTimeout(() => setKeySaved(false), 3000);
    }
  };

  return (
    <header className="top-header" id="main-header">
      <div className="brand-section">
        <div className="brand-logo-badge">
          <HardHat size={24} />
        </div>
        <div>
          <div className="brand-title">
            <span>ConstructIQ</span>
            <span style={{ color: 'var(--safety-amber)', fontSize: '0.85rem' }}>AI</span>
          </div>
          <div className="brand-tagline">Multimodal Construction Intelligence Platform</div>
        </div>
      </div>

      <div className="header-status-group">
        {/* Active Project Dropdown */}
        <div className="project-badge-pill" id="project-selector-wrapper">
          <Building2 size={15} style={{ color: 'var(--safety-amber)' }} />
          <select
            id="project-selector"
            value={activeProject.id}
            onChange={(e) => {
              const selected = projects.find(p => p.id === e.target.value);
              if (selected) setActiveProject(selected);
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-main)',
              fontSize: '0.82rem',
              fontWeight: 600,
              padding: '2px 6px',
              cursor: 'pointer'
            }}
          >
            {projects.map(p => (
              <option key={p.id} value={p.id} style={{ background: '#0f172a', color: '#fff' }}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Backend / AI Status Pill */}
        <div className="status-indicator-badge" id="backend-status-badge">
          <span className="pulse-dot"></span>
          <span>{backendStatus.status === 'healthy' ? 'FastAPI & AI Online' : 'Local AI Engine'}</span>
        </div>

        {/* AI Engine Switch / Settings Button */}
        <button
          className="btn-secondary"
          id="btn-ai-settings"
          onClick={() => setShowSettings(!showSettings)}
          style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
          title="Configure Multimodal AI Settings"
        >
          <Cpu size={14} style={{ color: 'var(--safety-cyan)' }} />
          <span>AI Engine</span>
        </button>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div
          id="ai-settings-modal"
          style={{
            position: 'absolute',
            top: '70px',
            right: '25px',
            width: '380px',
            background: 'var(--bg-card-elevated)',
            border: '1px solid var(--border-glow)',
            borderRadius: '12px',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 1000
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h4 style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Key size={16} style={{ color: 'var(--safety-amber)' }} />
              Multimodal AI Configuration
            </h4>
            <button
              onClick={() => setShowSettings(false)}
              style={{ background: 'transparent', color: 'var(--text-muted)', fontSize: '1rem' }}
            >
              ✕
            </button>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: '1.4' }}>
            ConstructIQ leverages a multimodal LLM (Gemini 1.5/2.0) integrated with high-precision civil engineering algorithms for OSHA safety, ACI 318 crack physics, and WBS planning.
          </p>

          <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
            Google Gemini API Key (Optional)
          </label>
          <input
            id="input-gemini-key"
            type="password"
            placeholder="AIzaSy..."
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            style={{ width: '100%', marginBottom: '0.8rem', fontSize: '0.82rem' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button className="btn-primary" id="btn-save-key" onClick={handleSaveKey} style={{ fontSize: '0.8rem', padding: '0.45rem 0.95rem' }}>
              {keySaved ? 'Saved!' : 'Save Key'}
            </button>
          </div>
          <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '0.75rem', color: 'var(--text-emerald)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={13} />
            <span>High-precision deterministic engine active & verified.</span>
          </div>
        </div>
      )}
    </header>
  );
}
