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

export const Route = createFileRoute("/workflows/bank-wire-dispute")({
  head: () => ({
    meta: [
      {
        title:
          "Bank & Wire Transfer Dispute Letter — Document & Dispute | Private Office",
      },
      {
        name: "description",
        content:
          "Prepare a documented bank or wire transfer dispute letter for unauthorized wires, mistaken transfers, beneficiary errors, bank refusals, or delayed investigations. Organize transaction records, build a chronology, review the draft, and send certified mail with proof of delivery.",
      },
      { name: "robots", content: "index,follow" },
      {
        property: "og:title",
        content: "Bank & Wire Transfer Dispute Letter — Private Office",
      },
      {
        property: "og:description",
        content:
          "Document your bank or wire transfer dispute with transaction records, chronology, and professional correspondence. Certified mail with proof of delivery.",
      },
    ],
  }),
  component: BankWireDisputePage,
});

const profile = workflowProfiles["bank-wire-dispute"];

const authoritySections = [
  {
    icon: FileText,
    title: "Overview",
    content:
      "A bank and wire transfer dispute letter formally documents your position when a wire transfer or bank transaction has been disputed — an unauthorized wire, mistaken transfer, beneficiary or account error, bank refusal to investigate, delayed response, or disputed transaction. The letter creates a clear factual record — identifying the financial institution, the account holder, the reported transaction, the dispute, the bank's response, and the requested resolution — which may be critical if the matter escalates to a regulatory complaint, fraud claim, or legal proceedings. Private Office does not determine whether a transaction was legally unauthorized and does not guarantee any outcome including recovery.",
  },
  {
    icon: CheckCircle2,
    title: "When to use this workflow",
    items: [
      "A wire transfer was sent or received that you believe was unauthorized",
      "A transfer was sent to the wrong beneficiary or account",
      "The bank refused to recall or investigate a disputed transfer",
      "The bank is delaying investigation without explanation",
      "You need to formally document a disputed transaction",
      "You need to request a recall, correction, or reimbursement",
      "You need to submit additional documentation to the bank",
      "You need to request a status update or written explanation",
      "You need to document the dispute before escalating to a regulator",
    ],
  },
  {
    icon: AlertTriangle,
    title: "When not to use this workflow",
    items: [
      "You need to report active fraud to law enforcement — contact your bank and file a police report immediately",
      "You need to file a complaint with a regulator (CFPB, OCC, state banking authority) — that requires a separate formal process",
      "You are facing a lawsuit — consult an attorney immediately",
      "You need to freeze accounts or stop payment — contact your bank directly and immediately",
      "The transaction involves suspected money laundering or terrorism financing — report to the appropriate authorities",
    ],
  },
  {
    icon: Lock,
    title: "Privacy and data minimization",
    content:
      "This workflow involves sensitive financial information. Do not provide full bank account numbers, passwords, PINs, or online banking credentials. Where an account reference is useful, use masked values such as 'Account ending 4821' rather than the full account number. Private Office never asks for or stores authentication credentials. Only provide factual information relevant to documenting the dispute.",
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
      "Financial transaction dispute timelines vary by transaction type, institution, jurisdiction, account type, applicable agreement, and whether the transaction is classified as unauthorized or fraudulent. Capture all dates from your bank statements, correspondence, and account agreements. Some banks have stated response timeframes for disputes. Federal regulations may impose investigation deadlines on banks for certain transaction types. Do not assume a specific deadline — surface the date facts for your review and consult your bank's dispute policy or an attorney if you are unsure about limitation periods or regulatory deadlines.",
  },
  {
    icon: ShieldCheck,
    title: "Evidence checklist",
    items: [
      "Bank statement showing the disputed transaction",
      "Wire transfer confirmation, receipt, or SWIFT message",
      "Transaction confirmation or transfer record",
      "All bank correspondence regarding the dispute",
      "Any dispute or recall request you previously submitted",
      "Bank investigation response or status update",
      "Beneficiary or recipient information (if known)",
      "Relevant invoices, contracts, or agreements",
      "Supporting communications — email, chat, or phone logs",
    ],
  },
  {
    icon: Eye,
    title: "How the workflow works",
    items: [
      "Intake: Provide the financial institution, account holder name, transaction details, and describe the dispute and bank's response",
      "Documents: Upload or paste bank statements, transfer confirmations, and correspondence",
      "Analysis: The system identifies facts, missing information, contradictions, and risks",
      "Evidence: Organize supporting documents and link them to factual assertions",
      "Timeline: Build a chronology from the dates in your materials — transaction date, discovery date, notification date, bank response, etc.",
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
      "Not notifying the bank promptly after discovering the issue",
      "Not keeping copies of all correspondence with the bank",
      "Failing to document the dispute in writing (phone calls alone are not sufficient)",
      "Not preserving transaction confirmations and receipts",
      "Sending communications without proof of delivery",
      "Assuming the bank's initial response is final without formal follow-up",
      "Not documenting the chronology of events",
      "Providing full account numbers when masked references would suffice",
    ],
  },
  {
    icon: Mail,
    title: "Mailing, tracking, and proof",
    content:
      "Your final letter is printed, enveloped, and mailed via USPS. Certified mail with return receipt provides signature tracking and proof of delivery — your permanent record that the financial institution received your dispute correspondence. This documentation may be critical if the matter escalates to a regulatory complaint, fraud claim, or legal proceedings.",
  },
];

