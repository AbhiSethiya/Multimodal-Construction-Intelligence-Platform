from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field

class TradeManpower(BaseModel):
    trade_name: str
    headcount: int
    hours_worked: float
    supervisor_in_charge: str

class DelayRecord(BaseModel):
    cause: str
    hours_lost: float
    impacted_activity: str
    remedial_action: str

class MaterialDelivery(BaseModel):
    material: str
    quantity: str
    supplier: str
    inspection_status: str  # Accepted, Quarantined, Rejected

class DailyLogRequest(BaseModel):
    project_name: Optional[str] = "Skyline Heights - Tower B"
    date_str: Optional[str] = "2026-10-28"
    raw_notes: str = Field(..., description="Unstructured notes or voice dictation from site engineer")
    ambient_weather: Optional[str] = "Overcast, 24°C, intermittent wind 18 km/h"

class DailyLogResponse(BaseModel):
    report_id: str
    report_date: str
    project_name: str
    executive_summary: str
    total_active_workforce: int
    manpower_distribution: List[TradeManpower]
    completed_milestones: List[str]
    equipment_on_duty: List[str]
    delays_recorded: List[DelayRecord]
    materials_received: List[MaterialDelivery]
    safety_compliance_notes: str
    tomorrow_planned_activities: List[str]
    supervisor_signoff_status: str
