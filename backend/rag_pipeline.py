#implementation of a fast RAG pipeline with hybrid search (BM25 + optional embeddings)
import os
import json
from typing import List, Dict
import numpy as np
from models import Source

class HybridVectorStore:
    """Fast hybrid search: BM25 keyword + optional embeddings"""
    
    def __init__(self):
        self.documents = []
        self.bm25 = None
        self.tokenized_docs = []
        self.embeddings = None
        self.doc_embeddings = None
        
    def add_documents(self, docs: List[Dict]):
        """Add documents and create BM25 index"""
        self.documents = docs
        
        # Initialize BM25 for keyword search
        try:
            from rank_bm25 import BM25Okapi
            self.tokenized_docs = [doc.get('content', '').lower().split() for doc in docs]
            self.bm25 = BM25Okapi(self.tokenized_docs)
            print(f"✓ Loaded {len(docs)} documents into BM25 index")
        except Exception as e:
            print(f"Warning: Could not initialize BM25: {e}")
            self.bm25 = None
    
    def hybrid_search(self, query: str, k: int = 3) -> List[Dict]:
        """Hybrid search: BM25 + optional semantic similarity"""
        results = {}
        
        # BM25 keyword search (always available, fast!)
        if self.bm25:
            try:
                query_tokens = query.lower().split()
                bm25_scores = self.bm25.get_scores(query_tokens)
                for idx, score in enumerate(bm25_scores):
                    if score > 0.01:
                        results[idx] = score * 0.7  # 70% weight on BM25
            except Exception as e:
                print(f"BM25 search error: {e}")
        
        # Semantic search with embeddings (if available)
        if self.embeddings and self.doc_embeddings is not None:
            try:
                query_embedding = self.embeddings.encode(query, show_progress_bar=False)
                from sklearn.metrics.pairwise import cosine_similarity
                similarities = cosine_similarity([query_embedding], self.doc_embeddings)[0]
                
                for idx, score in enumerate(similarities):
                    if score > 0.1:
                        results[idx] = results.get(idx, 0) + (score * 0.3)  # 30% weight on semantic
            except Exception as e:
                pass  # Silently skip if embedding fails
        
        # If no results, return top docs by keyword
        if not results:
            return self._keyword_search(query, k)
        
        # Sort by score
        sorted_results = sorted(results.items(), key=lambda x: x[1], reverse=True)[:k]
        return [self.documents[idx] for idx, _ in sorted_results]
    
    def _keyword_search(self, query: str, k: int = 3) -> List[Dict]:
        """Fallback keyword-only search"""
        if not self.bm25:
            return self.documents[:k]
        
        query_tokens = query.lower().split()
        try:
            bm25_scores = self.bm25.get_scores(query_tokens)
            scored = [(idx, score) for idx, score in enumerate(bm25_scores) if score > 0]
            scored.sort(key=lambda x: x[1], reverse=True)
            return [self.documents[idx] for idx, _ in scored[:k]]
        except:
            return self.documents[:k]


class RAGPipeline:
    """Fast RAG pipeline with hybrid search"""
    
    def __init__(self, documents: List[Dict] = None):
        self.vector_store = HybridVectorStore()
        self.documents_loaded = False
        
        if documents:
            self.initialize(documents)
    
    def initialize(self, documents: List[Dict]):
        """Initialize RAG with documents"""
        self.vector_store.add_documents(documents)
        self.documents_loaded = True
    
    def query(self, query_text: str) -> List[Dict]:
        """Query the RAG pipeline with hybrid search"""
        if not self.documents_loaded:
            raise ValueError("RAG pipeline not initialized. Call initialize() first.")
        
        results = self.vector_store.hybrid_search(query_text, k=3)
        return results


def split_pdf_text(text: str, chunk_size: int = 1000, chunk_overlap: int = 200) -> List[str]:
    """Split text into chunks"""
    chunks = []
    current_chunk = ""
    
    sentences = text.split('.')
    
    for sentence in sentences:
        if len(current_chunk) + len(sentence) > chunk_size:
            if current_chunk:
                chunks.append(current_chunk.strip())
            current_chunk = sentence
        else:
            current_chunk += sentence + "."
    
    if current_chunk:
        chunks.append(current_chunk.strip())
    
    return chunks


def load_constitution_pdf() -> List[Dict]:
    """Load Constitution PDF and extract Dhara (Articles 1-308) with Upadhara (subsections)"""
    # Try multiple possible paths
    possible_paths = [
        os.getenv('PDF_PATH'),
        os.path.join(os.path.dirname(__file__), 'data/constitution.pdf'),
        '/home/sam/Github/synergy/data/constitution.pdf',
        os.path.join(os.path.dirname(__file__), '../data/constitution.pdf'),
    ]
    
    pdf_path = None
    for path in possible_paths:
        if path and os.path.exists(path):
            pdf_path = path
            break
    
    if not pdf_path:
        raise FileNotFoundError("Constitution PDF not found in any expected location")
    
    try:
        from PyPDF2 import PdfReader
        import re
        
        reader = PdfReader(pdf_path)
        documents = []
        
        for page_num, page in enumerate(reader.pages, 1):
            text = page.extract_text()
            if not text.strip():
                continue
            
            # Extract Dhara (Article) number and Upadhara (Section) information
            dhara_info = extract_dhara_info(text)
            
            # Create document with proper source attribution
            source_name = dhara_info if dhara_info else f"Constitution - Page {page_num}"
            
            documents.append({
                'content': text,
                'metadata': {
                    'source': 'Constitution of Nepal',
                    'source_detail': source_name,
                    'page': page_num,
                    'dhara_info': dhara_info
                }
            })
        
        if documents:
            print(f"✓ Loaded {len(documents)} pages from Constitution PDF")
            return documents
        else:
            raise ValueError("PDF loaded but no text extracted")
            
    except Exception as e:
        raise RuntimeError(f"Error loading PDF from {pdf_path}: {e}")


def extract_dhara_info(text: str) -> str:
    """Extract Dhara (Article) and Upadhara (Subsection) info from text"""
    import re
    
    lines = text.split('\n')
    
    # Look for pattern like "307. Short title" or "307. (1) First clause"
    for line in lines[:10]:  # Check first 10 lines
        line = line.strip()
        
        # Match Dhara number (1-308)
        dhara_match = re.match(r'^(\d{1,3})\.\s*(.+)', line)
        if dhara_match:
            dhara_num = dhara_match.group(1)
            rest = dhara_match.group(2)
            
            # Check if there's an Upadhara (subsection) in parentheses
            upadhara_match = re.match(r'\((\d+)\)\s*(.+)', rest)
            
            if upadhara_match:
                upadhara_num = upadhara_match.group(1)
                description = upadhara_match.group(2)[:50]  # First 50 chars
                return f"Dhara {dhara_num}, Upadhara {upadhara_num}: {description}"
            else:
                description = rest[:50]  # First 50 chars
                return f"Dhara {dhara_num}: {description}"
    
    return None
