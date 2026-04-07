# Nyayak
Digital legal navigation system designed for Nepal.




# algorithms used:
1. content-based recommendation using bag-of-words text normalization, stop-word removal, exact category matching (weighted scoring), and term-frequency-based ranking with explainable outputs.
example: input “land dispute issue” → bag-of-words → [land, dispute] → category match “property law” (+20 score) + term frequency in bio (e.g., “land” appears 3 times → +6 score) → final ranked lawyer with explanation “matched specialization + keyword relevance.”

3. graph-based forum system using pagerank-style scoring for influential users and dfs traversal for hierarchical thread reconstruction with realtime interactions.

example: user gets replies (+2 edges) and upvotes (+3 edges) → higher pagerank score → shown as top creator; fetching comments → build parent-child graph → dfs traversal → returns ordered nested replies in chronological flow.

4. courts (map insert garera graph based representation haldine) i don't know what algorithm to used 

1. RAG Pipeline (BM25 + Cosine Similarity)
Current Location: backend/rag_pipeline.py lines 32-57
User asks (Can my land dispute be solved?)
BM25 searches for keyword matches in Constitution (70% relevance)
Semantic embeddings find contextually similar articles (30% relevance)
Combined score ranks the top 3 most relevant constitutional articles
Response sent via src/app/api/ask-legal/route.ts → ChatInterface displays it

2. Lawyer Ranking Algorithm
Current Location: convex/lawyers.ts lines 42-46
When user views /lawyers page
System ranks lawyers by: (1) Availability status, (2) Rating score
LawyerDirectory.tsx displays sorted list
Issue: No matching between user query + lawyer expertise (this is your gap!)

3. Text Classification (Legal Field Detection)
Current Location: backend/main.py lines 201-208
User query arrives → system identifies if it's "Family Law", "Criminal Law", etc.
Keyword matching: "विवाह" → Family Law, "मृत्यु" → Criminal Law
Used to tag the query but NOT used to recommend lawyers


4. Database Indexing
Current Location: convex/schema.ts lines 13-40
by_clerkId index: Fast user lookup when they sign in
by_userId index: Quick retrieval of lawyer's current cases
by_lawyer_status index: Filter available lawyers quickly
These indexes make queries O(log n) instead of O(n)


5. HMAC-SHA256 & JWT
Current Location: convex/http.ts, convex/auth.config.js
Clerk webhook arrives → HMAC signature verified
New user signs up → JWT token generated
Protects against fake webhook attacks




Problem & Users
Primary Users (Citizens): Individuals facing legal uncertainties who find the justice system complex, expensive, or inaccessible.
Secondary Users (Legal Professionals): Practicing lawyers, law firms, and independent advocates looking to expand their clientele and streamline their case discovery process.
Pain Points:
For Citizens (Access Gap): Legal consultations are often prohibitively expensive and finding a trustworthy specialist is difficult due to information opacity.
For Lawyers (Market Inefficiency): There is no centralized digital platform for lawyers to showcase expertise or find cases that match their specialization, leading to underutilization of talent.
Systemic Issues: With 150,000+ pending cases in Nepal, the lack of digital tools contributes to massive delays and administrative bottlenecks.
Success Metric: Empowering citizens with instant legal clarity and representation while providing lawyers with a consistent stream of relevant cases.
Solution

Nyayak provides a comprehensive three-layer solution:
AI Legal Assistant: Uses RAG (Retrieval-Augmented Generation) to give accurate, cited answers from the Nepali Constitution and legal documents with history saved
Lawyer Marketplace: A verified directory where users can book consultations and chat with lawyers, enabling direct professional assistance. 
Cases Repository: A centralized database allowing lawyers to efficiently find and accept cases that match their specific domain expertise. 
"Flow": A user asks a complex question about property law in "Nepali English" and gets an instant, simplified citation from the Civil Code, followed by a recommendation for a top property lawyer nearby.

System Design / Architecture Overview
Flow:
User interacts with the Next.js Frontend.
Auth is handled by Clerk (integrated with Convex).
Real-time Data (Messages, Lawyer Profiles) flows via Convex Database.
Complex Legal Queries are sent to the Python FastAPI Backend (hosted on Render/Local).
AI Backend uses LangChain to retrieve docs from ChromaDB and generates answers via Google Gemini / Groq.
System Design in Arch linux

Key Features
AI Legal Advisor: Instant answers using RAG on Nepali laws.
Lawyer Marketplace: Verified directory with booking capabilities.
Case Management: Specialized tools for lawyers to track consultations and documents.
Court Information: Navigation and detailed info for courts across Nepal.
Community Forum: A space for public legal discussions. (Coming soon)
Why It's Better
Constitution-Centric RAG: Utilizes Retrieval-Augmented Generation strictly anchored to the Constitution of Nepal, ensuring answers are grounded in actual legal text rather than generic hallucinations.
Integrated Workflow: Seamlessly bridges the gap between information (AI legal guidance) and action (hiring Human Lawyers) in a single platform, supported by cloud-scale infrastructure.
Modern Stack: Built on Convex for real-time reactivity and Next.js for high performance.