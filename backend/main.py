import os
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from groq import Groq

from models import LegalQuery, LegalResponse, Source
from rag_pipeline import RAGPipeline, load_constitution_pdf
from lawyers_db import find_best_lawyer


def _is_placeholder_or_invalid_key(value: str | None) -> bool:
    return not value or value.startswith("your_")


def _build_llm_client():
    """Prefer Gemini when available, then fall back to Groq."""
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if not _is_placeholder_or_invalid_key(gemini_api_key):
        try:
            from langchain_google_genai import ChatGoogleGenerativeAI

            logger.info("✓ Gemini client initialized")
            return {
                "provider": "gemini",
                "client": ChatGoogleGenerativeAI,
                "api_key": gemini_api_key,
            }
        except Exception as e:
            logger.warning(f"⚠ Could not initialize Gemini: {e}")

    groq_api_key = os.getenv("GROQ_API_KEY")
    if not _is_placeholder_or_invalid_key(groq_api_key):
        try:
            logger.info("✓ Groq client initialized")
            return {
                "provider": "groq",
                "client": Groq(api_key=groq_api_key),
            }
        except Exception as e:
            logger.warning(f"⚠ Could not initialize Groq: {e}")

    logger.warning("⚠ No LLM provider configured - using mock responses")
    return {"provider": None, "client": None}


def _gemini_model_candidates() -> list[str]:
    preferred_model = os.getenv("GEMINI_MODEL")
    candidates = [
        preferred_model,
        "gemini-3.6-flash",
        "gemini-flash-latest",
        "gemini-3.5-flash",
        "gemini-2.0-flash",
    ]
    return [candidate for candidate in candidates if candidate]


def _coerce_llm_text(content) -> str:
    if isinstance(content, str):
        return content

    if isinstance(content, list):
        parts = []
        for item in content:
            if isinstance(item, str):
                parts.append(item)
            elif isinstance(item, dict):
                text = item.get("text")
                if text:
                    parts.append(str(text))
            else:
                text = getattr(item, "text", None)
                if text:
                    parts.append(str(text))
        return "".join(parts).strip()

    text = getattr(content, "text", None)
    if text:
        return str(text)

    return str(content)


def build_rag_fallback_answer(query: str, relevant_docs: list) -> str:
    """Return a useful answer from retrieved context when LLM generation is unavailable."""
    if not relevant_docs:
        return (
            "I could not retrieve enough constitutional context to answer this question confidently right now. "
            "Please try again with more specific terms (for example: fundamental rights, property, marriage, bail)."
        )

    top_doc = relevant_docs[0]
    source_detail = top_doc["metadata"].get("source_detail", f"Page {top_doc['metadata'].get('page', 'Unknown')}")
    snippet = top_doc["content"].strip().replace("\n", " ")[:500]

    return (
        f"Based on the constitutional references available, here is the closest match for your question: \"{query}\".\n\n"
        f"Relevant provision: {source_detail}\n"
        f"Excerpt: {snippet}...\n\n"
        "Note: AI text generation is temporarily unavailable, so this response is derived directly from retrieved legal text."
    )

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Synergy Legal Assistant API",
    description="Python backend for RAG-powered legal consultation",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG pipeline
try:
    constitution_docs = load_constitution_pdf()
    rag_pipeline = RAGPipeline(constitution_docs)
    logger.info(f"✓ RAG Pipeline initialized with {len(constitution_docs)} documents")
except Exception as e:
    logger.error(f"Error initializing RAG pipeline: {e}")
    rag_pipeline = None

llm_runtime = _build_llm_client()
llm_provider = llm_runtime["provider"]
llm_client = llm_runtime["client"]


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "rag_initialized": rag_pipeline is not None and rag_pipeline.documents_loaded,
        "llm_provider": llm_provider,
        "llm_configured": llm_client is not None
    }


