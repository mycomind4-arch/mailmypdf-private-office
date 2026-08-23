import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Send,
  Eye,
  Scale,
  Calendar,
  DollarSign,
} from "lucide-react";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { workflowProfiles } from "@/domain/workflow-profiles";
import { useAuth } from "@/lib/use-auth";

export const Route = createFileRoute("/workflows/contractor-dispute")({
  head: () => ({
    meta: [
      {
        title:
          "Contractor Dispute Letter — Prepare, Review, Send & Prove | Private Office",
      },
      {
        name: "description",
        content:
          "Prepare a professional contractor dispute letter for defective work, incomplete work, billing disputes, or breach of agreement. Organize evidence, build a timeline, review the draft, and send certified mail with proof of delivery.",
      },
      { name: "robots", content: "index,follow" },
      {
        property: "og:title",
        content: "Contractor Dispute Letter — Private Office",
      },
      {
        property: "og:description",
        content:
          "Document your contractor dispute with evidence, timeline, and professional correspondence. Certified mail with proof of delivery.",
      },
    ],
  }),
  component: ContractorDisputePage,
});

const profile = workflowProfiles["contractor-dispute"];


const authoritySections = [
  {
    icon: FileText,
    title: "Overview",
    content:
      "A contractor dispute letter formally documents your position when a contractor has performed defective work, left work incomplete, disputed billing, or breached your agreement. The letter creates a clear factual record, identifies the issues, states the requested resolution, and establishes a timeline for response — all of which may be critical if the matter escalates to a demand letter, insurance claim, or legal proceeding.",
  },
  {
    icon: CheckCircle2,
    title: "When to use this workflow",
    items: [
      "The contractor performed defective, substandard, or non-compliant work",
      "Work was left incomplete or abandoned before finishing the agreed scope",
      "You were overcharged, billed for work not performed, or billed beyond the contract",
      "The contractor failed to obtain required permits or inspections",
      "The contractor's work caused property damage or required remediation",
      "You need to document the dispute formally before escalating",
    ],
  },
  {
    icon: AlertTriangle,
    title: "When not to use this workflow",
    items: [
      "You need immediate emergency repairs to prevent ongoing damage — call a qualified contractor first",
      "You are facing a lien or lawsuit from the contractor — consult an attorney immediately",
      "The dispute involves personal injury — seek medical and legal attention",
      "You want to file a contractor license board complaint — that requires a separate formal process",
    ],
  },
  {
    icon: Scale,
    title: "Documents to gather",
    items: profile.evidenceRequirements,
  },
  {
    icon: Calendar,
    title: "Deadlines and timing",
    content:
      "Capture all dates visible in your agreement, invoices, and correspondence. Some contracts include cure periods or response deadlines. Statutes of limitations for construction defects vary by state. Do not assume a specific deadline — surface the date facts for your review and consult an attorney if you are unsure about limitation periods.",
  },
  {
    icon: ShieldCheck,
    title: "Evidence checklist",
    items: [
      "Photos showing the defect, incomplete work, or damage",
      "The written contract or agreement (or documentation of any oral agreement)",
      "Invoices and payment records showing what was billed and paid",
      "Correspondence: emails, texts, or letters with the contractor",
      "Permits, inspection reports, or code violation notices",
      "Any contractor proposals, change orders, or scope documents",
      "Repair estimates from other contractors for remediation",
    ],
  },
  {
    icon: Eye,
    title: "How the workflow works",
    items: [
      "Intake: Provide property/project details, contractor information, and describe the dispute",
      "Documents: Upload or reference relevant contracts, invoices, and photos",
      "Analysis: The system identifies facts, missing information, and risks",
      "Evidence: Organize supporting documents and link them to factual assertions",
      "Timeline: Build a chronology from the dates in your materials",
      "Draft: A professional dispute letter is generated from your facts",
      "Review: You review and edit the draft before anything is sent",
      "Approval: You explicitly approve the draft before mailing",
      "Delivery: Certified mail with tracking and proof of delivery",
      "Proof: Permanent record of mailing, delivery, and correspondence",
    ],
  },
  {
    icon: AlertTriangle,
    title: "Common mistakes",
    items: [
      "Waiting too long after discovering the defect to document it",
      "Not preserving photos and physical evidence before remediation",
      "Making verbal agreements without written confirmation",
      "Paying disputed invoices without documenting the dispute in writing",
      "Sending emotional or threatening communications instead of factual documentation",
      "Not sending the dispute via certified mail with proof of delivery",
    ],
  },
  {
    icon: Mail,
    title: "Mailing, tracking, and proof",
    content:
      "Your final letter is printed, enveloped, and mailed via USPS. Certified mail with return receipt provides signature tracking and proof of delivery — your permanent record that the contractor received your dispute letter. This documentation may be critical if the matter escalates to a demand letter, insurance claim, or legal proceeding.",
  },
];

