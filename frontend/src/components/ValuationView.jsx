import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  RefreshCw, 
  Building2, 
  DollarSign, 
  Layers, 
  MapPin, 
  ShieldCheck, 
  PieChart 
} from 'lucide-react';
import { getValuationPreset, estimateValuation } from '../services/api';

export default function ValuationView() {
  const [loading, setLoading] = useState(false);
  const [valData, setValData] = useState(null);
  const [propertyType, setPropertyType] = useState('Commercial Mixed-Use');
  const [builtUpArea, setBuiltUpArea] = useState(25000);
  const [locationTier, setLocationTier] = useState('Tier 1 Metro Core');
  const [constructionGrade, setConstructionGrade] = useState('Grade A+ Premium');
  const [completionPercent, setCompletionPercent] = useState(68);
  const [imageDataUri, setImageDataUri] = useState('');

  useEffect(() => {
    loadPresetData();
  }, []);

  const loadPresetData = async () => {
    try {
      setLoading(true);
      const preset = await getValuationPreset();
      setImageDataUri(preset.image_data_uri);
      setPropertyType(preset.property_type);
      setBuiltUpArea(preset.built_up_area_sqft);
      setLocationTier(preset.location_tier);
      setConstructionGrade(preset.construction_grade);
      setCompletionPercent(preset.completion_percentage);

      const res = await estimateValuation(preset);
      setValData(res);
    } catch (err) {
      console.error("Failed to load valuation:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRecalculate = async () => {
    try {
      setLoading(true);
      const res = await estimateValuation({
        property_type: propertyType,
        built_up_area_sqft: Number(builtUpArea),
        location_tier: locationTier,
        construction_grade: constructionGrade,
        completion_percentage: Number(completionPercent),
        image_base64: imageDataUri
      });
      setValData(res);
    } catch (err) {
      console.error("Failed to estimate valuation:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="valuation-view" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
            <span className="badge-tag compliant">Multimodal Asset Appraisal</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Valuation ID: {valData?.valuation_id || 'VAL-CALCULATING'}
            </span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Real Estate & Construction Valuation Engine</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Synthesizes visual completion state, material replacement cost multipliers, and municipal market comps.
          </p>
        </div>

        <button className="btn-primary" onClick={handleRecalculate} disabled={loading} id="btn-recalculate-valuation">
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          <span>{loading ? 'Appraising Asset...' : 'Recalculate Valuation'}</span>
        </button>
      </div>

      {/* Property Parameter Controls */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Property Asset Type</label>
            <select 
              value={propertyType} 
              onChange={(e) => setPropertyType(e.target.value)} 
              style={{ width: '100%', fontSize: '0.82rem' }}
              id="select-property-type"
            >
              <option value="Commercial Mixed-Use">Commercial Mixed-Use</option>
              <option value="Residential High-Rise">Residential High-Rise</option>
              <option value="Industrial Logistics">Industrial Logistics</option>
              <option value="Luxury Villa Estate">Luxury Villa Estate</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Built-Up Area (Sq.Ft)</label>
            <input 
              type="number" 
              value={builtUpArea} 
              onChange={(e) => setBuiltUpArea(e.target.value)} 
              style={{ width: '100%', fontSize: '0.82rem' }}
              id="input-built-up-area"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Location Tier</label>
            <select 
              value={locationTier} 
              onChange={(e) => setLocationTier(e.target.value)} 
              style={{ width: '100%', fontSize: '0.82rem' }}
              id="select-location-tier"
            >
              <option value="Tier 1 Metro Core">Tier 1 Metro Core</option>
              <option value="Tier 2 Urban">Tier 2 Urban</option>
              <option value="Suburban Corridor">Suburban Corridor</option>
              <option value="Emerging Industrial">Emerging Industrial</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Construction Grade</label>
            <select 
              value={constructionGrade} 
              onChange={(e) => setConstructionGrade(e.target.value)} 
              style={{ width: '100%', fontSize: '0.82rem' }}
              id="select-construction-grade"
            >
              <option value="Standard Commercial">Standard Commercial</option>
              <option value="Grade A+ Premium">Grade A+ Premium</option>
              <option value="Luxury Institutional">Luxury Institutional</option>
              <option value="LEED Gold Spec">LEED Gold Spec</option>
            </select>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Completion Stage</span>
              <strong style={{ color: 'var(--safety-amber)' }}>{completionPercent}%</strong>
            </div>
            <input 
              type="range" 
              min="10" 
              max="100" 
              value={completionPercent} 
              onChange={(e) => setCompletionPercent(e.target.value)} 
              style={{ width: '100%', accentColor: 'var(--safety-amber)' }}
              id="slider-completion-percent"
            />
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      {valData && (
        <div className="grid-cols-4">
          <div className="metric-tile highlight-emerald">
            <div className="metric-label">
              <span>Current Market Value</span>
              <DollarSign size={14} style={{ color: 'var(--safety-emerald)' }} />
            </div>
            <div className="metric-value" style={{ color: 'var(--safety-emerald)' }}>
              ${(valData.estimated_current_market_value_usd / 1000000).toFixed(2)}M
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              As-Is Verified Physical Stage
            </span>
          </div>

          <div className="metric-tile highlight-cyan">
            <div className="metric-label">
              <span>Completed Asset Value</span>
              <Building2 size={14} style={{ color: 'var(--safety-cyan)' }} />
            </div>
            <div className="metric-value" style={{ color: 'var(--safety-cyan)' }}>
              ${(valData.estimated_completed_value_usd / 1000000).toFixed(2)}M
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              ${valData.price_per_sqft_usd} / Sq.Ft Benchmark
            </span>
          </div>

          <div className="metric-tile highlight-amber">
            <div className="metric-label">
              <span>Cost to Complete</span>
              <Layers size={14} style={{ color: 'var(--safety-amber)' }} />
            </div>
            <div className="metric-value" style={{ color: 'var(--safety-amber)' }}>
              ${(valData.cost_to_complete_usd / 1000000).toFixed(2)}M
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Residual Capex Allocation
            </span>
          </div>

          <div className="metric-tile highlight-cyan">
            <div className="metric-label">
              <span>Risk Rating</span>
              <ShieldCheck size={14} style={{ color: 'var(--safety-cyan)' }} />
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.4rem' }}>
              {valData.investment_risk_rating.split('(')[0]}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--safety-emerald)' }}>
              Confidence Score: {valData.confidence_score}%
            </span>
          </div>
        </div>
      )}

      {/* Split View: Visual Stage Verification & Cost Breakdown */}
      <div className="grid-split-view">
        {/* Left: Visual Stage-of-Construction Blueprint Analysis */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div className="panel-header">
            <div className="panel-title">
              <Building2 size={18} style={{ color: 'var(--safety-cyan)' }} />
              <span>Architectural Elevation & Progress Verification</span>
            </div>
            <span className="badge-tag info">{completionPercent}% Superstructure</span>
          </div>

          <div className="inspection-canvas-wrapper" style={{ minHeight: '300px' }} id="valuation-canvas-container">
            {imageDataUri && (
              <img 
                src={imageDataUri} 
                alt="Architectural Blueprint Elevation" 
                style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
              />
            )}
          </div>

          {valData && (
            <div style={{ 
              background: 'rgba(15, 23, 42, 0.6)', 
              padding: '0.85rem', 
              borderRadius: '8px', 
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
              lineHeight: '1.45',
              border: '1px solid var(--border-subtle)'
            }}>
              <strong style={{ color: 'var(--safety-cyan)' }}>AI Appraisal Intelligence: </strong>
              {valData.ai_appraisal_notes}
            </div>
          )}
        </div>

        {/* Right: Capex Cost Breakdown */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div className="panel-header">
            <div className="panel-title">
              <PieChart size={18} style={{ color: 'var(--safety-amber)' }} />
              <span>Construction Capex Cost Breakdown</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {valData?.cost_breakdown?.map((item, idx) => (
              <div 
                key={idx}
                style={{
                  padding: '0.75rem 0.85rem',
                  background: 'rgba(15, 23, 42, 0.5)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{item.category}</span>
                  <span className="badge-tag info">{item.allocation_percent}%</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  {item.description}
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--safety-amber)', fontFamily: 'var(--font-mono)' }}>
                  ${item.amount_usd.toLocaleString()} USD
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Comparables Table */}
      {valData && (
        <div className="glass-panel">
          <div className="panel-header">
            <div className="panel-title">
              <MapPin size={18} style={{ color: 'var(--safety-emerald)' }} />
              <span>Recent Local Market Comparable Transactions</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {valData.market_comparables.map((comp, idx) => (
              <div 
                key={idx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.5fr 100px 100px 120px 120px 130px',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.75rem 1rem',
                  background: 'rgba(15, 23, 42, 0.5)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.82rem'
                }}
              >
                <div style={{ fontWeight: 600 }}>{comp.property_name}</div>
                <div style={{ color: 'var(--text-muted)' }}>{comp.distance_miles} mi</div>
                <div style={{ color: 'var(--text-muted)' }}>{comp.size_sqft.toLocaleString()} sqft</div>
                <div style={{ fontWeight: 700, color: 'var(--safety-emerald)' }}>${(comp.sale_price_usd / 1000000).toFixed(2)}M</div>
                <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--safety-cyan)' }}>${comp.price_per_sqft}/sqft</div>
                <div><span className="badge-tag info">{comp.construction_quality}</span></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
