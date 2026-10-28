from fastapi import APIRouter, HTTPException
from schemas.daily_log_schema import DailyLogRequest, DailyLogResponse
from services.multimodal_engine import multimodal_engine
from services.presets import SAMPLE_RAW_DAILY_NOTES

router = APIRouter(prefix="/daily-log", tags=["Daily Site Assistant & DPR Logbook"])

@router.get("/preset")
async def get_daily_log_preset():
    """Returns sample voice dictation / raw notes for 1-click parsing."""
    return {
        "project_name": "Skyline Heights - Tower B",
        "date_str": "2026-10-28",
        "ambient_weather": "Overcast, 24°C, intermittent wind 18 km/h",
        "raw_notes": SAMPLE_RAW_DAILY_NOTES
    }

@router.post("/process", response_model=DailyLogResponse)
async def process_daily_log(payload: DailyLogRequest):
    """
    Transforms unstructured site notes or voice transcripts into a standardized
    Daily Progress Report (DPR) with manpower, delay records, and material logs.
    """
    try:
        result = multimodal_engine.process_daily_log(
            raw_notes=payload.raw_notes,
            project_name=payload.project_name or "Skyline Heights - Tower B",
            date_str=payload.date_str,
            ambient_weather=payload.ambient_weather or "Overcast, 24°C"
        )
        return DailyLogResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Daily log processing failed: {str(e)}")
