import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Calendar, CheckCircle2, Eye, FileText, Lock, Mail, ShieldCheck, Scale } from "lucide-react";
import { WorkflowAuthorityPage, type AuthoritySection, type IntakeField } from "@/components/workflow-authority-page";
import { workflowProfiles } from "@/domain/workflow-profiles";

export const Route = createFileRoute("/workflows/high-value-asset-protection")({
  head: () => ({
    meta: [
      { title: "High-Value Asset Protection & Documentation | Private Office" },
      { name: "description", content: "Organize high-value asset ownership, custody, valuation, insurance, financing, condition, and dispute records with AI-assisted chronology, evidence mapping, risk review, and controlled correspondence." },
      { name: "robots", content: "index,follow" },
      { property: "og:title", content: "High-Value Asset Protection — Private Office" },
      { property: "og:description", content: "Build a private, evidence-backed record for valuable property and assets with AI-assisted document organization, risk review, chronology, and correspondence." },
    ],
  }),
  component: () => <WorkflowAuthorityPage workflowId="high-value-asset-protection" authoritySections={authoritySections} intakeFields={intakeFields} />,
});

const profile = workflowProfiles["high-value-asset-protection"];

const authoritySections: AuthoritySection[] = [
  { icon: FileText, title: "Overview", content: "High-Value Asset Protection is a documentation and intelligence workflow for valuable property that may require a clean ownership, custody, condition, insurance, valuation, or dispute record. Private Office uses your supplied documents to organize facts, dates, evidence, discrepancies, unresolved questions, and action items so you have a controlled record for your own decisions and professional review." },
  { icon: CheckCircle2, title: "When to use this workflow", items: [
    "You acquired a valuable asset and want a consolidated evidence file",
    "Ownership, custody, title, registration, or transfer records are scattered across documents",
    "You are documenting a loss, damage event, or condition change",
    "Insurance, financing, appraisal, or counterparty records need reconciliation",
    "A dispute or claim has emerged around a valuable asset",
    "You need a rapid, organized record before speaking with an attorney, insurer, lender, appraiser, or other professional",
    "You want a repeatable private record for ongoing maintenance and document updates",
  ]},
  { icon: AlertTriangle, title: "When not to use this workflow", items: [
    "You need a legal opinion about title, ownership, liens, or enforceability",
    "You need an appraisal, investment recommendation, insurance coverage opinion, or security assessment",
    "You are facing an immediate emergency, physical threat, or active theft situation",
    "You need litigation strategy or legal representation",
  ]},
  { icon: Lock, title: "Privacy and data minimization", content: "Use only information necessary to document the asset. Do not provide passwords, authentication codes, private keys, wallet seed phrases, full bank credentials, or other secrets. Mask unnecessary account numbers and identifiers. Keep sensitive records limited to what is needed for the matter." },
  { icon: Scale, title: "Documents to gather", items: profile.evidenceRequirements },
  { icon: Calendar, title: "Deadlines and timing", content: profile.deadlinePolicy },
  { icon: ShieldCheck, title: "What the AI reviews", items: [
    "Facts stated in your documents and intake",
    "Dates and chronology across multiple documents",
    "Potential contradictions or unexplained differences",
    "Missing ownership, custody, insurance, valuation, or transaction records",
    "Evidence supporting important factual assertions",
    "Risks created by missing information or unresolved discrepancies",
    "Action items and questions to take to the appropriate professional",
  ]},
  { icon: Eye, title: "How the workflow works", items: [
    "Intake: Identify the asset, owner or holder, identifiers, location or custody, and the immediate objective",
    "Documents: Upload or provide the records relevant to ownership, value, condition, insurance, financing, custody, and the matter",
    "AI organization: The system extracts facts and dates and organizes the matter into a coherent evidence record",
    "Reconciliation: Inconsistencies and missing information are surfaced rather than silently resolved",
    "Risk review: Potential exposure from documentation gaps, deadlines, or disputed facts is flagged for human review",
    "Strategy: The system organizes practical next steps and professional questions based on the supplied record",
    "Draft: Correspondence can be generated from verified matter facts",
    "Review: You control the final wording and supporting documents",
    "Approval: Consequential mailing remains explicitly human-approved",
  ]},
  { icon: AlertTriangle, title: "Important limitations", content: "An AI-generated finding is not an appraisal, legal conclusion, coverage determination, investment recommendation, or security assessment. When records conflict, Private Office should preserve the conflict and identify what needs to be verified. Professional advice should be obtained for decisions outside document organization and correspondence." },
  { icon: Mail, title: "Mailing, tracking, and proof", content: "When correspondence is appropriate, the final reviewed document can move through the same controlled mailing process used by other Private Office workflows, including explicit approval before consequential mailing and retained delivery evidence." },
];

const intakeFields: IntakeField[] = [
  { key: "assetDescription", label: "Asset description *", placeholder: "1967 Porsche 911 / primary residence / fine art collection / aircraft / business equipment..." },
  { key: "ownerName", label: "Owner or holder name *", placeholder: "Your name or the documented owner/holding entity" },
  { key: "assetReference", label: "Asset identifier or reference *", placeholder: "VIN, serial number, title reference, property address, registration number, inventory ID..." },
  { key: "custodyLocation", label: "Current custody or location *", placeholder: "Private storage facility, residence, dealer, lender, third-party custodian..." },
  { key: "acquisitionDate", label: "Acquisition or transfer date *", placeholder: "June 14, 2024" },
  { key: "knownValue", label: "Known value or valuation reference", placeholder: "Documented purchase price, appraisal date/value, insured value, or leave blank if unknown" },
  { key: "insuranceStatus", label: "Insurance status or reference", placeholder: "Insurer, policy reference, coverage period, claim number, or unknown" },
  { key: "matterDescription", label: "Describe the matter *", placeholder: "What prompted you to organize this asset file? Dispute, loss, sale, financing, insurance issue, custody issue, routine recordkeeping...", type: "textarea", rows: 4 },
  { key: "immediateObjective", label: "Immediate objective *", placeholder: "Create a clean asset record, document a loss, reconcile records, notify a counterparty, preserve evidence, prepare correspondence...", type: "textarea", rows: 3 },
];
