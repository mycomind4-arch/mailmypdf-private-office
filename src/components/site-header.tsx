import { Link } from "@tanstack/react-router";
import { ShieldCheck, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { ECOSYSTEM_PRODUCTS, ECOSYSTEM_PAGE_URL } from "./ecosystem-nav";
import { useAuth } from "@/lib/use-auth";

const navLinks = [
  { label: "MailMyPDF", href: "https://mailmypdf.ai" },
  { label: "Products", href: "https://mailmypdf.ai/products" },
  { label: "How It Works", href: "https://mailmypdf.ai/how-it-works" },
  { label: "Resources", href: "https://mailmypdf.ai/resources" },
  { label: "Pricing", href: "https://mailmypdf.ai/pricing" },
];


function WorkflowsDropdown({ isTransparent }: { isTransparent?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={isTransparent ? "flex items-center gap-1 text-sm font-medium text-white/80 transition hover:text-white" : "flex items-center gap-1 text-sm font-medium text-slate-500 transition hover:text-indigo-700"}
      >
        Workflows
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1.5 w-[520px] max-w-[calc(100vw-2rem)]">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
            <div className="border-b border-slate-100 px-5 py-3">
              <div className="font-serif text-base text-slate-900">Workflows</div>
              <p className="mt-0.5 text-xs text-slate-500">Purpose-built products for specific document problems.</p>
            </div>
            <div className="grid gap-px bg-slate-100 sm:grid-cols-2">
              {ECOSYSTEM_PRODUCTS.map((p) => (
                <a
                  key={p.product}
                  href={p.href}
                  onClick={() => setOpen(false)}
                  className="block bg-white px-4 py-3 transition-colors hover:bg-slate-50"
                >
                  <div className="font-medium text-sm text-slate-900">{p.product}</div>
                  <div className="mt-0.5 text-xs leading-5 text-slate-500">{p.description}</div>
                </a>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-2.5">
              <a href={ECOSYSTEM_PAGE_URL} onClick={() => setOpen(false)} className="text-xs font-medium text-indigo-700 hover:text-indigo-600">
                Explore all workflows →
              </a>
              <div className="text-[10px] text-slate-400">{ECOSYSTEM_PRODUCTS.length} product families</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function SiteHeader({ variant }: { variant?: "transparent" | "solid" }) {
  const { user } = useAuth();
  const isTransparent = variant === "transparent";

  return (
    <header
      className={isTransparent ? "absolute inset-x-0 top-0 z-50" : "border-b border-warm-border bg-white"}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <ShieldCheck size={24} className={isTransparent ? "text-gold-300" : "text-indigo-700"} />
          <span
            className={isTransparent ? "text-lg font-bold text-white" : "text-lg font-bold text-indigo-800"}
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Private Office
          </span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <WorkflowsDropdown isTransparent={isTransparent} />
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={
                isTransparent
                  ? "text-sm font-medium text-white/80 transition hover:text-white"
                  : "text-sm font-medium text-slate-500 transition hover:text-indigo-700"
              }
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/dashboard" className={isTransparent ? "text-sm font-medium text-white/80 hover:text-white" : "text-sm font-medium text-slate-500 hover:text-indigo-700"}>
                Dashboard
              </Link>
              <Link to="/workflows/contractor-dispute" className="btn-gold text-sm">
                Start a Matter
              </Link>
            </>
          ) : (
            <>
              <Link to="/auth" className={isTransparent ? "text-sm font-medium text-white/80 hover:text-white" : "text-sm font-medium text-slate-500 hover:text-indigo-700"}>
                Sign In
              </Link>
              <Link to="/workflows/contractor-dispute" className={isTransparent ? "btn-gold text-sm" : "btn-primary text-sm"}>
                Start a Matter
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
