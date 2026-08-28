import { workflowProfiles, type WorkflowProfile } from "./workflow-profiles";

const executiveCrisisProfile: WorkflowProfile = {
  id: "executive-crisis-response",
  slug: "executive-crisis-response",
  family: "Executive & High-Stakes",
  primaryKeyword: "executive crisis response",
  supportingKeywords: [
    "executive crisis letter",
    "executive demand letter response",
    "executive allegation response",
    "regulatory inquiry response letter",
    "reputation dispute documentation",
    "high stakes business correspondence",
    "crisis response document organizer",
  ],
  searchIntent: "commercial",
  problem:
    "An executive, founder, professional, or high-value individual is facing a time-sensitive and sensitive matter requiring disciplined document intake, factual separation, evidence preservation, chronology, risk identification, and controlled written response — without treating unverified allegations as facts.",
  outcome:
    "Create a structured crisis matter record that separates verified facts, reported allegations, disputed assertions, open questions, deadlines, evidence, and response objectives; then generate professional correspondence from the controlled record for human review.",
  recipientRole: "counterparty, institution, regulator, employer, counsel, or other identified recipient",
  requiredFacts: [
    "matter subject",
    "primary organization or counterparty",
    "material event date",
    "current matter status",
    "executive's factual account",
    "reported allegation or demand",
  ],
  evidenceRequirements: [
    "incoming letter, notice, demand, or inquiry",
    "relevant contract or agreement",
    "executive or organization correspondence",
    "supporting emails and messages",
    "meeting notes or contemporaneous records",
    "financial or transaction records when relevant",
    "policies, procedures, or institutional documents when relevant",
    "public statements or published material when relevant",
    "documents supporting the executive's factual account",
  ],
  deadlinePolicy:
    "Capture every explicit date, response deadline, meeting date, notice period, hearing date, or escalation date found in supplied materials. Distinguish documented deadlines from potential legal, regulatory, contractual, employment, or procedural deadlines that require verification. Never invent a deadline. Any potential limitation period or mandatory response timeframe should be surfaced for professional review.",
  objectivePrompt:
    "What outcome do you want this response to achieve — acknowledge and preserve the record, request clarification, correct factual inaccuracies, provide requested documents, seek additional time, communicate a position, or another documented objective?",
  draftSubject: "Executive Matter Correspondence",
  disclaimer: "Private Office provides document preparation, evidence organization, and mailing assistance. It is not a law firm, public-relations firm, regulator, employer, investigator, or security service. It does not provide legal advice, crisis counsel, representation, determine whether allegations are true, or guarantee any outcome. Human review is required before consequential correspondence is sent.",
  pricing: {
    preparationFee: 49.99,
    includedResponsePages: 5,
    responsePagePrice: 0.55,
    supportingPagePrice: 0.3,
    standardMail: 5.49,
    certifiedMail: 12.99,
    certifiedReturnReceipt: 18.99,
    registeredMail: 24.99,
  },
};

Object.assign(workflowProfiles, {
  "executive-crisis-response": executiveCrisisProfile,
});
