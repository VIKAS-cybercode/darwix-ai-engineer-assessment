# Darwix AI Engineer Assessment
## Overview

A functional prototype covering all four assessment areas:

1. Knowledge-grounded voice agent
2. Production-oriented knowledge base and retrieval
3. Multilingual voice interaction and localization
4. Live call insight detection and real-time nudges

The implementation prioritizes working end-to-end flows, grounded responses, measurable tests, failure handling, and explicit production limitations.

## Q1 — Knowledge-Grounded Voice Agent

### Use Case

Business-loan lead qualification using synthetic business-loan product and policy data.

The voice agent collects qualification information and uses the Q2 knowledge base for business-policy questions and objections.

### Qualification Rules

- Applicant age >= 21
- Business age >= 2 years
- Monthly turnover >= ₹3,00,000
- Requested amount between ₹2,00,000 and ₹25,00,000
- Business is registered
- Required documents can be provided

The result is preliminary eligibility, not final loan approval.

### Grounding

The ElevenLabs agent connects to the Q2 knowledge-base search API.

Unsupported questions are handled safely: the agent states when information is unavailable instead of guessing.

### Human Escalation

The agent recognizes explicit requests to speak with a human representative and moves the interaction toward human assistance.

### Testing

Q1 automated tests: **12/12 PASS**

Coverage includes:

- Greeting handling
- Natural name extraction
- Complete qualification
- Under-21 rejection
- Business-age rejection
- Low-turnover rejection
- Indian currency parsing
- Registration handling
- Document consent
- Financial-information objection
- Out-of-scope fallback
- Human escalation

ElevenLabs was used for the voice-agent prototype.

No paid OpenAI API was used.

## Q2 — Knowledge Base

### Source Data

The repository contains synthetic business-loan documents:

- data/loan-product.md
- data/eligibility-policy.md
- data/required-documents.md
- data/loan-faq.md
- data/objections.md
- data/qualification-rules.md

### Processing Pipeline

`	ext
Markdown documents
      ↓
Cleaning
      ↓
PII redaction
      ↓
Heading-aware chunking
      ↓
Metadata enrichment
      ↓
PostgreSQL / Neon
      ↓
Lexical retrieval
      ↓
Ranked chunks

The prototype uses Neon PostgreSQL with pgvector enabled.

The current retrieval implementation uses lexical retrieval rather than an external embedding API.

Retrieval includes:

Token normalization
Stopword removal
Exact phrase matching
Heading boosts
Category/intent routing
Domain-aware ranking
Retrieval Results

Five retrieval tests were executed:

Test    Result
Required documents    PASS
Minimum monthly turnover    PASS
Borrow amount / maximum tenure    PASS
Guarantee approval    PASS
Financial-information objection    PASS

Retrieval result: 5/5 PASS

Detailed results:

docs/Q2-RETRIEVAL-RESULTS.md

Q2 Limitation

Lexical retrieval can miss semantically equivalent wording that shares few lexical terms.

A production implementation would add embedding-based retrieval and/or hybrid lexical + semantic ranking.

## Q3 — Multilingual Voice Interaction

The prototype supports multilingual voice interaction using ElevenLabs.

### Target Markets

- Philippines — Filipino / Tagalog / Taglish
- Indonesia — Indonesian with colloquial language and English finance terminology

### Recorded Calls

Four recorded calls are included:

`	ext
recordings/q3/
├── indonesia-call-01.mp4
├── indonesia-call-02.mp4
├── philippines-call-01.mp4
└── philippines-call-02.mp4

Written transcripts are available under:

q3-multilingual/transcripts/
Indonesia

Two calls demonstrate:

Indonesian-language interaction
Natural conversational phrasing
Business-loan qualification
Currency/market clarification
Safe handling of an unsupported Indonesia-specific policy
Human escalation
Philippines

Two calls demonstrate:

Filipino/Tagalog interaction
Taglish/code-switching
Philippine peso clarification
Market mismatch handling
Human escalation

One Philippines call ended early because the ElevenLabs account reached its available credit/quota during testing. It is documented as a partial test rather than being presented as a completed scenario.

Important Limitation

The assessment's Q3 target domains are Philippines life insurance/bancassurance and Indonesia multifinance/consumer finance.

The current prototype reuses the business-loan qualification agent from Q1.

Therefore, the multilingual implementation demonstrates language localization, code-switching, safe market/currency mismatch handling, KB grounding, and escalation, but it does not claim full production compliance with the requested market-specific insurance/finance product policies.

Configuration and gaps are documented in:

q3-multilingual/configuration.md
q3-multilingual/localization-comparison.md
q3-multilingual/gaps-and-limitations.md
q3-multilingual/terminology.md
Q4 — Live Call Insights

Q4 implements a real-time transcript-stream simulation for live call insights.

