const BASE_URL = "http://localhost:3004";

interface SimulationChunk {
  callId: string;
  sequence: number;
  speaker: "customer" | "agent";
  text: string;
  confidence: number;
}

const scenarios: Record<string, SimulationChunk[]> = {
  "cross-sell": [
    {
      callId: "demo-cross-sell",
      sequence: 1,
      speaker: "customer",
      text: "The loan sounds useful for my business.",
      confidence: 0.96
    },
    {
      callId: "demo-cross-sell",
      sequence: 2,
      speaker: "agent",
      text: "What would you use the loan for?",
      confidence: 0.98
    },
    {
      callId: "demo-cross-sell",
      sequence: 3,
      speaker: "customer",
      text: "I also want insurance coverage to protect my family.",
      confidence: 0.94
    },
    {
      callId: "demo-cross-sell",
      sequence: 4,
      speaker: "agent",
      text: "Let me note that requirement.",
      confidence: 0.97
    }
  ],

  "compliance": [
    {
      callId: "demo-compliance",
      sequence: 1,
      speaker: "customer",
      text: "Can you guarantee approval for my loan?",
      confidence: 0.95
    },
    {
      callId: "demo-compliance",
      sequence: 2,
      speaker: "agent",
      text: "Approval depends on the eligibility checks.",
      confidence: 0.98
    },
    {
      callId: "demo-compliance",
      sequence: 3,
      speaker: "customer",
      text: "Can I just say yes and skip the verification?",
      confidence: 0.91
    }
  ],

  "frustration": [
    {
      callId: "demo-frustration",
      sequence: 1,
      speaker: "customer",
      text: "I already told you my business details.",
      confidence: 0.95
    },
    {
      callId: "demo-frustration",
      sequence: 2,
      speaker: "agent",
      text: "I just need to confirm one more detail.",
      confidence: 0.98
    },
    {
      callId: "demo-frustration",
      sequence: 3,
      speaker: "customer",
      text: "Why do you keep asking the same thing?",
      confidence: 0.94
    },
    {
      callId: "demo-frustration",
      sequence: 4,
      speaker: "customer",
      text: "This is taking too long and is frustrating.",
      confidence: 0.93
    }
  ],

  "noisy": [
    {
      callId: "demo-noisy",
      sequence: 1,
      speaker: "customer",
      text: "My monthly turnover is about five lakh rupees.",
      confidence: 0.96
    },
    {
      callId: "demo-noisy",
      sequence: 2,
      speaker: "customer",
      text: "[inaudible] ... background noise ... maybe three lakh",
      confidence: 0.48
    },
    {
      callId: "demo-noisy",
      sequence: 3,
      speaker: "customer",
      text: "I said three or five, I'm not sure.",
      confidence: 0.59
    }
  ]
};

async function sendChunk(chunk: SimulationChunk): Promise<void> {
  const payload = {
    ...chunk,
    timestamp: Date.now()
  };

  const response = await fetch(`${BASE_URL}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const result = await response.json();

  console.log("\n--- STREAM CHUNK ---");
  console.log(`Call: ${chunk.callId}`);
  console.log(`Sequence: ${chunk.sequence}`);
  console.log(`Speaker: ${chunk.speaker}`);
  console.log(`Text: ${chunk.text}`);
  console.log(`Confidence: ${chunk.confidence}`);
  console.log(`Processing: ${result.processingMs.toFixed(2)} ms`);
  console.log(`End-to-end: ${result.ingestToProcessMs} ms`);

  if (result.nudges.length > 0) {
    console.log("NUDGES:");

    for (const nudge of result.nudges) {
      console.log(
        `[${nudge.priority.toUpperCase()}] ${nudge.signalType}: ${nudge.message}`
      );
    }
  } else {
    console.log("No nudge.");
  }
}

async function runScenario(name: string): Promise<void> {
  const chunks = scenarios[name];

  if (!chunks) {
    console.error(`Unknown scenario: ${name}`);
    console.log(`Available: ${Object.keys(scenarios).join(", ")}`);
    process.exit(1);
  }

  console.log(`\n========================================`);
  console.log(`SCENARIO: ${name.toUpperCase()}`);
  console.log(`========================================`);

  for (const chunk of chunks) {
    await sendChunk(chunk);
    await new Promise((resolve) => setTimeout(resolve, 1200));
  }

  console.log(`\nScenario "${name}" complete.`);
}

const scenario = process.argv[2] ?? "cross-sell";

runScenario(scenario).catch((error) => {
  console.error("Simulation failed:", error);
  process.exit(1);
});
