import { describe, expect, it } from "vitest";
import {
  planPath,
  recommendNext,
  findGoalCapability,
} from "./workflow-orchestrator";
import { capabilityGraph } from "./capability-graph";
import { createInitialState, completeCapability } from "./state-engine";

describe("workflow-orchestrator: planPath", () => {
  it("returns empty path when goal is already completed", () => {
    const state = createInitialState("user-1");
    const { state: s1 } = completeCapability(capabilityGraph, state, "form-llc");
    const path = planPath(capabilityGraph, s1, "form-llc");
    expect(path.path).toEqual([]);
    expect(path.stepsRemaining).toBe(0);
  });

  it("returns single step for form-llc from initial state", () => {
    const state = createInitialState("user-1");
    const path = planPath(capabilityGraph, state, "form-llc");
    expect(path.path).toEqual(["form-llc"]);
    expect(path.stepsRemaining).toBe(1);
    expect(path.nextAvailable).toContain("form-llc");
    expect(path.blockedBy).toEqual({});
  });

  it("returns full path for business-sale from initial state", () => {
    const state = createInitialState("user-1");
    const path = planPath(capabilityGraph, state, "business-sale");
    expect(path.stepsRemaining).toBeGreaterThan(3);
    expect(path.path[0]).toBe("form-llc");
    expect(path.path[path.path.length - 1]).toBe("business-sale");
    expect(path.nextAvailable).toEqual(["form-llc"]);
  });

  it("path is in topological order (prerequisites before dependents)", () => {
    const state = createInitialState("user-1");
    const path = planPath(capabilityGraph, state, "open-business-bank-account");
    const pathArr = path.path;
    // form-llc should come before obtain-ein, obtain-ein before open-business-bank-account
    const llcIdx = pathArr.indexOf("form-llc");
    const einIdx = pathArr.indexOf("obtain-ein");
    const bankIdx = pathArr.indexOf("open-business-bank-account");
    expect(llcIdx).toBeLessThan(einIdx);
    expect(einIdx).toBeLessThan(bankIdx);
  });

  it("blockedBy shows missing prerequisites for locked steps", () => {
    const state = createInitialState("user-1");
    const path = planPath(capabilityGraph, state, "hire-employees");
    // hire-employees requires obtain-ein and obtain-business-insurance
    // obtain-ein requires form-llc
    expect(path.blockedBy["hire-employees"]).toBeDefined();
    expect(path.blockedBy["obtain-ein"]).toContain("form-llc");
  });

  it("after completing form-llc, path to hire-employees updates", () => {
    const state = createInitialState("user-1");
    const { state: s1 } = completeCapability(capabilityGraph, state, "form-llc");
    const path = planPath(capabilityGraph, s1, "hire-employees");
    // form-llc is no longer in the path
    expect(path.path).not.toContain("form-llc");
    // obtain-ein and obtain-business-insurance are now available
    expect(path.nextAvailable).toContain("obtain-ein");
    expect(path.nextAvailable).toContain("obtain-business-insurance");
  });

  it("returns empty path for unknown goal", () => {
    const state = createInitialState("user-1");
    const path = planPath(capabilityGraph, state, "nonexistent-capability");
    expect(path.path).toEqual([]);
    expect(path.stepsRemaining).toBe(0);
  });
});

describe("workflow-orchestrator: recommendNext", () => {
  it("recommends form-llc at initial state", () => {
    const state = createInitialState("user-1");
    const recs = recommendNext(capabilityGraph, state);
    expect(recs.length).toBe(1);
    expect(recs[0].capability.id).toBe("form-llc");
    expect(recs[0].reason).toContain("first step");
  });

  it("returns empty array when no capabilities are available", () => {
    // Complete ALL capabilities — nothing should be available
    let state = createInitialState("user-done");
    const allCaps = Object.keys(capabilityGraph.capabilities);
    for (const capId of allCaps) {
      const result = completeCapability(capabilityGraph, state, capId);
      state = result.state;
    }
    const recs = recommendNext(capabilityGraph, state);
    expect(recs).toEqual([]);
  });

  it("recommends multiple capabilities after form-llc", () => {
    const state = createInitialState("user-1");
    const { state: s1 } = completeCapability(capabilityGraph, state, "form-llc");
    const recs = recommendNext(capabilityGraph, s1);
    expect(recs.length).toBe(5); // ein, dba, license, insurance, contracts
    const recIds = recs.map((r) => r.capability.id);
    expect(recIds).toContain("obtain-ein");
    expect(recIds).toContain("register-dba");
    expect(recIds).toContain("obtain-local-license");
    expect(recIds).toContain("obtain-business-insurance");
    expect(recIds).toContain("create-contracts");
  });

  it("prioritizes capabilities with milestone impact", () => {
    const state = createInitialState("user-1");
    const { state: s1 } = completeCapability(capabilityGraph, state, "form-llc");
    const recs = recommendNext(capabilityGraph, s1);
    // All 5 have milestone impact (business-operational), so sort by downstream
    // obtain-ein unlocks the most downstream, should be first
    expect(recs[0].capability.id).toBe("obtain-ein");
  });

  it("recommendations include a reason string", () => {
    const state = createInitialState("user-1");
    const recs = recommendNext(capabilityGraph, state);
    expect(recs[0].reason).toBeTruthy();
    expect(recs[0].reason.length).toBeGreaterThan(10);
  });
});

