import os
import sys

# Ensure backend directory is in sys.path for direct or module imports
_backend_dir = os.path.dirname(os.path.abspath(__file__))
if _backend_dir not in sys.path:
    sys.path.insert(0, _backend_dir)

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings

from routers.safety import router as safety_router
from routers.crack import router as crack_router
from routers.valuation import router as valuation_router
from routers.planning import router as planning_router
from routers.daily_log import router as daily_log_router
from routers.weather import router as weather_router
from routers.knowledge import router as knowledge_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Multimodal Artificial Intelligence Decision Support System for Construction Management"
)

# Enable CORS for seamless React frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all feature routers
app.include_router(safety_router, prefix=settings.API_PREFIX)
app.include_router(crack_router, prefix=settings.API_PREFIX)
app.include_router(valuation_router, prefix=settings.API_PREFIX)
app.include_router(planning_router, prefix=settings.API_PREFIX)
app.include_router(daily_log_router, prefix=settings.API_PREFIX)
app.include_router(weather_router, prefix=settings.API_PREFIX)
app.include_router(knowledge_router, prefix=settings.API_PREFIX)

@app.get("/")
async def root():
    return {
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "docs_url": "/docs",
        "modules": [
            "construction_site_safety_monitoring",
            "crack_detection_and_analysis",
            "real_estate_valuation",
            "construction_project_planning",
            "daily_site_assistance",
            "weather_aware_advisory",
            "construction_knowledge_assistance"
        ]
    }

@app.get("/api/health")
async def health_check():
    has_gemini = bool(settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY"))
    return {
        "status": "healthy",
        "version": settings.VERSION,
        "multimodal_ai_provider": "Google Gemini Multimodal + High-Fidelity Engineering Engine",
        "gemini_active": has_gemini,
        "timestamp": os.getenv("CURRENT_TIME", "")
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
