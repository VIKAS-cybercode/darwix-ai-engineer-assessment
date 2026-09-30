\# Q2 Retrieval Evaluation Results



\## Retrieval Approach



The knowledge base uses a local lexical/keyword-based retrieval approach.



No external embedding API is required.



The retrieval pipeline:

1\. Normalizes the user query.

2\. Removes common stopwords.

3\. Detects the likely business intent/category.

4\. Scores matching KB chunks using keyword matches.

5\. Boosts heading and category matches.

6\. Returns the highest-ranked grounded source.



\## Evaluation



Five representative business questions were tested.



\### Test 1 — Required Documents



\*\*Question:\*\*  

What documents are required for the business loan?



\*\*Expected source:\*\* LOAN-003  

\*\*Retrieved source:\*\* LOAN-003 — Required Documents  

\*\*Score:\*\* 3.333  

\*\*Verdict:\*\* CORRECT



\*\*Relevance:\*\*  

The required-documents source directly lists the documents requested during application review.



\---



\### Test 2 — Eligibility / Turnover



\*\*Question:\*\*  

What is the minimum monthly business turnover?



\*\*Expected source:\*\* LOAN-002  

\*\*Retrieved source:\*\* LOAN-002 — Eligibility Policy  

\*\*Score:\*\* 1.750  

\*\*Verdict:\*\* CORRECT



\*\*Relevance:\*\*  

The eligibility policy defines the minimum average monthly turnover requirement.



\---



\### Test 3 — Product Amount and Tenure



\*\*Question:\*\*  

How much can I borrow and what is the maximum tenure?



\*\*Expected source:\*\* LOAN-001  

\*\*Retrieved source:\*\* LOAN-001 — FlexiBiz Business Loan Product  

\*\*Score:\*\* 1.667  

\*\*Verdict:\*\* CORRECT



\*\*Relevance:\*\*  

The product source defines the available loan amount and tenure range.



\---



\### Test 4 — Approval Guarantee



\*\*Question:\*\*  

Can you guarantee that my loan will be approved?



\*\*Expected source:\*\* LOAN-004  

\*\*Retrieved source:\*\* LOAN-004 — Loan FAQ  

\*\*Score:\*\* 2.000  

\*\*Verdict:\*\* CORRECT



\*\*Relevance:\*\*  

The FAQ explains that approval is subject to review and should not be represented as guaranteed.



\---



\### Test 5 — Financial Information Objection



\*\*Question:\*\*  

I don't want to share my financial information.



\*\*Expected source:\*\* LOAN-005  

\*\*Retrieved source:\*\* LOAN-005 — Common Objections  

\*\*Score:\*\* 3.300  

\*\*Verdict:\*\* CORRECT



\*\*Relevance:\*\*  

The objections source contains the grounded response for customers concerned about sharing financial information.



\---



\## Summary



\*\*Top-result accuracy: 5/5 (100%)\*\*



All five evaluation queries retrieved the expected source as the top result.



The evaluation covers:

\- Product information

\- Eligibility rules

\- Required documents

\- Approval/FAQ handling

\- Customer objections



\## Known Limitation



This MVP uses lexical retrieval rather than semantic vector embeddings.



This was intentionally selected to avoid dependency on a paid external embedding API during the assessment prototype.



For production, the retrieval layer could be upgraded to local or managed embeddings while preserving the same document IDs, metadata, source tracking, and evaluation framework.

