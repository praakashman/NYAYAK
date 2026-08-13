// ============================================================
//  Nyayak: Digital Legal Navigation System for Nepal
//  B.Sc. CSIT Final Year Project Proposal
//  Tribhuvan University - Patan Multiple Campus
// ============================================================

#import "@preview/cetz:0.4.0": canvas, draw
#import "@preview/fletcher:0.5.8": diagram, edge, node

// ── Page geometry ────────────────────────────────────────────
#set page(
  paper:        "a4",
  margin:       (top: 1in, bottom: 1in, left: 1.25in, right: 1in),
  numbering:    none,
  number-align: center + bottom,
)

// ── Base typography ──────────────────────────────────────────
#set text(font: "Nimbus Roman", size: 12pt, lang: "en")
#set par(justify: true, leading: 0.85em, spacing: 1.6em)

// ── Heading numbering ────────────────────────────────────────
#set heading(numbering: "1.1.1")

// ── Heading display styles ───────────────────────────────────
#show heading.where(level: 1): it => {
  set block(above: 1.5em, below: 1.0em)
  set text(size: 16pt, weight: "bold")
  it
}
#show heading.where(level: 2): it => {
  set block(above: 1.2em, below: 0.8em)
  set text(size: 14pt, weight: "bold")
  it
}
#show heading.where(level: 3): it => {
  set block(above: 1.0em, below: 0.6em)
  set text(size: 12pt, weight: "bold")
  it
}
#show heading.where(level: 4): it => {
  set block(above: 0.9em, below: 0.55em)
  set text(size: 12pt, weight: "bold")
  it
}

// ── Figures and tables: centred, bold captions ───────────────
#show figure.where(kind: table): set figure.caption(position: top)
#show figure.caption: it => {
  set text(weight: "bold", size: 12pt)
  [#it.body:]
}

// ── Equation numbering ───────────────────────────────────────
#set math.equation(numbering: "(1)")

// ── Utility colours ──────────────────────────────────────────
#let head-blue  = rgb("#D5E8F0")
#let row-green  = rgb("#E2EFDA")
#let row-gray   = rgb("#F2F2F2")


// ============================================================
//  FRONT MATTER
// ============================================================

// ── Cover page ───────────────────────────────────────────────
#align(center)[
  #v(0.4cm)
  #image("tu_logo.png", width: 2.5cm)
  #v(0.4cm)
  #text(size: 14pt, weight: "bold")[TRIBHUVAN UNIVERSITY] \
  #v(3pt)
  #text(size: 13pt, weight: "bold")[Institute of Science and Technology]
  #v(1.5cm)
  #text(size: 13pt, weight: "bold")[A Project Proposal] \
  #v(3pt)
  #text(size: 12pt)[On]
  #v(0.4cm)
  #text(size: 15pt, weight: "bold")[
    Nyayak: Digital Legal Navigation System \
    Designed for Nepal
  ]
  #v(1.5cm)
  #text(size: 12pt, weight: "bold")[Submitted to:] \
  #v(4pt)
  #text(size: 12pt)[
    Department of Computer Science and Information Technology \
    Patan Multiple Campus
  ]
  #v(1.5cm)
  #text(size: 12pt, style: "italic")[
    In partial fulfillment of the requirements for Bachelor Degree in \
    Computer Science and Information Technology
  ]
  #v(1.5cm)
  #text(size: 12pt, weight: "bold")[Submitted By:] \
  #v(5pt)
  #text(size: 12pt)[
    Samir Paudel, Roll No: [79010103] \
    Prakashman Singh Thakuri, Roll No: [79012186]
  ]
]

#pagebreak()
#set page(numbering: "i")

// ── Table of contents ────────────────────────────────────────
#outline(
  title:  text(size: 16pt, weight: "bold")[Table of Contents],
  depth:  4,
  indent: 1.5em,
)

#pagebreak()

// ── List of figures ──────────────────────────────────────────
#outline(
  title:  text(size: 16pt, weight: "bold")[List of Figures],
  target: figure.where(kind: image),
)

#pagebreak()

// ── List of tables ───────────────────────────────────────────
#outline(
  title:  text(size: 16pt, weight: "bold")[List of Tables],
  target: figure.where(kind: table),
)

#pagebreak()