@app.post("/api/ask-legal", response_model=LegalResponse)
async def ask_legal(request: LegalQuery):
    """
    Ask a legal question with RAG
    
    The system will:
    1. Search the Constitution using RAG
    2. Get AI-powered response from Gemini
    3. Recommend a lawyer based on the legal field
    """
    try:
        query = request.query
        
        if not query:
            raise HTTPException(status_code=400, detail="Query is required")
        
        # Get relevant documents from RAG
        if not rag_pipeline or not rag_pipeline.documents_loaded:
            relevant_docs = []
        else:
            relevant_docs = rag_pipeline.query(query)
        
        # Prepare context from documents
        context_parts = []
        source_citations = []
        
        for doc in relevant_docs:
            source_detail = doc['metadata'].get('source_detail', f"Page {doc['metadata'].get('page', 'Unknown')}")
            source_name = doc['metadata'].get('source', 'Constitution')
            
            context_parts.append(f"[Source: {source_detail}]\n{doc['content']}")
            
            # Track sources for citation
            if source_detail not in source_citations:
                source_citations.append(source_detail)
        
        context = "\n\n---\n\n".join(context_parts)
        
        # Generate response with the configured LLM, falling back to retrieved context if unavailable.
        if llm_client is None:
            answer = build_rag_fallback_answer(query, relevant_docs)
        else:
            try:
                system_prompt = """You are a legal expert on the Nepal Constitution. 
Answer all questions based on the Constitution excerpts provided.
ALWAYS cite the specific Dhara (Article) and Upadhara (Section).
Format citations as: [Dhara X, Upadhara Y] or [Article X, Section Y, Page Z]
Include all relevant citations at the end of your response.
Be precise and reference the exact constitutional provisions.
Provide clear, authoritative legal information."""

                if llm_provider == "gemini":
                    prompt_text = f"{system_prompt}\n\nConstitution Context:\n{context}\n\nQuestion: {query}"
                    last_error = None

                    for model_name in _gemini_model_candidates():
                        try:
                            gemini_client = llm_client(
                                model=model_name,
                                google_api_key=os.getenv("GEMINI_API_KEY"),
                                temperature=0.5,
                            )
                            completion = gemini_client.invoke(prompt_text)
                            answer = _coerce_llm_text(completion.content)
                            break
                        except Exception as e:
                            last_error = e
                            logger.warning(f"⚠ Gemini model {model_name} failed: {e}")
                    else:
                        raise last_error if last_error else RuntimeError("Gemini generation failed")
                else:
                    completion = llm_client.chat.completions.create(
                        model="llama-3.3-70b-versatile",
                        messages=[
                            {
                                "role": "system",
                                "content": system_prompt
                            },
                            {
                                "role": "user",
                                "content": f"Constitution Context:\n{context}\n\nQuestion: {query}"
                            }
                        ],
                        temperature=0.5,
                        max_completion_tokens=1024,
                        top_p=1
                    )
                    answer = completion.choices[0].message.content
            except Exception as e:
                logger.error(f"LLM API error: {e}")
                answer = build_rag_fallback_answer(query, relevant_docs)
        
        # Detect legal field from query
        legal_field = detect_legal_field(query)
        
        # Find best lawyer
        recommended_lawyer = find_best_lawyer(legal_field)
        
        # Format sources with proper citation
        sources = [
            Source(
                page=doc['metadata'].get('page', 1),
                content=doc['content'][:200] + "...",
                source_name=doc['metadata'].get('source_detail', f"Page {doc['metadata'].get('page', 1)}")
            )
            for doc in relevant_docs
        ]
        
        return LegalResponse(
            answer=answer,
            sources=sources,
            recommended_lawyer=recommended_lawyer,
            field=legal_field
        )
    
    except Exception as e:
        logger.error(f"Error processing legal query: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/lawyers")
async def get_lawyers(specialization: str = None):
    """Get all lawyers or filter by specialization"""
    from lawyers_db import LAWYERS_DATABASE, find_lawyers_by_specialization
    
    try:
        if specialization:
            lawyers = find_lawyers_by_specialization(specialization)
        else:
            lawyers = LAWYERS_DATABASE
        
        # Sort by availability and rating
        lawyers = sorted(
            lawyers,
            key=lambda x: (not x.available_now, -x.rating)
        )
        
        return lawyers
    
    except Exception as e:
        logger.error(f"Error fetching lawyers: {e}")
        raise HTTPException(status_code=500, detail=str(e))


def detect_legal_field(query: str) -> str:
    """Detect the legal field from a query"""
    query_lower = query.lower()
    
    field_keywords = {
        "Constitutional Law": ["constitution", "fundamental", "rights", "amendment"],
        "Criminal Law": ["crime", "criminal", "offense", "prosecution", "jail", "bail"],
        "Family Law": ["marriage", "divorce", "child", "custody", "family"],
        "Corporate Law": ["company", "business", "corporate", "contract", "agreement"],
        "Property Law": ["property", "land", "real estate", "house", "deed"],
        "Labor Law": ["labor", "employment", "worker", "wage", "job"],
    }
    
    for field, keywords in field_keywords.items():
        if any(keyword in query_lower for keyword in keywords):
            return field
    
    return "Constitutional Law"  # Default


if __name__ == "__main__":
    import uvicorn
    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host=host, port=port)
