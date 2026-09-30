import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  qualify,
  requestHuman,
  unsupportedQuestion,
  getNextQuestion,
  QualificationData,
  ConversationState,
} from "./agent.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const KB_URL = process.env.KB_URL || "http://localhost:3002";

const conversations = new Map<string, ConversationState>();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "darwix-q1-voice-agent",
  });
});

app.post("/qualify", (req, res) => {
  const data = req.body as QualificationData;

  const result = qualify(data);

  res.json({
    success: true,
    ...result,
  });
});

app.post("/kb-search", async (req, res) => {
  try {
    const query = String(req.body?.query || "").trim();

    if (!query) {
      return res.status(400).json({
        success: false,
        error: "query is required",
      });
    }

    const response = await fetch(
      `${KB_URL}/search?q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error(`KB returned HTTP ${response.status}`);
    }

    const data = await response.json();

    res.json({
      success: true,
      query,
      source: "q2-knowledge-base",
      ...data,
    });
  } catch (error) {
    console.error("KB search error:", error);

    res.status(502).json({
      success: false,
      error: "Knowledge base is currently unavailable.",
    });
  }
});

app.post("/answer", async (req, res) => {
  try {
    const query = String(req.body?.query || "").trim();

    if (!query) {
      return res.status(400).json({
        success: false,
        error: "query is required",
      });
    }

    const response = await fetch(
      `${KB_URL}/search?q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error(`KB returned HTTP ${response.status}`);
    }

    const data = await response.json();

    const topResult = data.results?.[0];

    if (!topResult || topResult.score < 1.0) {
      return res.json({
        success: true,
        grounded: false,
        reply:
          "I don't have enough information in my knowledge base to answer that accurately. I don't want to guess. I can arrange human assistance if you'd like.",
        status: "human_requested",
      });
    }

    res.json({
      success: true,
      grounded: true,
      reply: topResult.content,
      source: {
        source_id: topResult.source_id,
        title: topResult.title,
        category: topResult.category,
        heading: topResult.heading,
        score: topResult.score,
      },
    });
  } catch (error) {
    console.error("Grounded answer error:", error);

    res.status(502).json({
      success: false,
      error: "Knowledge base is currently unavailable.",
    });
  }
});

/**
 * Convert common Indian currency expressions to INR.
 *
 * Examples:
 * "500000"       -> 500000
 * "5 lakh"       -> 500000
 * "10 lakh"      -> 1000000
 * "₹10 lakh"     -> 1000000
 * "2.5 crore"    -> 25000000
 */
function parseIndianAmount(message: string): number {
  const normalized = message
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/₹/g, "")
    .trim();

  const croreMatch = normalized.match(/(\d+(?:\.\d+)?)\s*crore/);

  if (croreMatch) {
    return Number(croreMatch[1]) * 10000000;
  }

  const lakhMatch = normalized.match(/(\d+(?:\.\d+)?)\s*lakh/);

  if (lakhMatch) {
    return Number(lakhMatch[1]) * 100000;
  }

  const thousandMatch = normalized.match(/(\d+(?:\.\d+)?)\s*thousand/);

  if (thousandMatch) {
    return Number(thousandMatch[1]) * 1000;
  }

  const plainNumber = normalized.replace(/[^0-9.]/g, "");

  return plainNumber ? Number(plainNumber) : NaN;
}

/**
 * Extract a person's name from natural language.
 *
 * Examples:
 * "Vikas" -> "Vikas"
 * "My name is Vikas" -> "Vikas"
 * "I am Vikas" -> "Vikas"
 */
function parseName(message: string): string {
  const trimmed = message.trim();

  const patterns = [
    /^my name is\s+(.+)$/i,
    /^i am\s+(.+)$/i,
    /^i'm\s+(.+)$/i,
    /^this is\s+(.+)$/i,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);

    if (match) {
      return match[1].trim();
    }
  }

  return trimmed;
}

/**
 * Detect greetings so they don't accidentally become applicant names.
 */
function isGreeting(message: string): boolean {
  return /^(hi|hello|hey|good morning|good afternoon|good evening)$/i.test(
    message.trim()
  );
}

/**
 * Detect objection related to sharing financial information.
 */
function isFinancialPrivacyObjection(message: string): boolean {
  const lower = message.toLowerCase();

  return (
    (lower.includes("don't want") ||
      lower.includes("do not want") ||
      lower.includes("not comfortable") ||
      lower.includes("uncomfortable") ||
      lower.includes("refuse") ||
      lower.includes("don't like") ||
      lower.includes("do not like")) &&
    (lower.includes("financial") ||
      lower.includes("income") ||
      lower.includes("turnover") ||
      lower.includes("bank") ||
      lower.includes("money") ||
      lower.includes("financial information"))
  );
}

/**
 * Detect a generic objection.
 */
