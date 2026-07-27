#implementation of a FastAPI backend for RAG-powered legal consultation with LLM integration ( Groq)
from typing import List, Optional
from pydantic import BaseModel

class Lawyer(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    specialization: List[str]
    years_of_experience: int
    rating: float
    bio: str
    available_now: bool

class LegalQuery(BaseModel):
    query: str

class Source(BaseModel):
    page: int
    content: str
    source_name: str = "Constitution of Nepal"  # Document/article name

class LegalResponse(BaseModel):
    answer: str
    sources: List[Source]
    recommended_lawyer: Optional[Lawyer] = None
    field: str
