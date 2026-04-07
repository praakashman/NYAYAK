# Nyayak Project Proposal

## Overview
This directory contains the complete Typst proposal document for the **Nyayak** project—a digital legal navigation system for Nepal.

## Files

### Main Document
- **nyayak_proposal.typ** - The Typst source file for the proposal (~20 pages)
- **nyayak_proposal.pdf** - Compiled PDF version of the proposal

### Diagrams and Assets
- **usecase.svg** - UML use-case diagram showing system actors and interactions
- **architecture.png** - Three-tier system architecture diagram (Presentation, Application, AI Backend)
- **gantt.png** - Project timeline and work breakdown structure (Feb–May 2026)
- **tu_logo.png** - Tribhuvan University logo
- **logo.png** - Nyayak project logo

## Content Structure

The proposal includes:

1. **Introduction** - Overview of Nyayak and the justice-access problem in Nepal
2. **Problem Statement** - Detailed analysis of three key challenges
3. **Objectives** - Seven core project goals
4. **Methodology** - Requirement identification, study of existing systems, and technical justification
5. **Requirement Analysis** - Functional and non-functional requirements
6. **System Analysis and Design** - Use-case diagram, architecture, and timeline
7. **Implementation Plan** - Technology stack and module breakdown
8. **Feasibility Analysis** - Technical, operational, and economic viability
9. **Work Plan and Schedule** - Five-phase development roadmap
10. **Expected Outcomes** - Deliverables
11. **Conclusion** - Project vision

## Compilation

To compile the Typst document to PDF:

```bash
typst compile nyayak_proposal.typ
```

This will generate `nyayak_proposal.pdf`.

## Key Features

- **Professional formatting** with Times New Roman font (or DejaVu Serif), 1.5 line spacing
- **Structured outline** with hierarchical heading numbering
- **Professional diagrams** including UML use-cases, architecture, and Gantt chart
- **Detailed technical content** covering RAG, recommendation algorithms, and graph-based systems
- **Table of Contents, List of Figures, List of Tables** automatically generated
- **Citation support** (references section)

## Technology Stack Highlighted

- **Frontend:** Next.js 14
- **Real-Time Backend:** Convex
- **AI Backend:** FastAPI + LangChain + ChromaDB
- **Authentication:** Clerk (JWT/HMAC)
- **LLM:** Google Gemini or Groq

## Author
Samir Paudel (79010103) & Prakashman Singh Thakuri (79012186)

**Department:** Computer Science and Information Technology  
**Institution:** Patan Multiple Campus, Tribhuvan University