function isObjection(message: string): boolean {
  const lower = message.toLowerCase();

  return (
    lower.includes("too expensive") ||
    lower.includes("high interest") ||
    lower.includes("interest rate") ||
    lower.includes("not interested") ||
    lower.includes("don't need") ||
    lower.includes("do not need") ||
    lower.includes("don't want") ||
    lower.includes("do not want") ||
    lower.includes("not comfortable") ||
    lower.includes("concerned about") ||
    lower.includes("worried about")
  );
}

/**
 * Detect out-of-scope questions.
 */
function isOutOfScope(message: string): boolean {
  const lower = message.toLowerCase();

  return (
    lower.includes("flight") ||
    lower.includes("hotel") ||
    lower.includes("weather") ||
    lower.includes("movie") ||
    lower.includes("restaurant") ||
    lower.includes("cricket") ||
    lower.includes("football")
  );
}

app.post("/chat", async (req, res) => {
  try {
    const sessionId = String(req.body?.sessionId || "").trim();
    const message = String(req.body?.message || "").trim();

    if (!sessionId || !message) {
      return res.status(400).json({
        success: false,
        error: "sessionId and message are required",
      });
    }

    let state = conversations.get(sessionId);

    if (!state) {
      state = {
        data: {},
        currentField: "applicantName",
      };

      conversations.set(sessionId, state);
    }

    const lowerMessage = message.toLowerCase();

    /**
     * Human escalation has the highest priority.
     */
    if (
      lowerMessage.includes("human") ||
      lowerMessage.includes("representative") ||
      lowerMessage.includes("speak to someone") ||
      lowerMessage.includes("talk to someone") ||
      lowerMessage.includes("real person") ||
      lowerMessage.includes("someone")
    ) {
      return res.json({
        success: true,
        reply:
          "Sure. I can arrange for a human representative to assist you.",
        status: "human_requested",
      });
    }

    /**
     * Out-of-scope questions must never be guessed.
     */
    if (isOutOfScope(message)) {
      return res.json({
        success: true,
        grounded: false,
        reply:
          "I don't have enough information in my knowledge base to answer that accurately. I don't want to guess. I can arrange human assistance if you'd like.",
        status: "human_requested",
      });
    }

    /**
     * Handle financial-information objections through the Q2 KB.
     */
    if (isFinancialPrivacyObjection(message)) {
      try {
        const response = await fetch(
          `${KB_URL}/search?q=${encodeURIComponent(message)}`
        );

        if (response.ok) {
          const data = await response.json();
          const topResult = data.results?.[0];

          if (topResult && topResult.score >= 1.0) {
            return res.json({
              success: true,
              grounded: true,
              reply:
                topResult.content +
                " If you'd still prefer, I can arrange human assistance.",
              source: {
                source_id: topResult.source_id,
                title: topResult.title,
                category: topResult.category,
                heading: topResult.heading,
                score: topResult.score,
              },
              status: "collecting_information",
            });
          }
        }
      } catch (error) {
        console.error("Objection KB lookup error:", error);
      }

      return res.json({
        success: true,
        grounded: false,
        reply:
          "I understand your concern. I don't want to guess about financial-information requirements. I can arrange human assistance to explain exactly what information is required and why.",
        status: "human_requested",
      });
    }

    /**
     * Handle other objections using the Q2 knowledge base.
     */
    if (isObjection(message)) {
      try {
        const response = await fetch(
          `${KB_URL}/search?q=${encodeURIComponent(message)}`
        );

        if (response.ok) {
          const data = await response.json();
          const topResult = data.results?.[0];

          if (topResult && topResult.score >= 1.0) {
            return res.json({
              success: true,
              grounded: true,
              reply: topResult.content,
              source: {
                source_id: topResult.source_id,
                title: topResult.title,
                category: topResult.category,
                heading: topResult.heading,
                score: topResult.score,
              },
              status: "collecting_information",
            });
          }
        }
      } catch (error) {
        console.error("Objection KB lookup error:", error);
      }

      return res.json({
        success: true,
        grounded: false,
        reply:
          "I don't have enough information in my knowledge base to answer that accurately. I don't want to guess. I can arrange human assistance if you'd like.",
        status: "human_requested",
      });
    }

    /**
     * Greeting handling.
     *
     * This prevents "Hi" or "Hello" from being stored as the applicant's name.
     */
    if (isGreeting(message) && state.currentField === "applicantName") {
      return res.json({
        success: true,
        reply:
          "Hello! I can help you check your preliminary eligibility for a business loan. May I know your name?",
        status: "collecting_information",
      });
    }

    /**
     * Collect the current field.
     */
    switch (state.currentField) {
      case "applicantName":
        state.data.applicantName = parseName(message);
        state.currentField = "businessName";
        break;

      case "businessName":
        state.data.businessName = message;
        state.currentField = "businessAgeYears";
        break;

      case "businessAgeYears": {
        const match = message.match(/(\d+(?:\.\d+)?)/);
        const value = match ? Number(match[1]) : NaN;

        if (Number.isNaN(value)) {
          return res.json({
            success: true,
            reply:
              "I didn't catch the number of years. Could you please tell me how many years the business has been operating?",
            status: "collecting_information",
          });
        }

        state.data.businessAgeYears = value;

        if (value < 2) {
          const result = qualify(state.data);

          return res.json({
            success: true,
            ...result,
          });
        }

        state.currentField = "applicantAge";
        break;
      }

      case "applicantAge": {
        const match = message.match(/(\d+(?:\.\d+)?)/);
        const value = match ? Number(match[1]) : NaN;

        if (Number.isNaN(value)) {
          return res.json({
            success: true,
            reply: "Could you please provide your age in years?",
            status: "collecting_information",
          });
        }

        state.data.applicantAge = value;

        if (value < 21) {
          const result = qualify(state.data);

          return res.json({
            success: true,
            ...result,
          });
        }

        state.currentField = "businessRegistered";
        break;
      }

      case "businessRegistered": {
        /**
         * Check negative answers FIRST.
         *
         * This prevents "not registered" from being interpreted
         * as true simply because it contains the word "registered".
         */
        if (
          lowerMessage === "no" ||
          lowerMessage === "n" ||
          lowerMessage.includes("not registered") ||
          lowerMessage.includes("isn't registered") ||
          lowerMessage.includes("is not registered") ||
          lowerMessage.includes("unregistered")
        ) {
          state.data.businessRegistered = false;
        } else if (
          lowerMessage === "yes" ||
          lowerMessage === "y" ||
          lowerMessage.includes("registered") ||
          lowerMessage.includes("it is registered")
        ) {
          state.data.businessRegistered = true;
        } else {
          return res.json({
            success: true,
            reply:
              "Please answer yes or no. Is your business currently registered?",
            status: "collecting_information",
          });
        }

        state.currentField = "monthlyTurnover";
        break;
      }

      case "monthlyTurnover": {
        const value = parseIndianAmount(message);

        if (Number.isNaN(value)) {
          return res.json({
            success: true,
            reply:
              "Could you please provide your approximate monthly turnover in INR, for example 5 lakh?",
            status: "collecting_information",
          });
        }

        state.data.monthlyTurnover = value;

        if (value < 300000) {
          const result = qualify(state.data);

          return res.json({
            success: true,
            ...result,
          });
        }

        state.currentField = "requestedAmount";
        break;
      }

      case "requestedAmount": {
        const value = parseIndianAmount(message);

        if (Number.isNaN(value)) {
          return res.json({
            success: true,
            reply:
              "Could you please provide the approximate loan amount you are looking for in INR, for example 10 lakh?",
            status: "collecting_information",
          });
        }

        state.data.requestedAmount = value;

        if (value < 200000 || value > 2500000) {
          const result = qualify(state.data);

          return res.json({
            success: true,
            ...result,
          });
        }

        state.currentField = "intendedUse";
        break;
      }

      case "intendedUse":
        state.data.intendedUse = message;
        state.currentField = "willingToProvideDocuments";
        break;

      case "willingToProvideDocuments":
        if (
          lowerMessage === "yes" ||
          lowerMessage === "y" ||
          lowerMessage.includes("yes,") ||
          lowerMessage.includes("yes ") ||
          lowerMessage.includes("willing") ||
          lowerMessage.includes("happy to provide") ||
          lowerMessage.includes("can provide")
        ) {
          state.data.willingToProvideDocuments = true;
        } else if (
          lowerMessage === "no" ||
          lowerMessage === "n" ||
          lowerMessage.includes("not willing") ||
          lowerMessage.includes("don't want to provide") ||
          lowerMessage.includes("do not want to provide") ||
          lowerMessage.includes("cannot provide") ||
          lowerMessage.includes("can't provide")
        ) {
          state.data.willingToProvideDocuments = false;
        } else {
          return res.json({
            success: true,
            reply:
              "Please answer yes or no. Would you be willing to provide the required business and financial documents?",
            status: "collecting_information",
          });
        }

        state.currentField = "complete";
        break;

      case "complete":
        break;
    }

    /**
     * Ask the next question.
     */
    if (state.currentField !== "complete") {
      const next = getNextQuestion(state);

      return res.json({
        success: true,
        ...next,
      });
    }

    /**
     * Final qualification.
     */
    const result = qualify(state.data);

    return res.json({
      success: true,
      ...result,
      collectedData: state.data,
    });
  } catch (error) {
    console.error("Chat error:", error);

    res.status(500).json({
      success: false,
      error: "Conversation processing failed.",
    });
  }
});

app.post("/unsupported", (_req, res) => {
  res.json({
    success: true,
    ...unsupportedQuestion(),
  });
});

app.post("/human", (_req, res) => {
  res.json({
    success: true,
    ...requestHuman(),
  });
});

app.listen(PORT, () => {
  console.log(`Q1 Voice Agent API running on http://localhost:${PORT}`);
  console.log(`Connected KB: ${KB_URL}`);
});