// ============================================================
//  MAIN MATTER - switch to Arabic page numbering
// ============================================================
#set page(numbering: "1")
#counter(page).update(1)


// ============================================================
//  CHAPTER 1 - INTRODUCTION
// ============================================================
= Introduction

Access to legal services and information remains one of the most significant barriers faced by citizens across developing nations, and Nepal is no exception. The Nepali legal system - governed by a comprehensive Constitution ratified in 2015, supplemented by dozens of Acts and Civil Codes - is complex, multilingual, and largely inaccessible to ordinary citizens without professional legal counsel. With more than 150,000 cases pending in courts across the country @supremecourt2023, the gap between those who can navigate the justice system and those who cannot continues to widen.

*Nyayak* is a digital legal navigation platform designed to bridge this gap. The name derives from the Nepali word _Nyāyak_, meaning "legal advocate" or "one who upholds justice," reflecting the system's core mission: delivering justice-ena bling technology to every Nepali citizen. The platform operates as a three-layer solution combining an AI-powered legal assistant, a verified lawyer marketplace, and a community-driven knowledge ecosystem. By deploying modern techniques - Retrieval-Augmented Generation (RAG) grounded in the Constitution and Civil Code of Nepal, a content-based lawyer recommendation engine, and a graph-based community forum - Nyayak provides users with instant, reliable legal guidance and connects them to professional representation.

The platform is built on a modern full-stack architecture: a Next.js frontend with Convex for real-time data, Clerk for identity management, and a Python FastAPI backend powered by LangChain, ChromaDB, and large language models (Google Gemini / Groq). This combination ensures scalability, security, and responsiveness for both citizens seeking guidance and lawyers seeking clients.

The need for such a system has been well-documented in prior research @galanter1989 @lawcommission2015. Studies on legal aid access in South Asia consistently show that information asymmetry - not merely cost - is the primary deterrent to legal participation. Nyayak directly addresses this by placing authoritative, citation-backed legal information in the hands of anyone with a smartphone, while simultaneously providing the mechanism to engage a verified legal professional when needed.

#pagebreak()

// ============================================================
//  CHAPTER 2 - PROBLEM STATEMENT
// ============================================================
= Problem Statement

Nepal's justice system faces a systemic access crisis rooted in three interrelated problems.

*Information Asymmetry for Citizens.* Legal consultations in Nepal are prohibitively expensive for a significant portion of the population, and even locating a lawyer with the right specialisation is difficult without personal referrals. Citizens facing land disputes, domestic violence, contract breaches, or employment violations frequently lack even basic awareness of their legal rights under the Constitution and applicable statutes. There is no reliable, publicly accessible digital resource that provides authoritative, cited answers to legal questions in plain Nepali or Nepali-English.

*Market Inefficiency for Legal Professionals.* Practising lawyers and advocates - particularly those outside Kathmandu - have no centralised platform to showcase their credentials, publish their areas of specialisation, or connect with prospective clients whose cases match their expertise. This leads to underutilisation of legal talent in the provinces while demand remains unmet in underserved communities.

*Absence of Court Infrastructure Information.* Court locations, jurisdictions, operating hours, and case-filing procedures are poorly documented online. Citizens must navigate these institutions largely through informal channels, adding cost and delay to already overburdened proceedings.

Existing global platforms such as LegalZoom (USA) and Kanoon.co (India) address similar challenges but are entirely focused on their respective jurisdictions and corpora. No comparable platform exists for Nepal. The Nepal Bar Council's official digital presence is limited to registration and directory functions, with no advisory or matching capabilities.

Nyayak addresses all three dimensions: it democratises legal information through AI, creates a merit-based marketplace connecting citizens to lawyers, and builds the first comprehensive digital map of Nepal's court infrastructure.

#pagebreak()

// ============================================================
//  CHAPTER 3 - OBJECTIVES
// ============================================================
= Objectives

The primary objective of Nyayak is to develop a fully functional, accessible, and AI-augmented legal navigation platform tailored to the laws and legal infrastructure of Nepal. The specific objectives are as follows:

- *To develop an AI-powered Legal Assistant* using a hybrid Retrieval-Augmented Generation (RAG) pipeline that combines BM25 keyword search and semantic cosine similarity to retrieve and synthesise authoritative answers from the Constitution of Nepal and the Civil Code 2017, providing citizens with instant, citation-backed legal guidance in plain language.

