import "@/styles/private-office-command.css";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, BriefcaseBusiness, FileText, Mail, Plus, ShieldCheck } from "lucide-react";
import { PrivateOfficeChrome } from "@/components/private-office-chrome";
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

const stageLabels = ["Intake", "Facts", "Evidence", "Analysis", "Strategy", "Draft", "Approval", "Delivery", "Proof"];

function DashboardPage() {
  const { user, loading, isConfigured } = useAuth();
  const [matters] = useState<MatterSummary[]>([]);
  const [mattersLoading, setMattersLoading] = useState(true);

  useEffect(() => {
    if (!user || !isConfigured) {
      setMattersLoading(false);
      return;
    }
    setMattersLoading(false);
  }, [user, isConfigured]);

  if (loading) {
    return (
      <main className="office-app-shell">
        <PrivateOfficeChrome />
        <div className="office-page office-page--loading"><span className="office-pulse" /> Loading Private Office…</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="office-app-shell">
        <PrivateOfficeChrome />
        <section className="office-auth-empty">
          <div className="office-auth-panel">
            <div className="office-section-kicker">PRIVATE ACCESS</div>
            <h1>Sign in to your Private Office.</h1>
            <p>Your matters, evidence, correspondence, and delivery records are isolated to your account.</p>
            <Link to="/auth" className="office-primary-action">Sign in <ArrowRight size={16} /></Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="office-app-shell">
      <PrivateOfficeChrome />
      <section className="office-dashboard-head">
        <div className="office-dashboard-head__inner">
          <div>
            <div className="office-section-kicker">PRIVATE OFFICE / MATTERS</div>
            <h1>Your matters.</h1>
            <p>One controlled record from first fact to final proof.</p>
          </div>
          <Link to="/workflows" className="office-primary-action"><Plus size={16} /> Open a matter</Link>
        </div>
      </section>
      <section className="office-page">
        <div className="office-overview-grid">
          <div className="office-stat-panel"><span className="office-stat-panel__label">ACTIVE MATTERS</span><strong>{matters.length}</strong><span className="office-stat-panel__meta">Owner-scoped records</span></div>
          <div className="office-stat-panel"><span className="office-stat-panel__label">CONTROL MODEL</span><strong>9 gates</strong><span className="office-stat-panel__meta">Review before consequence</span></div>
          <div className="office-stat-panel"><span className="office-stat-panel__label">DELIVERY</span><strong>Verified</strong><span className="office-stat-panel__meta">Mail + proof boundary</span></div>
        </div>
        {mattersLoading ? (
          <div className="office-empty-state"><span className="office-pulse" /> Loading matters…</div>
        ) : matters.length === 0 ? (
          <div className="office-empty-state office-empty-state--hero">
            <div className="office-empty-state__icon"><BriefcaseBusiness size={22} /></div>
            <div>
              <div className="office-section-kicker">NO ACTIVE MATTERS</div>
              <h2>Your office is ready.</h2>
              <p>Start with a workflow. Private Office will turn the matter into a controlled record with facts, evidence, analysis, review, delivery, and proof.</p>
              <Link to="/workflows" className="office-secondary-action">Browse workflows <ArrowRight size={15} /></Link>
            </div>
          </div>
        ) : (
          <div className="office-matter-list">
            {matters.map((matter) => (
              <article key={matter.id} className="office-matter-card">
                <div className="office-matter-card__topline"><span className={`office-status office-status--${matter.status}`}>{matter.status.replace(/_/g, " ")}</span><span>Updated {new Date(matter.updatedAt).toLocaleDateString()}</span></div>
                <div className="office-matter-card__body">
                  <div><h2>{matter.title}</h2><p>{matter.workflowId}</p></div>
                  {matter.trackingNumber ? <div className="office-tracking"><Mail size={14} /> {matter.trackingNumber}</div> : null}
                </div>
                <div className="office-stage-row" aria-label="Matter lifecycle">{stageLabels.map((stage) => <span key={stage}>{stage}</span>)}</div>
              </article>
            ))}
          </div>
        )}
        <div className="office-workflow-section">
          <div className="office-section-heading">
            <div><div className="office-section-kicker">WORKFLOW LIBRARY</div><h2>Open a new matter</h2></div>
            <span className="office-section-note"><ShieldCheck size={14} /> Every workflow uses the same control model</span>
          </div>
          <div className="office-workflow-grid">
            {Object.values(workflows).map((wf) => (
              <Link key={wf.id} to={`/workflows/${wf.id}`} className="office-workflow-card">
                <div className="office-workflow-card__icon"><FileText size={17} /></div>
                <div className="office-workflow-card__copy"><h3>{wf.title}</h3><p>{wf.description}</p></div>
                <ArrowRight size={16} className="office-workflow-card__arrow" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
