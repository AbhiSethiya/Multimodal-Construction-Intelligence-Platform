import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Upload, 
  RefreshCw, 
  CheckCircle2, 
  AlertOctagon, 
  Eye, 
  EyeOff, 
  Download, 
  FileCheck,
  AlertTriangle,
  HardHat
} from 'lucide-react';
import { getSafetyPreset, analyzeSafety } from '../services/api';

export default function SafetyAuditView() {
  const [loading, setLoading] = useState(false);
  const [auditData, setAuditData] = useState(null);
  const [imageDataUri, setImageDataUri] = useState('');
  const [selectedDetection, setSelectedDetection] = useState(null);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);

  // Load preset on mount
  useEffect(() => {
    loadPresetData();
  }, []);

  const loadPresetData = async () => {
    try {
      setLoading(true);
      const preset = await getSafetyPreset();
      setImageDataUri(preset.image_data_uri);
      const res = await analyzeSafety({
        image_base64: preset.image_data_uri,
        site_zone: preset.site_zone,
        work_activity: preset.work_activity,
        weather_condition: preset.weather_condition
      });
      setAuditData(res);
      setSelectedDetection(res.detections[1]); // Default select critical detection
    } catch (err) {
      console.error("Failed to load safety audit:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result;
        setImageDataUri(base64);
        setLoading(true);
        try {
          const res = await analyzeSafety({
            image_base64: base64,
            site_zone: "Uploaded Custom Site Image",
            work_activity: "General Civil Works"
          });
          setAuditData(res);
          setSelectedDetection(res.detections[0]);
        } catch (err) {
          console.error("Error analyzing uploaded image:", err);
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExportJSON = () => {
    if (!auditData) return;
    const blob = new Blob([JSON.stringify(auditData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Safety-Audit-${auditData.audit_id}.json`;
    a.click();
  };

  const filteredDetections = auditData?.detections?.filter(d => {
    if (filterCategory === 'ALL') return true;
    if (filterCategory === 'VIOLATIONS') return d.category !== 'Compliant PPE';
    if (filterCategory === 'COMPLIANT') return d.category === 'Compliant PPE';
    if (filterCategory === 'CRITICAL') return d.severity === 'critical';
    return true;
  }) || [];

  return (
    <div id="safety-audit-view" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* View Header */}
      <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
            <span className="badge-tag high">OSHA 1926 Multimodal Vision AI</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Audit ID: {auditData?.audit_id || 'SAF-SCANNING'}
            </span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Construction Site Safety Monitoring</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Automated visual detection of Personal Protective Equipment (PPE) non-compliance, leading edge fall hazards, and unsafe proximity zones.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <label className="btn-secondary" style={{ cursor: 'pointer' }} id="btn-upload-site-image">
            <Upload size={15} />
            <span>Upload Site Photo</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>
          <button className="btn-primary" onClick={loadPresetData} disabled={loading} id="btn-load-safety-preset">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            <span>{loading ? 'Analyzing...' : 'Reset Sector 4 Preset'}</span>
          </button>
          <button className="btn-secondary" onClick={handleExportJSON} id="btn-export-safety-audit">
            <Download size={15} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Safety Scoreboard Metrics */}
      {auditData && (
        <div className="grid-cols-4">
          <div className="metric-tile highlight-amber">
            <div className="metric-label">
              <span>Overall Safety Score</span>
              <ShieldAlert size={14} style={{ color: 'var(--safety-amber)' }} />
            </div>
            <div className="metric-value" style={{ color: auditData.overall_safety_score < 70 ? 'var(--safety-amber)' : 'var(--safety-emerald)' }}>
              {auditData.overall_safety_score} <span style={{ fontSize: '1.1rem', color: 'var(--text-dim)' }}>/ 100</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hazard Index: {auditData.hazard_level}</span>
          </div>

          <div className="metric-tile highlight-emerald">
            <div className="metric-label">
              <span>Personnel Compliance</span>
              <CheckCircle2 size={14} style={{ color: 'var(--safety-emerald)' }} />
            </div>
            <div className="metric-value" style={{ color: 'var(--safety-emerald)' }}>
              {auditData.compliance_rate_percent}%
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {auditData.compliant_workers_count} of {auditData.total_workers_detected} Workers Fully Compliant
            </span>
          </div>

          <div className="metric-tile highlight-ruby">
            <div className="metric-label">
              <span>Violations Detected</span>
              <AlertOctagon size={14} style={{ color: 'var(--safety-ruby)' }} />
            </div>
            <div className="metric-value" style={{ color: 'var(--safety-ruby)' }}>
              {auditData.violations_detected_count}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-ruby)' }}>1 Critical Fall Hazard Action</span>
          </div>

          <div className="metric-tile highlight-cyan">
            <div className="metric-label">
              <span>Audit Timestamp</span>
              <FileCheck size={14} style={{ color: 'var(--safety-cyan)' }} />
            </div>
            <div className="metric-value" style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginTop: '0.4rem' }}>
              {auditData.timestamp.split(' ')[1] || '14:32:10'}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Telemetry: Sector 4 Scaffolding Cam
            </span>
          </div>
        </div>
      )}

      {/* Main Split View: Visual Canvas with Bounding Boxes & Violation Details */}
      <div className="grid-split-view">
        {/* Left: Interactive Inspection Canvas */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div className="panel-header" style={{ marginBottom: '0.5rem' }}>
            <div className="panel-title">
              <Eye size={18} style={{ color: 'var(--safety-amber)' }} />
              <span>Multimodal Vision Bounding-Box Overlay</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button 
                className="btn-secondary" 
                onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
                id="btn-toggle-boxes"
              >
                {showBoundingBoxes ? <EyeOff size={13} /> : <Eye size={13} />}
                <span>{showBoundingBoxes ? 'Hide Overlays' : 'Show Overlays'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Bounding Box Viewer */}
          <div className="inspection-canvas-wrapper" id="safety-canvas-container" style={{ minHeight: '380px' }}>
            {imageDataUri && (
              <img 
                src={imageDataUri} 
                alt="Construction Site Safety Feed" 
                style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
              />
            )}

            {/* Render Bounding Boxes */}
            {showBoundingBoxes && filteredDetections.map((det) => {
              const isSelected = selectedDetection?.id === det.id;
              const boxClass = det.severity === 'critical' ? 'critical' : 
                               det.severity === 'high' ? 'high' : 
                               det.category === 'Compliant PPE' ? 'compliant' : 'high';

              return (
                <div
                  key={det.id}
                  id={`bbox-${det.id}`}
                  className={`bounding-box-overlay ${boxClass}`}
                  onClick={() => setSelectedDetection(det)}
                  style={{
                    left: `${det.box.x}%`,
                    top: `${det.box.y}%`,
                    width: `${det.box.width}%`,
                    height: `${det.box.height}%`,
                    borderWidth: isSelected ? '3px' : '2px',
                    transform: isSelected ? 'scale(1.02)' : 'none',
                    zIndex: isSelected ? 20 : 10
                  }}
                  title={det.label}
                >
                  <span className="bounding-box-tag">
                    {det.category === 'Compliant PPE' ? '✓ COMPLIANT' : `⚠️ ${det.severity.toUpperCase()}`}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', alignSelf: 'center' }}>Filter:</span>
            {['ALL', 'CRITICAL', 'VIOLATIONS', 'COMPLIANT'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`badge-tag ${filterCategory === cat ? 'medium' : 'info'}`}
                style={{ cursor: 'pointer', border: filterCategory === cat ? '1px solid var(--safety-amber)' : '1px solid transparent' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Selected Detection & Actionable OSHA Card */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="panel-header" style={{ marginBottom: '0.5rem' }}>
            <div className="panel-title">
              <AlertTriangle size={18} style={{ color: 'var(--safety-ruby)' }} />
              <span>Inspection Item Details & Action</span>
            </div>
            {selectedDetection && (
              <span className={`badge-tag ${selectedDetection.severity === 'critical' ? 'critical' : selectedDetection.severity === 'high' ? 'high' : 'compliant'}`}>
                {selectedDetection.severity}
              </span>
            )}
          </div>

          {selectedDetection ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }} id="selected-detection-card">
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                  {selectedDetection.label}
                </h4>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  Category: <span style={{ color: 'var(--text-main)' }}>{selectedDetection.category}</span> | Confidence: <span style={{ color: 'var(--safety-emerald)' }}>{(selectedDetection.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>

              {/* OSHA Standard Code */}
              <div style={{ 
                background: 'rgba(6, 182, 212, 0.08)', 
                borderLeft: '3px solid var(--safety-cyan)', 
                padding: '0.75rem', 
                borderRadius: '6px' 
              }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--safety-cyan)', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  Federal Standard Citation
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.15rem' }}>
                  {selectedDetection.osha_regulation}
                </div>
              </div>

              {/* Immediate Corrective Action */}
              <div style={{ 
                background: selectedDetection.severity === 'critical' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(30, 41, 59, 0.6)', 
                border: selectedDetection.severity === 'critical' ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--border-subtle)',
                padding: '0.85rem', 
                borderRadius: '8px' 
              }}>
                <div style={{ 
                  fontSize: '0.72rem', 
                  color: selectedDetection.severity === 'critical' ? 'var(--text-ruby)' : 'var(--safety-amber)', 
                  fontWeight: 800, 
                  textTransform: 'uppercase', 
                  fontFamily: 'var(--font-mono)' 
                }}>
                  Mandatory Action Required
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '0.25rem', lineHeight: '1.45' }}>
                  {selectedDetection.action_required}
                </div>
              </div>

              {/* All Detections Mini List */}
              <div style={{ marginTop: '0.5rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                  Detected Site Hazards ({auditData?.detections?.length || 0})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '180px', overflowY: 'auto' }}>
                  {auditData?.detections?.map((d) => (
                    <div
                      key={d.id}
                      onClick={() => setSelectedDetection(d)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        background: selectedDetection.id === d.id ? 'rgba(245, 158, 11, 0.15)' : 'rgba(15, 23, 42, 0.5)',
                        border: selectedDetection.id === d.id ? '1px solid var(--safety-amber)' : '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.78rem'
                      }}
                    >
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{d.label.slice(0, 38)}...</span>
                      <span className={`badge-tag ${d.severity === 'critical' ? 'critical' : d.severity === 'high' ? 'high' : 'compliant'}`}>
                        {d.severity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '2rem' }}>
              Select a bounding box on the image to view detailed OSHA regulations and corrective protocol.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
