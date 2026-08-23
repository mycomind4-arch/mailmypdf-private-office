import { describe, expect, it } from "vitest";
import { workflows, workflowList, type WorkflowId } from "./workflows";

describe("workflow registry", () => {
  it("registers contractor-dispute as the first Gold Standard workflow", () => {
    expect(workflows["contractor-dispute"]).toBeDefined();
    expect(workflows["contractor-dispute"].lifecycle).toBe("gold");
    expect(workflows["contractor-dispute"].title).toBe("Contractor Dispute");
  });

  it("defines the canonical 18 Gold Standard stages", () => {
    const stages = workflows["contractor-dispute"].goldStandardStages;
    expect(stages).toHaveLength(18);
    expect(stages[0]).toBe("secure-ingest");
    expect(stages[stages.length - 1]).toBe("prove-audit");
  });

  it("assigns P06 and P10 pipeline archetypes to contractor-dispute", () => {
    const archetypes = workflows["contractor-dispute"].pipelineArchetypes;
    expect(archetypes).toContain("P06");
    expect(archetypes).toContain("P10");
  });

  it("includes standard workflow steps", () => {
    const steps = workflows["contractor-dispute"].steps;
    expect(steps).toContain("intro");
    expect(steps).toContain("draft");
    expect(steps).toContain("review");
    expect(steps).toContain("mailing");
    expect(steps).toContain("submitted");
  });

  it("includes a disclaimer", () => {
    expect(workflows["contractor-dispute"].disclaimer).toContain("not a law firm");
  });

  it("exposes a workflow list", () => {
    expect(workflowList).toHaveLength(1);
    expect(workflowList[0].id).toBe("contractor-dispute");
  });

  it("workflow IDs are string literals", () => {
    const id: WorkflowId = "contractor-dispute";
    expect(workflows[id]).toBeDefined();
  });
});
