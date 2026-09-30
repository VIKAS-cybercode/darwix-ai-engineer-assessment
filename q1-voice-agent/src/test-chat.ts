const BASE_URL = "http://localhost:3001";

type TestResult = {
  name: string;
  passed: boolean;
  details: string;
};

const results: TestResult[] = [];

async function chat(sessionId: string, message: string): Promise<any> {
  const response = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sessionId,
      message,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

function check(
  name: string,
  condition: boolean,
  details: string
): void {
  results.push({
    name,
    passed: condition,
    details,
  });
}

async function runTest(
  name: string,
  test: () => Promise<string>
): Promise<void> {
  try {
    const details = await test();

    check(name, true, details);
  } catch (error) {
    check(
      name,
      false,
      error instanceof Error ? error.message : String(error)
    );
  }
}

async function runTests() {
  console.log("");
  console.log("==============================================");
  console.log("       DARWIX Q1 VOICE AGENT TEST SUITE");
  console.log("==============================================");
  console.log("");

  // --------------------------------------------------
  // 1. Greeting
  // --------------------------------------------------

  await runTest("Greeting handling", async () => {
    const result = await chat("test-greeting-suite", "Hi");

    if (
      !result.reply.includes("May I know your name") ||
      result.status !== "collecting_information"
    ) {
      throw new Error(`Unexpected response: ${result.reply}`);
    }

    return "Greeting did not get stored as applicant name";
  });

  // --------------------------------------------------
  // 2. Natural name extraction
  // --------------------------------------------------

  await runTest("Natural name extraction", async () => {
    const session = "test-name-suite";

    const result = await chat(session, "My name is Vikas");

    if (!result.reply.includes("business")) {
      throw new Error(`Unexpected response: ${result.reply}`);
    }

    return 'Accepted "My name is Vikas" and moved to business name';
  });

  // --------------------------------------------------
  // 3. Full cooperative customer
  // --------------------------------------------------

  await runTest("Complete cooperative qualification", async () => {
    const session = "test-cooperative-suite";

    await chat(session, "Vikas");
    await chat(session, "ABC Traders");
    await chat(session, "5 years");
    await chat(session, "30");
    await chat(session, "Yes");
    await chat(session, "5 lakh");
    await chat(session, "10 lakh");
    await chat(session, "Business expansion");

    const result = await chat(
      session,
      "Yes, I am willing to provide the required documents"
    );

    if (result.status !== "preliminarily_eligible") {
      throw new Error(
        `Expected preliminarily_eligible, got ${result.status}: ${result.reply}`
      );
    }

    return "Valid customer reached preliminary eligibility";
  });

  // --------------------------------------------------
  // 4. Under 21
  // --------------------------------------------------

  await runTest("Under-21 rejection", async () => {
    const session = "test-under21-suite";

    await chat(session, "Vikas");
    await chat(session, "ABC Traders");
    await chat(session, "5 years");

    const result = await chat(session, "19");

    if (result.status !== "not_preliminarily_eligible") {
      throw new Error(
        `Expected rejection, got ${result.status}: ${result.reply}`
      );
    }

    return "Applicant below 21 correctly rejected";
  });

  // --------------------------------------------------
  // 5. Business less than 2 years
  // --------------------------------------------------

  await runTest("Business-age rejection", async () => {
    const session = "test-business-age-suite";

    await chat(session, "Vikas");
    await chat(session, "ABC Traders");

    const result = await chat(session, "1 year");

    if (result.status !== "not_preliminarily_eligible") {
      throw new Error(
        `Expected rejection, got ${result.status}: ${result.reply}`
      );
    }

    return "Business with less than 2 years correctly rejected";
  });

  // --------------------------------------------------
  // 6. Low turnover
  // --------------------------------------------------

  await runTest("Low-turnover rejection", async () => {
    const session = "test-turnover-suite";

    await chat(session, "Vikas");
    await chat(session, "ABC Traders");
    await chat(session, "5 years");
    await chat(session, "30");
    await chat(session, "Yes");

    const result = await chat(session, "2 lakh");

    if (result.status !== "not_preliminarily_eligible") {
      throw new Error(
        `Expected rejection, got ${result.status}: ${result.reply}`
      );
    }

    return "Turnover below â‚¹3 lakh correctly rejected";
  });

  // --------------------------------------------------
  // 7. Loan amount parsing
  // --------------------------------------------------

  await runTest("Indian currency parsing", async () => {
    const session = "test-currency-suite";

    await chat(session, "Vikas");
    await chat(session, "ABC Traders");
    await chat(session, "5 years");
    await chat(session, "30");
    await chat(session, "Yes");
    await chat(session, "5 lakh");

    const result = await chat(session, "â‚¹10 lakh");

    if (result.status !== "preliminarily_eligible") {
      throw new Error(`Currency parsing failed: ${result.reply}`);
    }

    return "â‚¹10 lakh correctly interpreted as â‚¹10,00,000";
  });

  // --------------------------------------------------
  // 8. Registration = false
  // --------------------------------------------------

  await runTest("Registration negative handling", async () => {
    const session = "test-registration-suite";

    await chat(session, "Vikas");
    await chat(session, "ABC Traders");
    await chat(session, "5 years");
    await chat(session, "30");

    const result = await chat(session, "not registered");

    if (
      !result.reply.toLowerCase().includes("turnover")
    ) {
      throw new Error(
        `Registration parsing failed: ${result.reply}`
      );
    }

    return '"not registered" correctly interpreted as false';
  });

  // --------------------------------------------------
  // 9. Document consent natural language
  // --------------------------------------------------

  await runTest("Document consent natural language", async () => {
    const session = "test-documents-suite";

    await chat(session, "Vikas");
    await chat(session, "ABC Traders");
    await chat(session, "5 years");
    await chat(session, "30");
    await chat(session, "Yes");
    await chat(session, "5 lakh");
    await chat(session, "10 lakh");
    await chat(session, "Business expansion");

    const result = await chat(
      session,
      "Yes, I am willing to provide the required documents"
    );

    if (result.status !== "preliminarily_eligible") {
      throw new Error(
        `Document consent failed: ${result.status}`
      );
    }

    return "Natural-language document consent accepted";
  });

  // --------------------------------------------------
  // 10. Financial-information objection
  // --------------------------------------------------

  await runTest("Financial-information objection", async () => {
    const session = "test-objection-suite";

    const result = await chat(
      session,
      "I do not want to share my financial information"
    );

    if (
      !result.grounded &&
      result.status !== "human_requested"
    ) {
      throw new Error(
        `Unexpected objection response: ${result.reply}`
      );
    }

    return "Financial-information objection handled without hallucination";
  });

  // --------------------------------------------------
  // 11. Out-of-scope question
  // --------------------------------------------------

  await runTest("Out-of-scope fallback", async () => {
    const session = "test-out-of-scope-suite";

    const result = await chat(
      session,
      "Can you tell me the weather in London tomorrow?"
    );

    if (
      result.grounded !== false ||
      result.status !== "human_requested"
    ) {
      throw new Error(
        `Out-of-scope handling failed: ${result.reply}`
      );
    }

    return "Out-of-scope question correctly refused/redirected";
  });

  // --------------------------------------------------
  // 12. Human escalation
  // --------------------------------------------------

  await runTest("Human escalation", async () => {
    const session = "test-human-suite";

    const result = await chat(
      session,
      "I would like to speak to a human representative"
    );

    if (result.status !== "human_requested") {
      throw new Error(
        `Expected human_requested, got ${result.status}`
      );
    }

    return "Human escalation correctly detected";
  });

  // --------------------------------------------------
  // Print report
  // --------------------------------------------------

  console.log("");
  console.log("==============================================");
  console.log("                 TEST RESULTS");
  console.log("==============================================");
  console.log("");

  let passed = 0;

  for (const result of results) {
    const status = result.passed ? "PASS" : "FAIL";

    if (result.passed) {
      passed++;
    }

    console.log(
      `${status.padEnd(6)} ${result.name}`
    );

    console.log(`       ${result.details}`);
    console.log("");
  }

  console.log("==============================================");

  console.log(
    `RESULT: ${passed}/${results.length} tests passed`
  );

  console.log("==============================================");
  console.log("");

  if (passed !== results.length) {
    process.exitCode = 1;
  }
}

runTests().catch((error) => {
  console.error("");
  console.error("TEST SUITE ERROR:");
  console.error(error);
  process.exitCode = 1;
});
