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

} from "lucide-react";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { workflowProfiles } from "@/domain/workflow-profiles";
import { useAuth } from "@/lib/use-auth";

export const Route = createFileRoute("/workflows/property-insurance-claim")({
  head: () => ({
    meta: [
      {
        title:
          "Property Insurance Claim Letter — Document, Dispute & Appeal | Private Office",
      },
      {
        name: "description",
        content:
          "Prepare a professional property insurance claim letter for denied claims, underpayments, disputed scope, delayed responses, or supplemental claims. Organize evidence, build a chronology, review the draft, and send certified mail with proof of delivery.",
      },
      { name: "robots", content: "index,follow" },
      {
        property: "og:title",
        content: "Property Insurance Claim Letter — Private Office",
      },
      {
        property: "og:description",
        content:
          "Document your property insurance claim with evidence, chronology, and professional correspondence. Certified mail with proof of delivery.",
      },
    ],
  }),
  component: PropertyInsuranceClaimPage,
});

const profile = workflowProfiles["property-insurance-claim"];

const authoritySections = [
  {
    icon: FileText,
    title: "Overview",
    content:
      "A property insurance claim letter formally documents your position when your insurer has denied your claim, underpaid it, delayed response, disputed the scope of damage, or when you need to file a supplemental claim for additional damage. The letter creates a clear factual record — identifying the property, the policy, the claim, the damage, the insurer's position, and the requested resolution — which may be critical if the matter escalates to appraisal, a department of insurance complaint, or legal proceedings.",
  },
  {
    icon: CheckCircle2,
    title: "When to use this workflow",
    items: [
      "Your claim was denied and you believe the denial is incorrect",
      "The insurer paid less than the estimated repair cost (underpayment)",
      "The insurer is delaying response or investigation without explanation",
      "The insurer disputes the scope or valuation of damage",
      "You discovered additional damage after the initial claim was filed",
      "You need to request a supplemental claim or additional inspection",
      "The insurer requested information and you need to respond formally",
      "You need to document the claim process before escalating",
    ],
  },
  {
    icon: AlertTriangle,
    title: "When not to use this workflow",
    items: [
      "You need immediate emergency repairs to prevent ongoing damage — mitigate first, document second",
      "You are facing a lawsuit from or against the insurer — consult an attorney immediately",
      "The claim involves bodily injury or liability — seek legal representation",
      "You want to file a complaint with your state department of insurance — that requires a separate formal process",
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
      "Insurance claim timelines are governed by your policy, state law, and the claim's procedural posture. Capture all dates from your policy, correspondence, and denial letters. Many policies require proof of loss within a specific timeframe. State laws may impose response deadlines on insurers. Do not assume a specific deadline — surface the date facts for your review and consult an attorney if you are unsure about limitation periods or proof-of-loss requirements.",
  },
  {
    icon: ShieldCheck,
    title: "Evidence checklist",
    items: [
      "Your insurance policy or declarations page",
      "The claim number and all correspondence with the insurer",
      "The denial letter or explanation of benefits (if denied)",
      "Payment statements showing what was paid vs. claimed",
      "Photos of the property damage from multiple angles",
      "Repair estimates or contractor bids for the work",
      "Inspection reports, engineer reports, or adjuster notes",
      "Receipts for emergency repairs or temporary mitigation",
      "Any prior claim-related communications",
    ],
  },
  {
    icon: Eye,
    title: "How the workflow works",
    items: [
      "Intake: Provide property details, policy information, claim number, and describe the damage and insurer's position",
      "Documents: Upload or paste policy documents, denial letters, estimates, and correspondence",
      "Analysis: The system identifies facts, missing information, contradictions, and risks",
      "Evidence: Organize supporting documents and link them to factual assertions",
      "Timeline: Build a chronology from the dates in your materials — date of loss, report date, inspection, denial, etc.",
      "Draft: A professional claim letter is generated from your facts",
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
      "Missing proof-of-loss deadlines specified in the policy",
      "Accepting the insurer's first estimate without getting your own",
      "Not documenting damage with photos before repairs",
      "Failing to mitigate further damage after the loss",
      "Not keeping copies of all correspondence with the insurer",
      "Sending communications without proof of delivery",
      "Assuming the insurer's scope assessment is definitive without independent verification",
    ],
  },
  {
    icon: Mail,
    title: "Mailing, tracking, and proof",
    content:
      "Your final letter is printed, enveloped, and mailed via USPS. Certified mail with return receipt provides signature tracking and proof of delivery — your permanent record that the insurer received your claim correspondence. This documentation may be critical if the matter escalates to appraisal, a department of insurance complaint, or legal proceedings.",
  },
];

const pricingExample = [
  { item: "Workflow preparation", price: `$${profile.pricing.preparationFee.toFixed(2)}` },
  { item: `${profile.pricing.includedResponsePages} response pages included`, price: "Included" },
  { item: "Certified mail with return receipt", price: `$${profile.pricing.certifiedReturnReceipt?.toFixed(2) ?? "—.—"}` },
  { item: "Estimated total", price: `$${(profile.pricing.preparationFee + (profile.pricing.certifiedReturnReceipt ?? 0)).toFixed(2)}`, bold: true },
];

function PropertyInsuranceClaimPage() {
  const { user } = useAuth();
  const [showWorkspace, setShowWorkspace] = useState(false);
  const [intakeData, setIntakeData] = useState<Record<string, string>>({});
  const [objective, setObjective] = useState("");
  const [documentText, setDocumentText] = useState("");
  const [result, setResult] = useState<null | ReturnType<typeof import("@/domain/private-office-workflow").runPrivateOfficeWorkflow>>(null);

  function runAnalysis() {
    import("@/domain/private-office-workflow").then(({ runPrivateOfficeWorkflow }) => {
      const res = runPrivateOfficeWorkflow({
        workflowId: "property-insurance-claim",
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
              Property Insurance Claim Letter
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-500">
              {profile.problem} Document your claim with evidence, chronology, and professional correspondence. Review before sending, mail certified, and keep permanent proof of delivery.
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
              Property Insurance Claim Workspace
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Provide the facts of your claim. The system will analyze them, identify issues, and generate a draft for your review.
            </p>

            {/* Intake form */}
            <div className="mt-6 space-y-4">
              <div>
                <label className="input-label">Property address *</label>
                <input
                  className="input-field"
                  value={intakeData["propertyAddress"] ?? ""}
                  onChange={(e) => setIntakeData({ ...intakeData, propertyAddress: e.target.value })}
                  placeholder="123 Main Street, Springfield, IL 62701"
                />
              </div>
              <div>
                <label className="input-label">Insurance company name *</label>
                <input
                  className="input-field"
                  value={intakeData["insurerName"] ?? ""}
                  onChange={(e) => setIntakeData({ ...intakeData, insurerName: e.target.value })}
                  placeholder="ABC Insurance Company"
                />
              </div>
              <div>
                <label className="input-label">Claim number *</label>
                <input
                  className="input-field"
                  value={intakeData["claimNumber"] ?? ""}
                  onChange={(e) => setIntakeData({ ...intakeData, claimNumber: e.target.value })}
                  placeholder="CLM-2026-001234"
                />
              </div>
              <div>
                <label className="input-label">Date of loss *</label>
                <input
                  className="input-field"
                  value={intakeData["dateOfLoss"] ?? ""}
                  onChange={(e) => setIntakeData({ ...intakeData, dateOfLoss: e.target.value })}
                  placeholder="March 15, 2026"
                />
              </div>
              <div>
                <label className="input-label">Description of damage *</label>
                <textarea
                  className="input-field"
                  rows={4}
                  value={intakeData["descriptionOfDamage"] ?? ""}
                  onChange={(e) => setIntakeData({ ...intakeData, descriptionOfDamage: e.target.value })}
                  placeholder="Describe the property damage — affected areas, type of damage, extent of damage..."
                />
              </div>
              <div>
                <label className="input-label">Insurer's position (denial, underpayment, delay, dispute, etc.) *</label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={intakeData["insurerPosition"] ?? ""}
                  onChange={(e) => setIntakeData({ ...intakeData, insurerPosition: e.target.value })}
                  placeholder="Denied claim citing wear and tear exclusion. / Paid $5,000 but estimate is $15,000. / No response in 45 days..."
                />
              </div>
              <div>
                <label className="input-label">Requested resolution *</label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="What do you want the insurer to do — reconsider denial, pay additional amount, inspect, provide written explanation, or other action?"
                />
              </div>
              <div>
                <label className="input-label">Source document text (paste policy, denial letter, or correspondence)</label>
                <textarea
                  className="input-field"
                  rows={6}
                  value={documentText}
                  onChange={(e) => setDocumentText(e.target.value)}
                  placeholder="Paste the text of your policy declarations, denial letter, claim correspondence, or any documents from the insurer..."
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