describe("workflow-orchestrator: findGoalCapability", () => {
  it("finds by exact id", () => {
    const result = findGoalCapability(capabilityGraph, "form-llc");
    expect(result).toBeDefined();
    expect(result!.id).toBe("form-llc");
  });

  it("finds by exact title", () => {
    const result = findGoalCapability(capabilityGraph, "Create LLC");
    expect(result).toBeDefined();
    expect(result!.id).toBe("form-llc");
  });

  it("finds by partial keyword", () => {
    const result = findGoalCapability(capabilityGraph, "llc");
    expect(result).toBeDefined();
  });

  it("finds by multi-word goal", () => {
    const result = findGoalCapability(capabilityGraph, "hire employees");
    expect(result).toBeDefined();
    expect(result!.id).toBe("hire-employees");
  });

  it("finds banking-related goal", () => {
    const result = findGoalCapability(capabilityGraph, "business bank account");
    expect(result).toBeDefined();
    expect(result!.id).toBe("open-business-bank-account");
  });

  it("returns undefined for completely unrelated goal", () => {
    const result = findGoalCapability(capabilityGraph, "skydiving lessons");
    expect(result).toBeUndefined();
  });
});

describe("workflow-orchestrator: real-world scenario", () => {
  it("user says 'I want to start a landscaping business' → path to business operational", () => {
    // User enters Private Office and says they want to start a landscaping business.
    // The system should determine: goal = form-llc (business entity), then build out.

    const state = createInitialState("user-landscaping");

    // The orchestrator identifies the first step
    const recs = recommendNext(capabilityGraph, state);
    expect(recs[0].capability.id).toBe("form-llc");

    // User completes form-llc
    const r1 = completeCapability(capabilityGraph, state, "form-llc");
    expect(r1.newlyReachedMilestones[0].id).toBe("llc-established");

    // Now the system shows what's available
    const recs2 = recommendNext(capabilityGraph, r1.state);
    expect(recs2.length).toBe(5);

    // User works through the operational setup
    let currentState = r1.state;
    for (const capId of [
      "obtain-ein",
      "register-dba",
      "open-business-bank-account",
      "obtain-local-license",
      "obtain-business-insurance",
      "set-up-accounting",
      "create-contracts",
    ]) {
      const result = completeCapability(capabilityGraph, currentState, capId);
      currentState = result.state;
    }

    // Business operational milestone reached
    expect(currentState.reachedMilestones).toContain("business-operational");

    // Next recommendations include growing-business capabilities
    const recs3 = recommendNext(capabilityGraph, currentState);
    const recIds = recs3.map((r) => r.capability.id);
    expect(recIds).toContain("hire-employees");
    expect(recIds).toContain("obtain-business-credit");
    expect(recIds).toContain("obtain-financing");
  });

  it("user wants to sell their business — path from initial state to business-sale", () => {
    const state = createInitialState("user-exit");
    const path = planPath(capabilityGraph, state, "business-sale");

    // The full path should be long — many prerequisites
    expect(path.stepsRemaining).toBeGreaterThan(5);
    expect(path.path[0]).toBe("form-llc");
    expect(path.path[path.path.length - 1]).toBe("business-sale");

    // Only the first step is available now
    expect(path.nextAvailable).toEqual(["form-llc"]);
  });
});
