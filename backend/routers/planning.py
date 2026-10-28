from fastapi import APIRouter, HTTPException
from schemas.planning_schema import ProjectPlanningRequest, ProjectPlanningResponse
from services.multimodal_engine import multimodal_engine

router = APIRouter(prefix="/planning", tags=["Project Planning & Scheduling"])

@router.get("/preset")
async def get_planning_preset():
    """Returns sample high-rise project planning input parameters."""
    return {
        "project_title": "Harborview Commercial Tower",
        "project_type": "High-Rise Commercial",
        "total_area_sqft": 120000.0,
        "target_budget_usd": 28000000.0,
        "target_duration_months": 18,
        "site_terrain_complexity": "Moderate Urban Infill with Deep Foundation"
    }

@router.post("/generate", response_model=ProjectPlanningResponse)
async def generate_plan(payload: ProjectPlanningRequest):
    """
    Automated Project Planning & WBS Generator.
    Produces 5-phase schedule breakdown, critical path Gantt tasks, milestone targets,
    and contingency risk mitigation strategies.
    """
    try:
        result = multimodal_engine.generate_project_plan(
            project_title=payload.project_title,
            project_type=payload.project_type,
            total_area_sqft=payload.total_area_sqft,
            target_budget_usd=payload.target_budget_usd,
            target_duration_months=payload.target_duration_months,
            site_terrain_complexity=payload.site_terrain_complexity or "Moderate Urban Infill"
        )
        return ProjectPlanningResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Project planning failed: {str(e)}")
