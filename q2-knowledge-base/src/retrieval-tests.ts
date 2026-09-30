import { retrieve } from "./retrieve.js";

type TestCase = {
  id: string;
  query: string;
  expectedSource: string;
  expectedReason: string;
};

const TEST_CASES: TestCase[] = [
  {
    id: "Q1",
    query: "What documents are required for the business loan?",
    expectedSource: "LOAN-003",
    expectedReason:
      "The required-documents source directly lists the documents requested during application review.",
  },
  {
    id: "Q2",
    query: "What is the minimum monthly business turnover?",
    expectedSource: "LOAN-002",
    expectedReason:
      "The eligibility policy defines the minimum average monthly turnover requirement.",
  },
  {
    id: "Q3",
    query: "How much can I borrow and what is the maximum tenure?",
    expectedSource: "LOAN-001",
    expectedReason:
      "The product source defines the available loan amount and tenure range.",
  },
  {
    id: "Q4",
    query: "Can you guarantee that my loan will be approved?",
    expectedSource: "LOAN-004",
    expectedReason:
      "The FAQ explains that approval is subject to review and should not be represented as guaranteed.",
  },
  {
    id: "Q5",
    query: "I don't want to share my financial information.",
    expectedSource: "LOAN-005",
    expectedReason:
      "The objections source contains the grounded response for customers concerned about sharing financial information.",
  },
];

async function main() {
  console.log("======================================");
  console.log("Q2 RETRIEVAL EVALUATION");
  console.log("======================================\n");

  let passed = 0;

  for (const test of TEST_CASES) {
    const results = await retrieve(test.query, 3);

    const topResult = results[0];

    const correct =
      topResult?.source_id === test.expectedSource;

    if (correct) {
      passed++;
    }

    console.log(`### ${test.id}`);
    console.log(`Question: ${test.query}`);
    console.log(`Expected source: ${test.expectedSource}`);
    console.log(
      `Retrieved source: ${topResult?.source_id ?? "NONE"}`
    );
    console.log(
      `Retrieved title: ${topResult?.title ?? "NONE"}`
    );
    console.log(
      `Score: ${topResult?.score.toFixed(3) ?? "N/A"}`
    );
    console.log(`Verdict: ${correct ? "CORRECT" : "INCORRECT"}`);
    console.log(`Why: ${test.expectedReason}`);
    console.log("");
  }

  console.log("======================================");
  console.log(
    `RESULT: ${passed}/${TEST_CASES.length} top-result tests correct`
  );
  console.log("======================================");
}

main().catch((error) => {
  console.error("❌ Retrieval evaluation failed:");
  console.error(error);
  process.exit(1);
});