const pricingExample = [
  { item: "Workflow preparation", price: `$${profile.pricing.preparationFee.toFixed(2)}` },
  { item: `${profile.pricing.includedResponsePages} response pages included`, price: "Included" },
  { item: "Certified mail with return receipt", price: `$${profile.pricing.certifiedReturnReceipt?.toFixed(2) ?? "—.—"}` },
  { item: "Estimated total", price: `$${(profile.pricing.preparationFee + (profile.pricing.certifiedReturnReceipt ?? 0)).toFixed(2)}`, bold: true },
];

function ContractorDisputePage() {
  const { user } = useAuth();
  const [showWorkspace, setShowWorkspace] = useState(false);
  const [intakeData, setIntakeData] = useState<Record<string, string>>({});
  const [objective, setObjective] = useState("");
  const [documentText, setDocumentText] = useState("");
  const [result, setResult] = useState<null | ReturnType<typeof import("@/domain/private-office-workflow").runPrivateOfficeWorkflow>>(null);

  function runAnalysis() {
    import("@/domain/private-office-workflow").then(({ runPrivateOfficeWorkflow }) => {
      const res = runPrivateOfficeWorkflow({
        workflowId: "contractor-dispute",
        documentId: "local-doc",
        text: documentText || "Source document text placeholder for analysis.",
        facts: intakeData,
        objective,
      });
      setResult(res);
    });
  }

  return (
    <main className="min-h-screen bg-cream">
      <SiteHeader />

      {/* Hero */}
      <section className="border-b border-warm-border bg-white py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="badge badge-gold">Property</span>
              <span className="badge badge-indigo">Gold Standard Workflow</span>
            </div>
            <h1
              className="mt-4 text-4xl font-bold leading-tight text-indigo-800 md:text-5xl"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Contractor Dispute Letter
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-500">
              {profile.problem} Document your dispute with evidence, timeline, and professional correspondence. Review before sending, mail certified, and keep permanent proof of delivery.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={() => setShowWorkspace(true)} className="btn-gold">
                {user ? "Start this matter" : "Try the workflow"} <ArrowRight size={16} />
              </button>
              <a href="#authority" className="btn-outline">
                Learn more
              </a>
            </div>
            {!user && (
              <p className="mt-3 text-xs text-slate-400">
                Sign in to save your matter, evidence, and delivery records. You can preview the workflow without an account.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Workflow workspace */}
      {showWorkspace && (
        <section className="border-b border-warm-border bg-white py-12">
          <div className="container max-w-3xl">
            <h2 className="text-2xl font-bold text-indigo-800" style={{ fontFamily: "var(--font-serif)" }}>
              Contractor Dispute Workspace
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Provide the facts of your dispute. The system will analyze them, identify issues, and generate a draft for your review.
            </p>

            {/* Intake form */}
            <div className="mt-6 space-y-4">
              <div>
                <label className="input-label">Property or project address *</label>
                <input
                  className="input-field"
                  value={intakeData["propertyAddress"] ?? ""}
                  onChange={(e) => setIntakeData({ ...intakeData, propertyAddress: e.target.value })}
                  placeholder="123 Main Street, Springfield, IL"
                />
              </div>
              <div>
                <label className="input-label">Contractor name *</label>
                <input
                  className="input-field"
                  value={intakeData["contractorName"] ?? ""}
                  onChange={(e) => setIntakeData({ ...intakeData, contractorName: e.target.value })}
                  placeholder="ABC Construction LLC"
                />
              </div>
              <div>
                <label className="input-label">Agreement or contract reference *</label>
                <input
                  className="input-field"
                  value={intakeData["agreementReference"] ?? ""}
                  onChange={(e) => setIntakeData({ ...intakeData, agreementReference: e.target.value })}
                  placeholder="Written contract dated January 15, 2026"
                />
              </div>
              <div>
                <label className="input-label">Description of dispute or defect *</label>
                <textarea
                  className="input-field"
                  rows={4}
                  value={intakeData["disputeDescription"] ?? ""}
                  onChange={(e) => setIntakeData({ ...intakeData, disputeDescription: e.target.value })}
                  placeholder="Describe the defective work, incomplete work, billing dispute, or other issue..."
                />
              </div>
              <div>
                <label className="input-label">Requested resolution *</label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="What do you want the contractor to do — repair, refund, complete, correct, or other action?"
                />
              </div>
              <div>
                <label className="input-label">Source document text (paste contract, invoice, or correspondence)</label>
                <textarea
                  className="input-field"
                  rows={6}
                  value={documentText}
                  onChange={(e) => setDocumentText(e.target.value)}
                  placeholder="Paste the text of your contract, invoice, or any correspondence with the contractor..."
                />
              </div>
              <button onClick={runAnalysis} className="btn-primary">
                Analyze & Generate Draft <ArrowRight size={16} />
              </button>
            </div>

            {/* Results */}
            {result && (
              <div className="mt-8 space-y-6">
                {/* Stage results */}
                <div className="card p-6">
                  <h3 className="font-semibold text-indigo-800">Pipeline stages</h3>
                  <div className="mt-3 space-y-1">
                    {result.stages.map((stage) => (
                      <div key={stage.stage} className="flex items-center gap-2 text-sm">
                        <span
                          className={
                            stage.status === "passed"
                              ? "text-green-600"
                              : stage.status === "failed"
                                ? "text-red-600"
                                : stage.status === "blocked"
                                  ? "text-red-600"
                                  : "text-slate-400"
                          }
                        >
                          {stage.status === "passed" ? "✓" : stage.status === "failed" || stage.status === "blocked" ? "✗" : "○"} {stage.stage}
                        </span>
                        {stage.detail && <span className="text-slate-400">— {stage.detail}</span>}
                      </div>
                    ))}
                  </div>
                  {result.errors.length > 0 && (
                    <div className="mt-4 alert alert-danger">
                      <strong>Blocking issues:</strong>
                      <ul className="mt-2 list-disc pl-5">
                        {result.errors.map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Findings */}
                {result.analysis.findings.length > 0 && (
                  <div className="card p-6">
                    <h3 className="font-semibold text-indigo-800">Findings ({result.analysis.findings.length})</h3>
                    <div className="mt-3 space-y-2">
                      {result.analysis.findings.map((finding) => (
                        <div key={finding.id} className="flex items-start gap-2 text-sm">
                          <span
                            className={
                              finding.state === "confirmed"
                                ? "badge badge-green"
                                : finding.state === "missing"
                                  ? "badge badge-red"
                                  : "badge badge-gold"
                            }
                          >
                            {finding.state}
                          </span>
                          <div>
                            <p className="font-medium text-indigo-700">{finding.title}</p>
                            <p className="text-slate-500">{finding.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Evidence */}
                {result.analysis.evidence.length > 0 && (
                  <div className="card p-6">
                    <h3 className="font-semibold text-indigo-800">Evidence requirements ({result.analysis.evidence.length})</h3>
                    <div className="mt-3 space-y-2">
                      {result.analysis.evidence.map((ev) => (
                        <div key={ev.id} className="flex items-center gap-2 text-sm">
                          <span
                            className={
                              ev.status === "verified" || ev.status === "provided"
                                ? "badge badge-green"
                                : ev.status === "missing"
                                  ? "badge badge-red"
                                  : "badge badge-gold"
                            }
                          >
                            {ev.status}
                          </span>
                          <span className="text-slate-600">{ev.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timeline */}
                {result.analysis.timeline.length > 0 && (
                  <div className="card p-6">
                    <h3 className="font-semibold text-indigo-800">Timeline ({result.analysis.timeline.length} events)</h3>
                    <div className="mt-3 space-y-2">
                      {result.analysis.timeline.map((event, i) => (
                        <div key={i} className="text-sm">
                          <span className="font-medium text-indigo-700">{event.date ?? "Date unknown"}</span>
                          <span className="text-slate-500"> — {event.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Draft */}
                {result.draft && (
                  <div className="card p-6">
                    <h3 className="font-semibold text-indigo-800">Draft correspondence</h3>
                    <p className="mt-1 text-xs text-slate-400">
                      [DRAFT — REVIEW BEFORE SENDING] This draft is generated from your facts. Review every word before approving for mailing.
                    </p>
                    <pre className="mt-4 whitespace-pre-wrap rounded-lg bg-cream p-4 text-sm leading-6 text-slate-700">
                      {result.draft}
                    </pre>
                    <div className="mt-4 flex gap-3">
                      <button className="btn-primary" disabled={!result.ready}>
                        Approve & Mail <Send size={16} />
                      </button>
                      <button className="btn-outline">Edit draft</button>
                    </div>
                    {!result.ready && (
                      <p className="mt-3 text-xs text-red-600">
                        Cannot mail until all blocking issues are resolved and the draft is approved.
                      </p>
                    )}
                  </div>
                )}

                {/* Disclaimer */}
                <div className="alert alert-warning">
                  <strong>Important:</strong> {profile.disclaimer}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Authority content */}
      <section id="authority" className="py-20 md:py-28">
        <div className="container max-w-3xl">
          <div className="space-y-12">
            {authoritySections.map((section, i) => (
              <div key={i}>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                    <section.icon size={20} className="text-indigo-700" />
                  </div>
                  <h2
                    className="text-2xl font-bold text-indigo-800"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {section.title}
                  </h2>
                </div>
                {section.content && (
                  <p className="mt-3 text-sm leading-7 text-slate-600">{section.content}</p>
                )}
                {section.items && (
                  <ul className="mt-3 space-y-2">
                    {section.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm leading-7 text-slate-600">
                        <CheckCircle2 size={16} className="mt-1 shrink-0 text-indigo-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {/* Pricing */}
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                  <DollarSign size={20} className="text-indigo-700" />
                </div>
                <h2
                  className="text-2xl font-bold text-indigo-800"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Pricing
                </h2>
              </div>
              <div className="mt-4 card p-6">
                <p className="text-sm text-slate-500">
                  Starting at ${(profile.pricing.preparationFee + (profile.pricing.standardMail)).toFixed(2)} (preparation + standard mail). Certified mail with return receipt starts at ${(profile.pricing.preparationFee + (profile.pricing.certifiedReturnReceipt ?? 0)).toFixed(2)}.
                </p>
                <div className="mt-4 space-y-2">
                  {pricingExample.map((row) => (
                    <div key={row.item} className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">{row.item}</span>
                      <span className={row.bold ? "font-bold text-indigo-800" : "text-slate-600"}>
                        {row.price}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-slate-400">
                  The exact price is calculated from your final approved packet before payment. Additional response pages and supporting documents are priced per sheet.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="card p-8 text-center">
              <h2
                className="text-2xl font-bold text-indigo-800"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Ready to document your contractor dispute?
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Start the workflow to organize your facts, generate a professional draft, review it, and send it certified with proof of delivery.
              </p>
              <button onClick={() => setShowWorkspace(true)} className="btn-gold mt-6">
                Start the Contractor Dispute workflow <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
