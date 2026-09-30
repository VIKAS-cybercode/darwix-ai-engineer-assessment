export type SignalType =
  | "compliance_risk"
  | "cross_sell"
  | "frustration"
  | "low_confidence";

export type Priority = "critical" | "high" | "medium";

export interface TranscriptChunk {
  callId: string;
  sequence: number;
  timestamp: number;
  speaker: "customer" | "agent";
  text: string;
  confidence: number;
}

export interface Nudge {
  id: string;
  callId: string;
  signalType: SignalType;
  priority: Priority;
  message: string;
  confidence: number;
  createdAt: number;
  expiresAt: number;
  sequence: number;
  groupId: string;
}

const CONFIG = {
  minConfidence: 0.70,
  cooldownMs: 8000,
  expiryMs: 15000,
  maxRepetitions: 2,
  frustrationWindow: 5,
  groupingWindowMs: 3000
};

const compliancePatterns = [
  "guarantee approval",
  "guaranteed approval",
  "approve without documents",
  "fake documents",
  "hide information",
  "hide info",
  "just say yes",
  "skip verification"
];

const crossSellPatterns = [
  "insurance",
  "insurance coverage",
  "protect my family",
  "protection plan",
  "payment protection",
  "life cover",
  "life insurance"
];

const frustrationPatterns = [
  "this is frustrating",
  "already told you",
  "why are you asking",
  "why do you keep asking",
  "this is taking too long",
  "ridiculous",
  "annoying",
  "waste of time",
  "not helpful"
];

const noisePatterns = [
  "[inaudible]",
  "[unclear]",
  "[noise]",
  "background noise",
  "can't hear",
  "cannot hear"
];

interface SignalState {
  lastTriggeredAt: Partial<Record<SignalType, number>>;
  repetitions: Partial<Record<SignalType, number>>;
  frustrationHistory: number[];
}

export class SignalEngine {
  private states = new Map<string, SignalState>();

  private getState(callId: string): SignalState {
    let state = this.states.get(callId);

    if (!state) {
      state = {
        lastTriggeredAt: {},
        repetitions: {},
        frustrationHistory: []
      };

      this.states.set(callId, state);
    }

    return state;
  }

  process(chunk: TranscriptChunk): Nudge[] {
    const state = this.getState(chunk.callId);
    const now = Date.now();
    const nudges: Nudge[] = [];

    if (
      chunk.confidence < CONFIG.minConfidence ||
      noisePatterns.some((pattern) =>
        chunk.text.toLowerCase().includes(pattern.toLowerCase())
      )
    ) {
      const nudge = this.createNudge(
        chunk,
        "low_confidence",
        "medium",
        "Transcript confidence is low or noisy. Verify the customer's statement before acting."
      );

      if (this.shouldEmit(state, nudge.signalType, now)) {
        nudges.push(nudge);
      }
    }

    const lower = chunk.text.toLowerCase();

    if (compliancePatterns.some((pattern) => lower.includes(pattern))) {
      const nudge = this.createNudge(
        chunk,
        "compliance_risk",
        "critical",
        "Compliance risk detected. Do not bypass verification or document requirements."
      );

      if (this.shouldEmit(state, nudge.signalType, now)) {
        nudges.push(nudge);
      }
    }

    if (crossSellPatterns.some((pattern) => lower.includes(pattern))) {
      const nudge = this.createNudge(
        chunk,
        "cross_sell",
        "medium",
        "Potential cross-sell opportunity detected. Customer mentioned protection or insurance needs."
      );

      if (this.shouldEmit(state, nudge.signalType, now)) {
        nudges.push(nudge);
      }
    }

    if (chunk.speaker === "customer") {
      if (
        frustrationPatterns.some((pattern) =>
          lower.includes(pattern)
        )
      ) {
        state.frustrationHistory.push(now);

        state.frustrationHistory = state.frustrationHistory.filter(
          (timestamp) => now - timestamp <= 30000
        );

        if (state.frustrationHistory.length >= 1) {
          const nudge = this.createNudge(
            chunk,
            "frustration",
            "high",
            "Customer frustration appears to be rising. Consider slowing down, acknowledging the concern, and offering assistance."
          );

          if (this.shouldEmit(state, nudge.signalType, now)) {
            nudges.push(nudge);
          }
        }
      }
    }

    return nudges;
  }

  private shouldEmit(
    state: SignalState,
    signalType: SignalType,
    now: number
  ): boolean {
    const lastTriggered = state.lastTriggeredAt[signalType] ?? 0;
    const repetitions = state.repetitions[signalType] ?? 0;

    if (now - lastTriggered < CONFIG.cooldownMs) {
      return false;
    }

    if (repetitions >= CONFIG.maxRepetitions) {
      return false;
    }

    state.lastTriggeredAt[signalType] = now;
    state.repetitions[signalType] = repetitions + 1;

    return true;
  }

  private createNudge(
    chunk: TranscriptChunk,
    signalType: SignalType,
    priority: Priority,
    message: string
  ): Nudge {
    const now = Date.now();

    const groupId =
      `${chunk.callId}-${Math.floor(
        chunk.timestamp / CONFIG.groupingWindowMs
      )}`;

    return {
      id: `${chunk.callId}-${chunk.sequence}-${signalType}-${now}`,
      callId: chunk.callId,
      signalType,
      priority,
      message,
      confidence: chunk.confidence,
      createdAt: now,
      expiresAt: now + CONFIG.expiryMs,
      sequence: chunk.sequence,
      groupId
    };
  }
}
