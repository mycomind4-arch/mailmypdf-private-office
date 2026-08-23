import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

const footerLinks = [
  { label: "MailMyPDF", href: "https://mailmypdf.ai" },
  { label: "Products", href: "https://mailmypdf.ai/products" },
  { label: "How It Works", href: "https://mailmypdf.ai/how-it-works" },
  { label: "Resources", href: "https://mailmypdf.ai/resources" },
  { label: "Pricing", href: "https://mailmypdf.ai/pricing" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-warm-border bg-white py-12">
      <div className="container">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <Link to="/" className="flex items-center gap-2">
              <ShieldCheck size={20} className="text-indigo-700" />
              <span className="text-base font-bold text-indigo-800" style={{ fontFamily: "var(--font-serif)" }}>
                Private Office
              </span>
            </Link>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              High-stakes correspondence, professionally prepared, provably delivered, and permanently documented. Part of the MailMyPDF ecosystem.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {footerLinks.map((link) => (
              <a key={link.label} href={link.href} className="text-sm text-slate-500 transition hover:text-indigo-700">
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div className="mt-8 border-t border-warm-border pt-6">
          <p className="text-xs text-slate-400">
            Private Office is a correspondence and evidence documentation service. It is not a law firm and does not provide legal advice or representation. © 2026 MailMyPDF.
          </p>
        </div>
      </div>
    </footer>
  );
}
