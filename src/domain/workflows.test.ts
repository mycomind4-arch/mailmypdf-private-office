import { describe, expect, it } from "vitest";
import { workflows, workflowList, type WorkflowId } from "./workflows";

describe("workflow registry", () => {
  it("registers contractor-dispute as a Gold Standard workflow", () => {
    expect(workflows["contractor-dispute"]).toBeDefined();
    expect(workflows["contractor-dispute"].lifecycle).toBe("gold");
    expect(workflows["contractor-dispute"].title).toBe("Contractor Dispute");
  });

  it("registers property-insurance-claim as a Gold Standard workflow", () => {
    expect(workflows["property-insurance-claim"]).toBeDefined();
    expect(workflows["property-insurance-claim"].lifecycle).toBe("gold");
    expect(workflows["property-insurance-claim"].title).toBe("Property Insurance Claim");
  });

  it("defines the canonical 18 Gold Standard stages for both workflows", () => {
    for (const id of Object.keys(workflows) as WorkflowId[]) {
      const stages = workflows[id].goldStandardStages;
      expect(stages).toHaveLength(18);
      expect(stages[0]).toBe("secure-ingest");
      expect(stages[stages.length - 1]).toBe("prove-audit");
    }
  });

  it("assigns P06 and P10 pipeline archetypes to both workflows", () => {
    for (const id of Object.keys(workflows) as WorkflowId[]) {
      const archetypes = workflows[id].pipelineArchetypes;
      expect(archetypes).toContain("P06");
      expect(archetypes).toContain("P10");
    }
  });

  it("includes standard workflow steps for both workflows", () => {
    for (const id of Object.keys(workflows) as WorkflowId[]) {
      const steps = workflows[id].steps;
      expect(steps).toContain("intro");
      expect(steps).toContain("draft");
      expect(steps).toContain("review");
      expect(steps).toContain("mailing");
      expect(steps).toContain("submitted");
    }
  });

  it("includes a disclaimer for both workflows", () => {
    for (const id of Object.keys(workflows) as WorkflowId[]) {
      expect(workflows[id].disclaimer).toContain("not a law firm");
    }
  });

  it("exposes a workflow list with both workflows", () => {
    expect(workflowList).toHaveLength(2);
    expect(workflowList.map((w) => w.id)).toContain("contractor-dispute");
    expect(workflowList.map((w) => w.id)).toContain("property-insurance-claim");
  });

  it("workflow IDs are string literals", () => {
    const contractorId: WorkflowId = "contractor-dispute";
    const insuranceId: WorkflowId = "property-insurance-claim";
    expect(workflows[contractorId]).toBeDefined();
    expect(workflows[insuranceId]).toBeDefined();
  });

  it("property-insurance-claim has a description mentioning insurance claims", () => {
    expect(workflows["property-insurance-claim"].description).toContain("insurance claim");
  });
});
