import React from 'react';
import { 
  ShieldAlert, 
  Search, 
  Calendar, 
  FileText, 
  CloudSun, 
  TrendingUp, 
  BookOpen, 
  AlertTriangle, 
  CheckCircle, 
  ArrowUpRight, 
  Activity,
  Layers,
  Clock
} from 'lucide-react';

export default function CommandCenter({ onSelectTab, activeProject }) {
  const kpis = [
    {
      id: 'kpi-safety',
      label: 'Site Safety Compliance',
      value: '64%',
      sub: '3 Violations Flagged',
      trend: '-6% this shift',
      trendType: 'negative',
      color: 'var(--safety-amber)',
      highlight: 'highlight-amber',
      actionTab: 'safety'
    },
    {
      id: 'kpi-crack',
      label: 'Structural Integrity',
      value: '48 / 100',
      sub: 'Girder G-102 Shear Crack',
      trend: 'Immediate Shoring Req.',
      trendType: 'critical',
      color: 'var(--safety-ruby)',
      highlight: 'highlight-ruby',
      actionTab: 'crack'
    },
    {
      id: 'kpi-schedule',
      label: 'Schedule Progress',
      value: '58.4%',
      sub: 'Phase 3: Core Erection',
      trend: 'Critical Path +2 Days',
      trendType: 'neutral',
      color: 'var(--safety-cyan)',
      highlight: 'highlight-cyan',
      actionTab: 'planning'
    },
    {
      id: 'kpi-weather',
      label: 'Site Weather Risk',
      value: '45 / 100',
      sub: '34.5°C | Wind 26 km/h',
      trend: 'Safe Pour Window: 06-10 AM',
      trendType: 'positive',
      color: 'var(--safety-emerald)',
      highlight: 'highlight-emerald',
      actionTab: 'weather'
    }
  ];

  const modules = [
    {
      id: 'safety',
      title: 'Site Safety Monitoring',
      desc: 'Multimodal vision scanner for PPE compliance (helmets, vests, harnesses), leading edge fall hazards, and automated OSHA 1926 violation mapping.',
      icon: <ShieldAlert size={26} style={{ color: 'var(--safety-amber)' }} />,
      badge: 'Vision AI Active',
      badgeClass: 'high'
    },
    {
      id: 'crack',
      title: 'Crack Detection & Health',
      desc: 'Sub-millimeter crack gauge and structural classification (shear vs flexural vs settlement) with ACI 224R remediation protocols and shoring alerts.',
      icon: <Search size={26} style={{ color: 'var(--safety-ruby)' }} />,
      badge: 'Critical Inspection',
      badgeClass: 'critical'
    },
    {
      id: 'valuation',
      title: 'Real Estate Asset Valuation',
      desc: 'Stage-of-construction visual validation, cost-to-complete forecasting, material index multipliers, and localized commercial comps appraisal.',
      icon: <TrendingUp size={26} style={{ color: 'var(--safety-emerald)' }} />,
      badge: '93% Confidence',
      badgeClass: 'compliant'
    },
    {
      id: 'planning',
      title: 'Project Planning & WBS Gantt',
      desc: 'Automated 5-phase Work Breakdown Structure (WBS), critical path analysis, resource crew staging, and proactive risk mitigation matrix.',
      icon: <Calendar size={26} style={{ color: 'var(--safety-cyan)' }} />,
      badge: '18-Month Plan',
      badgeClass: 'info'
    },
    {
      id: 'daily-log',
      title: 'Daily Site Assistant (DPR)',
      desc: 'Converts site voice notes and field transcripts into structured Daily Progress Reports with trade manpower distributions and material deliveries.',
      icon: <FileText size={26} style={{ color: 'var(--safety-amber)' }} />,
      badge: 'Auto-Compiled',
      badgeClass: 'medium'
    },
    {
      id: 'weather',
      title: 'Weather-Aware Advisory',
      desc: 'Real-time engineering risk indexes for concrete pouring (ACI 305/306), crane wind-speed cutoffs (OSHA 1926 CC), and trench bank stability.',
      icon: <CloudSun size={26} style={{ color: 'var(--safety-cyan)' }} />,
      badge: 'Forecast Synced',
      badgeClass: 'info'
    },
    {
      id: 'knowledge',
      title: 'Construction Knowledge Hub',
      desc: 'Multimodal engineering copilot citing ACI 318, OSHA 1926, Eurocode 2, and AISC specs with interactive formulas and inspection checklists.',
      icon: <BookOpen size={26} style={{ color: '#a855f7' }} />,
      badge: 'Code Citations',
      badgeClass: 'info'
    }
  ];

  return (
    <div id="command-center-view" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Welcome & Live Site Status Bar */}
      <div 
        className="glass-panel" 
        style={{ 
          background: 'linear-gradient(135deg, rgba(16, 24, 43, 0.9), rgba(13, 20, 36, 0.95))',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          borderLeft: '4px solid var(--safety-amber)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <span className="badge-tag medium">Active Site Telemetry</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Project: {activeProject.name}
            </span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Executive Construction Command Center</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.2rem' }}>
            Real-time multimodal artificial intelligence pipeline synthesizing visual feeds, sensor telemetry, and engineering contracts.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            className="btn-primary" 
            id="btn-quick-safety-audit" 
            onClick={() => onSelectTab('safety')}
          >
            <ShieldAlert size={16} />
            <span>Launch Site Safety Scan</span>
          </button>
          <button 
            className="btn-secondary" 
            id="btn-quick-dpr" 
            onClick={() => onSelectTab('daily-log')}
          >
            <FileText size={16} />
            <span>Record Daily DPR</span>
          </button>
        </div>
      </div>

      {/* KPI Tiles Row */}
      <div className="grid-cols-4">
        {kpis.map((kpi) => (
          <div 
            key={kpi.id} 
            className={`glass-panel metric-tile ${kpi.highlight}`}
            style={{ cursor: 'pointer' }}
            onClick={() => onSelectTab(kpi.actionTab)}
            id={kpi.id}
          >
            <div className="metric-label">
              <span>{kpi.label}</span>
              <ArrowUpRight size={14} style={{ color: 'var(--text-dim)' }} />
            </div>
            <div className="metric-value" style={{ color: kpi.color }}>
              {kpi.value}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {kpi.sub}
            </div>
            <div className="metric-trend" style={{ 
              color: kpi.trendType === 'critical' ? 'var(--text-ruby)' : 
                     kpi.trendType === 'negative' ? 'var(--text-amber)' : 'var(--text-emerald)',
              marginTop: '0.35rem'
            }}>
              {kpi.trendType === 'critical' ? <AlertTriangle size={13} /> : <Activity size={13} />}
              <span>{kpi.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Critical Stop-Work & Risk Notice Bar */}
      <div 
        style={{
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '10px',
          padding: '0.85rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
        id="critical-alert-banner"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            background: 'rgba(239, 68, 68, 0.2)',
            padding: '8px',
            borderRadius: '8px',
            color: 'var(--safety-ruby)'
          }}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-ruby)' }}>
              URGENT HAZARD ALERT: Elevated Leading Edge Fall Risk & Girder G-102 Shear Crack
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Sector 4 scaffolding scan detected unharnessed workers near leading drop (OSHA 1926.501). Transfer girder exhibits 3.42mm shear propagation.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className="btn-secondary" 
            onClick={() => onSelectTab('safety')}
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.85rem', borderColor: 'rgba(239, 68, 68, 0.4)' }}
          >
            Review Violations
          </button>
          <button 
            className="btn-secondary" 
            onClick={() => onSelectTab('crack')}
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.85rem', borderColor: 'rgba(239, 68, 68, 0.4)' }}
          >
            View Shoring Plan
          </button>
        </div>
      </div>

      {/* 7 Decision-Support Intelligent Modules Grid */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Decision-Support Intelligence Modules</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Select a specialized multimodal module to inspect visual feeds, run predictive modeling, or query standards.
            </p>
          </div>
          <span className="badge-tag info">7 Engines Ready</span>
        </div>

        <div className="grid-cols-3">
          {modules.map((m) => (
            <div 
              key={m.id}
              className="glass-panel"
              id={`module-card-${m.id}`}
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '210px'
              }}
              onClick={() => onSelectTab(m.id)}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                  <div style={{ 
                    background: 'rgba(30, 41, 59, 0.7)', 
                    padding: '10px', 
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {m.icon}
                  </div>
                  <span className={`badge-tag ${m.badgeClass}`}>{m.badge}</span>
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.4rem' }}>{m.title}</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.45' }}>{m.desc}</p>
              </div>

              <div style={{ 
                marginTop: '1.2rem', 
                paddingTop: '0.75rem', 
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--safety-amber)'
              }}>
                <span>Open Intelligence Module</span>
                <ArrowUpRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
