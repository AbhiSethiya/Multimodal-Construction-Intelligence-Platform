from typing import List, Optional
from pydantic import BaseModel, Field

class CrackRemediationStep(BaseModel):
    step_number: int
    title: str
    procedure: str
    materials: List[str]
    timeframe: str
    certified_engineer_signoff: bool

class CrackAnalysisRequest(BaseModel):
    image_base64: Optional[str] = None
    structural_element: str = Field("Reinforced Concrete Beam", description="Beam, Column, Slab, Shear Wall, Foundation, Masonry Wall")
    element_location: Optional[str] = "Basement Sub-level 1, Grid C-4"
    concrete_grade: Optional[str] = "M35 / 4000 PSI"
    exposure_environment: Optional[str] = "Subterranean moisture, moderate humidity"
    known_age_years: Optional[float] = 4.5

class CrackAnalysisResponse(BaseModel):
    analysis_id: str
    timestamp: str
    crack_type: str  # e.g., Diagonal Shear Crack, Hairline Plastic Shrinkage, Flexural Tension Crack, Settlement Crack
    severity_level: str  # Negligible, Low Risk, Moderate Structural Risk, Critical Danger
    estimated_width_mm: float
    maximum_width_mm: float
    depth_profile: str  # Surface Crazing (<1mm), Medium Depth (1-3mm), Full Through-Thickness
    propagation_risk: str  # Low, Moderate, High, Imminent Spalling
    structural_integrity_score: int = Field(..., ge=0, le=100)
    requires_immediate_shoring: bool
    root_cause_hypothesis: str
    standard_code_reference: str  # e.g. ACI 224R-01, EN 1992-1-1, IS 456
    remediation_protocol: List[CrackRemediationStep]
    monitoring_interval_days: int
    executive_verdict: str