- *To design and implement a Verified Lawyer Marketplace* with a content-based recommendation engine that intelligently matches citizen queries to qualified legal professionals based on specialisation, profile relevance, and availability - enabling direct booking, real-time consultation, and efficient case discovery for both citizens and lawyers.

- *To build a Community Legal Forum and Court Navigation Module* that empowers citizens to seek peer-sourced legal knowledge through a graph-ranked discussion forum, and to locate the most jurisdictionally appropriate court for any legal matter using Dijkstra's shortest-path algorithm across Nepal's 77-district court network.

- *To deliver a secure, scalable, and accessible full-stack web platform* that integrates all modules under a single authenticated interface, enforces JWT-based security and HMAC-SHA256 webhook verification, and is deployable on free-tier cloud infrastructure to ensure barrier-free adoption across Nepal.

#pagebreak()

// ============================================================
//  CHAPTER 4 - METHODOLOGY
// ============================================================
= Methodology

== Requirement Identification

=== Study of Existing Systems / Literature Review

A structured review of existing legal technology platforms, academic literature on legal AI, and information retrieval systems informs the design of Nyayak.

The primary comparative systems are presented in @tab-comparison. The analysis demonstrates that no existing platform offers the combination of a Nepal-specific legal corpus, AI-assisted guidance, and an integrated lawyer marketplace. Nyayak's novelty lies precisely in this integration.

#figure(
  kind: table,
  caption: [Comparison of Nyayak with Existing Legal Platforms],
  table(
    columns: (auto, 1fr, 1fr, 1fr, 1fr),
    align:   (left, center, center, center, center),
    fill: (col, row) => if row == 0 { head-blue } else { none },
    stroke: 0.5pt + black,
    inset:  6pt,
    table.header(
      [*Feature*],
      [*Nyayak*],
      [*Kanoon.co*],
      [*LegalZoom*],
      [*Nepal Bar\ Council*],
    ),
    [AI Legal Q&A (RAG)],          [✓], [Partial], [✗], [✗],
    [Nepal-Specific Law Corpus],   [✓], [✗],       [✗], [✗],
    [Verified Lawyer Marketplace], [✓], [✗],       [✓], [✗],
    [Expert Matching Algorithm],   [✓], [✗],   [Partial], [✗],
    [Community Forum],             [✓], [✗],       [✗], [✗],
    [Court Navigation],            [✓], [✗],       [✗], [✗],
    [Real-Time Booking / Chat],    [✓], [✗],       [✓], [✗],
  )
) <tab-comparison>

Lewis et al. (2020) introduced RAG as a method for augmenting large language model responses with retrieved document context, dramatically improving factual grounding and reducing hallucination @lewis2020. In the legal domain, Shao et al. (2023) demonstrated that hybrid retrieval combining BM25 (sparse, keyword-based) and dense vector embeddings (semantic) consistently outperforms either method alone @shao2023. Nyayak adopts this hybrid approach: BM25 contributes 70% of the retrieval score for keyword precision, while cosine similarity between sentence embeddings contributes 30% for semantic coverage.

Pazzani and Billsus (2007) established content-based filtering as the standard approach for systems where item profiles can be constructed from structured attributes @pazzani2007. For lawyer recommendation, the user's query is treated as a document and matched against lawyer bios and specialisation tags using bag-of-words representation with stop-word removal and term-frequency scoring.

PageRank, introduced by Page et al. (1999) @page1999, ranks users in Nyayak's forum by influence score derived from received replies and upvotes. Thread reconstruction employs DFS traversal over a parent-child comment graph. For court navigation, Dijkstra's single-source shortest-path algorithm @dijkstra1959 traverses a weighted graph of Nepal's court nodes to recommend the nearest applicable court for any given user location and legal matter type.

RFC 7519 (JWT) and HMAC-SHA256 are industry-standard mechanisms for stateless authentication and webhook integrity verification respectively @rfc7519. Clerk's integration abstracts these standards into a production-grade identity layer, with all cryptographic guarantees verified at the application level.

=== Requirement Analysis

==== Functional Requirements

