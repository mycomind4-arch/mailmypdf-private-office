import { createFileRoute } from "@tanstack/react-router";
import { FileText, ShieldCheck, CheckCircle2, AlertTriangle, Eye, Calendar, Lock, Scale } from "lucide-react";
import { WorkflowAuthorityPage, type AuthoritySection, type IntakeField } from "@/components/workflow-authority-page";
import { workflowProfiles } from "@/domain/workflow-profiles";

export const Route = createFileRoute("/workflows/major-purchase-due-diligence")({
  head: () => ({
    meta: [
      { title: "Major Purchase Due Diligence — AI Document & Risk Review | Private Office" },
      { name: "description", content: "Organize a high-value purchase with AI-assisted document review, evidence mapping, chronology, discrepancies, deadlines, risks, and a decision brief before you commit." },
      { name: "robots", content: "index,follow" },
      { property: "og:title", content: "Major Purchase Due Diligence — Private Office" },
      { property: "og:description", content: "Turn a complex purchase file into a structured, fact-based decision brief with AI-assisted document organization and review." },
    ],
  }),
  component: () => <WorkflowAuthorityPage workflowId="major-purchase-due-diligence" authoritySections={authoritySections} intakeFields={intakeFields} />,
});

const profile = workflowProfiles["major-purchase-due-diligence"];

const authoritySections: AuthoritySection[] = [
  { icon: FileText, title: "Overview", content: "A major purchase can involve dozens of documents that are easy to review separately but difficult to understand as one transaction. Private Office brings the purchase file together and uses AI-assisted analysis to organize documented facts, obligations, costs, contingencies, dates, discrepancies, missing records, and unresolved questions into a review-ready decision brief. It does not decide whether a purchase is good, safe, fairly valued, legally enforceable, or suitable for you." },
  { icon: CheckCircle2, title: "When to use this workflow", items: [
    "You are evaluating a property or other high-value purchase",
    "You are reviewing a business acquisition or major equipment purchase",
    "The seller has supplied multiple agreements, disclosures, estimates, and representations",
    "You need one consolidated view of price, obligations, contingencies, and deadlines",
    "You want discrepancies across documents surfaced before signing",
    "You need a list of missing documents and questions for professionals",
    "You want a written record of what was reviewed before committing",
  ]},
  { icon: AlertTriangle, title: "When not to rely on this workflow alone", items: [
    "You need a licensed inspection, appraisal, title opinion, legal opinion, tax analysis, or financing approval",
    "You need investment advice or a determination that an asset is financially suitable",
    "You are being pressured to sign immediately and need professional advice on your rights",
    "The transaction involves litigation, suspected fraud, or a material undisclosed issue",
  ]},
  { icon: Scale, title: "Documents to gather", items: profile.evidenceRequirements },
  { icon: Calendar, title: "Deadlines and timing", content: "The system captures dates stated in purchase documents, inspection materials, financing documents, delivery schedules, contingencies, warranty terms, and correspondence. It distinguishes documented deadlines from inferred or potential deadlines and does not invent contractual or legal timing requirements. Material timing items are surfaced for human verification before commitment." },
  { icon: Lock, title: "Sensitive information", content: "Use the minimum information needed to document the transaction. Do not provide passwords, authentication codes, full payment-card numbers, online-banking credentials, or unnecessary government identifiers. For financial accounts, use masked references where possible." },
  { icon: Eye, title: "How the AI workflow works", items: [
    "Ingest: collect the proposal, agreements, disclosures, reports, quotes, correspondence, and supporting records",
    "Classify: identify document roles and transaction components",
    "Extract: capture parties, amounts, dates, obligations, contingencies, representations, and document references",
    "Reconcile: surface conflicting amounts, dates, terms, descriptions, or representations rather than silently choosing one",
    "Evidence: connect material statements to the documents that support them and identify missing support",
    "Timeline: build the transaction chronology and surface time-sensitive items",
    "Risk view: organize documented concerns, unknowns, dependencies, and unresolved issues",
    "Decision brief: summarize what is documented, what remains uncertain, and what should be verified before commitment",
    "Correspondence: prepare focused questions or requests for clarification when appropriate",
    "Human review: you decide what to do and approve any consequential communication",
  ]},
  { icon: ShieldCheck, title: "What makes the analysis trustworthy", items: [
    "User-provided facts remain distinct from AI interpretation",
    "Conflicting source material is surfaced rather than overwritten",
    "Dates and obligations are tied to source material when available",
    "Missing evidence is identified explicitly",
    "Potential concerns are presented as review items, not professional conclusions",
    "No consequential correspondence is sent without explicit human approval",
  ]},
];

const intakeFields: IntakeField[] = [
  { key: "purchaseTarget", label: "Purchase target *", placeholder: "Residential property / business / aircraft / vehicle / equipment / other high-value asset" },
  { key: "sellerOrCounterparty", label: "Seller or counterparty *", placeholder: "Seller, dealer, broker, vendor, or transaction counterparty" },
  { key: "proposedPrice", label: "Proposed price *", placeholder: "$850,000" },
  { key: "purchaseType", label: "Purchase type *", placeholder: "Real estate / business acquisition / vehicle / equipment / other" },
  { key: "transactionStatus", label: "Current transaction status *", placeholder: "Offer stage / under contract / inspection period / awaiting financing / negotiation / other" },
  { key: "knownConcern", label: "Known concern or decision point *", placeholder: "What is making you pause or what do you most want the document review to clarify?", type: "textarea", rows: 3 },
];
