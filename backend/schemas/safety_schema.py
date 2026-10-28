from typing import List, Optional
from pydantic import BaseModel, Field

class BoundingBox(BaseModel):
    x: float = Field(..., description="Top-left X coordinate in percentage (0 to 100)")
    y: float = Field(..., description="Top-left Y coordinate in percentage (0 to 100)")
    width: float = Field(..., description="Bounding box width in percentage (0 to 100)")
    height: float = Field(..., description="Bounding box height in percentage (0 to 100)")

class SafetyViolationItem(BaseModel):
    id: str
    label: str
    category: str = Field(..., description="PPE Violation, Fall Hazard, Unguarded Edge, Electrical Hazard, Tripping Hazard, Compliant PPE")
    severity: str = Field(..., description="low, medium, high, critical")
    confidence: float
    box: BoundingBox
    osha_regulation: str
    action_required: str

class SafetyAuditRequest(BaseModel):
    image_base64: Optional[str] = None
    site_zone: Optional[str] = "Scaffolding Zone B - Sector 4"
    work_activity: Optional[str] = "Structural framing & elevated decking"
    weather_condition: Optional[str] = "Overcast, 22°C"

class SafetyAuditResponse(BaseModel):
    audit_id: str
    timestamp: str
    overall_safety_score: int = Field(..., ge=0, le=100)
    compliance_rate_percent: float
    total_workers_detected: int
    compliant_workers_count: int
    violations_detected_count: int
    hazard_level: str  # Safe, Caution, Severe, Immediate Stop-Work
    critical_alerts: List[str]
    detections: List[SafetyViolationItem]
    executive_summary: str
    recommended_safety_talk: str
