from fastapi import APIRouter, HTTPException
from schemas.valuation_schema import ValuationRequest, ValuationResponse
from services.multimodal_engine import multimodal_engine
from services.presets import SAMPLE_VALUATION_IMAGE

router = APIRouter(prefix="/valuation", tags=["Real Estate & Asset Valuation"])

@router.get("/preset")
async def get_valuation_preset():
    """Returns sample commercial project asset valuation parameters."""
    return {
        "image_data_uri": SAMPLE_VALUATION_IMAGE,
        "property_type": "Commercial Mixed-Use",
        "built_up_area_sqft": 25000.0,
        "location_tier": "Tier 1 Metro Core",
        "construction_grade": "Grade A+ Premium",
        "completion_percentage": 68.0,
        "land_area_sqft": 18000.0
    }

@router.post("/estimate", response_model=ValuationResponse)
async def estimate_valuation(payload: ValuationRequest):
    """
    Multimodal Real Estate Asset Valuation.
    Estimates current and completed market value, cost to complete, trade comps,
    and verified stage of construction.
    """
    try:
        result = multimodal_engine.calculate_valuation(
            property_type=payload.property_type,
            built_up_area_sqft=payload.built_up_area_sqft,
            location_tier=payload.location_tier,
            construction_grade=payload.construction_grade,
            completion_percentage=payload.completion_percentage,
            land_area_sqft=payload.land_area_sqft or 18000.0,
            image_base64=payload.image_base64
        )
        return ValuationResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Valuation estimation failed: {str(e)}")
