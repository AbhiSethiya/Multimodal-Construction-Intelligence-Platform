import React, { useState, useEffect } from 'react';
import { 
  CloudSun, 
  Wind, 
  Droplets, 
  Thermometer, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  Sliders 
} from 'lucide-react';
import { getWeatherPreset, calculateWeatherAdvisory } from '../services/api';

export default function WeatherAdvisoryView() {
  const [loading, setLoading] = useState(false);
  const [advisoryData, setAdvisoryData] = useState(null);
  const [siteLocation, setSiteLocation] = useState('Sector 62 - Coastal Metro Port');
  const [tempC, setTempC] = useState(34.5);
  const [humidity, setHumidity] = useState(78.0);
  const [windSpeed, setWindSpeed] = useState(26.0);
  const [precipProb, setPrecipProb] = useState(45.0);

  useEffect(() => {
    loadPresetData();
  }, []);

  const loadPresetData = async () => {
    try {
      setLoading(true);
      const preset = await getWeatherPreset();
      setSiteLocation(preset.site_location);
      setTempC(preset.temperature_c);
      setHumidity(preset.humidity_percent);
      setWindSpeed(preset.wind_speed_kph);
      setPrecipProb(preset.precipitation_prob_percent);

      const res = await calculateWeatherAdvisory(preset);
      setAdvisoryData(res);
    } catch (err) {
      console.error("Failed to load weather advisory:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRecalculate = async () => {
    try {
      setLoading(true);
      const res = await calculateWeatherAdvisory({
        site_location: siteLocation,
        temperature_c: Number(tempC),
        humidity_percent: Number(humidity),
        wind_speed_kph: Number(windSpeed),
        precipitation_prob_percent: Number(precipProb)
      });
      setAdvisoryData(res);
    } catch (err) {
      console.error("Failed to recalculate weather advisory:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="weather-advisory-view" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
            <span className="badge-tag info">Meteorological Construction Advisory</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Advisory ID: {advisoryData?.advisory_id || 'WTH-UPDATING'}
            </span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Weather-Aware Construction Safety Advisory</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Calculates environmental impact on concrete hydration (ACI 305R), crane wind cutoffs (OSHA 1926 CC), and trench bank saturation.
          </p>
        </div>

        <button className="btn-primary" onClick={handleRecalculate} disabled={loading} id="btn-recalculate-weather">
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          <span>{loading ? 'Evaluating Limits...' : 'Recalculate Risk Thresholds'}</span>
        </button>
      </div>

      {/* Interactive Weather Parameter Sliders */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 700 }}>
          <Sliders size={16} style={{ color: 'var(--safety-cyan)' }} />
          <span>Real-Time Environmental Telemetry & Simulation</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {/* Temperature */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.35rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)' }}>
                <Thermometer size={14} style={{ color: 'var(--safety-amber)' }} /> Temperature:
              </span>
              <strong style={{ color: 'var(--safety-amber)' }}>{tempC}°C</strong>
            </div>
            <input 
              type="range" 
              min="0" 
              max="50" 
              step="0.5" 
              value={tempC} 
              onChange={(e) => setTempC(e.target.value)} 
              style={{ width: '100%', accentColor: 'var(--safety-amber)' }}
              id="slider-temperature"
            />
          </div>

          {/* Humidity */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.35rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)' }}>
                <Droplets size={14} style={{ color: 'var(--safety-cyan)' }} /> Relative Humidity:
              </span>
              <strong style={{ color: 'var(--safety-cyan)' }}>{humidity}%</strong>
            </div>
            <input 
              type="range" 
              min="10" 
              max="100" 
              step="1" 
              value={humidity} 
              onChange={(e) => setHumidity(e.target.value)} 
              style={{ width: '100%', accentColor: 'var(--safety-cyan)' }}
              id="slider-humidity"
            />
          </div>

          {/* Wind Speed */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.35rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)' }}>
                <Wind size={14} style={{ color: '#38bdf8' }} /> Wind Velocity:
              </span>
              <strong style={{ color: windSpeed > 38 ? 'var(--safety-ruby)' : '#38bdf8' }}>{windSpeed} km/h</strong>
            </div>
            <input 
              type="range" 
              min="0" 
              max="70" 
              step="1" 
              value={windSpeed} 
              onChange={(e) => setWindSpeed(e.target.value)} 
              style={{ width: '100%', accentColor: windSpeed > 38 ? 'var(--safety-ruby)' : 'var(--safety-cyan)' }}
              id="slider-wind-speed"
            />
          </div>

          {/* Precipitation */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.35rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)' }}>
                <CloudSun size={14} style={{ color: 'var(--safety-emerald)' }} /> Precipitation Risk:
              </span>
              <strong style={{ color: precipProb > 50 ? 'var(--safety-ruby)' : 'var(--safety-emerald)' }}>{precipProb}%</strong>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              step="5" 
              value={precipProb} 
              onChange={(e) => setPrecipProb(e.target.value)} 
              style={{ width: '100%', accentColor: precipProb > 50 ? 'var(--safety-ruby)' : 'var(--safety-emerald)' }}
              id="slider-precipitation"
            />
          </div>
        </div>
      </div>

      {/* Advisory Status Cards (4 Pillars) */}
      {advisoryData && (
        <div className="grid-cols-4">
          {/* Concrete Pouring */}
          <div className="glass-panel highlight-amber">
            <div className="metric-label">
              <span>Concrete Pouring Status</span>
              <Thermometer size={14} style={{ color: 'var(--safety-amber)' }} />
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.5rem 0' }}>
              {advisoryData.concrete_pouring_verdict}
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              {advisoryData.concrete_advisory_details}
            </p>
          </div>

          {/* Crane Operations */}
          <div className={`glass-panel ${advisoryData.crane_lifting_status.includes('SHUTDOWN') ? 'highlight-ruby' : 'highlight-cyan'}`}>
            <div className="metric-label">
              <span>Crane & Hoist Safety</span>
              <Wind size={14} style={{ color: 'var(--safety-cyan)' }} />
            </div>
            <div style={{ 
              fontSize: '1.05rem', 
              fontWeight: 800, 
              color: advisoryData.crane_lifting_status.includes('SHUTDOWN') ? 'var(--safety-ruby)' : 'var(--text-main)', 
              margin: '0.5rem 0' 
            }}>
              {advisoryData.crane_lifting_status}
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              {advisoryData.crane_advisory_details}
            </p>
          </div>

          {/* Excavation */}
          <div className="glass-panel highlight-emerald">
            <div className="metric-label">
              <span>Excavation Stability</span>
              <Droplets size={14} style={{ color: 'var(--safety-emerald)' }} />
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.5rem 0' }}>
              {advisoryData.excavation_safety_level}
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              {advisoryData.excavation_advisory_details}
            </p>
          </div>

          {/* Coatings & Waterproofing */}
          <div className="glass-panel highlight-cyan">
            <div className="metric-label">
              <span>Exterior Waterproofing</span>
              <CloudSun size={14} style={{ color: 'var(--safety-cyan)' }} />
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.5rem 0' }}>
              {advisoryData.exterior_coating_status}
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Dew-point and vapor condensation index within permissible limits for membrane curing.
            </p>
          </div>
        </div>
      )}

      {/* Hourly Suitable Work Windows Table */}
      {advisoryData && (
        <div className="glass-panel">
          <div className="panel-header">
            <div className="panel-title">
              <Clock size={18} style={{ color: 'var(--safety-amber)' }} />
              <span>Optimal Shift Windows & Trade Restrictions</span>
            </div>
            <span className="badge-tag info">ACI 305R & OSHA Subpart CC Synced</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {advisoryData.hourly_windows.map((w, idx) => (
              <div 
                key={idx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '150px 1.2fr 1fr 100px',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.75rem 1rem',
                  background: 'rgba(15, 23, 42, 0.5)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.82rem'
                }}
              >
                <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--safety-cyan)' }}>
                  {w.time_window}
                </div>
                <div>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem', display: 'block', textTransform: 'uppercase' }}>Allowed Operations:</span>
                  <span style={{ color: 'var(--safety-emerald)' }}>{w.suitable_operations.join(', ')}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem', display: 'block', textTransform: 'uppercase' }}>Restricted Operations:</span>
                  <span style={{ color: w.restricted_operations[0] === 'None' ? 'var(--text-dim)' : 'var(--safety-ruby)' }}>
                    {w.restricted_operations.join(', ')}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`badge-tag ${w.risk_level === 'Safe' ? 'compliant' : w.risk_level === 'Moderate' ? 'medium' : 'critical'}`}>
                    {w.risk_level}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
