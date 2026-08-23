import type { WorkflowId } from "./workflows";

export interface WorkflowProfile {
  id: WorkflowId;
  slug: string;
  family: string;
  primaryKeyword: string;
  supportingKeywords: string[];
  searchIntent: "transactional" | "commercial" | "problem";
  problem: string;
  outcome: string;
  recipientRole: string;
  requiredFacts: string[];
  evidenceRequirements: string[];
  deadlinePolicy: string;
  objectivePrompt: string;
  draftSubject: string;
  disclaimer: string;
  pricing: {
    preparationFee: number;
    includedResponsePages: number;
    responsePagePrice: number;
    supportingPagePrice: number;
    standardMail: number;
    certifiedMail: number;
    certifiedReturnReceipt?: number;
    registeredMail?: number;
  };
}

const privateOfficeDisclaimer =
  "Private Office provides document preparation, evidence organization, and mailing assistance. It is not a law firm and does not provide legal advice, legal representation, or guarantee any outcome. You remain responsible for the facts and decisions in your matter.";

export const workflowProfiles: Record<WorkflowId, WorkflowProfile> = {
  "contractor-dispute": {
    id: "contractor-dispute",
    slug: "contractor-dispute",
    family: "Property",
    primaryKeyword: "contractor dispute letter",
    supportingKeywords: [
      "contractor dispute letter template",
      "construction defect notice",
      "letter to contractor for defective work",
      "contractor demand letter",
      "how to document contractor dispute",
    ],
    searchIntent: "commercial",
    problem:
      "A contractor performed defective, incomplete, or unauthorized work, or disputes have arisen over billing, scope, or performance under a construction or improvement agreement.",
    outcome:
      "Create a documented contractor dispute letter identifying the property, the contractor, the agreement, the defects or issues, the relevant dates, the evidence, and the requested resolution.",
    recipientRole: "contractor",
    requiredFacts: [
      "property address",
      "contractor name",
      "agreement reference",
      "dispute description",

    ],
    evidenceRequirements: [
      "contract or written agreement",
      "invoices or billing records",
      "payment records or receipts",
      "photos of defects or incomplete work",
      "correspondence with contractor",
      "permits or inspection reports when relevant",
    ],
    deadlinePolicy:
      "Capture all dates visible in the agreement, invoices, and correspondence. Flag any stated deadlines for cure, response, or filing. Do not invent a statutory deadline — surface date facts for human review.",
    objectivePrompt:
      "What specific resolution are you requesting from the contractor — repair, refund, completion, correction, or other action?",
    draftSubject: "Notice of Contractor Dispute",
    disclaimer: privateOfficeDisclaimer,
    pricing: {
      preparationFee: 24.99,
      includedResponsePages: 4,
      responsePagePrice: 0.45,
      supportingPagePrice: 0.25,
      standardMail: 5.49,
      certifiedMail: 12.99,
      certifiedReturnReceipt: 18.99,
      registeredMail: 24.99,
    },
  },
  "property-insurance-claim": {
    id: "property-insurance-claim",
    slug: "property-insurance-claim",
    family: "Property",
    primaryKeyword: "property insurance claim letter",
    supportingKeywords: [
      "insurance claim dispute letter",
      "denied insurance claim letter",
      "insurance claim reconsideration letter",
      "insurance supplemental claim letter",
      "insurance claim underpayment",
      "property damage insurance claim",
    ],
    searchIntent: "commercial",
    problem:
      "A property owner's insurance claim has been denied, underpaid, delayed, or disputed by the insurer — or a supplemental claim is needed for additional damage or repair costs discovered after the initial claim.",
    outcome:
      "Create a documented property insurance claim letter identifying the property, the policy, the claim, the damage, the insurer's position, the evidence, the chronology, and the requested resolution.",
    recipientRole: "insurer",
    requiredFacts: [
      "property address",
      "insurer name",
      "claim number",
      "date of loss",
      "description of damage",
      "insurer position",
    ],
    evidenceRequirements: [
      "policy documents or declarations page",
      "claim correspondence from insurer",
      "denial letter or explanation of benefits",
      "payment statements or claim summaries",
      "repair estimates or contractor bids",
      "photographs of property damage",
      "inspection reports or engineer reports",
      "receipts for repairs or temporary mitigation",
      "prior communications with insurer",
    ],
    deadlinePolicy:
      "Insurance claim timelines are governed by the policy, state law, and the claim's procedural posture. Capture all dates visible in correspondence, denial letters, and policy documents. Distinguish known deadlines explicitly stated in policy or correspondence from potential deadlines that depend on jurisdiction or policy provisions. Flag any stated response deadlines or proof-of-loss requirements as known deadlines. Flag any limitation periods or statutory deadlines as potential deadlines requiring verification. Do not invent a statutory deadline. Potential deadline identified — verify against the applicable policy and jurisdiction. Surface all date facts for human review.",
    objectivePrompt:
      "What specific resolution are you requesting from the insurer — reconsideration of denial, supplemental payment, additional inspection, written explanation, or other documented resolution?",
    draftSubject: "Property Insurance Claim Correspondence",
    disclaimer: privateOfficeDisclaimer,
    pricing: {
      preparationFee: 29.99,
      includedResponsePages: 4,
      responsePagePrice: 0.45,
      supportingPagePrice: 0.25,
      standardMail: 5.49,
      certifiedMail: 12.99,
      certifiedReturnReceipt: 18.99,
      registeredMail: 24.99,
    },
  },
};
