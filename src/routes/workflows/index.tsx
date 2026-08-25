import "@/styles/private-office-command.css";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { PrivateOfficeChrome } from "@/components/private-office-chrome";
import { workflows } from "@/domain/workflows";
import { workflowProfiles } from "@/domain/workflow-profiles";

export const Route = createFileRoute("/workflows/")({ component: WorkflowDirectory });

function WorkflowDirectory() {
  return (
    <main className="office-app-shell">
      <PrivateOfficeChrome />
      <section className="office-dashboard-head">
        <div className="office-dashboard-head__inner">
          <div>
            <div className="office-section-kicker">PRIVATE OFFICE / WORKFLOW LIBRARY</div>
            <h1>Choose the matter.</h1>
            <p>Each workflow is an executable Gold Standard process with evidence, review, authorization, delivery, and proof built into the same control model.</p>
          </div>
          <div className="office-section-note"><ShieldCheck size={14} /> Consequential actions remain approval-gated</div>
        </div>
      </section>
      <section className="office-page">
        <div className="office-workflow-grid">
          {Object.values(workflows).map((wf) => {
            const profile = workflowProfiles[wf.id];
            return (
              <Link key={wf.id} to={`/workflows/${wf.id}`} className="office-workflow-card">
                <div className="office-workflow-card__icon"><ShieldCheck size={17} /></div>
                <div className="office-workflow-card__copy">
                  <div className="office-section-kicker">{profile?.family ?? "PRIVATE MATTER"}</div>
                  <h3>{wf.title}</h3>
                  <p>{wf.description}</p>
                  <div className="office-keywords">
                    {profile?.supportingKeywords.slice(0, 3).map((kw) => <span key={kw}>{kw}</span>)}
                  </div>
                </div>
                <ArrowRight size={16} className="office-workflow-card__arrow" />
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
