import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ShieldCheck,
  Scale,
  Mail,
  Stamp,
  Lock,
  Briefcase,
  FileCheck2,
  Landmark,
  ScrollText,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/")({ component: HomePage });

const lifecycle = [
  ["01", "Prepare", "Facts, documents, and evidence become one controlled matter record."],
  ["02", "Understand", "Chronology, findings, risks, and open questions are surfaced before drafting."],
  ["03", "Review", "A source-grounded draft is presented with provenance and version integrity."],
  ["04", "Approve", "Nothing consequential moves forward without your explicit approval."],
  ["05", "Prove", "Mailing, delivery, and correspondence records remain part of the matter."],
];

const capabilities = [
  [Briefcase, "Matter intelligence", "A single workspace for the facts, evidence, timeline, strategy, correspondence, and actions that define a matter."],
  [FileCheck2, "Evidence & provenance", "Every important conclusion traces back to supplied material or is clearly identified as generated or externally sourced."],
  [Scale, "Decision support", "Surface contradictions, missing evidence, timing issues, and risks without pretending to make legal conclusions."],
  [ShieldCheck, "Human control", "AI can assist analysis and drafting. It cannot approve, pay, authorize, or send on your behalf."],
  [Mail, "Physical correspondence", "Turn an approved document into professionally fulfilled physical mail through the MailMyPDF boundary."],
  [Lock, "Private by design", "Owner-scoped matters, controlled writes, audit events, and deliberate authorization gates protect consequential work."],
];

const domains = [
  { icon: Landmark, family: "PROPERTY", title: "Property & disputes", copy: "Contractor disputes, insurance claims, property correspondence, and other matters where documentation and timing matter.", href: "/workflows/contractor-dispute" },
  { icon: Scale, family: "FINANCIAL", title: "Financial matters", copy: "Bank and wire transfer disputes with transaction records, chronology, evidence, and controlled correspondence.", href: "/workflows/bank-wire-dispute" },
  { icon: ScrollText, family: "TRUST & ESTATE", title: "Trust & estate", copy: "Beneficiary notices and trustee correspondence organized around the documents and facts of the matter.", href: "/workflows/trust-beneficiary-notice" },
];

const faqs = [
  ["What is Private Office?", "Private Office is a matter-centric correspondence and documentation environment for consequential personal and professional affairs. It organizes facts, evidence, analysis, drafting, approval, fulfillment, and proof in one controlled record."],
  ["Does Private Office provide legal advice?", "No. Private Office is not a law firm and does not provide legal advice or representation. It helps organize information and prepare correspondence while keeping consequential decisions under human control."],
  ["Can AI make decisions for me?", "No. AI is advisory. It may help analyze supplied information or improve a draft, but it cannot authorize mailing, approve payment, replace human approval, or silently overwrite user facts."],
  ["What happens after I approve a document?", "The approved version is preserved with its integrity information and can move through the fulfillment gates to physical mailing. Delivery and correspondence records become part of the matter record."],
];

