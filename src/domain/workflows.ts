export type WorkflowId = "contractor-dispute" | "property-insurance-claim";

export type WorkflowStep =
  | "intro"
  | "document"
  | "facts"
  | "objective"
  | "analysis"
  | "evidence"
  | "strategy"
  | "draft"
  | "review"
  | "attachments"
  | "recipient"
  | "mailing"
  | "checkout"
  | "submitted";

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
  "secure-ingest",
  "classify",
  "extract",
  "understand",
  "facts-provenance",
  "timeline-deadlines",
  "issues-discrepancies",
  "evidence",
  "authority-research",
  "risk",
  "strategy",
  "draft",
  "validate",
  "blocking-gates",
  "human-review",
  "authorized-mail",
  "track",
  "prove-audit",
];

const STANDARD_STEPS: WorkflowStep[] = [
  "intro",
  "document",
  "facts",
  "objective",
  "analysis",
  "evidence",
  "strategy",
  "draft",
  "review",
  "attachments",
  "recipient",
  "mailing",
  "checkout",
  "submitted",
];

const definitions: Array<
  Omit<WorkflowDefinition, "steps" | "goldStandardStages" | "pipelineArchetypes">
> = [
  {
    id: "contractor-dispute",
    title: "Contractor Dispute",
    description:
      "Prepare a documented contractor dispute letter for defective work, incomplete work, billing disputes, or breach of agreement — with evidence, timeline, and proof of delivery.",
    disclaimer:
      "Private Office provides document preparation and mailing assistance. It is not a law firm and does not provide legal advice or representation.",
    lifecycle: "gold",
  },
  {
    id: "property-insurance-claim",
    title: "Property Insurance Claim",
    description:
      "Document and pursue a property insurance claim — denied claims, underpayments, disputed scope, delayed responses, or supplemental claims — with evidence, chronology, and professional correspondence.",
    disclaimer:
      "Private Office provides document preparation, evidence organization, and mailing assistance. It is not a law firm and does not provide legal advice or representation.",
    lifecycle: "gold",
  },
];

export const workflows: Record<WorkflowId, WorkflowDefinition> =
  Object.fromEntries(
    definitions.map((definition) => [
      definition.id,
      {
        ...definition,
        steps: STANDARD_STEPS,
        goldStandardStages: GOLD_STAGES,
        pipelineArchetypes: ["P06", "P10"],
      },
    ]),
  ) as Record<WorkflowId, WorkflowDefinition>;

export const workflowList: WorkflowDefinition[] = Object.values(workflows);
