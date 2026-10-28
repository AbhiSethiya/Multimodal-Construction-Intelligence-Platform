from typing import List, Optional
from pydantic import BaseModel, Field

class HourlyForecastWindow(BaseModel):
    time_window: str
    suitable_operations: List[str]
    restricted_operations: List[str]
    risk_level: str  # Safe, Moderate, Danger

class WeatherAdvisoryRequest(BaseModel):
    site_location: str = Field("Sector 62 - Coastal Metro Port", description="Site or project location")
    temperature_c: float = Field(34.5, description="Ambient temperature in Celsius")
    humidity_percent: float = Field(78.0, description="Relative humidity percentage")
    wind_speed_kph: float = Field(26.0, description="Wind speed in km/h")
    precipitation_prob_percent: float = Field(45.0, description="Precipitation probability 0-100")
    uv_index: Optional[float] = 7.5

class WeatherAdvisoryResponse(BaseModel):
    advisory_id: str
    timestamp: str
    location: str
    overall_site_risk_index: int = Field(..., ge=0, le=100)
    concrete_pouring_verdict: str  # Safe, Caution (Cold/Hot Weather Measures), DO NOT POUR
    concrete_advisory_details: str
    crane_lifting_status: str  # Operational, Caution, High-Altitude Lift Stoppage Mandatory
    crane_advisory_details: str
    excavation_safety_level: str  # Stable, Monitor Surcharge, High Ingress Hazard
    excavation_advisory_details: str
    exterior_coating_status: str  # Ideal, Elevated Dew-Point Risk, Halt Work
    active_hazard_warnings: List[str]
    hourly_windows: List[HourlyForecastWindow]
    engineering_standards_cited: List[str]
    advisory_summary: str
