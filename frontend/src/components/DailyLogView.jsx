import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  RefreshCw, 
  Users, 
  Truck, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Mic, 
  Send, 
  Download,
  ShieldCheck
} from 'lucide-react';
import { getDailyLogPreset, processDailyLog } from '../services/api';

export default function DailyLogView() {
  const [loading, setLoading] = useState(false);
  const [logData, setLogData] = useState(null);
  const [rawNotes, setRawNotes] = useState('');
  const [projectName, setProjectName] = useState('Skyline Heights - Tower B');
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    loadPresetData();
  }, []);

  const loadPresetData = async () => {
    try {
      setLoading(true);
      const preset = await getDailyLogPreset();
      setRawNotes(preset.raw_notes);
      setProjectName(preset.project_name);
      const res = await processDailyLog({
        project_name: preset.project_name,
        date_str: preset.date_str,
        raw_notes: preset.raw_notes,
        ambient_weather: preset.ambient_weather
      });
      setLogData(res);
    } catch (err) {
      console.error("Failed to process daily log:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessNotes = async () => {
    if (!rawNotes.trim()) return;
    try {
      setLoading(true);
      const res = await processDailyLog({
        project_name: projectName,
        raw_notes: rawNotes
      });
      setLogData(res);
    } catch (err) {
      console.error("Failed to generate DPR:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateVoice = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setRawNotes(
        "Afternoon update: 42 workers now on site. Second pour of M35 concrete initiated for column C-12 to C-18. " +
        "Tower crane hoist motor inspected and certified. Rebar crew completed top mesh for Level 5 slab."
      );
    }, 2000);
  };

  const handleExportDPR = () => {
    if (!logData) return;
    const blob = new Blob([JSON.stringify(logData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DPR-${logData.report_id}.json`;
    a.click();
  };

  return (
    <div id="daily-log-view" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
            <span className="badge-tag medium">Automated Site Assistant (DPR)</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Report ID: {logData?.report_id || 'DPR-GENERATING'}
            </span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Daily Site Logbook & Manpower Intelligence</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Transforms field voice dictation and unstructured engineering notes into standardized Daily Progress Reports.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <button className="btn-secondary" onClick={handleExportDPR} id="btn-export-dpr">
            <Download size={15} />
            <span>Export Official DPR</span>
          </button>
          <button className="btn-primary" onClick={loadPresetData} disabled={loading} id="btn-load-dpr-preset">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            <span>{loading ? 'Compiling DPR...' : 'Reset Sample Site Shift'}</span>
          </button>
        </div>
      </div>

      {/* Voice / Text Raw Input Area */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div className="panel-header" style={{ marginBottom: '0.25rem' }}>
          <div className="panel-title">
            <Mic size={18} style={{ color: 'var(--safety-amber)' }} />
            <span>Site Supervisor Raw Notes / Voice Dictation Input</span>
          </div>
          <button
            className="btn-secondary"
            onClick={handleSimulateVoice}
            disabled={isRecording}
            style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem', borderColor: isRecording ? 'var(--safety-ruby)' : 'var(--border-subtle)' }}
            id="btn-voice-dictation"
          >
            <Mic size={14} className={isRecording ? 'animate-pulse text-ruby' : ''} />
            <span>{isRecording ? 'Listening to Radio Feed...' : 'Dictate Voice Note'}</span>
          </button>
        </div>

        <textarea
          id="textarea-site-notes"
          rows={4}
          value={rawNotes}
          onChange={(e) => setRawNotes(e.target.value)}
          placeholder="Enter quick shift notes: headcount, concrete volume poured, deliveries received, equipment breakdowns, weather delays..."
          style={{ width: '100%', fontSize: '0.85rem', lineHeight: '1.5' }}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <button className="btn-primary" onClick={handleProcessNotes} disabled={loading} id="btn-submit-notes">
            <Send size={15} />
            <span>Synthesize into Formal DPR</span>
          </button>
        </div>
      </div>

      {/* Structured DPR Display */}
      {logData && (
        <>
          {/* Executive Summary Card */}
          <div className="glass-panel" style={{ borderLeft: '4px solid var(--safety-amber)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span className="badge-tag medium">Executive Shift Summary</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--safety-emerald)', fontFamily: 'var(--font-mono)' }}>
                ✓ {logData.supervisor_signoff_status}
              </span>
            </div>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: '1.55' }}>
              {logData.executive_summary}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid-cols-4">
            <div className="metric-tile highlight-amber">
              <div className="metric-label">
                <span>Active Workforce</span>
                <Users size={14} style={{ color: 'var(--safety-amber)' }} />
              </div>
              <div className="metric-value" style={{ color: 'var(--safety-amber)' }}>
                {logData.total_active_workforce} <span style={{ fontSize: '1rem', color: 'var(--text-dim)' }}>Personnel</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {logData.manpower_distribution.length} Specialist Trades
              </span>
            </div>

            <div className="metric-tile highlight-emerald">
              <div className="metric-label">
                <span>Milestones Completed</span>
                <CheckCircle2 size={14} style={{ color: 'var(--safety-emerald)' }} />
              </div>
              <div className="metric-value" style={{ color: 'var(--safety-emerald)' }}>
                {logData.completed_milestones.length}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>65 cu.m M35 Concrete Cast</span>
            </div>

            <div className="metric-tile highlight-ruby">
              <div className="metric-label">
                <span>Delays Logged</span>
                <Clock size={14} style={{ color: 'var(--safety-ruby)' }} />
              </div>
              <div className="metric-value" style={{ color: logData.delays_recorded.length > 0 ? 'var(--safety-ruby)' : 'var(--safety-emerald)' }}>
                {logData.delays_recorded.reduce((sum, d) => sum + d.hours_lost, 0)} <span style={{ fontSize: '1rem', color: 'var(--text-dim)' }}>Hrs</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Logistics Traffic Congestion</span>
            </div>

            <div className="metric-tile highlight-cyan">
              <div className="metric-label">
                <span>Materials Verified</span>
                <Truck size={14} style={{ color: 'var(--safety-cyan)' }} />
              </div>
              <div className="metric-value" style={{ color: 'var(--safety-cyan)' }}>
                {logData.materials_received.length} <span style={{ fontSize: '1rem', color: 'var(--text-dim)' }}>Batches</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-emerald)' }}>Mill Test Certificates OK</span>
            </div>
          </div>

          {/* Trade Manpower Breakdown & Material Deliveries */}
          <div className="grid-cols-2">
            {/* Manpower Distribution */}
            <div className="glass-panel">
              <div className="panel-header">
                <div className="panel-title">
                  <Users size={18} style={{ color: 'var(--safety-amber)' }} />
                  <span>Trade Manpower Distribution</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {logData.manpower_distribution.map((m, idx) => (
                  <div 
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.85rem',
                      background: 'rgba(15, 23, 42, 0.5)',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{m.trade_name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Lead: {m.supervisor_in_charge}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="badge-tag medium">{m.headcount} Workers</span>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.15rem' }}>{m.hours_worked} hrs</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Material Deliveries & Lab Verifications */}
            <div className="glass-panel">
              <div className="panel-header">
                <div className="panel-title">
                  <Truck size={18} style={{ color: 'var(--safety-cyan)' }} />
                  <span>Material Intake & Quality Inspections</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {logData.materials_received.map((mat, idx) => (
                  <div 
                    key={idx}
                    style={{
                      padding: '0.75rem',
                      background: 'rgba(15, 23, 42, 0.5)',
                      borderRadius: '8px',
                      borderLeft: '3px solid var(--safety-emerald)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.2rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{mat.material}</span>
                      <span className="badge-tag compliant">{mat.inspection_status.split('-')[0]}</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                      Quantity: <strong style={{ color: 'var(--text-main)' }}>{mat.quantity}</strong> | Supplier: {mat.supplier}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                      {mat.inspection_status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
