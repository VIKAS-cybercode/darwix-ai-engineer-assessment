# Q3 — Voice Agent Configuration

## Voice Platform

**Platform:** ElevenLabs  
**Agent:** My Agent  
**Status:** Unpublished prototype  
**Primary language:** English  
**Additional languages:** Filipino and Indonesian

The agent is connected to the Q2 knowledge base through a webhook tool instead of embedding the complete FAQ and policy content directly into the voice prompt.

## Language Configuration

| Language | Configuration | Voice |
|---|---|---|
| English | Default language | Eric — Smooth, Trustworthy |
| Filipino | Additional language | James — Filipino, Warm |
| Indonesian | Additional language | Bian — Neutral, Calm and Clear |

## Knowledge Base Integration

The voice agent uses the ElevenLabs tool:

`search_loan_knowledge_base`

The tool sends the customer's question to the Q1 bridge, which forwards the request to the Q2 retrieval API.

### Request Flow

Customer
  |
  v
ElevenLabs Voice Agent
  |
  | search_loan_knowledge_base
  v
Cloudflare Quick Tunnel
  |
  v
Q1 Bridge :3003
  |
  v
Q2 Retrieval API :3002
  |
  v
PostgreSQL Knowledge Base

## Voice Agent Behavior

The agent is configured to:

1. Start by explaining that it is checking preliminary eligibility.
2. Ask qualification questions conversationally.
3. Use the knowledge-base tool for loan information, requirements, objections, and policies.
4. Avoid inventing unsupported information.
5. State when information is unavailable.
6. Escalate to a human representative when requested.
7. Safely stop or escalate when the customer's market, currency, or product does not match the configured India-focused business-loan rules.
8. Support English, Filipino/Taglish, and Indonesian interactions.

## Qualification Logic

The current prototype uses the following business-loan qualification rules:

| Field | Rule |
|---|---|
| Applicant age | Must be at least 21 years |
| Business age | Must be at least 2 years |
| Monthly turnover | Must be at least ₹3,00,000 |
| Requested amount | ₹2,00,000 to ₹25,00,000 |
| Business registration | Must be registered |
| Required documents | Customer must be willing to provide required documents |

Passing these checks means preliminary eligibility only and does not represent final loan approval.

## Human Escalation

The agent supports explicit requests such as:

- I want to speak to a human.
- Can I talk to a representative?
- I need help from someone.

When a human is requested, the agent stops attempting to answer the request itself and initiates the configured escalation flow.

## Out-of-Scope Handling

For questions outside the available knowledge base, the agent is instructed not to guess.

Example:

Customer: What is the weather today?

Agent: I don't have information about that in my available knowledge base. I can help with questions related to the business-loan qualification process, or I can connect you with a human representative.

## Testing Summary

The voice prototype was tested using:

- Cooperative qualification conversation
- Objection handling
- Incomplete information
- Conflicting information
- Out-of-scope questions
- Human escalation
- Filipino/Taglish interaction
- Indonesian interaction
- Currency and market mismatch handling

The prototype successfully demonstrated safe handling of India-specific eligibility rules when customers provided Philippine peso or Indonesian rupiah information.

## Q3 Product-Domain Limitation

The assignment specifies:

- Philippines: life insurance / bancassurance
- Indonesia: multifinance / consumer finance

The current voice prototype is configured for India-focused business-loan qualification.

Therefore, the Filipino and Indonesian calls demonstrate language localization, code-switching, market/currency mismatch handling, and escalation behavior, but they do not represent a complete production implementation of the requested Philippines life-insurance or Indonesia multifinance domains.

This limitation is documented explicitly rather than presenting the prototype as fully compliant with the requested product domains.

## Prototype Infrastructure

The current local architecture is:

ElevenLabs Voice Agent
        |
        v
Cloudflare Quick Tunnel
        |
        v
Q1 Bridge (:3003)
        |
        v
Q2 Retrieval API (:3002)
        |
        v
Neon PostgreSQL + pgvector

The Cloudflare Quick Tunnel is used only for prototype connectivity between ElevenLabs and the local development services. It is not considered a production deployment mechanism.

## Current Status

- ElevenLabs agent configured
- English voice configured
- Filipino voice configured
- Indonesian voice configured
- Q1 qualification logic connected
- Q2 knowledge-base retrieval connected
- Webhook tool configured
- Human escalation behavior tested
- Out-of-scope fallback tested
- Filipino and Indonesian test calls recorded
- Product-domain limitations documented
