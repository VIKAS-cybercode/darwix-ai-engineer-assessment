# Step 1 — Domain Design

## Chosen use case
Business-loan qualification.

## Why
Compact domain covering FAQs, qualification, objections, unsupported-question fallback, human escalation, and Q4 sales/compliance signals.

## Source-data assumption
The assessment references a provided script/business-rules source, but no separate source was available. These files are synthetic and will be labeled as such in the final submission.

## Safety boundaries
1. No final approval claims.
2. No fabricated pricing/EMI/disbursement promises.
3. No OTP/password/PIN/banking credential collection.
4. Unsupported questions get a grounded fallback.
5. Human requests trigger escalation.
6. Conflicting information must be clarified.

## Target retrieval metadata
chunk_id, source_id, source_file, domain, title, version, status, text, keywords, sensitivity, created_at.

## Taxonomy
product, eligibility, qualification, documents, faq, objection, safety.
