# Q3 — Multilingual Voice Agent

## Overview

This section evaluates multilingual voice-agent behavior for Philippines and Indonesia scenarios using ElevenLabs.

The prototype supports English, Filipino/Taglish, and Indonesian voice interactions and connects the voice agent to the Q2 knowledge base through a webhook-based retrieval flow.

## Voice Platform

**Platform:** ElevenLabs
**Agent:** My Agent
**Status:** Unpublished prototype

### Configured Languages

| Language | Voice | Usage |
|---|---|---|
| English | Eric — Smooth, Trustworthy | Default interaction |
| Filipino | James — Filipino, Warm | Philippines localization |
| Indonesian | Bian — Neutral, Calm and Clear | Indonesia localization |

## Architecture

The voice agent uses the following request flow:

Customer
↓
ElevenLabs Voice Agent
↓
search_loan_knowledge_base
↓
Cloudflare Quick Tunnel
↓
Q1 Bridge :3003
↓
Q2 Retrieval API :3002
↓
PostgreSQL Knowledge Base

The knowledge-base content is retrieved through the Q2 system instead of embedding the complete FAQ and policy content directly inside the voice prompt.

## Localization Coverage

### Philippines

The prototype was tested using Filipino and Taglish expressions including:

- "Gusto kong malaman kung kwalipikado ako para sa business loan."
- "Ang pangalan ko ay Vikas."
- "Ang negosyo ko ay nasa Pilipinas."
- "Philippine pesos, hindi Indian Rupees."
- "Gusto kong makipag-usap sa isang human representative."

The tests demonstrated Filipino/Taglish interaction and safe handling of the Philippine peso versus Indian Rupee market mismatch.

### Indonesia

The prototype was tested using both formal and colloquial Indonesian expressions including:

- "Saya ingin mengetahui apakah saya memenuhi syarat untuk pinjaman usaha."
- "Nama saya Vikas."
- "Usaha saya sudah jalan sekitar empat tahun."
- "Omzet saya sekitar sepuluh juta rupiah per bulan."
- "Saya ingin berbicara dengan perwakilan manusia."

The tests demonstrated Indonesian interaction, colloquial phrasing, currency handling, and human escalation.

## Recorded Calls

### Indonesia

Two calls were recorded:

- transcripts/indonesia-call-01.md
- transcripts/indonesia-call-02.md

Both calls demonstrated Indonesian interaction and safe escalation when the customer provided Indonesian Rupiah information for an India-focused loan product.

### Philippines

Two calls were recorded:

- transcripts/philippines-call-01.md
- transcripts/philippines-call-02.md

The first call demonstrated Filipino interaction and safe handling of Philippine Peso information.

The second call was intended to test Taglish and financial-information objection handling but ended early because the ElevenLabs account reached its available quota.

It is therefore documented as a partial test.

## Safety and Fallback Behavior

The prototype was designed to avoid silently applying unsupported eligibility rules.

For example, when Indonesian Rupiah or Philippine Peso information was provided, the agent identified the market/currency mismatch rather than treating the amount as Indian Rupees.

The agent can also:

- State when information is unavailable.
- Avoid guessing outside the knowledge base.
- Escalate to a human representative.
- Handle explicit human-support requests.

## Terminology

Market-specific terminology is documented in:

terminology.md

The terminology document includes examples for:

- Philippines Filipino/Taglish
- Indonesia Bahasa Indonesia
- Loan and eligibility terminology
- Currency terminology
- Human escalation terminology

## Configuration

Detailed ElevenLabs configuration is documented in:

configuration.md

This includes:

- Voice platform
- Agent configuration
- Language configuration
- Knowledge-base integration
- Qualification logic
- Human escalation
- Out-of-scope handling
- Prototype infrastructure

## Localization Comparison

The comparison between English, Filipino/Taglish, and Indonesian is documented in:

localization-comparison.md

It covers:

- Language switching
- Code-switching
- Formal versus colloquial Indonesian
- Market and currency handling
- Human escalation
- Localization observations

## Gaps and Limitations

Known limitations are documented in:

gaps-and-limitations.md

The main limitation is that the current knowledge base and qualification workflow are India-focused business-loan content.

The assignment specifies:

- Philippines: life insurance / bancassurance
- Indonesia: multifinance / consumer finance

Therefore, the current Q3 implementation demonstrates multilingual voice behavior and safe market-mismatch handling, but it does not claim complete implementation of the requested market-specific product domains.

Other limitations include:

- Limited native-speaker validation
- No comprehensive regional Indonesian accent testing
- Lexical rather than semantic retrieval
- Temporary Cloudflare Quick Tunnel
- No production contact-center handoff
- Limited call quota for additional ElevenLabs testing

## Q3 Deliverables

q3-multilingual/
├── README.md
├── configuration.md
├── terminology.md
├── localization-comparison.md
├── gaps-and-limitations.md
└── transcripts/
    ├── indonesia-call-01.md
    ├── indonesia-call-02.md
    ├── philippines-call-01.md
    └── philippines-call-02.md

## Conclusion

The Q3 prototype demonstrates multilingual voice interaction, Filipino/Taglish and Indonesian localization, code-switching, market/currency mismatch handling, knowledge-base integration, and human escalation.

The implementation and limitations are documented explicitly so that the demonstrated capabilities and remaining gaps are clear.
