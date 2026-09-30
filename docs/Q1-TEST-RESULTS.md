# Q1 Voice Agent — Test Results

## Automated Test Suite

Command:

    npx tsx src/test-chat.ts

Result:

    12/12 tests passed

## Tests Covered

- Greeting handling
- Natural name extraction
- Complete cooperative qualification
- Under-21 rejection
- Business-age rejection
- Low-turnover rejection
- Indian currency parsing
- Registration negative handling
- Document consent using natural language
- Financial-information objection
- Out-of-scope fallback
- Human escalation

## Key Reliability Behaviors

- Qualification rules are implemented separately from conversation handling.
- Indian currency expressions such as ₹10 lakh are parsed into numeric amounts.
- Negative registration statements are not incorrectly interpreted as positive registration.
- Financial-information objections are grounded against the Q2 knowledge base.
- Unsupported questions are refused rather than answered by guessing.
- Requests for a human representative trigger escalation.
- Preliminary eligibility is explicitly distinguished from final approval.

## Status

Q1 core conversational logic is functional and passes all automated tests.
