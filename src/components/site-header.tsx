import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/use-auth";

const navLinks = [
  { label: "MailMyPDF", href: "https://mailmypdf.ai" },
  { label: "Products", href: "https://mailmypdf.ai/products" },
  { label: "How It Works", href: "https://mailmypdf.ai/how-it-works" },
  { label: "Resources", href: "https://mailmypdf.ai/resources" },
  { label: "Pricing", href: "https://mailmypdf.ai/pricing" },
];

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
