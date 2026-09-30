# Q4 ? Live Call Insights Test Results

## 1. Overview

Q4 implements a realtime transcript-stream simulation for live call insights.

Transcript chunks are submitted to:

`POST /events`

The signal engine analyzes each chunk and generates structured nudges for:

- Compliance risk
- Cross-sell opportunities
- Customer frustration
- Low-confidence/noisy transcription

A WebSocket dashboard displays transcript chunks and generated nudges in near real time.

---

## 2. Required Scenario Tests

### Test 1 ? Cross-Sell Detection

Input:

> I also want insurance coverage to protect my family.

Result:

- Signal: `cross_sell`
- Priority: `MEDIUM`
- Nudge generated successfully
- Confidence: 0.94
- Processing latency: 0.29 ms
- End-to-end event latency: 18 ms

Expected behavior:

Detect a potential protection/insurance cross-sell opportunity and surface a nudge to the agent.

Status: **PASS**

---

### Test 2 ? Compliance Risk

Input:

> Can you guarantee approval for my loan?

Result:

- Signal: `compliance_risk`
- Priority: `CRITICAL`
- Nudge generated successfully
- Confidence: 0.95
- Processing latency: 0.06 ms
- End-to-end event latency: 71 ms

A later statement:

> Can I just say yes and skip the verification?

did not generate another nudge because the cooldown control suppressed a repeated compliance alert.

Status: **PASS**

---

### Test 3 ? Rising Frustration

Input:

> I already told you my business details.

Result:

- Signal: `frustration`
- Priority: `HIGH`
- Nudge generated successfully
- Confidence: 0.95
- Processing latency: 0.12 ms
- End-to-end event latency: 155 ms

Later frustration-related statements were suppressed by the cooldown.

Status: **PASS**

Limitation:

The current rule-based detector can trigger from a single phrase such as "I already told you". In production, this should be combined with multiple conversational signals, sentiment/prosody features, repetition frequency, and context to reduce false positives.

---

### Test 4 ? Noisy / Ambiguous Speech

Clear statement:

> My monthly turnover is about five lakh rupees.

Result:

- Confidence: 0.96
- No low-confidence nudge

Noisy statement:

> [inaudible] ... background noise ... maybe three lakh

Result:

- Signal: `low_confidence`
- Priority: `MEDIUM`
- Confidence: 0.48
- Processing latency: 0.09 ms
- End-to-end event latency: 18 ms

Later ambiguous statement:

> I said three or five, I'm not sure.

Confidence:

0.59

No additional alert was generated because of the control logic.

Status: **PASS**

---

## 3. Automated Tests

Command:

`npm test`

Result:

**6/6 PASS**

Tests:

1. Cross-sell detection ? PASS
2. Critical compliance detection ? PASS
3. Compliance cooldown suppression ? PASS
4. Frustration detection ? PASS
5. Low-confidence noisy transcript detection ? PASS
6. High-confidence transcript does not trigger low-confidence alert ? PASS

---

## 4. Alert Controls

### Confidence

Minimum confidence threshold:

`0.70`

Low-confidence or noisy transcript chunks can generate a `low_confidence` nudge.

### Cooldown

Cooldown:

`8 seconds`

Prevents repeated alerts for the same signal type from flooding the agent.

### Repetition Limit

Maximum repetitions per signal type:

`2`

This provides an additional repetition safeguard.

### Grouping

Grouping window:

`3000 ms`

Each nudge receives a deterministic `groupId` based on call ID and the grouping window.

This allows related nudges to be grouped in the dashboard or downstream systems.

### Priority

Priority levels:

- CRITICAL ? compliance risk
- HIGH ? customer frustration
- MEDIUM ? cross-sell and low-confidence signals

### Expiry

Nudges receive a:

`15 second`

expiry timestamp.

The timestamp allows the dashboard or downstream consumer to avoid treating stale alerts as current.

---

## 5. Latency Measurements

### Interactive Scenario Run

The first 14 event samples produced:

- P50: 18 ms
- P95: 155 ms
- Minimum: 4 ms
- Maximum: 155 ms

These measurements include the event ingestion-to-processing timing observed during interactive scenario execution.

### Steady-State Benchmark

A separate benchmark submitted 100 neutral transcript events.

Results:

| Metric | Result |
|---|---:|
| Samples | 100 |
| P50 | 1.85 ms |
| P95 | 2.50 ms |
| Minimum | 1.44 ms |
| Maximum | 36.30 ms |

The steady-state benchmark uses the same `/events` processing path but measures HTTP request response time from the local client.

These measurements should not be interpreted as full audio-to-dashboard latency because the current implementation uses simulated transcript chunks rather than a production speech-recognition pipeline.

---

## 6. Latency Components

Current implementation measures:

1. Event ingestion
2. Signal-engine processing
3. Ingest-to-processing latency
4. HTTP response latency during benchmark testing

The signal-engine processing itself was consistently sub-millisecond in the scenario tests.

A production implementation would additionally measure:

- Audio capture latency
- Streaming ASR latency
- ASR finalization latency
- Network transport latency
- Signal detection latency
- WebSocket delivery latency
- Dashboard rendering latency

---

## 7. False-Positive Analysis

### Frustration

The current detector can trigger on a single frustration phrase.

Example:

> I already told you my business details.

This is useful for immediate intervention but may be overly sensitive.

Production improvement:

- Require multiple frustration indicators
- Track repeated questions
- Include sentiment/prosody
- Use a rolling confidence score
- Require a threshold before escalating priority

### Low Confidence

The low-confidence detector correctly distinguishes:

- High-confidence clear speech ? no alert
- Low-confidence/noisy speech ? alert

However, ASR confidence alone should not be treated as truth in production. Domain-specific terms, accents, code-switching, and background noise can affect ASR confidence.

---

## 8. Scale Considerations

The current engine is intentionally lightweight and rule-based.

For higher call volume:

- Run workers horizontally
- Partition streams by call ID
- Keep per-call state in a shared low-latency store when required
- Use a message broker for durable event delivery
- Add backpressure and retry handling
- Persist nudge events for auditability
- Monitor processing and delivery latency
- Add rate limits and circuit breakers

The current prototype does not claim production-scale capacity.

---

## 9. Audio / ASR Limitation

This implementation performs realtime analysis on **streaming transcript chunks**.

It does not directly perform speech-to-text on microphone or call audio.

The architecture is intentionally separated so a production ASR adapter can feed transcript chunks into the existing `/events` interface.

This avoids coupling the signal engine to a specific paid speech API.

---

## 10. Dashboard Evidence

The browser dashboard was tested successfully with the cross-sell scenario.

The dashboard displayed:

- WebSocket connection status
- Live transcript chunks
- Speaker
- Transcript confidence
- Processing latency
- End-to-end event latency
- Nudge type
- Nudge priority
- Nudge confidence
- Nudge expiry

The cross-sell nudge appeared in the dashboard while the simulator was streaming the transcript.

---

## 11. Overall Q4 Status

Core prototype:

**PASS**

Automated tests:

**6/6 PASS**

Required scenario simulations:

**4/4 PASS**

Steady-state benchmark:

**100 samples**

P50:

**1.85 ms**

P95:

**2.50 ms**

The main production limitation is that the current implementation analyzes transcript streams rather than directly processing live call audio. An ASR/telephony adapter can feed the same event interface in a production deployment.
