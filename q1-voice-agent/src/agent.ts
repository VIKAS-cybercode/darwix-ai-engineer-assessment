export type QualificationData = {
  applicantName?: string;
  businessName?: string;
  businessAgeYears?: number;
  applicantAge?: number;
  businessRegistered?: boolean;
  monthlyTurnover?: number;
  requestedAmount?: number;
  intendedUse?: string;
  willingToProvideDocuments?: boolean;
};

export type AgentResult = {
  reply: string;
  status:
    | "collecting_information"
    | "preliminarily_eligible"
    | "needs_more_information"
    | "not_preliminarily_eligible"
    | "human_requested";
};

export function qualify(data: QualificationData): AgentResult {
  if (data.applicantAge !== undefined && data.applicantAge < 21) {
    return {
      reply:
        "Based on the information you've provided, the applicant needs to be at least 21 years old for preliminary eligibility.",
      status: "not_preliminarily_eligible",
    };
  }

  if (data.businessAgeYears !== undefined && data.businessAgeYears < 2) {
    return {
      reply:
        "The business needs at least 2 years of operating history for preliminary eligibility.",
      status: "not_preliminarily_eligible",
    };
  }

  if (
    data.monthlyTurnover !== undefined &&
    data.monthlyTurnover < 300000
  ) {
    return {
      reply:
        "The preliminary eligibility criteria require an average monthly business turnover of at least INR 3 lakh.",
      status: "not_preliminarily_eligible",
    };
  }

  if (
    data.requestedAmount !== undefined &&
    (data.requestedAmount < 200000 || data.requestedAmount > 2500000)
  ) {
    return {
      reply:
        "The available business-loan range in this demonstration is INR 2 lakh to INR 25 lakh.",
      status: "not_preliminarily_eligible",
    };
  }

  const requiredFields = [
    data.applicantName,
    data.businessName,
    data.businessAgeYears,
    data.applicantAge,
    data.businessRegistered,
    data.monthlyTurnover,
    data.requestedAmount,
    data.intendedUse,
    data.willingToProvideDocuments,
  ];

  if (requiredFields.some((value) => value === undefined)) {
    return {
      reply:
        "I need a few more details before I can assess preliminary eligibility.",
      status: "needs_more_information",
    };
  }

  if (data.willingToProvideDocuments === false) {
    return {
      reply:
        "The application process requires supporting business and financial documents. I can arrange human assistance if you'd like to discuss the requirements.",
      status: "needs_more_information",
    };
  }

  return {
    reply:
      "Based on the information provided, the applicant appears preliminarily eligible. This is not a final approval; the application remains subject to review.",
    status: "preliminarily_eligible",
  };
}

export function unsupportedQuestion(): AgentResult {
  return {
    reply:
      "I don't have enough information in my knowledge base to answer that accurately. I don't want to guess. I can arrange human assistance if you'd like.",
    status: "human_requested",
  };
}

export function requestHuman(): AgentResult {
  return {
    reply:
      "Sure. I can arrange for a human representative to assist you.",
    status: "human_requested",
  };
}
export type ConversationState = {
  data: QualificationData;
  currentField:
    | "applicantName"
    | "businessName"
    | "businessAgeYears"
    | "applicantAge"
    | "businessRegistered"
    | "monthlyTurnover"
    | "requestedAmount"
    | "intendedUse"
    | "willingToProvideDocuments"
    | "complete";
};

export function getNextQuestion(
  state: ConversationState
): AgentResult {
  const { data } = state;

  if (!data.applicantName) {
    return {
      reply: "May I know your name?",
      status: "collecting_information",
    };
  }

  if (!data.businessName) {
    return {
      reply: "What is the name of your business?",
      status: "collecting_information",
    };
  }

  if (data.businessAgeYears === undefined) {
    return {
      reply: "How many years has your business been operating?",
      status: "collecting_information",
    };
  }

  if (data.applicantAge === undefined) {
    return {
      reply: "May I know your age?",
      status: "collecting_information",
    };
  }

  if (data.businessRegistered === undefined) {
    return {
      reply:
        "Is your business currently registered?",
      status: "collecting_information",
    };
  }

  if (data.monthlyTurnover === undefined) {
    return {
      reply:
        "What is your average monthly business turnover in INR?",
      status: "collecting_information",
    };
  }

  if (data.requestedAmount === undefined) {
    return {
      reply:
        "Approximately how much business-loan funding are you looking for?",
      status: "collecting_information",
    };
  }

  if (!data.intendedUse) {
    return {
      reply:
        "What would you mainly use the loan for?",
      status: "collecting_information",
    };
  }

  if (data.willingToProvideDocuments === undefined) {
    return {
      reply:
        "Would you be willing to provide the required business and financial documents during the application process?",
      status: "collecting_information",
    };
  }

  return {
    reply:
      "Thank you. I have all the information needed for a preliminary eligibility check.",
    status: "collecting_information",
  };
}