*For Citizens.* The system shall accept natural-language legal questions in English and Nepali-English; retrieve the top-3 most relevant constitutional or statutory articles using the hybrid BM25 + cosine pipeline; generate a cited, contextualised response via an LLM; maintain conversation history per session; display a ranked list of lawyers matching the user's query with explainable scores; enable real-time booking and messaging with lawyers; and provide court navigation with location and jurisdiction details.

*For Lawyers.* The system shall allow creation and management of verified professional profiles including specialisation tags and availability status; surface relevant pending cases from the case repository matching their domain; enable real-time chat with client users; and support document uploads related to active consultations.

*For Administrators.* The system shall support lawyer profile verification, platform-wide user management, court data management, and community forum moderation to ensure content quality and platform integrity.

*For the Forum.* The system shall support threaded discussion creation; rank contributors by PageRank score computed from reply and upvote interactions; reconstruct nested threads through DFS traversal; and support real-time interaction updates via Convex's reactive data layer.

==== Non-Functional Requirements

The system shall respond to legal queries within five seconds under normal load. The platform shall be accessible via modern web browsers and mobile screens (responsive design). Authentication shall meet industry security standards (JWT, HMAC-SHA256). Database queries shall operate at $O(log n)$ complexity via indexed lookups. The system shall be deployable on free-tier cloud infrastructure (Vercel, Render, Convex) with no mandatory upfront cost. The codebase shall be modular, with clearly separated frontend, real-time database, and AI backend layers to facilitate independent testing and updates.


== Feasibility Study

=== Technical Feasibility

Nyayak is built entirely on mature, production-grade open-source and free-tier technologies. Next.js 14 (frontend), Convex (real-time backend and database), FastAPI (AI backend), LangChain (RAG orchestration), ChromaDB (vector store), and Google Gemini / Groq (LLM inference) are all actively maintained frameworks with extensive documentation and community support. The RAG pipeline leverages sentence-transformers for embedding generation, a technique with well-documented implementation patterns @lewis2020 @shao2023.

The technically most demanding component is the construction of the Nepali legal corpus within ChromaDB. This involves ingesting the Constitution of Nepal (449 articles), the Civil Code 2017, and relevant Acts in machine-readable form, chunking them appropriately, and generating vector embeddings. This process is one-time and well-supported by the LangChain ecosystem. The development environment runs on Arch Linux with all required toolchains installed, eliminating environment setup as a project risk.

=== Operational Feasibility

Nyayak's primary interface is a web application accessible from any modern browser, requiring no installation on the user's side. The system is designed for a Nepali-literate audience comfortable with online services - a growing demographic given Nepal's internet penetration rate of approximately 58% in 2023 @nta2023. The platform's real-time features (Convex) eliminate the need for page refreshes, providing a native-app-like experience. Maintenance is handled through Convex's managed infrastructure and Vercel's continuous deployment pipeline, reducing operational overhead to code-level updates only.

Moderation of the community forum is supported by the PageRank scoring system, which naturally elevates high-quality contributors. Lawyer verification is handled through a manual review step during profile creation, consistent with established legal directory practices.

=== Economic Feasibility

The project leverages exclusively free and open-source tools, with negligible cost even at modest production scale. @tab-cost presents the full cost breakdown.

#figure(
  kind: table,
  caption: [Project Cost Breakdown],
  table(
    columns: (2fr, 2.5fr, 1fr),
    align:   (left, left, center),
    fill: (col, row) => if row == 0 { head-blue }
                        else if row == 8 { head-blue }
                        else { none },
    stroke: 0.5pt + black,
    inset:  6pt,
    table.header(
      [*Item*], [*Details*], [*Cost (NPR)*],
    ),
    [Hosting (Render / Vercel)],
      [Free tier sufficient for development], [0],
    [Convex Database],
      [Free tier (unlimited reads, 1 GB storage)], [0],
    [Google Gemini / Groq API],
      [Free-tier API keys for development], [0],
    [Clerk Authentication],
      [Free tier (10,000 MAUs)], [0],
    [ChromaDB (Vector Store)],
      [Open-source, self-hosted locally], [0],
    [Development Hardware],
      [Personal computers already available], [0],
    [Domain Name (optional)],
      [Optional for production deployment], [~1,500],
    [*TOTAL*], [], [*~0–1,500*],
  )
) <tab-cost>

The total development and deployment cost for this academic project is effectively zero using available free tiers. This economic profile removes all financial barriers to project completion and demonstration.