Architecture
Streaming Transcript
        ↓
POST /events
        ↓
Signal Engine
        ↓
┌───────────────┐
│ Compliance    │
│ Cross-sell    │
│ Frustration   │
│ Low confidence│
└───────────────┘
        ↓
Nudge controls
        ↓
WebSocket
        ↓
Live Dashboard

Dashboard:

http://localhost:3004

WebSocket:

ws://localhost:3004/ws

Streaming endpoint:

POST http://localhost:3004/events
Detected Signals
Compliance risk
Cross-sell opportunity
Rising frustration
Low-confidence / noisy transcript
Nudge Controls

The implementation includes:

Confidence threshold: 0.70
Cooldown: 8 seconds
Maximum repetitions: 2
Grouping window: 3 seconds
Priority levels
Alert expiry: 15 seconds
Duplicate suppression
Scenario Testing

Four scenarios were tested:

Cross-sell opportunity
Compliance risk
Rising frustration
Noisy / ambiguous transcript

Automated tests:

6/6 PASS

PASS: cross-sell detection
PASS: critical compliance detection
PASS: compliance cooldown suppresses repetition
PASS: frustration detection
PASS: low-confidence noisy transcript detection
PASS: high-confidence transcript does not trigger low-confidence alert
Measured Latency

Interactive testing:

Samples: 14
P50: 18 ms
P95: 155 ms
Minimum: 4 ms
Maximum: 155 ms

Steady-state benchmark:

Samples: 100
P50: 1.85 ms
P95: 2.50 ms
Minimum: 1.44 ms
Maximum: 36.30 ms

These measurements cover the local transcript-event processing path.

They do not represent complete production audio-to-nudge latency.

A production deployment would additionally measure:

Audio capture
Streaming ASR
ASR finalization
Network transport
Signal detection
WebSocket delivery
Dashboard rendering

Detailed results:

q4-live-insights/docs/Q4-TEST-RESULTS.md

Production Considerations

The current implementation intentionally uses a transcript-stream simulation rather than a production telephony/audio ASR pipeline.

Production scaling would require:

Streaming ASR
Audio quality monitoring
Distributed event processing
Horizontal workers
Persistent event storage
WebSocket/pub-sub infrastructure
Per-call state management
Observability and tracing
Rate limiting
Authentication and authorization

False positives are explicitly considered, particularly for frustration and low-confidence signals.

Project Structure
darwix-ai-assignment/
├── data/
├── q1-voice-agent/
├── q2-knowledge-base/
├── q3-multilingual/
├── q4-live-insights/
├── docs/
├── recordings/
├── transcripts/
├── .env.example
├── .gitignore
└── README.md
Running the Prototype
Q2 Knowledge Base
cd q2-knowledge-base
npm install
npm run ingest
npm test
npm run dev

Q2 runs on:

http://localhost:3002
Q1 Voice Agent Backend
cd q1-voice-agent
npm install
npm test
npm run dev

Q1 runs on:

http://localhost:3001
Q4 Live Insights
cd q4-live-insights
npm install
npm test
npm run dev

Q4 runs on:

http://localhost:3004

Run scenarios from another terminal:

npm run simulate -- cross-sell
npm run simulate -- compliance
npm run simulate -- frustration
npm run simulate -- noisy
Evidence

The repository contains:

Q1 automated test results
Q2 retrieval test results
Q3 transcripts
Q3 call recordings
Q4 automated tests
Q4 latency measurements
Q4 scenario results
Architecture documentation
Localization documentation
Production limitations
Security

Secrets are excluded from source control.

Use .env.example as the configuration template.

Real customer information should not be committed to the repository.

Known Limitations

This submission is a functional prototype rather than a production telephony deployment.

The main limitations are:

Q1 uses a business-loan domain with synthetic data.
Q2 currently uses lexical retrieval instead of external embeddings.
Q3 demonstrates localization but reuses the Q1 business-loan domain instead of implementing the exact requested market products.
One Philippines multilingual call was partial because of ElevenLabs quota.
Q4 uses streaming transcript simulation rather than raw live audio + ASR.
Q4 latency measurements therefore exclude audio capture and ASR latency.
Production-scale infrastructure such as distributed workers, authentication, persistent event storage, and production telephony integration would still be required.

These limitations are intentionally documented rather than hidden.

Submission Walkthrough

The recommended demonstration order is:

Show the repository structure.
Demonstrate Q2 retrieval and grounding.
Show Q1 qualification and objection handling.
Show ElevenLabs voice-agent configuration.
Play Q3 multilingual recordings and show transcripts.
Open the Q4 live dashboard.
Run cross-sell, compliance, frustration, and noisy scenarios.
Show the automated tests and measured latency.
Explain production limitations and next steps.

