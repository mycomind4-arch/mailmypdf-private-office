import { createFileRoute } from "@tanstack/react-router";
import { FileText, ShieldCheck, CheckCircle2, AlertTriangle, Mail, Eye, Calendar, Lock } from "lucide-react";
import { WorkflowAuthorityPage, type AuthoritySection, type IntakeField } from "@/components/workflow-authority-page";
import "@/domain/workflow-profile-extensions";
import { workflowProfiles } from "@/domain/workflow-profiles";

export const Route = createFileRoute("/workflows/executive-crisis-response")({
  head: () => ({
    meta: [
      { title: "Executive Crisis Response — AI Document Intelligence & Correspondence | Private Office" },
      { name: "description", content: "Organize a high-stakes executive matter with AI-assisted document intake, fact separation, evidence mapping, chronology, deadline detection, risk review, strategy, and controlled professional correspondence." },
      { name: "robots", content: "index,follow" },
      { property: "og:title", content: "Executive Crisis Response — Private Office" },
      { property: "og:description", content: "AI-assisted organization for urgent executive correspondence, sensitive allegations, institutional inquiries, contractual conflicts, and high-stakes matters." },
    ],
  }),
  component: () => <WorkflowAuthorityPage workflowId="executive-crisis-response" authoritySections={authoritySections} intakeFields={intakeFields} />,
});

const profile = workflowProfiles["executive-crisis-response"];

const authoritySections: AuthoritySection[] = [
  { icon: FileText, title: "Overview", content: "Executive Crisis Response is a private matter-organization workflow for situations where a sensitive or time-critical issue needs disciplined documentation. It turns supplied letters, notices, contracts, correspondence, notes, and other records into a structured matter view: verified facts, reported allegations, disputed assertions, unanswered questions, evidence, chronology, deadlines, risks, and response objectives. AI assists with organization and analysis, while consequential decisions and outgoing correspondence remain under human control." },
  { icon: CheckCircle2, title: "When to use this workflow", items: [
    "You received an urgent demand, accusation, inquiry, or notice requiring a documented response",
    "A sensitive dispute could affect an executive, founder, professional, or organization",
    "You need to reconcile multiple letters, emails, contracts, meeting notes, and records quickly",
    "You need a defensible chronology before deciding how to respond",
    "You need to separate allegations from established facts and disputed claims",
    "You need to preserve and organize evidence before an escalation or professional review",
    "You need controlled professional correspondence generated from a verified matter record",
  ] },
  { icon: AlertTriangle, title: "When not to use this workflow", items: [
    "You face an immediate physical safety, security, medical, or emergency threat",
    "You have been served with litigation or a court order and need legal representation",
    "You need a lawyer, investigator, public-relations firm, crisis counselor, or security service to act for you",
    "You need the system to determine whether an allegation is true or whether a legal violation occurred",
  ] },
  { icon: Lock, title: "Privacy and sensitive information", content: "Executive matters can contain highly sensitive business, financial, personnel, reputational, and personal information. Provide only what is necessary. Do not provide passwords, authentication credentials, private keys, or unnecessary government identifiers. Where an account or identifier is relevant, prefer masked values. Treat every extracted statement as attributed information unless the supplied record supports treating it as a verified fact." },
  { icon: Calendar, title: "Deadlines and timing", content: profile.deadlinePolicy },
  { icon: FileText, title: "Documents to gather", items: profile.evidenceRequirements },
  { icon: Eye, title: "How the workflow works", items: [
    "Ingest: Supply the notice, correspondence, agreements, notes, and supporting records",
    "Classify: AI identifies document types, parties, topics, and the apparent matter context",
    "Extract: Key names, dates, amounts, statements, obligations, and allegations are surfaced with source references",
    "Separate: Verified facts, reported statements, disputed assertions, and open questions remain distinct",
    "Timeline: The system builds a chronological record and flags explicit deadlines and timing conflicts",
    "Evidence: Supporting materials are organized against factual claims and identified gaps",
    "Risk: The workflow surfaces documentation, timing, communication, and uncertainty risks for review",
    "Strategy: AI presents response objectives and practical next-step options without making legal conclusions",
    "Draft: Professional correspondence is generated from the controlled matter record",
    "Review: You inspect the facts, sources, draft, and unresolved questions before approval",
    "Delivery: Consequential mailing requires explicit human approval and the existing fulfillment controls",
  ] },
  { icon: ShieldCheck, title: "AI safeguards", items: [
    "AI output is bounded by the structured matter record and source material",
    "Unverified allegations remain attributed rather than silently becoming facts",
    "Conflicting statements are surfaced for review",
    "Potential deadlines are not presented as certain legal deadlines unless explicitly documented in supplied material",
    "The draft is labeled for review and cannot bypass human approval for consequential mailing",
  ] },
  { icon: AlertTriangle, title: "Important limitations", content: "Private Office is a documentation, analysis, and correspondence tool. It does not decide whether an allegation is true, determine legal rights or liability, provide legal advice, conduct an investigation, provide public-relations counsel, or represent you. For matters involving litigation, regulatory enforcement, employment law, criminal allegations, securities issues, material financial exposure, or other high-consequence decisions, professional advice may be appropriate." },
  { icon: Mail, title: "Mailing, tracking, and proof", content: "Once you approve the final correspondence and complete the required fulfillment steps, Private Office can route the document through the existing mailing process with tracking and proof records. The workflow is designed so analysis and drafting can be comprehensive while the final consequential action remains explicitly authorized by you." },
];

const intakeFields: IntakeField[] = [
  { key: "matterSubject", label: "Matter subject *", placeholder: "Executive conduct inquiry / demand letter / contractual conflict / regulatory inquiry" },
  { key: "primaryOrganization", label: "Primary organization or counterparty *", placeholder: "Company, agency, institution, employer, customer, partner, or other counterparty" },
  { key: "materialEventDate", label: "Material event date *", placeholder: "August 20, 2026" },
  { key: "currentMatterStatus", label: "Current matter status *", placeholder: "New inquiry received; response requested by Friday; counsel not yet retained...", type: "textarea", rows: 3 },
  { key: "executiveAccount", label: "Executive's factual account *", placeholder: "Describe what the executive says happened. Distinguish direct knowledge from assumptions or second-hand information.", type: "textarea", rows: 4 },
  { key: "reportedAllegation", label: "Reported allegation or demand *", placeholder: "Paste or summarize the allegation, demand, inquiry, notice, or requested action and identify who made it.", type: "textarea", rows: 4 },
  { key: "knownRecipient", label: "Known intended recipient (if any)", placeholder: "Name and organization of the recipient" },
];
