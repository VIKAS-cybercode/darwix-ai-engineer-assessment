# Q4 ? Live Call Insights

## Overview

This prototype analyzes streaming transcript chunks from a live call and generates actionable agent nudges in near real time.

The system detects:

- Compliance risk
- Cross-sell opportunities
- Rising customer frustration
- Low-confidence / noisy transcription

A browser dashboard receives transcript events and nudges through WebSocket.

> **Implementation note:** Q4 uses a realtime transcript-stream simulation rather than a live speech-to-text provider. The `/events` interface is designed as the boundary where a production ASR/telephony adapter can provide transcript chunks.

---

## Architecture

```text
                 ????????????????????????????
                 ?  Live Call / ASR Adapter  ?
                 ?   Production Boundary     ?
                 ????????????????????????????
                              ?
                              ? Transcript chunks
                              ?
                    ??????????????????????
                    ? POST /events       ?
                    ? Express Server     ?
                    ??????????????????????
                              ?
                              ?
                    ??????????????????????
                    ?   Signal Engine    ?
                    ?                    ?
                    ? Compliance         ?
                    ? Cross-sell         ?
                    ? Frustration        ?
                    ? Low confidence     ?
                    ??????????????????????
                              ?
                              ?
                    ??????????????????????
                    ? Nudge Controls     ?
                    ?                    ?
                    ? Confidence         ?
                    ? Cooldown           ?
                    ? Repetition         ?
                    ? Grouping           ?
                    ? Priority           ?
                    ? Expiry             ?
                    ??????????????????????
                              ?
                              ? WebSocket
                              ?
                    ??????????????????????
                    ? Live Dashboard     ?
                    ?                    ?
                    ? Transcript         ?
                    ? Nudges             ?
                    ? Latency            ?
                    ??????????????????????
Project Structure
q4-live-insights/
??? src/
?   ??? engine.ts
?   ??? server.ts
?   ??? simulator.ts
?   ??? tests.ts
??? public/
?   ??? index.html
??? docs/
?   ??? Q4-TEST-RESULTS.md
??? package.json
??? tsconfig.json
Setup

From the q4-live-insights directory:

npm install

Start the server:

npm run dev

Dashboard:

http://localhost:3004

Health endpoint:

http://localhost:3004/health

Metrics endpoint:

http://localhost:3004/metrics

WebSocket:

ws://localhost:3004/ws

Streaming endpoint:

POST http://localhost:3004/events
Running Scenarios

Open another terminal.

Cross-sell
npm run simulate -- cross-sell

Detects insurance/protection interest.

Expected signal:

cross_sell
MEDIUM
Compliance
npm run simulate -- compliance

Detects requests to bypass approval or verification.

Expected signal:

compliance_risk
CRITICAL

Repeated alerts are suppressed using the cooldown.

Frustration
npm run simulate -- frustration

Detects customer frustration indicators.

Expected signal:

frustration
HIGH
Noisy / ambiguous speech
npm run simulate -- noisy

Detects low-confidence or noisy transcript input.

Expected signal:

low_confidence
MEDIUM
Automated Tests

Run:

npm test

Current result:

Q4 TESTS PASSED: 6/6

Covered tests:

Cross-sell detection
Critical compliance detection
Compliance cooldown suppression
Frustration detection
Low-confidence noisy transcript detection
High-confidence transcript does not trigger low-confidence alert
Nudge Controls
Confidence

Minimum confidence:

0.70

Below this threshold, the engine can generate a low-confidence nudge.

Cooldown
8 seconds

Prevents repeated alerts of the same signal type from flooding the agent.

Repetition limit
2 alerts per signal type
Grouping
3 second grouping window

Every nudge receives a groupId based on the call and grouping window.

Priority
Signal    Priority
Compliance risk    CRITICAL
Frustration    HIGH
Cross-sell    MEDIUM
Low confidence    MEDIUM
Expiry

Nudges contain a:

15 second expiry timestamp

This allows downstream consumers to ignore stale alerts.

Latency Results
Interactive scenarios

14 event samples:

Metric    Result
P50    18 ms
P95    155 ms
Minimum    4 ms
Maximum    155 ms
Steady-state benchmark

100 neutral transcript events:

Metric    Result
Samples    100
P50    1.85 ms
P95    2.50 ms
Minimum    1.44 ms
Maximum    36.30 ms

The steady-state benchmark measures local HTTP event processing and response time.

It should not be interpreted as full audio-to-dashboard latency.

Signal Examples
Compliance

Customer:

Can you guarantee approval for my loan?

Nudge:

CRITICAL ? compliance_risk
Do not bypass verification or document requirements.
Cross-sell

Customer:

I also want insurance coverage to protect my family.

Nudge:

MEDIUM ? cross_sell
Potential cross-sell opportunity detected.
Frustration

Customer:

I already told you my business details.

Nudge:

HIGH ? frustration
Consider slowing down, acknowledging the concern,
and offering assistance.
Low confidence

Transcript:

[inaudible] ... background noise ... maybe three lakh

Nudge:

MEDIUM ? low_confidence
Verify the customer's statement before acting.
False-Positive Handling

The prototype intentionally favors explainable rule-based detection.

A known limitation is frustration sensitivity.

For example:

I already told you my business details.

can trigger frustration from a single phrase.

A production system should combine:

Repeated customer interruptions
Repeated questions
Sentiment
Prosody
Conversation context
ASR confidence
Multiple signal confirmations

before escalating the alert.

Production Considerations

For higher call volume:

Partition streams by call ID
Horizontally scale workers
Use a shared low-latency state store when required
Introduce a message broker for durable event delivery
Add retry and backpressure handling
Persist nudge events for auditability
Monitor component-level latency
Add rate limits and circuit breakers
Add production ASR and telephony integration
Current Limitation

The prototype analyzes streaming transcript chunks, not raw live call audio.

A production deployment would connect:

Telephony / Call Audio
        ?
Streaming ASR
        ?
Transcript Chunks
        ?
POST /events
        ?
Signal Engine
        ?
Agent Nudges

The signal engine and dashboard do not depend on a specific ASR provider.

Evidence

Detailed test results are available in:

docs/Q4-TEST-RESULTS.md

The live dashboard was tested successfully with the cross-sell scenario, showing:

WebSocket connection
Live transcript
Confidence
Processing latency
End-to-end event latency
Nudge type
Priority
Nudge confidence
Nudge expiry
