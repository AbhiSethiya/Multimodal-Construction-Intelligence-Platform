from fastapi import APIRouter, HTTPException
from schemas.knowledge_schema import ConstructionKnowledgeRequest, ConstructionKnowledgeResponse
from services.multimodal_engine import multimodal_engine

router = APIRouter(prefix="/knowledge", tags=["Construction Knowledge Assistant"])

@router.get("/preset")
async def get_knowledge_presets():
    """Returns sample technical prompts across structural, safety, and materials."""
    return {
        "sample_queries": [
            {
                "title": "Slump Test & Workability Standards",
                "query": "What is the recommended ASTM slump for high-slump pumped concrete slabs, and how to maintain workability in hot weather?",
                "domain": "Structural Concrete & Steel"
            },
            {
                "title": "ACI 318 Clear Rebar Spacing Rules",
                "query": "What are the minimum clear spacing and concrete cover requirements for heavily reinforced beams under ACI 318-19?",
                "domain": "Structural Concrete & Steel"
            },
            {
                "title": "OSHA 1926 Scaffolding & Fall Arrest",
                "query": "What are the OSHA requirements for perimeter guardrails, toe-boards, and PFAS anchorage points at heights > 6 feet?",
                "domain": "Safety Codes & OSHA"
            }
        ]
    }

@router.post("/ask", response_model=ConstructionKnowledgeResponse)
async def ask_knowledge_assistant(payload: ConstructionKnowledgeRequest):
    """
    Multimodal Construction QA Assistant.
    Provides rigorous technical responses with verified code citations
    (ACI, OSHA, AISC, Eurocode) and field inspection checkpoints.
    """
    try:
        result = multimodal_engine.answer_knowledge_query(
            query=payload.query,
            domain_filter=payload.domain_filter or "Structural Concrete & Steel",
            image_base64=payload.image_base64
        )
        return ConstructionKnowledgeResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Knowledge inquiry failed: {str(e)}")
