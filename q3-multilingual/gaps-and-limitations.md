# Q3 — Gaps and Limitations

## 1. Product-Domain Mismatch

The assignment specifies different financial use cases for the two target markets:

- Philippines: life insurance / bancassurance
- Indonesia: multifinance / consumer finance

The current prototype is configured for India-focused business-loan qualification.

Therefore, the multilingual implementation demonstrates language localization and safe handling of market/product mismatches, but it is not a complete implementation of the requested Philippines life-insurance or Indonesia multifinance use cases.

This limitation is intentionally documented rather than presenting the prototype as fully compliant with the requested domains.

## 2. India-Specific Eligibility Rules

The current knowledge base contains India-focused business-loan rules, including:

- Indian Rupee currency
- Minimum monthly turnover of ₹3,00,000
- Indian business-loan qualification criteria

During the Philippines and Indonesia tests, customers provided Philippine pesos and Indonesian rupiah.

The agent correctly avoided applying the Indian turnover threshold to those currencies and instead explained the market mismatch and offered human assistance.

A production implementation would require separate market-specific knowledge bases and eligibility policies.

## 3. Multilingual Product Knowledge Gap

The voice agent can interact in English, Filipino/Taglish, and Indonesian.

However, the underlying knowledge base remains focused on the India business-loan product.

Therefore, language localization is demonstrated, but the product knowledge is not yet localized for the Philippines life-insurance and Indonesia consumer-finance domains required by the assignment.

## 4. Voice and Accent Validation

The prototype uses configured voices for English, Filipino, and Indonesian.

However, comprehensive native-speaker validation was not performed.

In particular:

- Filipino pronunciation was not evaluated by a native-speaking evaluator.
- Indonesian validation primarily represents standard Indonesian rather than regional accents.
- Regional Indonesian accents outside standard Jakarta pronunciation were not comprehensively tested.

Further native-speaker evaluation would be required before production deployment.

## 5. Philippines Call Testing Limitation

The second Philippines test call was intended to test Taglish interaction and a financial-information objection.

However, the ElevenLabs account reached its available quota during the call.

The call therefore stopped before the planned objection-handling scenario could be completed.

It is documented as a partial test rather than being presented as a successful completed test case.

## 6. Observed Grounding Limitations

During prototype testing, some preview responses introduced unsupported product-specific wording.

For example, the agent occasionally introduced a product name or product details that were not present in the intended knowledge-base evidence.

These observations demonstrate why production grounding controls are necessary.

The intended production behavior is:

1. Retrieve relevant knowledge.
2. Use only retrieved evidence for policy/product claims.
3. Clearly state when information is unavailable.
4. Escalate when the request cannot be safely answered.

## 7. Retrieval Limitation

The Q2 prototype currently uses lexical retrieval rather than external embedding generation.

This was intentionally implemented to keep the prototype functional without requiring a paid external embedding API.

The retrieval system uses:

- Keyword matching
- Stopword removal
- Heading boosts
- Exact phrase matching
- Category and intent routing
- Relevance scoring

This approach is suitable for the current controlled knowledge base but may be less robust than semantic vector retrieval for larger and more diverse document collections.

## 8. Temporary Public Connectivity

The ElevenLabs agent connects to the local prototype through a Cloudflare Quick Tunnel.

This provides temporary public connectivity for testing.

It is not a production deployment architecture.

A production system would require a persistent authenticated endpoint with appropriate security controls, observability, rate limiting, and access management.

## 9. Human Handoff Limitation

The prototype demonstrates human-escalation intent and the agent can respond to explicit requests for a human representative.

However, a complete production implementation would require integration with an actual contact-center or agent-handoff system.

The current prototype therefore demonstrates the decision and escalation behavior rather than a complete enterprise telephony transfer workflow.

## 10. Production Readiness Gaps

Before production deployment, the following areas would require additional implementation and validation:

- Market-specific knowledge bases
- Market-specific eligibility policies
- Stronger semantic retrieval
- Native-speaker language and accent evaluation
- Persistent voice/telephony infrastructure
- Authenticated production APIs
- Production human handoff
- Monitoring and observability
- Rate limiting
- Authentication and authorization
- More extensive adversarial testing
- Larger-scale latency and reliability testing

## 11. Key Takeaway

The Q3 prototype demonstrates multilingual voice interaction, code-switching, safe handling of unsupported market/currency combinations, knowledge-base integration, and human escalation.

The main limitation is that the underlying product configuration remains an India-focused business-loan workflow rather than the Philippines life-insurance and Indonesia multifinance workflows specified in the assignment.

These limitations are explicitly recorded so that the prototype's demonstrated capabilities are not overstated.
