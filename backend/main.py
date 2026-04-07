import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from groq import Groq

from models import LegalQuery, LegalResponse, Source
from rag_pipeline import RAGPipeline, load_constitution_pdf
from lawyers_db import find_best_lawyer

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

# Initialize Groq client
try:
    groq_api_key = os.getenv("GROQ_API_KEY")
    if groq_api_key and groq_api_key != "your_groq_api_key_here":
        groq_client = Groq(api_key=groq_api_key)
        logger.info("✓ Groq client initialized")
    else:
        groq_client = None
        logger.warning("⚠ Groq API key not configured - using mock responses")
except Exception as e:
    logger.warning(f"⚠ Could not initialize Groq: {e} - using mock responses")
    groq_client = None


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "rag_initialized": rag_pipeline is not None and rag_pipeline.documents_loaded,
        "groq_configured": groq_client is not None
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
            return {"error": "Query is required"}, 400
        
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
        
        # Generate response with Groq
        try:
            system_prompt = """You are a legal expert on the Nepal Constitution. 
Answer all questions based on the Constitution excerpts provided.
ALWAYS cite the specific Dhara (Article) and Upadhara (Section).
Format citations as: [Dhara X, Upadhara Y] or [Article X, Section Y, Page Z]
Include all relevant citations at the end of your response.
Be precise and reference the exact constitutional provisions.
Provide clear, authoritative legal information."""
            
            completion = groq_client.chat.completions.create(
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
            logger.error(f"Groq API error: {e}")
            # Return error message - no mock fallback
            answer = f"Unable to process request at this time: {str(e)}"
        
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
        return LegalResponse(
            answer=f"Error: {str(e)}",
            sources=[],
            recommended_lawyer=None,
            field="Constitutional Law"
        )


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
        return {"error": str(e)}, 500


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
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
