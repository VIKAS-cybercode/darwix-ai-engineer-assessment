# Darwix AI Engineer Assessment

A functional AI engineering prototype covering all four areas of the Darwix AI Engineer Assessment:

1. **Knowledge-Grounded Voice Agent**
2. **Production-Oriented Knowledge Base & Retrieval**
3. **Multilingual Voice Interaction & Localization**
4. **Live Call Insights & Real-Time Nudges**

The implementation focuses on working end-to-end flows, grounded responses, measurable testing, failure handling, explainability, and explicit production limitations.

---

## Table of Contents

- [Overview](#overview)
- [Demo Video](#-demo-video)
- [Architecture](#architecture)
- [Q1 — Knowledge-Grounded Voice Agent](#q1--knowledge-grounded-voice-agent)
- [Q2 — Production-Oriented Knowledge Base](#q2--production-oriented-knowledge-base)
- [Q3 — Multilingual Voice Interaction](#q3--multilingual-voice-interaction)
- [Q4 — Live Call Insights](#q4--live-call-insights)
- [Project Structure](#project-structure)
- [Running the Prototype](#running-the-prototype)
- [Testing Summary](#testing-summary)
- [Evidence & Artifacts](#evidence--artifacts)
- [Security](#security)
- [Known Limitations](#known-limitations)
- [Production Next Steps](#production-next-steps)
- [Submission Walkthrough](#submission-walkthrough)

---

# Overview

The project demonstrates an end-to-end AI workflow for business-loan lead qualification and live call intelligence.

The system combines:

- A voice-based qualification agent
- A knowledge-grounded retrieval layer
- Synthetic business and policy documents
- Multilingual voice interaction
- Human escalation handling
- Real-time transcript signal detection
- Live nudge delivery through WebSocket
- Automated tests
- Latency measurement
- Production-oriented failure and limitation analysis

The prototype intentionally avoids hiding unsupported behavior. When the available knowledge does not support an answer, the system is designed to avoid guessing and instead provide a safe fallback or escalate to a human.

---
## 🎥 Demo Video

[▶️ Watch the Full Project Walkthrough](https://drive.google.com/file/d/1gxSqQkCcxX8cX-8vFs9FZxY8XHtL6dGW/view?usp=sharing)

The walkthrough covers the project architecture, Q1 voice agent, Q2 knowledge base and retrieval, Q3 multilingual testing, Q4 real-time call insights, live demonstrations, limitations, and production improvements.

---
# Architecture

```text
                         ┌─────────────────────────┐
                         │     Synthetic Data      │
                         │                         │
                         │ Loan Product             │
                         │ Eligibility Policy      │
                         │ FAQs                    │
                         │ Objections              │
                         │ Required Documents      │
                         │ Qualification Rules     │
                         └────────────┬────────────┘
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │     Q2 Knowledge Base   │
                         │                         │
                         │ Cleaning                │
                         │ PII Redaction           │
                         │ Chunking                │
                         │ Metadata                │
                         │ PostgreSQL / Neon       │
                         │ Lexical Retrieval       │
                         └────────────┬────────────┘
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │     Q1 Voice Agent      │
                         │                         │
                         │ ElevenLabs              │
                         │ Qualification Logic     │
                         │ KB Grounding            │
                         │ Objection Handling      │
                         │ Human Escalation        │
                         └────────────┬────────────┘
                                      │
                         ┌────────────┴────────────┐
                         │                         │
                         ▼                         ▼
              ┌────────────────────┐    ┌────────────────────┐
              │ Q3 Multilingual    │    │ Q4 Live Insights   │
              │                    │    │                    │
              │ Filipino/Taglish   │    │ Transcript Stream   │
              │ Indonesian         │    │ Signal Detection    │
              │ Localized Voice    │    │ Nudge Engine        │
              └────────────────────┘    │ WebSocket           │
                                        │ Live Dashboard      │
                                        └────────────────────┘
```

# Q1 — Knowledge-Grounded Voice Agent

## Use Case

The prototype implements a **business-loan lead qualification voice agent** using synthetic business-loan product and policy data.

The agent collects qualification information and uses the Q2 knowledge base for policy questions, FAQs, and objections.

The voice interface is implemented using **ElevenLabs**.

## Qualification Rules

The current qualification workflow checks:

| Requirement | Rule |
|---|---|
| Applicant age | >= 21 years |
| Business age | >= 2 years |
| Monthly turnover | >= ₹3,00,000 |
| Requested amount | ₹2,00,000 – ₹25,00,000 |
| Business registration | Required |
| Required documents | Applicant must be willing to provide them |

The result is **preliminary eligibility**, not final loan approval.

## Grounding

The ElevenLabs voice agent connects to the Q2 knowledge-base search API.

The knowledge base is used for business-policy questions and objection handling rather than hardcoding every answer directly into the voice prompt.

For unsupported questions, the agent is instructed to:

- State that the required information is unavailable
- Avoid inventing an answer
- Offer a safe fallback
- Escalate to a human when appropriate

## Human Escalation

The agent recognizes explicit requests such as wanting to speak with a human representative.

The conversation is then moved toward human assistance instead of continuing to force an automated qualification flow.

## Q1 Automated Testing

**12/12 tests passed**

| Test | Result |
|---|---|
| Greeting handling | PASS |
| Natural name extraction | PASS |
| Complete qualification | PASS |
| Under-21 rejection | PASS |
| Business-age rejection | PASS |
| Low-turnover rejection | PASS |
| Indian currency parsing | PASS |
| Registration handling | PASS |
| Document consent | PASS |
| Financial-information objection | PASS |
| Out-of-scope fallback | PASS |
| Human escalation | PASS |

Detailed results:

```text
docs/Q1-TEST-RESULTS.md
```

## Voice Platform

The prototype uses **ElevenLabs** for:

- Voice interaction
- Multilingual voice configuration
- Agent prompt configuration
- Knowledge-base tool integration
- Recorded call testing

No paid OpenAI API was used for this implementation.

---

# Q2 — Production-Oriented Knowledge Base

## Source Data

The repository contains synthetic business-loan documents:

```text
data/
├── loan-product.md
├── eligibility-policy.md
├── required-documents.md
├── loan-faq.md
├── objections.md
├── qualification-rules.md
└── source-register.md
```

## Processing Pipeline

```text
Markdown Documents
        │
        ▼
Content Cleaning
        │
        ▼
PII Redaction
        │
        ▼
Heading-Aware Chunking
        │
        ▼
Metadata Enrichment
        │
        ▼
PostgreSQL / Neon
        │
        ▼
Lexical Retrieval
        │
        ▼
Ranked Results
        │
        ▼
Q1 Voice Agent
```

## Data Processing

The ingestion pipeline performs:

- Markdown cleanup
- Simple PII redaction
- Heading-aware chunking
- Metadata enrichment
- Document/source tracking
- Version information
- Category information
- Retrieval-method metadata

The prototype uses Neon PostgreSQL with pgvector enabled.

## Retrieval Strategy

The current implementation intentionally uses lexical retrieval rather than an external embedding API.

Retrieval includes:

- Token normalization
- Stopword removal
- Exact phrase matching
- Heading boosts
- Category/intent routing
- Domain-aware ranking

This provides a simple, explainable retrieval baseline without requiring a paid external embedding service.

## Retrieval Testing

Five retrieval scenarios were executed:

| Test | Result |
|---|---|
| Required documents | PASS |
| Minimum monthly turnover | PASS |
| Borrow amount / maximum tenure | PASS |
| Guarantee approval | PASS |
| Financial-information objection | PASS |

**Result: 5/5 retrieval tests passed**

Detailed results:

```text
docs/Q2-RETRIEVAL-RESULTS.md
```

Test cases:

```text
docs/Q2-RETRIEVAL-TEST-CASES.md
```

## Q2 Limitation

Lexical retrieval can miss semantically equivalent wording when the query shares few lexical terms with the source document.

A production implementation could add:

- Embedding-based retrieval
- Hybrid lexical + semantic retrieval
- Cross-encoder reranking
- Retrieval evaluation datasets
- Query expansion
- More advanced metadata filtering

The limitation is intentionally documented rather than hidden.

---

# Q3 — Multilingual Voice Interaction

The prototype demonstrates multilingual voice interaction using ElevenLabs.

## Target Languages

### Philippines

- Filipino / Tagalog
- Taglish
- Natural conversational phrasing

### Indonesia

- Indonesian
- Colloquial conversational language
- English finance terminology where naturally used

## Recorded Calls

Four recorded calls are included:

```text
recordings/q3/
├── q3-philippines-call-01.mp4
├── q3-philippines-call-02.mp4
├── q3_indonesia_call_1.mp4
└── q3_indonesia_call_2.mp4
```

Written transcripts are available under:

```text
q3-multilingual/transcripts/
├── indonesia-call-01.md
├── indonesia-call-02.md
├── philippines-call-01.md
└── philippines-call-02.md
```

## Indonesia

The two Indonesia calls demonstrate:

- Indonesian-language interaction
- Natural conversational phrasing
- Business-loan qualification
- Currency clarification
- Market clarification
- Safe handling of unsupported Indonesia-specific policy
- Human escalation

The agent identifies when the provided Indonesian Rupiah information does not fit the India-specific qualification rules and avoids silently applying the India-specific threshold.

## Philippines

The two Philippines calls demonstrate:

- Filipino/Tagalog interaction
- Taglish/code-switching
- Philippine Peso clarification
- Market mismatch handling
- Human escalation

One Philippines call ended early because the ElevenLabs account reached its available quota during testing.

It is documented as a **partial test** rather than being presented as a completed scenario.

## Important Q3 Limitation

The assessment's requested Q3 product domains are:

- **Philippines:** Life insurance / bancassurance
- **Indonesia:** Multifinance / consumer finance

The current prototype reuses the business-loan qualification agent from Q1.

Therefore, the Q3 implementation demonstrates:

- Language localization
- Code-switching
- Voice interaction
- Market/currency mismatch handling
- Knowledge-base grounding
- Human escalation

However, it does not claim full production compliance with the requested market-specific insurance and finance product policies.

This limitation is explicitly documented in:

```text
q3-multilingual/configuration.md
q3-multilingual/localization-comparison.md
q3-multilingual/gaps-and-limitations.md
q3-multilingual/terminology.md
```

---

# Q4 — Live Call Insights

Q4 implements a real-time transcript-stream simulation for live call insights.

The system detects conversational signals and produces real-time nudges for an operator/dashboard.

## Architecture

```text
Streaming Transcript
        │
        ▼
POST /events
        │
        ▼
Signal Detection Engine
        │
        ├───────────────┐
        │               │
        ▼               ▼
 Compliance          Cross-sell
 Risk                Opportunity
        │               │
        ├───────────────┤
        │               │
        ▼               ▼
 Frustration         Low Confidence
 Detection           / Noise
        │
        ▼
Nudge Controls
        │
        ▼
WebSocket
        │
        ▼
Live Dashboard
```

## Detected Signals

The engine detects:

- Compliance risk
- Cross-sell opportunity
- Rising frustration
- Low-confidence / noisy transcript

## Nudge Controls

The implementation includes:

| Control | Configuration |
|---|---:|
| Minimum confidence | 0.70 |
| Cooldown | 8 seconds |
| Maximum repetitions | 2 |
| Grouping window | 3 seconds |
| Alert expiry | 15 seconds |
| Priority levels | Critical / High / Medium |

These controls are designed to reduce repeated or noisy alerts.

## Dashboard

The local dashboard runs at:

```text
http://localhost:3004
```

WebSocket endpoint:

```text
ws://localhost:3004/ws
```

Streaming event endpoint:

```text
POST http://localhost:3004/events
```

Health endpoint:

```text
GET http://localhost:3004/health
```

Metrics endpoint:

```text
GET http://localhost:3004/metrics
```

## Scenario Testing

Four main scenarios were tested:

1. Cross-sell opportunity
2. Compliance risk
3. Rising frustration
4. Noisy / ambiguous transcript

## Q4 Automated Testing

**6/6 tests passed**

| Test | Result |
|---|---|
| Cross-sell detection | PASS |
| Critical compliance detection | PASS |
| Compliance cooldown suppression | PASS |
| Frustration detection | PASS |
| Low-confidence noisy transcript detection | PASS |
| High-confidence transcript avoids low-confidence alert | PASS |

Detailed results:

```text
q4-live-insights/docs/Q4-TEST-RESULTS.md
```

# Latency Measurements

## Interactive Testing

| Metric | Result |
|---|---:|
| Samples | 14 |
| P50 | 18 ms |
| P95 | 155 ms |
| Minimum | 4 ms |
| Maximum | 155 ms |

## Steady-State Benchmark

| Metric | Result |
|---|---:|
| Samples | 100 |
| P50 | 1.85 ms |
| P95 | 2.50 ms |
| Minimum | 1.44 ms |
| Maximum | 36.30 ms |

## Measurement Scope

These measurements cover the local transcript-event processing path.

They do **not** represent complete production audio-to-nudge latency.

A production measurement would include:

```text
Audio Capture
     ↓
Streaming ASR
     ↓
ASR Finalization
     ↓
Network Transport
     ↓
Signal Detection
     ↓
WebSocket Delivery
     ↓
Dashboard Rendering
```

This distinction is intentionally documented to avoid presenting local processing latency as complete production latency.

# Production Considerations

The current implementation uses a transcript-stream simulation instead of a production telephony/audio ASR pipeline.

A production deployment would additionally require:

- Streaming ASR
- Audio quality monitoring
- Distributed event processing
- Horizontal workers
- Persistent event storage
- WebSocket/pub-sub infrastructure
- Per-call state management
- Observability and tracing
- Rate limiting
- Authentication and authorization
- Production telephony integration

False-positive behavior is also considered, particularly for:

- Frustration detection
- Low-confidence/noisy transcripts
- Short ambiguous phrases
- Repeated conversational patterns

---

# Project Structure

```text
darwix-ai-assignment/
├── data/
├── docs/
├── q1-voice-agent/
├── q2-knowledge-base/
├── q3-multilingual/
├── q4-live-insights/
├── recordings/
├── transcripts/
├── .env.example
├── .gitignore
└── README.md
```

# Running the Prototype

## Q2 — Knowledge Base

```bash
cd q2-knowledge-base
npm install
npm run ingest
npm test
npm run dev
```

Q2 runs on:

```text
http://localhost:3002
```

## Q1 — Voice Agent Backend

```bash
cd q1-voice-agent
npm install
npm test
npm run dev
```

Q1 runs on:

```text
http://localhost:3001
```

## Q4 — Live Insights

```bash
cd q4-live-insights
npm install
npm test
npm run dev
```

Q4 runs on:

```text
http://localhost:3004
```

Run simulation scenarios from another terminal:

```bash
npm run simulate -- cross-sell
npm run simulate -- compliance
npm run simulate -- frustration
npm run simulate -- noisy
```

# Testing Summary

| Area | Result |
|---|---|
| Q1 automated tests | **12/12 PASS** |
| Q2 retrieval tests | **5/5 PASS** |
| Q3 recorded calls | **4 calls** |
| Q4 automated tests | **6/6 PASS** |
| Q4 interactive latency samples | **14** |
| Q4 steady-state benchmark samples | **100** |

The detailed test evidence is included in the repository.

# Evidence & Artifacts

## Q1

```text
docs/Q1-TEST-RESULTS.md
```

Includes automated qualification and fallback tests.

## Q2

```text
docs/Q2-RETRIEVAL-RESULTS.md
docs/Q2-RETRIEVAL-TEST-CASES.md
```

Includes retrieval queries, retrieved results, scoring behavior, and test outcomes.

## Q3

```text
q3-multilingual/transcripts/
recordings/q3/
q3-multilingual/configuration.md
q3-multilingual/localization-comparison.md
q3-multilingual/gaps-and-limitations.md
q3-multilingual/terminology.md
```

## Q4

```text
q4-live-insights/docs/Q4-TEST-RESULTS.md
```

Includes scenario results, latency measurements, controls, and production limitations.

# Security

Secrets are excluded from source control.

The repository uses:

```text
.env
```

in `.gitignore`.

A configuration template is provided as:

```text
.env.example
```

No production credentials or real customer information should be committed to the repository.

The assessment data used by the prototype is synthetic.

# Known Limitations

This submission is a functional prototype rather than a production telephony deployment.

The main limitations are:

1. **Q1 Domain**
   - Uses a synthetic business-loan qualification domain.

2. **Q2 Retrieval**
   - Currently uses lexical retrieval rather than an external embedding API.

3. **Q3 Product Domain**
   - Demonstrates multilingual localization but reuses the Q1 business-loan domain instead of implementing the exact requested Philippines insurance and Indonesia consumer-finance products.

4. **Q3 Testing**
   - One Philippines multilingual call was partial because the ElevenLabs account reached its available quota during testing.

5. **Q4 Audio Pipeline**
   - Uses streaming transcript simulation rather than raw live audio plus production ASR.

6. **Q4 Latency**
   - Reported latency excludes audio capture and ASR processing.

7. **Production Infrastructure**
   - Distributed workers, authentication, persistent event storage, production telephony, and other production infrastructure would still be required.

These limitations are intentionally documented rather than hidden.

# Production Next Steps

A production version could extend the prototype with:

## Knowledge Base

- Hybrid lexical + vector retrieval
- Embedding generation
- Cross-encoder reranking
- Automated retrieval evaluation
- Document versioning
- Incremental indexing
- Better PII detection

## Voice Agent

- Production telephony integration
- Streaming ASR
- Structured call state
- CRM/lead creation
- Human transfer integration
- Call outcome persistence
- Automated quality evaluation

## Multilingual

- Market-specific product policies
- Native localized terminology
- Market-specific compliance rules
- Native TTS voices
- Accent and pronunciation evaluation
- Separate knowledge bases per market

## Live Insights

- Streaming audio ingestion
- Production ASR
- Distributed event processing
- Pub/sub infrastructure
- Persistent call state
- Alert analytics
- Precision/recall monitoring
- Operator feedback loops

# Submission Walkthrough

Recommended demonstration order:

### 1. Repository

Show:

```text
README.md
data/
docs/
q1-voice-agent/
q2-knowledge-base/
q3-multilingual/
q4-live-insights/
recordings/
```

### 2. Q2 Knowledge Base

Demonstrate:

- Source documents
- Ingestion
- Retrieval
- Five retrieval tests
- Grounded result returned to Q1

### 3. Q1 Voice Agent

Demonstrate:

- Qualification flow
- Objection handling
- Knowledge-base grounding
- Unsupported-question fallback
- Human escalation
- Automated test results

### 4. ElevenLabs

Show:

- Agent configuration
- Knowledge-base tool
- Qualification prompt
- Language configuration

### 5. Q3 Multilingual

Play:

- Indonesia calls
- Philippines calls

Show corresponding transcripts and explain the documented product-domain limitation.

### 6. Q4 Live Insights

Open:

```text
http://localhost:3004
```

Run:

```bash
npm run simulate -- cross-sell
npm run simulate -- compliance
npm run simulate -- frustration
npm run simulate -- noisy
```

Show the resulting live nudges.

### 7. Testing & Measurements

Show:

- Q1: 12/12
- Q2: 5/5
- Q4: 6/6
- Q4 latency measurements

### 8. Production Discussion

Explain:

- Retrieval limitations
- Multilingual product-domain limitation
- ASR/audio pipeline limitation
- False-positive handling
- Scaling requirements
- Security considerations

# Final Result

The project demonstrates a working end-to-end prototype across all four assessment areas, with:

- Knowledge-grounded voice interaction
- Explainable retrieval
- Qualification logic
- Objection handling
- Human escalation
- Multilingual voice testing
- Real-time signal detection
- Nudge controls
- Automated tests
- Latency measurements
- Production considerations
- Explicit limitations

The implementation prioritizes functional behavior, measurable results, grounded responses, and transparent limitations over purely conceptual design.
