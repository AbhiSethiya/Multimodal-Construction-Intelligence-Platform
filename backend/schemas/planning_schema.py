from typing import List, Optional
from pydantic import BaseModel, Field

class GanttTask(BaseModel):
    id: str
    name: str
    phase: str
    start_day: int
    duration_days: int
    progress_percent: int
    is_critical_path: bool
    assigned_crew: str
    risk_level: str  # Low, Medium, High
    predecessors: List[str]

class ProjectPhase(BaseModel):
    phase_id: str
    phase_name: str
    duration_days: int
    budget_allocation_usd: float
    progress_percent: int
    milestone_deliverable: str

class RiskMitigation(BaseModel):
    risk_title: str
    severity: str
    probability: str
    impacted_phase: str
    mitigation_strategy: str

class ProjectPlanningRequest(BaseModel):
    project_title: str = Field("Harborview Commercial Tower", description="Project Title")
    project_type: str = Field("High-Rise Commercial", description="High-Rise Commercial, Residential Complex, Industrial Logistics, Public Infrastructure")
    total_area_sqft: float = Field(120000.0, gt=0)
    target_budget_usd: float = Field(28000000.0, gt=0)
    target_duration_months: int = Field(18, ge=3, le=60)
    site_terrain_complexity: Optional[str] = "Moderate Urban Infill with Deep Foundation"

class ProjectPlanningResponse(BaseModel):
    plan_id: str
    project_title: str
    estimated_total_days: int
    project_critical_path_days: int
    budget_variance_forecast_percent: float
    phases: List[ProjectPhase]
    tasks: List[GanttTask]
    key_milestones: List[str]
    identified_risks: List[RiskMitigation]
    ai_schedule_optimization_insight: str
