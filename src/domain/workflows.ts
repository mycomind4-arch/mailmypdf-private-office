export type WorkflowId = "contractor-dispute" | "property-insurance-claim" | "bank-wire-dispute" | "trust-beneficiary-notice" | "security-deposit-dispute" | "high-value-asset-protection";

export type WorkflowStep =
  | "intro" | "document" | "facts" | "objective" | "analysis" | "evidence" | "strategy" | "draft" | "review" | "attachments" | "recipient" | "mailing" | "checkout" | "submitted";

export type WorkflowLifecycle = "partial" | "executable" | "gold";

export interface WorkflowDefinition {
  id: WorkflowId;
  title: string;
  description: string;
  disclaimer: string;
  steps: WorkflowStep[];
  lifecycle: WorkflowLifecycle;
  goldStandardStages: string[];
  pipelineArchetypes: string[];
}

const GOLD_STAGES = [
  "secure-ingest", "classify", "extract", "understand", "facts-provenance", "timeline-deadlines", "issues-discrepancies", "evidence", "authority-research", "risk", "strategy", "draft", "validate", "blocking-gates", "human-review", "authorized-mail", "track", "prove-audit",
];

const STANDARD_STEPS: WorkflowStep[] = [
  "intro", "document", "facts", "objective", "analysis", "evidence", "strategy", "draft", "review", "attachments", "recipient", "mailing", "checkout", "submitted",
];

const definitions: Array<Omit<WorkflowDefinition, "steps" | "goldStandardStages" | "pipelineArchetypes">> = [
  {
    id: "contractor-dispute",
    title: "Contractor Dispute",
    description: "Prepare a documented contractor dispute letter for defective work, incomplete work, billing disputes, or breach of agreement — with evidence, timeline, and proof of delivery.",
    disclaimer: "Private Office provides document preparation and mailing assistance. It is not a law firm and does not provide legal advice or representation.",
    lifecycle: "gold",
  },
  {
    id: "property-insurance-claim",
    title: "Property Insurance Claim",
    description: "Document and pursue a property insurance claim — denied claims, underpayments, disputed scope, delayed responses, or supplemental claims — with evidence, chronology, and professional correspondence.",
    disclaimer: "Private Office provides document preparation, evidence organization, and mailing assistance. It is not a law firm and does not provide legal advice or legal representation.",
    lifecycle: "gold",
  },
  {
    id: "bank-wire-dispute",
    title: "Bank & Wire Transfer Dispute",
    description: "Document a bank or wire transfer dispute with transaction records, chronology, evidence, and professional correspondence to the financial institution.",
    disclaimer: "Private Office provides document preparation, evidence organization, and mailing assistance. It is not a law firm, bank, regulator, or law enforcement agency and does not provide legal advice or guarantee recovery.",
    lifecycle: "gold",
  },
  {
    id: "trust-beneficiary-notice",
    title: "Trust Beneficiary Notice",
    description: "Document a trust beneficiary matter — information, accounting, distribution status, trustee communication, or documentation submission — with evidence, chronology, and professional correspondence.",
    disclaimer: "Private Office provides document preparation, evidence organization, and mailing assistance. It is not a law firm, fiduciary, trustee, court, or government agency and does not provide legal advice or guarantee any outcome.",
    lifecycle: "gold",
  },
  {
    id: "security-deposit-dispute",
    title: "Security Deposit Dispute",
    description: "Document a security deposit dispute with lease evidence, condition documentation, correspondence, chronology, and professional correspondence to the landlord or property manager.",
    disclaimer: "Private Office provides document preparation, evidence organization, and mailing assistance. It is not a law firm or housing authority and does not provide legal advice or guarantee any outcome.",
    lifecycle: "gold",
  },
  {
    id: "high-value-asset-protection",
    title: "High-Value Asset Protection",
    description: "Organize a high-value asset matter involving ownership records, valuations, insurance, custody, counterparties, incidents, or emerging disputes — then build an evidence-backed risk and action record.",
    disclaimer: "Private Office provides document organization, evidence analysis, and correspondence assistance. It is not a law firm, investment adviser, insurance adviser, appraiser, or security service and does not provide legal, investment, valuation, insurance, or security advice or guarantee any outcome.",
    lifecycle: "gold",
  },
];

export const workflows: Record<WorkflowId, WorkflowDefinition> = Object.fromEntries(
  definitions.map((definition) => [definition.id, {
    ...definition,
    steps: STANDARD_STEPS,
    goldStandardStages: GOLD_STAGES,
    pipelineArchetypes: ["P06", "P10"],
  }]),
) as Record<WorkflowId, WorkflowDefinition>;

export const workflowList: WorkflowDefinition[] = Object.values(workflows);
