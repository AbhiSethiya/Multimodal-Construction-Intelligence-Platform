from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class CostBreakdownItem(BaseModel):
    category: str
    allocation_percent: float
    amount_usd: float
    description: str

class MarketComparable(BaseModel):
    property_name: str
    distance_miles: float
    size_sqft: float
    sale_price_usd: float
    price_per_sqft: float
    construction_quality: str

class ValuationRequest(BaseModel):
    property_type: str = Field("Commercial Mixed-Use", description="Residential High-Rise, Commercial Mixed-Use, Industrial Logistics, Luxury Villa")
    built_up_area_sqft: float = Field(25000.0, gt=0)
    location_tier: str = Field("Tier 1 Metro Core", description="Tier 1 Metro Core, Tier 2 Urban, Suburban Corridor, Emerging Industrial")
    construction_grade: str = Field("Grade A+ Premium", description="Standard Commercial, Grade A+ Premium, Luxury Institutional, LEED Gold Spec")
    completion_percentage: float = Field(68.0, ge=0, le=100)
    land_area_sqft: Optional[float] = 18000.0
    image_base64: Optional[str] = None

class ValuationResponse(BaseModel):
    valuation_id: str
    timestamp: str
    estimated_current_market_value_usd: float
    estimated_completed_value_usd: float
    price_per_sqft_usd: float
    cost_to_complete_usd: float
    material_appreciation_multiplier: float
    confidence_score: int = Field(..., ge=0, le=100)
    construction_stage_verified: str
    investment_risk_rating: str  # Low Risk (AAA), Moderate Investment Grade, Speculative High Yield
    cost_breakdown: List[CostBreakdownItem]
    market_comparables: List[MarketComparable]
    key_drivers: List[str]
    ai_appraisal_notes: str
