from fastapi import APIRouter, HTTPException
from schemas.crack_schema import CrackAnalysisRequest, CrackAnalysisResponse
from services.multimodal_engine import multimodal_engine
from services.presets import SAMPLE_CRACK_IMAGE

router = APIRouter(prefix="/crack", tags=["Crack Detection & Structural Health"])

@router.get("/preset")
async def get_crack_preset():
    """Returns sample cracked reinforced concrete girder for 1-click evaluation."""
    return {
        "image_data_uri": SAMPLE_CRACK_IMAGE,
        "structural_element": "Reinforced Concrete Transfer Girder G-102",
        "element_location": "Basement Sub-level 1, Grid C-4",
        "concrete_grade": "M35 / 4000 PSI",
        "exposure_environment": "Subterranean moisture, moderate humidity",
        "known_age_years": 4.5
    }

@router.post("/analyze", response_model=CrackAnalysisResponse)
async def analyze_crack(payload: CrackAnalysisRequest):
    """
    Multimodal Crack Detection and Structural Health Evaluation.
    Classifies crack topology (shear, flexural, settlement), estimates width (mm),
    computes structural integrity score, and generates ACI-compliant remediation protocol.
    """
    try:
        result = multimodal_engine.analyze_structural_crack(
            image_base64=payload.image_base64,
            structural_element=payload.structural_element,
            element_location=payload.element_location or "Basement Sub-level 1, Grid C-4",
            concrete_grade=payload.concrete_grade or "M35 / 4000 PSI",
            exposure_environment=payload.exposure_environment or "Subterranean moisture, moderate humidity",
            known_age_years=payload.known_age_years or 4.5
        )
        return CrackAnalysisResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Crack analysis failed: {str(e)}")
