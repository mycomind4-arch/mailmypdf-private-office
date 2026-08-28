import { createFileRoute } from "@tanstack/react-router";
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Eye,
  Scale,
  Calendar,
  Lock,
  Search,
} from "lucide-react";
import { WorkflowAuthorityPage, type AuthoritySection, type IntakeField } from "@/components/workflow-authority-page";
import { workflowProfiles } from "@/domain/workflow-profiles";

export const Route = createFileRoute("/workflows/estate-legacy-document-organizer")({
  head: () => ({
    meta: [
      { title: "Estate & Legacy Document Organizer — AI Document Review | Private Office" },
      { name: "description", content: "Organize wills, trusts, powers of attorney, health directives, deeds, beneficiary records, insurance documents, and related estate files. Private Office uses AI to extract facts, build a chronology, flag document gaps and inconsistencies, and prepare a review-ready legacy record." },
      { name: "robots", content: "index,follow" },
      { property: "og:title", content: "Estate & Legacy Document Organizer — Private Office" },
      { property: "og:description", content: "Use AI to organize estate and legacy documents into a structured private-office record with facts, chronology, evidence, gaps, and professional-review questions." },
    ],
  }),
  component: () => (
    <WorkflowAuthorityPage
      workflowId="estate-legacy-document-organizer"
      authoritySections={authoritySections}
      intakeFields={intakeFields}
    />
  ),
});

const profile = workflowProfiles["estate-legacy-document-organizer"];

const authoritySections: AuthoritySection[] = [
  {
    icon: FileText,
    title: "Overview",
    content:
      "The Estate & Legacy Document Organizer turns a collection of estate and legacy records into one structured matter file. It can organize wills, trusts, powers of attorney, health directives, deeds, beneficiary records, insurance documents, business records, and related correspondence; extract factual information with source provenance; build a chronology; flag possible missing or conflicting information; and prepare a concise question set for an attorney, fiduciary, tax professional, or other adviser. It does not decide what a document legally means or whether a plan is legally valid.",
  },
  {
    icon: CheckCircle2,
    title: "When to use this workflow",
    items: [
      "You have estate-planning documents spread across multiple files or folders",
      "You want a current inventory before meeting with an attorney or adviser",
      "You need to organize documents after a death before a professional handoff",
      "You want to compare documents across dates and identify possible changes",
      "You need a clear record of deeds, beneficiary records, insurance policies, and other supporting documents",
      "You want AI to surface missing information, inconsistent names, dates, or document references for review",
      "You need a professional-ready summary of what documents exist and what questions remain",
    ],
  },
  {
    icon: AlertTriangle,
    title: "When not to use this workflow",
    items: [
      "You need a lawyer to draft or revise a will, trust, power of attorney, or other legal instrument",
      "You need a legal determination about beneficiary rights, document validity, or fiduciary duties",
      "You need tax planning or tax-return advice",
      "You need investment or asset-allocation advice",
      "You are in active estate litigation or a court proceeding and need legal representation",
    ],
  },
  {
    icon: Lock,
    title: "Privacy and data minimization",
    content:
      "Estate records can contain highly sensitive family, property, and financial information. Provide only what is needed for the matter. Do not provide passwords, authentication codes, full bank account numbers, Social Security numbers, or other credentials. Where a financial reference is useful, prefer a masked identifier such as 'account ending 4821.' The workflow is designed to reason from documents and declared facts rather than request secrets.",
  },
  {
    icon: Search,
    title: "What the AI looks for",
    items: [
      "Document identity, date, parties, named roles, and source references",
      "Potential changes between older and newer documents",
      "Missing or unexpectedly absent document categories",
      "Inconsistent names, addresses, dates, ownership references, or beneficiary references",
      "Relationships among documents, people, assets, and events",
      "Dates that may deserve professional verification without treating them as legal deadlines",
      "Questions that would make a professional review more efficient",
    ],
  },
  {
    icon: Scale,
    title: "Documents to gather",
    items: profile.evidenceRequirements,
  },
  {
    icon: Calendar,
    title: "Dates and document history",
    content:
      "The workflow records dates from the source material and distinguishes document dates, event dates, and asserted deadlines where possible. A date is not treated as proof of legal validity, tax treatment, beneficiary status, or required action. Important date observations remain tied to their source so they can be checked against the original document and the advice of an appropriate professional.",
  },
  {
    icon: ShieldCheck,
    title: "Evidence checklist",
    items: [
      "Current and prior wills or testamentary documents, when applicable",
      "Trust instruments, amendments, restatements, and schedules, when applicable",
      "Powers of attorney and health-care directives",
      "Beneficiary designation confirmations and insurance records",
      "Real-property deeds and ownership records",
      "Business or entity ownership documents",
      "Relevant account or asset statements using masked identifiers when possible",
      "Important family, fiduciary, court, and professional correspondence",
      "Prior planning summaries and attorney correspondence when available",
    ],
  },
  {
    icon: Eye,
    title: "How the workflow works",
    items: [
      "Intake: Identify the document owner, the matter type, the review date, and the known jurisdiction",
      "Documents: Upload the estate and legacy records you want organized",
      "AI organization: Classify documents and extract structured facts with provenance",
      "Consistency review: Surface possible conflicts, duplicate versions, missing categories, and unanswered questions",
      "Timeline: Build a chronological record from source dates and events",
      "Evidence map: Connect important facts to the documents that support them",
      "Review brief: Produce a structured matter summary and professional-review question set",
      "Correspondence: Prepare a professional handoff or information request when needed",
      "Human review: You review the record and source documents before relying on any observation",
      "Mailing: When correspondence is authorized, approval and delivery controls remain in force",
    ],
  },
  {
    icon: AlertTriangle,
    title: "Important limitations",
    content:
      "AI observations are assistive. A flagged inconsistency is not necessarily an error, and a missing category does not prove that a document is required. Private Office does not determine whether a will or trust is valid, whether a beneficiary designation controls, whether a document has been revoked, how taxes should be handled, or what a court would decide. Those questions should be resolved by the appropriate qualified professional.",
  },
  {
    icon: Mail,
    title: "Mailing, tracking, and proof",
    content:
      "When the matter calls for correspondence, Private Office can turn the reviewed information into a professional document for the designated recipient and maintain the same explicit human-approval, mailing, tracking, and proof controls used throughout Private Office.",
  },
];

const intakeFields: IntakeField[] = [
  { key: "documentOwnerName", label: "Document owner name *", placeholder: "Jane B. Smith" },
  { key: "documentSetType", label: "Document set or matter type *", placeholder: "Estate planning review / Estate administration / Family legacy records" },
  { key: "keyEventDate", label: "Key event or review date *", placeholder: "August 28, 2026 / Date of death / Annual review date" },
  { key: "knownJurisdiction", label: "Known jurisdiction *", placeholder: "State of California / Unknown" },
  { key: "planningContext", label: "What prompted this review?", placeholder: "Annual review, new property purchase, death in the family, upcoming attorney meeting, trustee transition...", type: "textarea", rows: 3 },
  { key: "knownConcerns", label: "Known concerns or questions", placeholder: "Possible outdated beneficiary designation, different addresses in two documents, missing trust amendment...", type: "textarea", rows: 4 },
];
