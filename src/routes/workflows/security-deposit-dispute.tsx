import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Mail,
  DollarSign,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { workflowProfiles } from "@/domain/workflow-profiles";
import { useAuth } from "@/lib/use-auth";

export const Route = createFileRoute("/workflows/security-deposit-dispute")({
  head: () => ({
    meta: [
      {
        title:
          "Security Deposit Dispute Letter — Prepare, Review, Send & Prove | Private Office",
      },
      {
        name: "description",
        content:
          "Prepare a professional security deposit dispute letter for non-return, partial return, unauthorized deductions, or disputed damage charges. Organize lease evidence, condition reports, correspondence, and send certified mail with proof of delivery.",
      },
      { name: "robots", content: "index,follow" },
      {
        property: "og:title",
        content: "Security Deposit Dispute Letter — Private Office",
      },
      {
        property: "og:description",
        content:
          "Document your security deposit dispute with lease evidence, move-in/move-out condition reports, and professional correspondence. Certified mail with proof of delivery.",
      },
    ],
  }),
  component: SecurityDepositDisputePage,
});

const profile = workflowProfiles["security-deposit-dispute"];

const authoritySections = [
  {
    icon: FileText,
    title: "Overview",
    content:
      "A security deposit dispute letter formally documents your position when a landlord or property manager has not returned your deposit, returned only part of it with disputed deductions, or charged for damage you did not cause. The letter creates a clear factual record, identifies the lease terms, states the deposit amount and disputed charges, and requests a documented resolution — all of which may be critical if the matter escalates to a demand letter or legal proceeding.",
  },
  {
    icon: CheckCircle2,
    title: "When to use this workflow",
    content:
      "Use this workflow when your security deposit has not been returned within the expected timeframe, when deductions appear unauthorized or undocumented, when the landlord has not provided an itemized statement, or when you dispute the damage charges. This workflow helps you organize your lease, condition reports, and correspondence into a professional dispute letter.",
  },
  {
    icon: ShieldCheck,
    title: "What Private Office does",
    content:
      "Private Office helps you prepare a documented dispute letter, organize your evidence (lease, move-in and move-out condition reports, photos, correspondence), build a timeline, review the draft, and mail it via certified mail with proof of delivery. Private Office is not a law firm and does not provide legal advice or representation.",
  },
  {
    icon: AlertTriangle,
    title: "What Private Office does NOT do",
    content:
      "Private Office does not determine the lawful amount of your deposit, interpret lease provisions as legal conclusions, provide legal advice, represent you in landlord-tenant court, or guarantee any outcome including deposit return. You remain responsible for the facts and decisions in your matter.",
  },
  {
    icon: Mail,
    title: "Certified mail with proof of delivery",
    content:
      "Your dispute letter is sent via certified mail with return receipt, providing proof that your correspondence was delivered. This creates an auditable trail that the recipient received your dispute, which may be important if the matter escalates.",
  },
];

function SecurityDepositDisputePage() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-cream">
      <SiteHeader />
      <section className="border-b border-warm-border bg-white py-16">
        <div className="container max-w-3xl">
          <div className="eyebrow">PRIVATE OFFICE — {profile.family.toUpperCase()}</div>
          <h1
            className="mt-3 text-4xl font-bold text-indigo-800 md:text-5xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Security Deposit Dispute Letter
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-500">
            {profile.problem}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {profile.supportingKeywords.slice(0, 5).map((kw) => (
              <span key={kw} className="badge badge-indigo">
                {kw}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container max-w-3xl space-y-8">
          {authoritySections.map((section) => (
            <div key={section.title} className="card p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 rounded-lg bg-indigo-50 p-3">
                  <section.icon size={24} className="text-indigo-600" />
                </div>
                <div>
                  <h2
                    className="text-xl font-bold text-indigo-800"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {section.title}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {section.content}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <div className="card p-6">
            <h2
              className="text-xl font-bold text-indigo-800"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              What you'll need
            </h2>
            <ul className="mt-4 space-y-2">
              {profile.requiredFacts.map((fact) => (
                <li key={fact} className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 size={16} className="text-indigo-500" />
                  {fact}
                </li>
              ))}
            </ul>
            <h3 className="mt-6 text-sm font-semibold text-slate-700">Evidence items:</h3>
            <ul className="mt-2 space-y-1">
              {profile.evidenceRequirements.map((req) => (
                <li key={req} className="flex items-center gap-2 text-sm text-slate-500">
                  <FileText size={14} className="text-slate-400" />
                  {req}
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-6">
            <h2
              className="text-xl font-bold text-indigo-800"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Pricing
            </h2>
            <div className="mt-4 flex items-center gap-3">
              <DollarSign size={20} className="text-indigo-500" />
              <span className="text-lg font-bold text-slate-800">
                ${profile.pricing.preparationFee}
              </span>
              <span className="text-sm text-slate-500">
                preparation fee ({profile.pricing.includedResponsePages} pages included)
              </span>
            </div>
            <div className="mt-2 text-sm text-slate-500">
              Additional pages: ${profile.pricing.responsePagePrice} response /
              {" "}${profile.pricing.supportingPagePrice} supporting
            </div>
            <div className="mt-2 text-sm text-slate-500">
              Certified mail: ${profile.pricing.certifiedMail} ·
              Return receipt: ${profile.pricing.certifiedReturnReceipt}
            </div>
          </div>

          <div className="rounded-lg bg-indigo-50 p-6">
            <p className="text-sm leading-7 text-slate-600">
              {profile.disclaimer}
            </p>
          </div>

          {user ? (
            <a
              href={`/workflows/security-deposit-dispute/start`}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-white transition hover:bg-indigo-700"
            >
              Start your security deposit dispute
              <ArrowRight size={18} />
            </a>
          ) : (
            <a
              href="/auth"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-white transition hover:bg-indigo-700"
            >
              Sign in to start your dispute
              <ArrowRight size={18} />
            </a>
          )}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
