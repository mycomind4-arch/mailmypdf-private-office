import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { ECOSYSTEM_PRODUCTS } from "./ecosystem-shell";

export function SiteFooter() {
  return (
    <footer className="border-t border-rule/60 bg-paper py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 sm:gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2">
              <ShieldCheck size={20} className="text-indigo-700" />
              <span className="font-serif text-lg">Private Office</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
              High-stakes correspondence, professionally prepared, provably delivered, and permanently documented. Part of the MailMyPDF ecosystem.
            </p>
          </div>

          {/* Products */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Products</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/products" className="text-ink-soft transition-colors hover:text-foreground">All Products</Link></li>
              <li><Link to="/workflows" className="text-ink-soft transition-colors hover:text-foreground">Workflows</Link></li>
              <li><a href="https://mailmypdf.ai" className="text-ink-soft transition-colors hover:text-foreground">MailMyPDF</a></li>
              <li><a href="https://appeal.mailmypdf.ai" className="text-ink-soft transition-colors hover:text-foreground">Appeal Mail</a></li>
              <li><a href="https://dispute.mailmypdf.ai" className="text-ink-soft transition-colors hover:text-foreground">Dispute Mail</a></li>
            </ul>
          </div>

          {/* Learn */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Learn</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/how-it-works" className="text-ink-soft transition-colors hover:text-foreground">How It Works</Link></li>
              <li><Link to="/pricing" className="text-ink-soft transition-colors hover:text-foreground">Pricing</Link></li>
              <li><Link to="/workflows" className="text-ink-soft transition-colors hover:text-foreground">Browse Workflows</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Legal</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="https://mailmypdf.ai/privacy" className="text-ink-soft transition-colors hover:text-foreground">Privacy</a></li>
              <li><a href="https://mailmypdf.ai/terms" className="text-ink-soft transition-colors hover:text-foreground">Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-rule/40 pt-6">
          <p className="text-xs text-muted-foreground">
            Private Office is a correspondence and evidence documentation service. It is not a law firm and does not provide legal advice or representation. © 2026 MailMyPDF.
          </p>
        </div>
      </div>
    </footer>
  );
}