=== Schedule

The project is planned across fourteen weeks, aligned with the seventh-semester timeline. @fig-gantt presents the full schedule with milestones.

#figure(
  kind: image,
  caption: [Project Gantt Chart - 14-Week Schedule],
  image("gantt.png", width: 100%),
) <fig-gantt>

Risk mitigation: if the court navigation graph proves difficult to populate with verified court geodata within the timeline, a simplified static representation will be substituted without impacting the other modules. The modular architecture ensures each component can be demonstrated independently.


== High Level Design of System

=== Methodology of the Proposed System

Nyayak employs an incremental, module-by-module development methodology. Each component is built, tested, and integrated independently before the next begins. This approach keeps a functional version of the application available at all times, ensures regressions are caught early, and aligns with the proposal-to-final-defence timeline of the seventh semester.

Development is organised into four phases: (1) Requirements and Architecture (Weeks 1–3), establishing the tech stack, database schema, and legal corpus; (2) Core AI and Recommendation Backend (Weeks 3–7), building the RAG pipeline and lawyer matching engine; (3) Application Module Development (Weeks 5–11), implementing the marketplace, forum, and court navigator; and (4) Testing and Documentation (Weeks 11–14), covering end-to-end testing, bug fixing, and final report preparation.

=== Use Case Diagram

@fig-usecase illustrates the primary actors and their interactions with the Nyayak system. Three main actors are identified: the *Citizen* (general public seeking legal guidance), the *Lawyer* (verified legal professional), and the *Admin* (platform administrator responsible for oversight and data management). Use cases are organised within the system boundary according to actor role and access privilege.

