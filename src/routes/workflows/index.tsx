import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { workflows } from "@/domain/workflows";
import { workflowProfiles } from "@/domain/workflow-profiles";

export const Route = createFileRoute("/workflows/")({
  component: WorkflowDirectory,
});

function WorkflowDirectory() {
  return (
    <main className="min-h-screen bg-cream">
      <SiteHeader />
      <section className="border-b border-warm-border bg-white py-16">
        <div className="container max-w-5xl">
          <div className="eyebrow">PRIVATE OFFICE WORKFLOWS</div>
          <h1
            className="mt-3 text-4xl font-bold text-indigo-800 md:text-5xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Find the workflow that matches your matter
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-500">
            Each workflow is a real, executable Gold Standard process — not a template.
            Choose the one that matches your situation.
          </p>
        </div>
      </section>
      <section className="py-12">
        <div className="container max-w-5xl">
          <div className="grid gap-6 md:grid-cols-4">
            {Object.values(workflows).map((wf) => {
              const profile = workflowProfiles[wf.id];
              return (
                <Link
                  key={wf.id}
                  to={`/workflows/${wf.id}`}
                  className="card group p-6 transition hover:border-indigo-300 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="badge badge-gold">{profile?.family}</span>
                    <ArrowRight
                      size={18}
                      className="text-slate-300 transition group-hover:text-indigo-600"
                    />
                  </div>
                  <h3
                    className="mt-4 text-xl font-bold text-indigo-800"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {wf.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {wf.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {profile?.supportingKeywords.slice(0, 3).map((kw) => (
                      <span key={kw} className="badge badge-indigo">
                        {kw}
                      </span>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
