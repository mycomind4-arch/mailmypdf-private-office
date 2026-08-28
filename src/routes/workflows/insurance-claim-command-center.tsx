import { createFileRoute } from "@tanstack/react-router";
import { FileText, ShieldCheck, CheckCircle2, AlertTriangle, Mail, Eye, Scale, Calendar, Brain, ListChecks } from "lucide-react";
import { WorkflowAuthorityPage, type AuthoritySection, type IntakeField } from "@/components/workflow-authority-page";
import { workflowProfiles } from "@/domain/workflow-profiles";

export const Route = createFileRoute("/workflows/insurance-claim-command-center")({
  head: () => ({
    meta: [
      { title: "Insurance Claim Command Center — Organize, Analyze & Respond | Private Office" },
      { name: "description", content: "Use AI to organize a complex insurance claim into a verified matter record with documents, facts, evidence, chronology, deadlines, disputed issues, risks, strategy, and professional correspondence." },
      { name: "robots", content: "index,follow" },
      { property: "og:title", content: "Insurance Claim Command Center | Private Office" },
      { property: "og:description", content: "AI-assisted insurance claim organization, evidence analysis, chronology, risk review, strategy, and professional correspondence." },
    ],
  }),
  component: () => <WorkflowAuthorityPage workflowId="insurance-claim-command-center" authoritySections={authoritySections} intakeFields={intakeFields} />,
});

const profile = workflowProfiles["insurance-claim-command-center"];

const authoritySections: AuthoritySection[] = [
  { icon: FileText, title: "Overview", content: "The Insurance Claim Command Center is designed for complex or high-value claims where the important information is scattered across policies, estimates, photographs, adjuster communications, payments, reports, invoices, and prior correspondence. Instead of treating the matter as one letter, Private Office builds a structured claim record so you can see what is documented, what is missing, what conflicts, what dates matter, and what communication may be appropriate." },
  { icon: Brain, title: "AI-assisted matter intelligence", items: [
    "Classifies and organizes uploaded claim materials",
    "Extracts candidate facts and keeps them tied to source material",
    "Builds a chronology from dates found across documents",
    "Surfaces discrepancies, conflicting amounts, and unanswered questions",
    "Maps evidence to important factual assertions",
    "Separates documented deadlines from potential deadlines that require verification",
    "Produces risk and strategy observations as reviewable AI-assisted findings",
    "Generates correspondence from the verified matter record rather than inventing facts",
  ] },
  { icon: CheckCircle2, title: "When to use this workflow", items: [
    "A large or high-value claim has become difficult to keep organized",
    "You have many claim documents and need one coherent matter record",
    "The insurer's position has changed or is difficult to reconcile",
    "You need to understand what evidence is missing before responding",
    "You need a timeline of loss, reporting, inspection, payment, and correspondence events",
    "You need to document an underpayment, denial, delay, supplemental loss, or unresolved issue",
    "You want a professional communication prepared from the claim record",
  ] },
  { icon: AlertTriangle, title: "When not to rely on this workflow alone", items: [
    "You need emergency mitigation or immediate safety action — address the emergency first",
    "You have been served with a lawsuit, subpoena, or other litigation document — obtain qualified legal advice promptly",
    "You need a definitive legal opinion on coverage, liability, or a limitation period",
    "You need the system to determine whether a claim is legally valid or guaranteed to be paid",
  ] },
  { icon: Scale, title: "Documents to gather", items: profile.evidenceRequirements },
  { icon: Calendar, title: "Deadlines and timing", content: profile.deadlinePolicy },
  { icon: ListChecks, title: "What the AI reviews", items: [
    "Identity and claim references across documents",
    "Dates, chronology, and stated response windows",
    "Loss description and claimed damage",
    "Estimates, invoices, payments, and unexplained financial differences",
    "Insurer positions, requests, denials, reservations, and status statements",
    "Evidence gaps and duplicated or conflicting records",
    "Questions that require human verification or professional advice",
  ] },
  { icon: Eye, title: "How the workflow works", items: [
    "Intake: identify the insured, insurer, claim, policy, loss, status, and objective",
    "Documents: upload the claim file and supporting materials",
    "AI analysis: extract, classify, reconcile, and organize information",
    "Facts: review source-backed facts and unresolved conflicts",
    "Evidence: identify what supports the claim and what is missing",
    "Timeline: assemble dated events with provenance",
    "Risk & strategy: review AI-assisted observations and possible next steps",
    "Draft: generate professional correspondence from the reviewed matter record",
    "Human review: approve or edit before anything consequential is sent",
    "Delivery: mail through the existing Private Office fulfillment process when selected",
  ] },
  { icon: ShieldCheck, title: "Trust and review controls", items: [
    "AI output is treated as an aid, not as an authoritative finding",
    "Source-backed facts remain distinguishable from assumptions or unresolved items",
    "Conflicts are surfaced instead of silently overwritten",
    "Potential deadlines are not presented as confirmed legal deadlines",
    "Draft correspondence requires human review before mailing",
    "Approval and mailing controls preserve the distinction between drafting and authorized action",
  ] },
  { icon: Mail, title: "Mailing, tracking, and proof", content: "After review and explicit approval, the final correspondence can use Private Office mailing and tracking capabilities. The workflow is designed so the analysis workspace remains useful even when no letter is sent, while a mailed response can remain connected to the underlying matter record." },
];

const intakeFields: IntakeField[] = [
  { key: "insuredName", label: "Insured or claimant name *", placeholder: "Jane Smith" },
  { key: "insurerName", label: "Insurance company name *", placeholder: "ABC Insurance Company" },
  { key: "claimNumber", label: "Claim number *", placeholder: "CLM-2026-001234" },
  { key: "policyReference", label: "Policy number or reference *", placeholder: "POL-123456" },
  { key: "dateOfLoss", label: "Date of loss *", placeholder: "March 15, 2026" },
  { key: "lossDescription", label: "Loss or incident description *", placeholder: "Describe what happened, the affected property or loss, and the currently known scope...", type: "textarea", rows: 4 },
  { key: "claimStatus", label: "Current claim status *", placeholder: "Open, denied, partially paid, under investigation, delayed, supplemental, disputed, etc.", type: "textarea", rows: 3 },
  { key: "primaryClaimObjective", label: "Primary claim objective *", placeholder: "What do you want to accomplish with this matter?", type: "textarea", rows: 3 },
];
