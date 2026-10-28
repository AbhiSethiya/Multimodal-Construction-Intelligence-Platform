from typing import List, Optional
from pydantic import BaseModel, Field

class CitationReference(BaseModel):
    standard: str  # e.g. "ACI 318-19 Section 25.4", "OSHA 1926.501(b)(1)"
    clause: str
    relevance: str

class ConstructionKnowledgeRequest(BaseModel):
    query: str = Field(..., description="Technical engineering or construction management query")
    domain_filter: Optional[str] = "Structural Concrete & Steel"  # Structural, Safety Codes, MEP, Project Controls
    image_base64: Optional[str] = None

class ConstructionKnowledgeResponse(BaseModel):
    query_id: str
    query: str
    direct_answer: str
    detailed_technical_explanation: str
    code_citations: List[CitationReference]
    calculation_or_formula: Optional[str] = None
    practical_site_checkpoints: List[str]
    suggested_followups: List[str]