#figure(
  caption: [Nyayak System Use Case Diagram],
  canvas(length: 0.82cm, {
    import draw: *

    // ── Helpers ─────────────────────────────────────────────
    // Stick-figure actor: (x,y) = head centre
    let act(x, y, lbl) = {
      circle((x, y), radius: 0.30, stroke: 0.9pt, fill: white)
      line((x, y - 0.30), (x, y - 1.30), stroke: 0.9pt)
      line((x - 0.52, y - 0.75), (x + 0.52, y - 0.75), stroke: 0.9pt)
      line((x, y - 1.30), (x - 0.40, y - 2.10), stroke: 0.9pt)
      line((x, y - 1.30), (x + 0.40, y - 2.10), stroke: 0.9pt)
      content((x, y - 2.58), text(size: 8pt, weight: "bold")[#lbl])
    }

    // Rounded-rect use case node
    let uc(cx, cy, w, lbl) = {
      let h = 0.68
      rect(
        (cx - w/2, cy - h/2),
        (cx + w/2, cy + h/2),
        radius: 0.32,
        stroke: 0.75pt,
        fill: white,
      )
      content((cx, cy), text(size: 7.5pt)[#lbl])
    }

    // Connection line
    let ln(a, b) = line(a, b, stroke: 0.55pt + black)

    // ── System boundary ──────────────────────────────────────
    rect(
      (2.8, 0.9),
      (14.2, -23.2),
      stroke: (thickness: 1.6pt, paint: black),
    )
    content(
      (8.5, 1.22),
      text(size: 10.5pt, weight: "bold")[Nyayak - System Boundary],
    )

    // Section labels inside box
    content((5.6,  0.65), text(size: 7.5pt, fill: rgb("#555555"))[_Citizen Use Cases_])
    content((11.2, 0.65), text(size: 7.5pt, fill: rgb("#555555"))[_Lawyer Use Cases_])
    content((11.2,-12.90), text(size: 7.5pt, fill: rgb("#555555"))[_Admin Use Cases_])

    // Vertical divider (Citizen | Lawyer+Admin)
    line(
      (8.4, 0.9), (8.4, -23.2),
      stroke: (thickness: 0.4pt, dash: "dashed", paint: rgb("#BBBBBB")),
    )

    // Horizontal divider (Lawyer | Admin)
    line(
      (8.4, -12.6), (14.2, -12.6),
      stroke: (thickness: 0.4pt, dash: "dashed", paint: rgb("#BBBBBB")),
    )

    // ── CITIZEN actor  (head centre at (1.0, -7.8)) ──────────
    act(1.0, -7.8, "Citizen")
    let cx = 1.0
    let cy = -8.58   // body midpoint

    uc(5.6, -2.0,  3.5, "Login / Register")
    uc(5.6, -4.5,  3.9, "Ask Legal Question")
    uc(5.6, -7.0,  4.1, "Browse Lawyer Directory")
    uc(5.6, -9.5,  3.6, "Book Consultation")
    uc(5.6, -12.0, 3.9, "Post / Browse Forum")
    uc(5.6, -14.5, 3.9, "Find Nearest Court")

    ln((cx, cy), (3.85, -2.0))
    ln((cx, cy), (3.65, -4.5))
    ln((cx, cy), (3.55, -7.0))
    ln((cx, cy), (3.80, -9.5))
    ln((cx, cy), (3.65, -12.0))
    ln((cx, cy), (3.65, -14.5))

    // ── LAWYER actor  (head centre at (15.8, -5.2)) ──────────
    act(15.8, -5.2, "Lawyer")
    let lx = 15.8
    let ly = -5.98   // body midpoint

    uc(11.2, -2.0,  3.4, "Manage Profile")
    uc(11.2, -4.5,  4.1, "Browse Case Repository")
    uc(11.2, -7.0,  3.2, "Accept Case")
    uc(11.2, -9.5,  3.5, "Chat with Client")

    ln((lx, ly), (12.95, -2.0))
    ln((lx, ly), (13.25, -4.5))
    ln((lx, ly), (12.80, -7.0))
    ln((lx, ly), (12.95, -9.5))

    // Lawyer also uses Login/Register
    ln((lx, ly), (7.35, -2.0))

    // ── ADMIN actor  (head centre at (15.8, -16.2)) ──────────
    act(15.8, -16.2, "Admin")
    let ax = 15.8
    let ay = -16.98  // body midpoint

    uc(11.2, -14.0, 3.9, "Verify Lawyer Profile")
    uc(11.2, -16.5, 3.1, "Manage Users")
    uc(11.2, -19.0, 3.5, "Manage Court Data")
    uc(11.2, -21.5, 3.5, "Moderate Forum")

    ln((ax, ay), (13.15, -14.0))
    ln((ax, ay), (12.75, -16.5))
    ln((ax, ay), (12.95, -19.0))
    ln((ax, ay), (12.95, -21.5))

    // Admin also uses Login/Register
    ln((ax, ay), (7.35, -2.0))

    // ── <<includes>>: Book Consultation ──> Chat with Client ─
    line(
      (7.40, -9.5), (9.45, -9.5),
      stroke: (thickness: 0.5pt, dash: "dashed", paint: black),
      mark: (end: ">"),
    )
    content(
      (8.42, -9.22),
      text(size: 6.5pt, style: "italic")[<<includes>>],
    )
  })
) <fig-usecase>

=== System Architecture

Nyayak employs a three-tier architecture with a clear separation between the presentation layer, the real-time application layer, and the AI inference layer. @fig-arch illustrates this structure.

#figure(
  kind: image,
  caption: [Nyayak Three-Tier System Architecture],
  image("architecture.png", width: 95%),
) <fig-arch>

The *Presentation Layer* is a Next.js 14 application providing server-side rendering for performance and SEO. It encompasses the legal chat interface, the lawyer directory and booking system, the case repository view, the court navigation UI, and the community forum - all authenticated through Clerk's client-side SDK.

The *Real-Time Application Layer* is powered by Convex, a reactive backend-as-a-service platform. Convex stores all persistent data and pushes live updates to connected clients without polling. Database indexes ensure efficient, $O(log n)$ query performance.

The *AI Backend* is a Python FastAPI service deployed separately on Render. This service hosts the RAG pipeline, the lawyer recommendation scorer, the legal field text classifier, and the court graph navigator. LangChain orchestrates document retrieval from ChromaDB and prompt construction for the LLM.

=== Working Mechanism of Proposed System

@fig-flow illustrates the end-to-end legal query and recommendation flow, from user input through to the final response and lawyer suggestions.

#figure(
  image("flowchart.png", width: 100%),
  caption: [Nyayak System Workflow: Multi-Module Processing Flow],
) <fig-flow>

When a user authenticates and enters a legal question in plain Nepali or English, the entire Nyayak platform orchestrates a coordinated multi-component response:

*AI Legal Assistance Flow.* The user query is routed from the Next.js frontend to the FastAPI backend, which simultaneously initiates three parallel processes: (1) A text classifier identifies the legal domain (Property Law, Criminal Law, Family Law, etc.); (2) The RAG pipeline applies BM25 keyword scoring (70% weight) against the Nepali legal corpus, while sentence-transformer embeddings compute semantic similarity (30% weight) to retrieve the Top-3 most relevant constitutional and statutory articles; (3) An LLM (Google Gemini or Groq) synthesises these retrieved articles into a cited, plain-language response. The complete query, retrieved articles, and generated answer are persisted in Convex for conversation history and continuity across sessions.

*Lawyer Marketplace Integration.* Concurrently, the identified legal domain and extracted keywords from the user query are passed to the content-based lawyer recommendation engine. The engine scores all lawyer profiles by computing exact matches between the legal domain and lawyer specialisation tags (+20 points per match), term frequency of query keywords in lawyer biography text (+2 points per occurrence), and availability bonus (+10 points if currently available). Lawyers are ranked by combined score and returned with explainable match explanations (e.g., "Matched specialisation: Property Law + keyword relevance"). The user views the ranked lawyer list directly alongside the AI-generated legal answer and can initiate real-time booking and chat from the marketplace view.

*Community Forum Interaction.* When users browse or post in the Community Forum, the system models all interactions as a directed weighted graph: replies contribute edge weight 2, upvotes contribute edge weight 3. Influential contributors are ranked by a PageRank-style scoring algorithm and displayed as Top Contributors. When a user loads a discussion thread, DFS (Depth-First Search) traversal reconstructs the nested reply tree in chronological order, enabling hierarchical thread viewing with real-time interaction updates via Convex's reactive data layer.

*Court Navigation Module.* The user's geographic district and legal matter type are mapped to nodes in a weighted court graph spanning all 77 districts of Nepal. Dijkstra's shortest-path algorithm computes the minimum-weight path to courts authorised to handle the identified matter type, accounting for both geographic distance and jurisdictional penalties. The system returns the recommended court with name, address, exact jurisdiction, and estimated travel distance.

=== Description of Algorithms

==== Algorithm 1: AI Legal Assistance - Hybrid RAG Pipeline with Content-Based Lawyer Recommendation

This combined algorithm encompasses both the legal information retrieval mechanism and the lawyer matching engine, which operate sequentially on the same user query $Q$.

*Part A - Hybrid Retrieval-Augmented Generation (RAG).* BM25 is a probabilistic ranking function that scores document $d$ against query $Q$ based on term frequency and inverse document frequency, normalised by document length:

$ "Score"_"BM25" (d, Q) = sum_(t in Q) "idf"(t) dot
  frac(
    "tf"(t, d) dot (k_1 + 1),
    "tf"(t, d) + k_1 dot (1 - b + b dot frac(|d|, "avgdl"))
  ) $ <eq-bm25>

where $k_1 = 1.5$ and $b = 0.75$ are standard tuning parameters, $|d|$ is document length, and $"avgdl"$ is the average document length across the corpus. Cosine similarity between the query embedding vector $bold(q)$ and document embedding vector $bold(d)$ provides the semantic score:

$ "Score"_"Cosine" (d, Q) = frac(bold(q) dot bold(d), ||bold(q)|| dot ||bold(d)||) $ <eq-cosine>

The final combined retrieval score is:

$ "Score"_"Final" (d, Q) = 0.70 times "Score"_"BM25" + 0.30 times "Score"_"Cosine" $ <eq-combined>

The top-3 scoring chunks are injected into the LLM prompt as grounding context, producing a cited, plain-language legal response.

*Part B - Content-Based Lawyer Recommendation.* User query $Q$ is preprocessed through tokenisation and stop-word removal to produce a normalised term set $T(Q)$. For each lawyer profile $L$ in the registry, a relevance score is computed as:

$ "Score"(L,Q) = alpha "CM"(L) + beta "TF"(L) + gamma "AB"(L) $ <eq-recommend>

where $"CM"$ = CategoryMatch (+20 points per specialisation match), $"TF"$ = TermFrequency (+2 per term in biography), and $"AB"$ = AvailabilityBonus (+10 if available). Lawyers are returned ranked by score with explanations.

==== Algorithm 2: Graph-Based Community Forum and Court Navigation

*Part A - Forum: PageRank and DFS Thread Reconstruction.* The forum models user interactions as a directed weighted graph $G = (V, E)$, where edge weight $w(e) = 2$ for a reply and $w(e) = 3$ for an upvote. The influence score of user $u$ is:

$ "PR"(u) = frac(1 - d, N) + d sum_(v in "In"(u))
  frac(w(v, u) dot "PR"(v), "Out"(v)) $ <eq-pagerank>

where $d = 0.85$ is the standard damping factor, $N$ is the total number of users, $"In"(u)$ is the set of users who have interacted with $u$, and $"Out"(v)$ is the total outgoing interaction weight of user $v$. Users with high $"PR"(u)$ scores are surfaced as Top Contributors. Thread reconstruction employs Depth-First Search (DFS) over the comment graph $C = (P, R)$, visiting children recursively in chronological order to produce a fully nested reply tree.

*Part B - Court Navigation: Dijkstra's Shortest Path.* Nepal's court network is modelled as a weighted undirected graph $G = (C, E)$ across all 77 districts. Each edge carries:

$ w(c_i, c_j) = d_("geo") times p_("juris") $ <eq-court>

where $d_("geo")$ is the geographic distance between courts and $p_("juris") = 1$ for same-jurisdiction courts and $p_("juris") > 1$ for cross-jurisdictional referrals. Given a user's district node $s$ and legal matter type $m$, Dijkstra's algorithm finds the minimum-weight path to the set of courts authorised to handle $m$ in $O((|C| + |E|) log |C|)$ time, returning the recommended court's name, address, jurisdiction, and estimated travel distance.

==== Algorithm 3: Database Indexing and Security Architecture

All primary data access patterns in Convex are supported by explicit composite indexes, reducing lookup complexity from $O(n)$ to $O(log n)$.

Security is enforced through HMAC-SHA256 signature verification on all incoming Clerk webhooks - preventing forged event injection - and JWT bearer tokens for all authenticated API calls, following RFC 7519 standards @rfc7519.

#pagebreak()

// ============================================================
//  CHAPTER 5 - EXPECTED OUTCOME
// ============================================================
= Expected Outcome

Upon successful completion, Nyayak will deliver the following concrete outcomes.

*Fully Functional Web Application.* A deployed, publicly accessible platform featuring all five core modules: the AI Legal Assistant, the Lawyer Marketplace, the Case Repository, the Community Forum, and the Court Navigation system. The application will be responsive across desktop and mobile browsers and will handle authenticated sessions for both citizen and lawyer user roles.

*Demonstrably Accurate RAG System.* A legal query system capable of answering questions about Nepali constitutional and civil law with citations to specific articles. Accuracy will be evaluated against a set of 50 manually curated test queries drawn from the Constitution of Nepal and Civil Code 2017, with a target that at least 80% of responses cite an article substantively relevant to the query.

*Lawyer Recommendation Engine.* A functional matching engine producing ranked, explainable results for at least 20 distinct legal query categories - including property law, criminal law, family law, and labour law - with match explanations visible to the user in the Lawyer Marketplace.

*Court Navigation Coverage.* A module covering all 77 districts of Nepal, returning at minimum the district court and high court relevant to any given user location, with Dijkstra's shortest-path recommendations for cross-district matters.

*Live Community Forum.* A forum with PageRank-scored contributor rankings and fully nested DFS-reconstructed threads, demonstrating real-time interaction updates via Convex.

Beyond these technical deliverables, the project will contribute the first openly documented full-stack legal AI system designed specifically for Nepal's legal corpus and institutional infrastructure. The codebase will be maintained on GitHub with documentation sufficient for future extension by students or developers. The work will serve as a practical reference for applying RAG, graph algorithms, and content-based filtering in a domain-specific, resource-constrained South Asian context.

The longer-term vision for Nyayak includes multilingual support for Nepali-script queries, integration with the Nepal Bar Council's official registry for lawyer verification, and a mobile application extending reach to rural communities with limited desktop access.

#pagebreak()

// ============================================================
//  REFERENCES
// ============================================================
= References
#set heading(numbering: none)

#bibliography(
  "refs.bib",
  style: "ieee",
  title: none,
)
