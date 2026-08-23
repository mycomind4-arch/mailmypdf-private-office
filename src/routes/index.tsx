import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ShieldCheck,
  Scale,
  Mail,
  Stamp,
  Lock,
  Briefcase,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/")({ component: HomePage });

const lifecycle = [
  { n: "01", title: "Prepare", desc: "Organize facts, evidence, and documents into a clear matter record." },
  { n: "02", title: "Review", desc: "Review a professional draft with source-grounded facts and provenance tracking." },
  { n: "03", title: "Approve", desc: "Explicit human approval is required before any consequential action." },
  { n: "04", title: "Deliver", desc: "Certified mail with tracking and proof of delivery — your record that it was received." },
  { n: "05", title: "Prove", desc: "Permanent proof of mailing, delivery, and correspondence preserved for your records." },
];

const features = [
  { icon: Briefcase, title: "Matter-centric workflow", desc: "Each matter — dispute, notice, claim — is tracked from intake through proof with a full audit trail." },
  { icon: Scale, title: "Evidence-grounded drafting", desc: "Drafts are built from your facts and evidence, with clear provenance. Nothing is manufactured." },
  { icon: ShieldCheck, title: "Approval-gated delivery", desc: "Nothing is mailed without explicit human approval. Consequential actions are protected at every gate." },
  { icon: Mail, title: "Certified mail with proof", desc: "Physical mail via USPS with tracking and return receipt. Proof of timely delivery preserved permanently." },
  { icon: Lock, title: "Private & secure", desc: "Every matter is encrypted, owner-scoped, and isolated. No one else can access your correspondence." },
  { icon: Stamp, title: "Permanent documentation", desc: "Your correspondence, evidence, and delivery proof are documented for future reference or escalation." },
];

const workflowCards = [
  {
    title: "Contractor Dispute",
    description:
      "Document defective or incomplete work, billing disputes, or breach of agreement with a professional dispute letter.",
    href: "/workflows/contractor-dispute",
    family: "Property",
  },
  {
    title: "Property Insurance Claim",
    description:
      "Document and pursue a property insurance claim — denied claims, underpayments, disputed scope, or supplemental claims — with evidence, chronology, and professional correspondence.",
    href: "/workflows/property-insurance-claim",
    family: "Property",
  },
  {
    title: "Bank & Wire Transfer Dispute",
    description:
      "Document a bank or wire transfer dispute — unauthorized wires, mistaken transfers, beneficiary errors, bank refusals, or delayed investigations — with transaction records, chronology, and professional correspondence.",
    href: "/workflows/bank-wire-dispute",
    family: "Financial",
  },
];

const faqItems = [
  { q: "Is this legal advice?", a: "No. Private Office is a correspondence preparation and evidence documentation service. It is not a law firm and does not provide legal advice or representation." },
  { q: "What can I use Private Office for?", a: "High-stakes correspondence: contractor disputes, property insurance claims, bank and wire transfer disputes, formal records requests, and other matters where professional preparation and proof of delivery matter." },
  { q: "How does the mailing work?", a: "Your final document is printed, enveloped, and mailed via USPS. Choose first-class, certified, or certified with return receipt for proof of delivery." },
  { q: "Is my data secure?", a: "All documents are encrypted and owner-scoped. No other user can access your matters, evidence, or delivery records. You can request deletion at any time." },
  { q: "Can I escalate a matter?", a: "Each workflow is designed with clean extension points for follow-up notices, demand letters, insurance claims, or legal escalation when needed." },
];

function HomePage() {
  return (
    <main>
      <SiteHeader variant="transparent" />

      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #312e81 0%, #4338ca 50%, #1e1b4b 100%)" }}
      >
        <div className="container relative py-20 md:py-28">
          <div className="max-w-2xl">
            <div
              className="badge badge-gold mb-5"
              style={{ background: "rgba(251,191,36,.15)", color: "#fde047" }}
            >
              Premium correspondence
            </div>
            <h1
              className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              High-stakes correspondence. Professionally prepared. Provably delivered.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">
              Private Office helps you prepare, review, send, and document your most important correspondence —
              with evidence organization, approval gates, certified mail, and permanent proof of delivery.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/workflows/contractor-dispute" className="btn-gold text-base">
                Start a Matter <ArrowRight size={18} />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10"
              >
                How it works
              </a>
            </div>
            <p className="mt-5 text-sm text-white/50">
              Not a law firm. Not legal advice. You remain in control of the facts and final document.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-b border-warm-border bg-cream py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <div className="eyebrow">THE LIFECYCLE</div>
            <h2
              className="mt-3 text-3xl font-bold text-indigo-800 md:text-4xl"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Prepare → Review → Approve → Deliver → Prove
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-500">
              Every matter follows a documented lifecycle with approval gates, evidence tracking, and permanent proof.
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-5">
            {lifecycle.map((step) => (
              <div key={step.n} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-lg font-bold text-indigo-700">
                  {step.n}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-indigo-800">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <div className="eyebrow">CAPABILITIES</div>
            <h2
              className="mt-3 text-3xl font-bold text-indigo-800 md:text-4xl"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Built for matters where the stakes are real
            </h2>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.title} className="card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
                  <feature.icon size={24} className="text-indigo-700" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-indigo-800">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflows */}
      <section id="workflows" className="border-y border-warm-border bg-cream py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <div className="eyebrow">AVAILABLE WORKFLOWS</div>
            <h2
              className="mt-3 text-3xl font-bold text-indigo-800 md:text-4xl"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Start with the matter that matters to you
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-500">
              Each workflow is a real, executable Gold Standard process — not a template.
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {workflowCards.map((wf) => (
              <Link key={wf.title} to={wf.href as "/workflows/contractor-dispute" | "/workflows/property-insurance-claim" | "/workflows/bank-wire-dispute"} className="card group p-6 transition hover:border-indigo-300 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="badge badge-gold">{wf.family}</span>
                  <ArrowRight size={18} className="text-slate-300 transition group-hover:text-indigo-600" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-indigo-800" style={{ fontFamily: "var(--font-serif)" }}>
                  {wf.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{wf.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28">
        <div className="container max-w-3xl">
          <div className="text-center">
            <div className="eyebrow">FAQ</div>
            <h2
              className="mt-3 text-3xl font-bold text-indigo-800"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Common questions
            </h2>
          </div>
          <div className="mt-12 space-y-4">
            {faqItems.map((item) => (
              <div key={item.q} className="card p-6">
                <h3 className="font-semibold text-indigo-800">{item.q}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
