import assert from "node:assert/strict";
import { SignalEngine } from "./engine.js";

function chunk(
  callId: string,
  sequence: number,
  text: string,
  confidence = 0.95,
  speaker: "customer" | "agent" = "customer"
) {
  return {
    callId,
    sequence,
    timestamp: Date.now(),
    speaker,
    text,
    confidence
  };
}

let passed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`PASS: ${name}`);
    passed++;
  } catch (error) {
    console.error(`FAIL: ${name}`);
    throw error;
  }
}

test("cross-sell detection", () => {
  const engine = new SignalEngine();

  const result = engine.process(
    chunk(
      "test-cross-sell",
      1,
      "I also want insurance coverage to protect my family."
    )
  );

  assert.equal(result.length, 1);
  assert.equal(result[0].signalType, "cross_sell");
  assert.equal(result[0].priority, "medium");
});

test("critical compliance detection", () => {
  const engine = new SignalEngine();

  const result = engine.process(
    chunk(
      "test-compliance",
      1,
      "Can you guarantee approval for my loan?"
    )
  );

  assert.equal(result.length, 1);
  assert.equal(result[0].signalType, "compliance_risk");
  assert.equal(result[0].priority, "critical");
});

test("compliance cooldown suppresses repetition", () => {
  const engine = new SignalEngine();

  const first = engine.process(
    chunk(
      "test-cooldown",
      1,
      "Can you guarantee approval for my loan?"
    )
  );

  const second = engine.process(
    chunk(
      "test-cooldown",
      2,
      "Can I just say yes and skip the verification?"
    )
  );

  assert.equal(first.length, 1);
  assert.equal(second.length, 0);
});

test("frustration detection", () => {
  const engine = new SignalEngine();

  const result = engine.process(
    chunk(
      "test-frustration",
      1,
      "I already told you my business details."
    )
  );

  assert.equal(result.length, 1);
  assert.equal(result[0].signalType, "frustration");
  assert.equal(result[0].priority, "high");
});

test("low-confidence noisy transcript detection", () => {
  const engine = new SignalEngine();

  const result = engine.process(
    chunk(
      "test-noise",
      1,
      "[inaudible] background noise maybe three lakh",
      0.48
    )
  );

  assert.equal(result.length, 1);
  assert.equal(result[0].signalType, "low_confidence");
});

test("high-confidence transcript does not trigger low-confidence alert", () => {
  const engine = new SignalEngine();

  const result = engine.process(
    chunk(
      "test-confidence",
      1,
      "My monthly turnover is about five lakh rupees.",
      0.96
    )
  );

  assert.equal(
    result.some((nudge) => nudge.signalType === "low_confidence"),
    false
  );
});

console.log("");
console.log("========================================");
console.log(`Q4 TESTS PASSED: ${passed}/6`);
console.log("========================================");