function HomePage() {
  return (
    <main className="po-site">
      <SiteHeader variant="transparent" />

      <section className="po-hero">
        <div className="po-orb po-orb-one" />
        <div className="po-orb po-orb-two" />
        <div className="container relative z-10 py-24 md:py-32">
          <div className="max-w-4xl">
            <div className="po-kicker"><span /> PRIVATE OFFICE <span /></div>
            <h1 className="po-display mt-7">
              Private matters.<br />Handled with <em>precision.</em>
            </h1>
            <p className="po-hero-copy mt-7 max-w-2xl">
              A private operating environment for consequential correspondence — bringing your facts, evidence, chronology, strategy, drafting, approval, and proof into one controlled matter record.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link to="/workflows/contractor-dispute" className="po-button po-button-gold">
                Open a Private Matter <ArrowRight size={17} />
              </Link>
              <a href="#system" className="po-button po-button-quiet">Explore the system</a>
            </div>
            <div className="po-trust-line mt-8">
              <span><Lock size={14} /> Owner-scoped</span>
              <span><ShieldCheck size={14} /> Human approval</span>
              <span><Stamp size={14} /> Proof preserved</span>
            </div>
          </div>
        </div>
        <div className="po-hero-bottom" />
      </section>

      <section id="system" className="po-section po-section-dark">
        <div className="container">
          <div className="grid gap-14 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div>
              <div className="po-section-label">THE PRIVATE OFFICE</div>
              <h2 className="po-heading mt-4">More than a letter.<br /><span>A complete matter record.</span></h2>
            </div>
            <p className="po-muted max-w-xl text-lg leading-8">
              Private Office is built around the matter, not the document. The correspondence is only one outcome of a deeper process of organizing facts, understanding evidence, making decisions, and preserving what happened.
            </p>
          </div>

          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-5">
            {lifecycle.map(([n, title, copy]) => (
              <div key={n} className="po-lifecycle">
                <div className="po-number">{n}</div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="po-section po-section-slate">
        <div className="container">
          <div className="po-section-label">THE OPERATING SYSTEM</div>
          <div className="mt-4 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <h2 className="po-heading max-w-3xl">Quietly powerful.<br /><span>Deliberately controlled.</span></h2>
            <p className="po-muted max-w-md leading-7">The system is designed for matters where mistakes, missing records, or an unverified statement can have real consequences.</p>
          </div>
          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map(([Icon, title, copy]) => (
              <div key={title as string} className="po-capability">
                <div className="po-icon"><Icon size={19} /></div>
                <h3>{title as string}</h3>
                <p>{copy as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="po-section po-section-paper">
        <div className="container">
          <div className="po-section-label po-section-label-light">MATTER DOMAINS</div>
          <h2 className="po-heading po-heading-light mt-4">Begin with the situation.<br /><span>Build from there.</span></h2>
          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {domains.map(({ icon: Icon, family, title, copy, href }) => (
              <Link key={title} to={href} className="po-domain group">
                <div className="flex items-center justify-between">
                  <div className="po-domain-icon"><Icon size={18} /></div>
                  <ArrowRight size={18} className="text-white/30 transition group-hover:translate-x-1 group-hover:text-gold-400" />
                </div>
                <div className="po-domain-family">{family}</div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="po-section po-section-dark">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-[1fr_.9fr] lg:items-center">
            <div>
              <div className="po-section-label">A DIFFERENT KIND OF AI</div>
              <h2 className="po-heading mt-4">Intelligence without surrendering control.</h2>
              <p className="po-muted mt-6 max-w-xl text-lg leading-8">
                Private Office uses multi-LLM assistance as an advisory layer. The deterministic workflow remains in charge. Your facts remain yours. Conflicts are surfaced. Provenance is retained. Consequential actions stay behind human gates.
              </p>
            </div>
            <div className="po-integrity">
              <div><span>AI</span><strong>ADVISORY</strong></div>
              <div><span>FACTS</span><strong>USER CONTROLLED</strong></div>
              <div><span>APPROVAL</span><strong>HUMAN REQUIRED</strong></div>
              <div><span>FULFILLMENT</span><strong>GATED</strong></div>
              <div><span>PROOF</span><strong>PRESERVED</strong></div>
            </div>
          </div>
        </div>
      </section>

      <section className="po-section po-section-slate">
        <div className="container max-w-4xl">
          <div className="text-center">
            <div className="po-section-label">QUESTIONS</div>
            <h2 className="po-heading mt-4">A few things worth knowing.</h2>
          </div>
          <div className="mt-12 divide-y divide-white/10 border-y border-white/10">
            {faqs.map(([q, a]) => (
              <details key={q} className="po-faq group">
                <summary>{q}<span>+</span></summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="po-final-cta">
        <div className="container py-24 text-center md:py-32">
          <div className="po-section-label">PRIVATE OFFICE</div>
          <h2 className="po-display mt-5">When the matter matters,<br /><em>keep a record.</em></h2>
          <p className="po-muted mx-auto mt-6 max-w-xl text-lg leading-8">Organize the facts. Understand the evidence. Approve the correspondence. Preserve the proof.</p>
          <Link to="/workflows/contractor-dispute" className="po-button po-button-gold mt-9">Open a Private Matter <ArrowRight size={17} /></Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
