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
  Lock,
} from "lucide-react";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { workflowProfiles } from "@/domain/workflow-profiles";
import { useAuth } from "@/lib/use-auth";

export const Route = createFileRoute("/workflows/trust-beneficiary-notice")({
  head: () => ({
    meta: [
      {
        title:
          "Trust Beneficiary Notice & Correspondence — Document & Request | Private Office",
      },
      {
        name: "description",
        content:
          "Prepare a documented trust beneficiary notice or correspondence — request trust information, accounting, distribution status, or clarification from the trustee. Organize evidence, build a chronology, review the draft, and send certified mail with proof of delivery.",
      },
      { name: "robots", content: "index,follow" },
      {
        property: "og:title",
        content: "Trust Beneficiary Notice — Private Office",
      },
      {
        property: "og:description",
        content:
          "Document your trust beneficiary matter with evidence, chronology, and professional correspondence to the trustee. Certified mail with proof of delivery.",
      },
    ],
  }),
  component: TrustBeneficiaryNoticePage,
});

const profile = workflowProfiles["trust-beneficiary-notice"];

const authoritySections = [
  {
    icon: FileText,
    title: "Overview",
    content:
      "A trust beneficiary notice or correspondence formally documents your position as a beneficiary of a trust — whether you are requesting information, an accounting, distribution status, clarification of trust provisions, or submitting documentation to the trustee. The letter creates a clear factual record — identifying the trust, the trustee, the beneficiary, the matter, the trustee's position, and the requested resolution — which may be critical if the matter escalates to court proceedings or professional legal review. Private Office does not determine beneficiary status, interpret trust instruments as legal conclusions, determine whether a trustee has violated fiduciary duties, or guarantee any outcome including inheritance or distribution.",
  },
  {
    icon: CheckCircle2,
    title: "When to use this workflow",
    items: [
      "You need to formally request trust information or documents from the trustee",
      "You are requesting an accounting of trust assets, income, or distributions",
      "You need to inquire about the status of a distribution",
      "You need to request clarification about trust provisions or your beneficiary status",
      "You need to respond to a trustee communication formally",
      "You need to submit documentation requested by the trustee",
      "You need to provide formal written notice as a beneficiary",
      "You need to document the matter before seeking professional legal review",
    ],
  },
  {
    icon: AlertTriangle,
    title: "When not to use this workflow",
    items: [
      "You need to initiate litigation against a trustee — consult a trust litigation attorney immediately",
      "You need to remove a trustee or petition the court — that requires formal legal proceedings",
      "You need to interpret complex trust provisions — consult a trust attorney",
      "You need to determine whether you are legally a beneficiary — consult a trust attorney",
      "You need to challenge the validity of the trust itself — that requires formal legal proceedings",
      "You suspect fiduciary breach and need immediate legal action — consult an attorney",
    ],
  },
  {
    icon: Lock,
    title: "Privacy and document sensitivity",
    content:
      "Trust documents may contain extremely sensitive personal and financial information — names, family relationships, asset details, and estate planning information. Provide only the information necessary for documenting your matter. Do not provide Social Security numbers, full bank account numbers, passwords, financial login credentials, or unnecessary tax identifiers. Where account references are relevant, use masked identifiers such as 'Account ending 4821.' Private Office never asks for or stores authentication credentials.",
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
      "Trust and beneficiary deadlines depend on jurisdiction, trust language, event type, applicable statute, notice date, trustee action, and court involvement. Capture all dates from your trust documents, trustee correspondence, and court filings. Some trusts specify response timeframes or notice periods. State trust codes may impose deadlines for accounting, contesting actions, or bringing claims. Do not assume a specific deadline — surface the date facts for your review and consult the applicable trust documents or a trust attorney if you are unsure about limitation periods or trust-code deadlines.",
  },
  {
    icon: ShieldCheck,
    title: "Evidence checklist",
    items: [
      "The trust instrument or trust document",
      "Any amendments or restatements of the trust",
      "All correspondence from the trustee",
      "Any prior beneficiary notices or communications you have sent",
      "Accounting records or financial statements for the trust",
      "Distribution records or receipts",
      "Inventory or asset documentation",
      "Court documents, orders, or filings (if applicable)",
      "Death certificate (if relevant to the matter)",
      "Supporting communications — email, letters, or phone logs",
    ],
  },
  {
    icon: Eye,
    title: "How the workflow works",
    items: [
      "Intake: Provide the trust name, trustee name, your name as beneficiary, and describe the matter and trustee's position",
      "Documents: Upload or paste trust documents, correspondence, and records",
      "Analysis: The system identifies facts, missing information, contradictions, and risks — without drawing legal conclusions",
      "Evidence: Organize supporting documents and link them to factual assertions",
      "Timeline: Build a chronology from the dates in your materials — trust creation, amendments, trustee communications, etc.",
      "Draft: A professional beneficiary correspondence is generated from your facts",
      "Review: You review and edit the draft before anything is sent",
      "Approval: You explicitly approve the draft before mailing",
      "Delivery: Certified mail with tracking and proof of delivery",
      "Proof: Permanent record of mailing, delivery, and correspondence",
    ],
  },
  {
    icon: AlertTriangle,
    title: "Important limitations",
    content:
      "Private Office is a documentation and correspondence workflow, not a legal decision-maker. It does not determine who is legally a beneficiary, whether a trustee has violated fiduciary duties, or what trust language means as a legal conclusion. If document language and your understanding appear inconsistent, the workflow will flag this for your review and recommend obtaining professional advice. Always consult a qualified trust attorney for legal conclusions about your rights, the trustee's obligations, or the meaning of trust provisions.",
  },
  {
    icon: Mail,
    title: "Mailing, tracking, and proof",
    content:
      "Your final letter is printed, enveloped, and mailed via USPS. Certified mail with return receipt provides signature tracking and proof of delivery — your permanent record that the trustee received your beneficiary correspondence. This documentation may be critical if the matter escalates to court proceedings, professional legal review, or formal proceedings.",
  },
];