const pricingExample = [
  { item: "Workflow preparation", price: `$${profile.pricing.preparationFee.toFixed(2)}` },
  { item: `${profile.pricing.includedResponsePages} response pages included`, price: "Included" },
  { item: "Certified mail with return receipt", price: `$${profile.pricing.certifiedReturnReceipt?.toFixed(2) ?? "—.—"}` },
  { item: "Estimated total", price: `$${(profile.pricing.preparationFee + (profile.pricing.certifiedReturnReceipt ?? 0)).toFixed(2)}`, bold: true },
];

function BankWireDisputePage() {
  const { user } = useAuth();
  const [showWorkspace, setShowWorkspace] = useState(false);
  const [intakeData, setIntakeData] = useState<Record<string, string>>({});
  const [objective, setObjective] = useState("");
  const [documentText, setDocumentText] = useState("");
  const [result, setResult] = useState<null | ReturnType<typeof import("@/domain/private-office-workflow").runPrivateOfficeWorkflow>>(null);

  function runAnalysis() {
    import("@/domain/private-office-workflow").then(({ runPrivateOfficeWorkflow }) => {
      const res = runPrivateOfficeWorkflow({
        workflowId: "bank-wire-dispute",
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
              <span className="badge badge-gold">Financial</span>
              <span className="badge badge-indigo">Gold Standard Workflow</span>
            </div>
            <h1
              className="mt-4 text-4xl font-bold leading-tight text-indigo-800 md:text-5xl"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Bank & Wire Transfer Dispute Letter
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-500">
              {profile.problem} Document your dispute with transaction records, chronology, and professional correspondence. Review before sending, mail certified, and keep permanent proof of delivery.
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
              <strong>Privacy notice:</strong> Do not provide full account numbers, passwords, PINs, or banking credentials. Use masked references such as "Account ending 4821." Private Office never asks for authentication credentials.
            </p>
          </div>
        </div>
      </section>

      {/* Workflow workspace */}
      {showWorkspace && (
        <section className="border-b border-warm-border bg-white py-12">
          <div className="container max-w-3xl">
            <h2 className="text-2xl font-bold text-indigo-800" style={{ fontFamily: "var(--font-serif)" }}>
              Bank & Wire Transfer Dispute Workspace
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Provide the facts of your dispute. The system will analyze them, identify issues, and generate a draft for your review.
            </p>

            {/* Privacy reminder in workspace */}
            <div className="mt-4 flex items-start gap-3 rounded-lg bg-amber-50 p-4">
              <Lock size={16} className="mt-0.5 flex-shrink-0 text-amber-700" />
              <p className="text-xs text-amber-800">
                Use masked account references (e.g., "Account ending 4821"). Never enter full account numbers, passwords, or credentials.
              </p>
            </div>

            {/* Intake form */}
            <div className="mt-6 space-y-4">
              <div>
                <label className="input-label">Financial institution (bank, credit union, etc.) *</label>
                <input
                  className="input-field"
                  value={intakeData["financialInstitution"] ?? ""}
                  onChange={(e) => setIntakeData({ ...intakeData, financialInstitution: e.target.value })}
                  placeholder="First National Bank"
                />
              </div>
              <div>
                <label className="input-label">Account holder name *</label>
                <input
                  className="input-field"
                  value={intakeData["accountHolderName"] ?? ""}
                  onChange={(e) => setIntakeData({ ...intakeData, accountHolderName: e.target.value })}
                  placeholder="Jane Q. Public"
                />
              </div>
              <div>
                <label className="input-label">Account reference (masked — e.g., "Account ending 4821")</label>
                <input
                  className="input-field"
                  value={intakeData["accountReference"] ?? ""}
                  onChange={(e) => setIntakeData({ ...intakeData, accountReference: e.target.value })}
                  placeholder="Account ending 4821"
                />
                <p className="mt-1 text-xs text-slate-400">Use masked references only. Do not enter full account numbers.</p>
              </div>
              <div>
                <label className="input-label">Transaction date *</label>
                <input
                  className="input-field"
                  value={intakeData["transactionDate"] ?? ""}
                  onChange={(e) => setIntakeData({ ...intakeData, transactionDate: e.target.value })}
                  placeholder="March 10, 2026"
                />
              </div>
              <div>
                <label className="input-label">Transaction amount and currency *</label>
                <input
                  className="input-field"
                  value={intakeData["transactionAmount"] ?? ""}
                  onChange={(e) => setIntakeData({ ...intakeData, transactionAmount: e.target.value })}
                  placeholder="$25,000.00 USD"
                />
              </div>
              <div>
                <label className="input-label">Transaction type</label>
                <input
                  className="input-field"
                  value={intakeData["transactionType"] ?? ""}
                  onChange={(e) => setIntakeData({ ...intakeData, transactionType: e.target.value })}
                  placeholder="Domestic wire / International wire / ACH transfer / Other"
                />
              </div>
              <div>
                <label className="input-label">Reference or confirmation number (if available)</label>
                <input
                  className="input-field"
                  value={intakeData["referenceNumber"] ?? ""}
                  onChange={(e) => setIntakeData({ ...intakeData, referenceNumber: e.target.value })}
                  placeholder="WTR-2026-0310-8842"
                />
              </div>
              <div>
                <label className="input-label">Reported beneficiary or destination (if known)</label>
                <input
                  className="input-field"
                  value={intakeData["reportedBeneficiary"] ?? ""}
                  onChange={(e) => setIntakeData({ ...intakeData, reportedBeneficiary: e.target.value })}
                  placeholder="John Doe / XYZ Corp / Account at Second National Bank"
                />
              </div>
              <div>
                <label className="input-label">Describe the dispute *</label>
                <textarea
                  className="input-field"
                  rows={4}
                  value={intakeData["disputeDescription"] ?? ""}
                  onChange={(e) => setIntakeData({ ...intakeData, disputeDescription: e.target.value })}
                  placeholder="Describe why the transaction is disputed — unauthorized wire, mistaken transfer, beneficiary error, bank refusal, delayed investigation, disputed transaction..."
                />
              </div>
              <div>
                <label className="input-label">When did you discover the issue?</label>
                <input
                  className="input-field"
                  value={intakeData["discoveryDate"] ?? ""}
                  onChange={(e) => setIntakeData({ ...intakeData, discoveryDate: e.target.value })}
                  placeholder="March 12, 2026"
                />
              </div>
              <div>
                <label className="input-label">When did you notify the bank?</label>
                <input
                  className="input-field"
                  value={intakeData["notificationDate"] ?? ""}
                  onChange={(e) => setIntakeData({ ...intakeData, notificationDate: e.target.value })}
                  placeholder="March 13, 2026"
                />
              </div>
              <div>
                <label className="input-label">Bank's response or current status *</label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={intakeData["bankResponse"] ?? ""}
                  onChange={(e) => setIntakeData({ ...intakeData, bankResponse: e.target.value })}
                  placeholder="Bank denied recall request. / Investigation opened, no update in 30 days. / Bank claims transaction was authorized. / No response received..."
                />
              </div>
              <div>
                <label className="input-label">Requested resolution *</label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="What do you want the bank to do — investigate, recall the transfer, correct the error, reimburse, provide written explanation, preserve records, or other action?"
                />
              </div>
              <div>
                <label className="input-label">Source document text (paste bank statements, confirmations, or correspondence)</label>
                <textarea
                  className="input-field"
                  rows={6}
                  value={documentText}
                  onChange={(e) => setDocumentText(e.target.value)}
                  placeholder="Paste the text of your bank statement, wire confirmation, dispute correspondence, or any documents from the bank..."
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
