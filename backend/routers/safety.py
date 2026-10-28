from fastapi import APIRouter, HTTPException
from schemas.safety_schema import SafetyAuditRequest, SafetyAuditResponse
from services.multimodal_engine import multimodal_engine
from services.presets import SAMPLE_SAFETY_IMAGE

router = APIRouter(prefix="/safety", tags=["Construction Site Safety"])

@router.get("/preset")
async def get_safety_preset():
    """Returns sample visual scene and parameters for immediate testing."""
    return {
        "image_data_uri": SAMPLE_SAFETY_IMAGE,
        "site_zone": "Scaffolding Zone B - Sector 4",
        "work_activity": "Structural framing & elevated decking",
        "weather_condition": "Overcast, 22°C"
    }

@router.post("/analyze", response_model=SafetyAuditResponse)
async def analyze_safety(payload: SafetyAuditRequest):
    """
    Multimodal Safety Audit endpoint.
    Scans construction imagery and site parameters for PPE non-compliance,
    fall hazards, unguarded edges, and outputs OSHA-referenced violations with bounding boxes.
    """
    try:
        result = multimodal_engine.analyze_site_safety(
            image_base64=payload.image_base64,
            site_zone=payload.site_zone or "Scaffolding Zone B - Sector 4",
            work_activity=payload.work_activity or "Structural framing & elevated decking",
            weather_condition=payload.weather_condition or "Overcast, 22°C"
        )
        return SafetyAuditResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Safety analysis failed: {str(e)}")