const pricingExample = [
  { item: "Workflow preparation", price: `$${profile.pricing.preparationFee.toFixed(2)}` },
  { item: `${profile.pricing.includedResponsePages} response pages included`, price: "Included" },
  { item: "Certified mail with return receipt", price: `$${profile.pricing.certifiedReturnReceipt?.toFixed(2) ?? "—.—"}` },
  { item: "Estimated total", price: `$${(profile.pricing.preparationFee + (profile.pricing.certifiedReturnReceipt ?? 0)).toFixed(2)}`, bold: true },
];

function TrustBeneficiaryNoticePage() {
  const { user } = useAuth();
  const [showWorkspace, setShowWorkspace] = useState(false);
  const [intakeData, setIntakeData] = useState<Record<string, string>>({});
  const [objective, setObjective] = useState("");
  const [documentText, setDocumentText] = useState("");
  const [result, setResult] = useState<null | ReturnType<typeof import("@/domain/private-office-workflow").runPrivateOfficeWorkflow>>(null);

  function runAnalysis() {
    import("@/domain/private-office-workflow").then(({ runPrivateOfficeWorkflow }) => {
      const res = runPrivateOfficeWorkflow({
        workflowId: "trust-beneficiary-notice",
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
              <span className="badge badge-gold">Trust & Estate</span>
              <span className="badge badge-indigo">Gold Standard Workflow</span>
            </div>
            <h1
              className="mt-4 text-4xl font-bold leading-tight text-indigo-800 md:text-5xl"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Trust Beneficiary Notice & Correspondence
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-500">
              {profile.problem} Document your matter with evidence, chronology, and professional correspondence to the trustee. Review before sending, mail certified, and keep permanent proof of delivery.
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

      {/* Privacy notice */}
      <section className="border-b border-warm-border bg-amber-50 py-4">
        <div className="container max-w-3xl">
          <div className="flex items-start gap-3">
            <Lock size={18} className="mt-0.5 flex-shrink-0 text-amber-700" />
            <p className="text-sm text-amber-800">
              <strong>Privacy notice:</strong> Trust documents may contain sensitive personal and financial information. Do not provide Social Security numbers, full account numbers, passwords, or credentials. Use masked references where needed. Private Office never asks for authentication credentials.
            </p>
          </div>
        </div>
      </section>

      {/* Workflow workspace */}
      {showWorkspace && (
        <section className="border-b border-warm-border bg-white py-12">
          <div className="container max-w-3xl">
            <h2 className="text-2xl font-bold text-indigo-800" style={{ fontFamily: "var(--font-serif)" }}>
              Trust Beneficiary Notice Workspace
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Provide the facts of your trust matter. The system will analyze them, identify issues, and generate a draft for your review. Private Office does not provide legal conclusions about beneficiary status, fiduciary duties, or the meaning of trust provisions.
            </p>

            {/* Privacy reminder in workspace */}
            <div className="mt-4 flex items-start gap-3 rounded-lg bg-amber-50 p-4">
              <Lock size={16} className="mt-0.5 flex-shrink-0 text-amber-700" />
              <p className="text-xs text-amber-800">
                Provide only information necessary for documenting your matter. Use masked account references. Never enter Social Security numbers, full account numbers, passwords, or credentials.
              </p>
            </div>

            {/* Intake form */}
            <div className="mt-6 space-y-4">
              <div>
                <label className="input-label">Trust name or identifier *</label>
                <input
                  className="input-field"
                  value={intakeData["trustName"] ?? ""}
                  onChange={(e) => setIntakeData({ ...intakeData, trustName: e.target.value })}
                  placeholder="The Smith Family Trust dated January 15, 2020"
                />
              </div>
              <div>
                <label className="input-label">Trustee name *</label>
                <input
                  className="input-field"
                  value={intakeData["trusteeName"] ?? ""}
                  onChange={(e) => setIntakeData({ ...intakeData, trusteeName: e.target.value })}
                  placeholder="John A. Smith"
                />
              </div>
              <div>
                <label className="input-label">Your name (beneficiary) *</label>
                <input
                  className="input-field"
                  value={intakeData["beneficiaryName"] ?? ""}
                  onChange={(e) => setIntakeData({ ...intakeData, beneficiaryName: e.target.value })}
                  placeholder="Jane B. Smith"
                />
              </div>
              <div>
                <label className="input-label">Your relationship/status as reported</label>
                <input
                  className="input-field"
                  value={intakeData["beneficiaryStatus"] ?? ""}
                  onChange={(e) => setIntakeData({ ...intakeData, beneficiaryStatus: e.target.value })}
                  placeholder="Named beneficiary in Section 3.2 of the trust instrument"
                />
                <p className="mt-1 text-xs text-slate-400">Report your status as stated in the trust document. Private Office does not verify or determine beneficiary status.</p>
              </div>
              <div>
                <label className="input-label">Trust type (if known)</label>
                <input
                  className="input-field"
                  value={intakeData["trustType"] ?? ""}
                  onChange={(e) => setIntakeData({ ...intakeData, trustType: e.target.value })}
                  placeholder="Revocable living trust / Irrevocable trust / Testamentary trust"
                />
              </div>
              <div>
                <label className="input-label">Governing jurisdiction (if known)</label>
                <input
                  className="input-field"
                  value={intakeData["governingJurisdiction"] ?? ""}
                  onChange={(e) => setIntakeData({ ...intakeData, governingJurisdiction: e.target.value })}
                  placeholder="State of California"
                />
              </div>
              <div>
                <label className="input-label">Relevant date (key event date) *</label>
                <input
                  className="input-field"
                  value={intakeData["relevantDate"] ?? ""}
                  onChange={(e) => setIntakeData({ ...intakeData, relevantDate: e.target.value })}
                  placeholder="Date of settlor's passing, date of trustee's last communication, date of distribution request..."
                />
              </div>
              <div>
                <label className="input-label">Describe the matter *</label>
                <textarea
                  className="input-field"
                  rows={4}
                  value={intakeData["matterDescription"] ?? ""}
                  onChange={(e) => setIntakeData({ ...intakeData, matterDescription: e.target.value })}
                  placeholder="Describe what happened — requested information, trustee communication received, distribution inquiry, accounting request, documentation submission..."
                />
              </div>
              <div>
                <label className="input-label">Trustee's current position or response *</label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={intakeData["trusteePosition"] ?? ""}
                  onChange={(e) => setIntakeData({ ...intakeData, trusteePosition: e.target.value })}
                  placeholder="Trustee has not responded to information request. / Trustee states distribution is pending. / Trustee provided partial accounting. / No response received..."
                />
              </div>
              <div>
                <label className="input-label">Requested resolution *</label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="What do you want the trustee to do — provide accounting, distribute assets, respond to information request, clarify trust provisions, acknowledge beneficiary status, preserve documents, or other action?"
                />
              </div>
              <div>
                <label className="input-label">Source document text (paste trust instrument, correspondence, or records)</label>
                <textarea
                  className="input-field"
                  rows={6}
                  value={documentText}
                  onChange={(e) => setDocumentText(e.target.value)}
                  placeholder="Paste the relevant text of your trust instrument, trustee correspondence, accounting records, or other documents..."
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

                {/* Risks */}
                {result.analysis.risks.length > 0 && (
                  <div className="card p-6">
                    <h3 className="font-semibold text-indigo-800">Risks ({result.analysis.risks.length})</h3>
                    <div className="mt-3 space-y-2">
                      {result.analysis.risks.map((risk) => (
                        <div key={risk.title} className="flex items-start gap-2 text-sm">
                          <span
                            className={
                              risk.severity === "high"
                                ? "badge badge-red"
                                : risk.severity === "medium"
                                  ? "badge badge-gold"
                                  : "badge badge-green"
                            }
                          >
                            {risk.severity}
                          </span>
                          <div>
                            <p className="font-medium text-indigo-700">{risk.title}</p>
                            <p className="text-slate-500">{risk.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Strategy */}
                {result.analysis.strategy.length > 0 && (
                  <div className="card p-6">
                    <h3 className="font-semibold text-indigo-800">Strategy ({result.analysis.strategy.length})</h3>
                    <ul className="mt-3 space-y-2">
                      {result.analysis.strategy.map((strat, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm leading-6 text-slate-600">
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-300" />
                          {strat}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Timeline */}
                {result.analysis.timeline.length > 0 && (
                  <div className="card p-6">
                    <h3 className="font-semibold text-indigo-800">Chronology ({result.analysis.timeline.length})</h3>
                    <div className="mt-3 space-y-1">
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
                      <li key={j} className="flex items-start gap-2 text-sm leading-6 text-slate-600">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-300" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div className="mt-16 card p-6">
            <h2
              className="text-2xl font-bold text-indigo-800"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Pricing
            </h2>
            <div className="mt-4 space-y-2">
              {pricingExample.map((row) => (
                <div
                  key={row.item}
                  className={`flex items-center justify-between text-sm ${row.bold ? "border-t border-warm-border pt-2 font-bold text-indigo-800" : "text-slate-600"}`}
                >
                  <span>{row.item}</span>
                  <span>{row.price}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-400">
              Additional response pages and supporting pages billed at per-page rates. Mailing fees vary by method selected.
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
