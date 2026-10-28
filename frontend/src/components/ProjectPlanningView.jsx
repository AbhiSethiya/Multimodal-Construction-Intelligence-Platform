import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  RefreshCw, 
  Clock, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign, 
  TrendingUp, 
  SlidersHorizontal 
} from 'lucide-react';
import { getPlanningPreset, generateProjectPlan } from '../services/api';

export default function ProjectPlanningView() {
  const [loading, setLoading] = useState(false);
  const [planData, setPlanData] = useState(null);
  const [projectTitle, setProjectTitle] = useState('Harborview Commercial Tower');
  const [projectType, setProjectType] = useState('High-Rise Commercial');
  const [totalArea, setTotalArea] = useState(120000);
  const [budgetUSD, setBudgetUSD] = useState(28000000);
  const [targetMonths, setTargetMonths] = useState(18);

  useEffect(() => {
    loadPresetData();
  }, []);

  const loadPresetData = async () => {
    try {
      setLoading(true);
      const preset = await getPlanningPreset();
      setProjectTitle(preset.project_title);
      setProjectType(preset.project_type);
      setTotalArea(preset.total_area_sqft);
      setBudgetUSD(preset.target_budget_usd);
      setTargetMonths(preset.target_duration_months);

      const res = await generateProjectPlan(preset);
      setPlanData(res);
    } catch (err) {
      console.error("Failed to generate plan:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRecalculate = async () => {
    try {
      setLoading(true);
      const res = await generateProjectPlan({
        project_title: projectTitle,
        project_type: projectType,
        total_area_sqft: Number(totalArea),
        target_budget_usd: Number(budgetUSD),
        target_duration_months: Number(targetMonths),
        site_terrain_complexity: "Urban High-Rise Specification"
      });
      setPlanData(res);
    } catch (err) {
      console.error("Plan recalculation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="project-planning-view" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
            <span className="badge-tag info">WBS & Critical Path Engine</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Plan ID: {planData?.plan_id || 'PLN-SIMULATING'}
            </span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Construction Project Planning & WBS Gantt</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Multi-stage work breakdown structure generation, critical path network calculation, and resource crew scheduling.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <button className="btn-primary" onClick={handleRecalculate} disabled={loading} id="btn-recalculate-plan">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            <span>{loading ? 'Optimizing Schedule...' : 'Regenerate WBS & Gantt'}</span>
          </button>
        </div>
      </div>

      {/* Parameter Controls Bar */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.85rem', fontWeight: 700 }}>
          <SlidersHorizontal size={15} style={{ color: 'var(--safety-amber)' }} />
          <span>Project Specifications & Schedule Constraints</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Project Title</label>
            <input 
              type="text" 
              value={projectTitle} 
              onChange={(e) => setProjectTitle(e.target.value)}
              style={{ width: '100%', fontSize: '0.82rem' }}
              id="input-project-title"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Project Type</label>
            <select 
              value={projectType} 
              onChange={(e) => setProjectType(e.target.value)}
              style={{ width: '100%', fontSize: '0.82rem' }}
              id="select-project-type"
            >
              <option value="High-Rise Commercial">High-Rise Commercial</option>
              <option value="Residential Complex">Residential Complex</option>
              <option value="Industrial Logistics Hub">Industrial Logistics Hub</option>
              <option value="Public Transit Infrastructure">Public Transit Infrastructure</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Total Area (Sq.Ft)</label>
            <input 
              type="number" 
              value={totalArea} 
              onChange={(e) => setTotalArea(e.target.value)}
              style={{ width: '100%', fontSize: '0.82rem' }}
              id="input-total-area"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Target Budget (USD)</label>
            <input 
              type="number" 
              value={budgetUSD} 
              onChange={(e) => setBudgetUSD(e.target.value)}
              style={{ width: '100%', fontSize: '0.82rem' }}
              id="input-budget-usd"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Target Duration (Months)</label>
            <input 
              type="number" 
              value={targetMonths} 
              onChange={(e) => setTargetMonths(e.target.value)}
              style={{ width: '100%', fontSize: '0.82rem' }}
              id="input-target-months"
            />
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      {planData && (
        <div className="grid-cols-4">
          <div className="metric-tile highlight-cyan">
            <div className="metric-label">
              <span>Total Duration</span>
              <Clock size={14} style={{ color: 'var(--safety-cyan)' }} />
            </div>
            <div className="metric-value" style={{ color: 'var(--safety-cyan)' }}>
              {planData.estimated_total_days} <span style={{ fontSize: '1rem', color: 'var(--text-dim)' }}>Days</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Critical Path: {planData.project_critical_path_days} Days
            </span>
          </div>

          <div className="metric-tile highlight-emerald">
            <div className="metric-label">
              <span>Budget Variance Forecast</span>
              <DollarSign size={14} style={{ color: 'var(--safety-emerald)' }} />
            </div>
            <div className="metric-value" style={{ color: 'var(--safety-emerald)' }}>
              +{planData.budget_variance_forecast_percent}%
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Within ±5.0% Control Limits
            </span>
          </div>

          <div className="metric-tile highlight-amber">
            <div className="metric-label">
              <span>WBS Project Phases</span>
              <Layers size={14} style={{ color: 'var(--safety-amber)' }} />
            </div>
            <div className="metric-value" style={{ color: 'var(--safety-amber)' }}>
              {planData.phases.length}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Phase 3 Active (50% Complete)
            </span>
          </div>

          <div className="metric-tile highlight-ruby">
            <div className="metric-label">
              <span>Tracked Risks</span>
              <AlertTriangle size={14} style={{ color: 'var(--safety-ruby)' }} />
            </div>
            <div className="metric-value" style={{ color: 'var(--safety-ruby)' }}>
              {planData.identified_risks.length}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Mitigation Protocol Ready
            </span>
          </div>
        </div>
      )}

      {/* Interactive Gantt Chart Timeline */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="panel-header" style={{ marginBottom: '0.5rem' }}>
          <div className="panel-title">
            <Calendar size={18} style={{ color: 'var(--safety-amber)' }} />
            <span>Interactive Project Gantt Chart & Critical Path Network</span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.78rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '12px', height: '12px', background: 'linear-gradient(90deg, #f59e0b, #ef4444)', borderRadius: '3px' }}></span>
              Critical Path Task
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '12px', height: '12px', background: 'linear-gradient(90deg, #06b6d4, #3b82f6)', borderRadius: '3px' }}></span>
              Standard Activity
            </span>
          </div>
        </div>

        <div className="gantt-container" id="gantt-tasks-table">
          {planData?.tasks?.map((task) => {
            const totalProjectDays = planData.estimated_total_days || 540;
            const leftPercent = (task.start_day / totalProjectDays) * 100;
            const widthPercent = Math.max(4, (task.duration_days / totalProjectDays) * 100);

            return (
              <div key={task.id} className="gantt-task-row">
                <div className="gantt-task-meta">
                  <div className="gantt-task-title">
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--safety-amber)' }}>{task.id}</span>
                    <span>{task.name}</span>
                  </div>
                  <div className="gantt-task-sub">
                    Crew: {task.assigned_crew} | {task.duration_days} Days
                  </div>
                </div>

                <div className="gantt-track">
                  <div 
                    className={`gantt-bar ${task.is_critical_path ? 'critical' : 'standard'}`}
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`
                    }}
                    title={`${task.name}: ${task.progress_percent}% complete`}
                  >
                    <span>{task.progress_percent}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Section: 5 WBS Phases Breakdown & Risk Mitigation Matrix */}
      <div className="grid-cols-2">
        {/* WBS Phases */}
        <div className="glass-panel">
          <div className="panel-header">
            <div className="panel-title">
              <Layers size={18} style={{ color: 'var(--safety-cyan)' }} />
              <span>Work Breakdown Structure (WBS) Phases</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {planData?.phases?.map((p) => (
              <div 
                key={p.phase_id}
                style={{
                  padding: '0.85rem',
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>{p.phase_name}</span>
                  <span className="badge-tag info">{p.progress_percent}% Done</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Deliverable: <strong style={{ color: 'var(--text-main)' }}>{p.milestone_deliverable}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                  <span>Duration: {p.duration_days} Days</span>
                  <span>Budget: ${p.budget_allocation_usd.toLocaleString()} USD</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Identified Risks & Mitigations */}
        <div className="glass-panel">
          <div className="panel-header">
            <div className="panel-title">
              <AlertTriangle size={18} style={{ color: 'var(--safety-ruby)' }} />
              <span>Identified Project Risks & Contingency</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {planData?.identified_risks?.map((risk, idx) => (
              <div 
                key={idx}
                style={{
                  padding: '0.85rem',
                  background: 'rgba(15, 23, 42, 0.5)',
                  borderLeft: '3px solid var(--safety-ruby)',
                  borderRadius: '8px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' }}>{risk.risk_title}</span>
                  <span className="badge-tag critical">{risk.severity} Severity</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Phase Affected: <strong style={{ color: 'var(--safety-amber)' }}>{risk.impacted_phase}</strong>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-emerald)', lineHeight: '1.4' }}>
                  <strong>Mitigation Strategy:</strong> {risk.mitigation_strategy}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
