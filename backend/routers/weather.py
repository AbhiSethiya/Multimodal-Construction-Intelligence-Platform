from fastapi import APIRouter, HTTPException
from schemas.weather_schema import WeatherAdvisoryRequest, WeatherAdvisoryResponse
from services.multimodal_engine import multimodal_engine

router = APIRouter(prefix="/weather", tags=["Weather-Aware Advisory"])

@router.get("/preset")
async def get_weather_preset():
    """Returns sample adverse weather scenario parameters."""
    return {
        "site_location": "Sector 62 - Coastal Metro Port",
        "temperature_c": 34.5,
        "humidity_percent": 78.0,
        "wind_speed_kph": 26.0,
        "precipitation_prob_percent": 45.0,
        "uv_index": 7.5
    }

@router.post("/advisory", response_model=WeatherAdvisoryResponse)
async def get_weather_advisory(payload: WeatherAdvisoryRequest):
    """
    Computes site operation hazard levels for concrete hydration (ACI 305R),
    crane wind-load limits (OSHA 1926 CC), and trenching stability.
    """
    try:
        result = multimodal_engine.calculate_weather_advisory(
            site_location=payload.site_location,
            temperature_c=payload.temperature_c,
            humidity_percent=payload.humidity_percent,
            wind_speed_kph=payload.wind_speed_kph,
            precipitation_prob_percent=payload.precipitation_prob_percent,
            uv_index=payload.uv_index or 7.5
        )
        return WeatherAdvisoryResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Weather advisory calculation failed: {str(e)}")
