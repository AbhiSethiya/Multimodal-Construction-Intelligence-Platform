import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Upload, 
  RefreshCw, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  Wrench, 
  Activity, 
  Ruler, 
  Layers,
  FileCheck
} from 'lucide-react';
import { getCrackPreset, analyzeCrack } from '../services/api';

export default function CrackAnalysisView() {
  const [loading, setLoading] = useState(false);
  const [crackData, setCrackData] = useState(null);
  const [imageDataUri, setImageDataUri] = useState('');
  const [structuralElement, setStructuralElement] = useState('Reinforced Concrete Transfer Girder G-102');
  const [exposureEnv, setExposureEnv] = useState('Subterranean moisture, moderate humidity');

  useEffect(() => {
    loadPresetData();
  }, []);

  const loadPresetData = async () => {
    try {
      setLoading(true);
      const preset = await getCrackPreset();
      setImageDataUri(preset.image_data_uri);
      setStructuralElement(preset.structural_element);
      setExposureEnv(preset.exposure_environment);
      const res = await analyzeCrack({
        image_base64: preset.image_data_uri,
        structural_element: preset.structural_element,
        element_location: preset.element_location,
        concrete_grade: preset.concrete_grade,
        exposure_environment: preset.exposure_environment,
        known_age_years: preset.known_age_years
      });
      setCrackData(res);
    } catch (err) {
      console.error("Failed to load crack analysis:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result;
        setImageDataUri(base64);
        setLoading(true);
        try {
          const res = await analyzeCrack({
            image_base64: base64,
            structural_element: structuralElement,
            exposure_environment: exposureEnv
          });
          setCrackData(res);
        } catch (err) {
          console.error("Error analyzing crack:", err);
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div id="crack-analysis-view" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
            <span className="badge-tag critical">ACI 224R Structural Diagnostics</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Analysis ID: {crackData?.analysis_id || 'CRK-INSPECTING'}
            </span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Crack Detection & Structural Health Analysis</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Multimodal visual crack classification, sub-millimeter propagation risk modeling, and certified structural remediation protocols.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <label className="btn-secondary" style={{ cursor: 'pointer' }} id="btn-upload-crack-photo">
            <Upload size={15} />
            <span>Upload Element Photo</span>
            <input type="file" accept="image/*" onChange={handleCustomUpload} style={{ display: 'none' }} />
          </label>
          <button className="btn-primary" onClick={loadPresetData} disabled={loading} id="btn-load-crack-preset">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            <span>{loading ? 'Analyzing...' : 'Reset Girder Preset'}</span>
          </button>
        </div>
      </div>

      {/* Primary Status Banner & Shoring Alert */}
      {crackData && crackData.requires_immediate_shoring && (
        <div 
          style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '2px solid var(--safety-ruby)',
            borderRadius: '10px',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
          id="shoring-emergency-alert"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'var(--safety-ruby)', color: '#fff', padding: '10px', borderRadius: '50%' }}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-ruby)' }}>
                EMERGENCY STRUCTURAL INTERVENTION REQUIRED: Immediate Shoring Mandatory
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {crackData.crack_type} exceeds ACI 224R critical limits with width of {crackData.estimated_width_mm}mm. Relief props required beneath mid-span within 4 hours.
              </div>
            </div>
          </div>
          <span className="badge-tag critical" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
            Integrity: {crackData.structural_integrity_score}%
          </span>
        </div>
      )}

      {/* Metrics Row */}
      {crackData && (
        <div className="grid-cols-4">
          <div className="metric-tile highlight-ruby">
            <div className="metric-label">
              <span>Estimated Crack Width</span>
              <Ruler size={14} style={{ color: 'var(--safety-ruby)' }} />
            </div>
            <div className="metric-value" style={{ color: 'var(--safety-ruby)' }}>
              {crackData.estimated_width_mm} <span style={{ fontSize: '1rem', color: 'var(--text-dim)' }}>mm</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Peak: {crackData.maximum_width_mm}mm (Threshold: 0.30mm)
            </span>
          </div>

          <div className="metric-tile highlight-amber">
            <div className="metric-label">
              <span>Structural Integrity Score</span>
              <Activity size={14} style={{ color: 'var(--safety-amber)' }} />
            </div>
            <div className="metric-value" style={{ color: crackData.structural_integrity_score < 60 ? 'var(--safety-ruby)' : 'var(--safety-amber)' }}>
              {crackData.structural_integrity_score} <span style={{ fontSize: '1rem', color: 'var(--text-dim)' }}>/ 100</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Penetration: {crackData.depth_profile.split('(')[0]}
            </span>
          </div>

          <div className="metric-tile highlight-cyan">
            <div className="metric-label">
              <span>Propagation Risk</span>
              <Layers size={14} style={{ color: 'var(--safety-cyan)' }} />
            </div>
            <div className="metric-value" style={{ fontSize: '1.3rem', color: 'var(--safety-cyan)', marginTop: '0.35rem' }}>
              {crackData.propagation_risk.split('-')[0]}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Recheck Interval: {crackData.monitoring_interval_days} Days
            </span>
          </div>

          <div className="metric-tile highlight-emerald">
            <div className="metric-label">
              <span>Standard Code Reference</span>
              <ShieldCheck size={14} style={{ color: 'var(--safety-emerald)' }} />
            </div>
            <div className="metric-value" style={{ fontSize: '1.05rem', color: 'var(--text-main)', marginTop: '0.4rem' }}>
              {crackData.standard_code_reference.split('&')[0]}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-emerald)' }}>
              Code Compliant Protocol Loaded
            </span>
          </div>
        </div>
      )}

      {/* Split View: Visual Crack Element & Step-by-Step Remediation Plan */}
      <div className="grid-split-view">
        {/* Left: Element Visual Inspection */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div className="panel-header" style={{ marginBottom: '0.5rem' }}>
            <div className="panel-title">
              <Search size={18} style={{ color: 'var(--safety-ruby)' }} />
              <span>Concrete Element Visual Inspection</span>
            </div>
            <span className="badge-tag critical">{crackData?.crack_type.split('(')[0] || 'Diagnosed'}</span>
          </div>

          {/* Image Canvas with Calibrated HUD */}
          <div className="inspection-canvas-wrapper" style={{ minHeight: '340px' }} id="crack-canvas-container">
            {imageDataUri && (
              <img 
                src={imageDataUri} 
                alt="Cracked Concrete Element" 
                style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
              />
            )}
          </div>

          {crackData && (
            <div style={{ 
              background: 'rgba(15, 23, 42, 0.6)', 
              padding: '0.85rem', 
              borderRadius: '8px', 
              border: '1px solid var(--border-subtle)',
              fontSize: '0.82rem',
              lineHeight: '1.45'
            }}>
              <div style={{ color: 'var(--safety-amber)', fontWeight: 700, marginBottom: '0.2rem', fontFamily: 'var(--font-mono)' }}>
                ROOT CAUSE ANALYSIS HYPOTHESIS:
              </div>
              <div style={{ color: 'var(--text-muted)' }}>
                {crackData.root_cause_hypothesis}
              </div>
            </div>
          )}
        </div>

        {/* Right: Remediation Protocol Stepper */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="panel-header" style={{ marginBottom: '0.5rem' }}>
            <div className="panel-title">
              <Wrench size={18} style={{ color: 'var(--safety-amber)' }} />
              <span>Certified Engineering Remediation Protocol</span>
            </div>
            <span className="badge-tag info">{crackData?.remediation_protocol?.length || 0} Steps</span>
          </div>

          <div className="stepper-container" id="remediation-steps-list">
            {crackData?.remediation_protocol?.map((step) => (
              <div key={step.step_number} className="step-card">
                <div className="step-number-circle">{step.step_number}</div>
                <div className="step-body">
                  <div className="step-title">
                    <span>{step.title}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--safety-cyan)', fontFamily: 'var(--font-mono)' }}>
                      {step.timeframe}
                    </span>
                  </div>
                  <div className="step-desc">{step.procedure}</div>

                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                    {step.materials.map((mat, idx) => (
                      <span key={idx} className="badge-tag info" style={{ fontSize: '0.68rem' }}>
                        {mat}
                      </span>
                    ))}
                    {step.certified_engineer_signoff && (
                      <span className="badge-tag critical" style={{ fontSize: '0.68rem' }}>
                        ✓ PE Signoff Required
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
