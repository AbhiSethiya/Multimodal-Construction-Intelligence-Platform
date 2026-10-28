import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Search, 
  TrendingUp, 
  Calendar, 
  FileText, 
  CloudSun, 
  BookOpen,
  Building2,
  HardHat,
  Cpu,
  CheckCircle2
} from 'lucide-react';

import Header from './components/Header';
import CommandCenter from './components/CommandCenter';
import SafetyAuditView from './components/SafetyAuditView';
import CrackAnalysisView from './components/CrackAnalysisView';
import ValuationView from './components/ValuationView';
import ProjectPlanningView from './components/ProjectPlanningView';
import DailyLogView from './components/DailyLogView';
import WeatherAdvisoryView from './components/WeatherAdvisoryView';
import KnowledgeAssistantView from './components/KnowledgeAssistantView';
import { checkBackendHealth } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('command-center');
  const [backendStatus, setBackendStatus] = useState({ status: 'checking', gemini_active: false });
  const [activeProject, setActiveProject] = useState({
    id: 'p1',
    name: 'Harborview Commercial Tower - Sector 4',
    phase: 'Level 18 Superstructure'
  });

  useEffect(() => {
    async function verifyHealth() {
      const res = await checkBackendHealth();
      setBackendStatus(res);
    }
    verifyHealth();
  }, []);

  const tabs = [
    { id: 'command-center', label: 'Command Center', icon: <LayoutDashboard size={16} /> },
    { id: 'safety', label: 'Safety Monitoring', icon: <ShieldAlert size={16} /> },
    { id: 'crack', label: 'Crack & Structural Health', icon: <Search size={16} /> },
    { id: 'valuation', label: 'Real Estate Valuation', icon: <TrendingUp size={16} /> },
    { id: 'planning', label: 'Project Planning & WBS', icon: <Calendar size={16} /> },
    { id: 'daily-log', label: 'Daily Site Logbook', icon: <FileText size={16} /> },
    { id: 'weather', label: 'Weather Advisory', icon: <CloudSun size={16} /> },
    { id: 'knowledge', label: 'Knowledge Copilot', icon: <BookOpen size={16} /> },
  ];

  return (
    <div className="app-container">
      {/* Top Header */}
      <Header 
        backendStatus={backendStatus} 
        activeProject={activeProject}
        setActiveProject={setActiveProject}
      />

      {/* Navigation Tab Bar */}
      <nav className="module-nav-bar" id="navigation-tabs-bar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            className={`nav-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Main Viewport Content */}
      <main className="main-viewport" id="main-content-viewport">
        {activeTab === 'command-center' && (
          <CommandCenter onSelectTab={setActiveTab} activeProject={activeProject} />
        )}
        {activeTab === 'safety' && <SafetyAuditView />}
        {activeTab === 'crack' && <CrackAnalysisView />}
        {activeTab === 'valuation' && <ValuationView />}
        {activeTab === 'planning' && <ProjectPlanningView />}
        {activeTab === 'daily-log' && <DailyLogView />}
        {activeTab === 'weather' && <WeatherAdvisoryView />}
        {activeTab === 'knowledge' && <KnowledgeAssistantView />}
      </main>

      {/* Engineering Compliance Footer */}
      <footer style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(7, 11, 20, 0.9)',
        padding: '1rem 1.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        fontSize: '0.78rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>ConstructIQ™ Platform v2.4.0</span>
          <span>•</span>
          <span>FastAPI Strict JSON Contracts</span>
          <span>•</span>
          <span>Google Gemini Multimodal AI Provider</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontFamily: 'var(--font-mono)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--safety-emerald)' }}>
            <CheckCircle2 size={13} />
            <span>OSHA 1926 & ACI 318 Compliant</span>
          </span>
          <span style={{ color: 'var(--text-dim)' }}>React 19 + Vite</span>
        </div>
      </footer>
    </div>
  );
}
