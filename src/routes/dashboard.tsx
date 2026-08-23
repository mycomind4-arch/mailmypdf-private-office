import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Briefcase, ArrowRight, Mail, FileText } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useAuth } from "@/lib/use-auth";
import { workflows } from "@/domain/workflows";

export const Route = createFileRoute("/dashboard")({ component: DashboardPage });

interface MatterSummary {
  id: string;
  title: string;
  workflowId: string;
  status: string;
  updatedAt: string;
  trackingNumber?: string | null;
}

function DashboardPage() {
  const { user, loading, isConfigured } = useAuth();
  const [matters] = useState<MatterSummary[]>([]);
  const [mattersLoading, setMattersLoading] = useState(true);

  useEffect(() => {
    if (!user || !isConfigured) {
      setMattersLoading(false);
      return;
    }
    // In production, this would call a server function to list matters.
    // For now, show the workflow directory as the starting point.
    setMattersLoading(false);
  }, [user, isConfigured]);

  if (loading) {
    return (
      <main className="min-h-screen bg-cream">
        <SiteHeader />
        <div className="container py-20 text-center">
          <p className="text-slate-400">Loading…</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-cream">
        <SiteHeader />
        <section className="py-20">
          <div className="container max-w-md text-center">
            <h1 className="text-2xl font-bold text-indigo-800" style={{ fontFamily: "var(--font-serif)" }}>
              Sign in to view your matters
            </h1>
            <p className="mt-3 text-sm text-slate-500">
              Your matters, evidence, and delivery records are private and require authentication.
            </p>
            <Link to="/auth" className="btn-primary mt-6">
              Sign in <ArrowRight size={16} />
            </Link>
          </div>
        </section>
        <SiteFooter />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream">
      <SiteHeader />
      <section className="border-b border-warm-border bg-white py-12">
        <div className="container">
          <div className="flex items-center justify-between">
            <div>
              <div className="eyebrow">YOUR MATTERS</div>
              <h1 className="mt-2 text-3xl font-bold text-indigo-800" style={{ fontFamily: "var(--font-serif)" }}>
                Welcome back
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage your active matters, review drafts, and track delivery.
              </p>
            </div>
            <Link to="/workflows/contractor-dispute" className="btn-gold">
              Start a new matter <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          {mattersLoading ? (
            <p className="text-slate-400">Loading matters…</p>
          ) : matters.length === 0 ? (
            <div className="card p-12 text-center">
              <Briefcase size={48} className="mx-auto text-indigo-300" />
              <h2 className="mt-4 text-xl font-semibold text-indigo-800">No active matters yet</h2>
              <p className="mt-2 text-sm text-slate-500">
                Start your first matter to prepare, review, send, and document professional correspondence.
              </p>
              <Link to="/workflows/contractor-dispute" className="btn-primary mt-6">
                Start a Contractor Dispute <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {matters.map((matter) => (
                <div key={matter.id} className="card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`status-badge status-${matter.status}`}>{matter.status.replace(/_/g, " ")}</span>
                      <h3 className="mt-2 text-lg font-semibold text-indigo-800">{matter.title}</h3>
                      <p className="mt-1 text-xs text-slate-400">Updated {new Date(matter.updatedAt).toLocaleDateString()}</p>
                    </div>
                    {matter.trackingNumber && (
                      <div className="flex items-center gap-2 text-sm text-indigo-600">
                        <Mail size={16} />
                        <span>{matter.trackingNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Available workflows */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-indigo-800" style={{ fontFamily: "var(--font-serif)" }}>
              Available workflows
            </h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {Object.values(workflows).map((wf) => (
                <Link key={wf.id} to="/workflows/contractor-dispute" className="card group p-6 transition hover:border-indigo-300">
                  <div className="flex items-center justify-between">
                    <FileText size={20} className="text-indigo-600" />
                    <ArrowRight size={16} className="text-slate-300 transition group-hover:text-indigo-600" />
                  </div>
                  <h3 className="mt-3 font-semibold text-indigo-800">{wf.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{wf.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
