import { describe, expect, it } from "vitest";
import {
  createInitialState,
  getAvailableCapabilities,
  getCompletedCapabilities,
  getLockedCapabilities,
  isCapabilityAvailable,
  getCapabilityStatus,
  checkMilestones,
  getMilestoneUnlocks,
  startCapability,
  completeCapability,
  getLifeStateSummary,
} from "./state-engine";
import { capabilityGraph } from "./capability-graph";

describe("state-engine: initial state", () => {
  it("starts with no completed, in-progress, or milestones", () => {
    const state = createInitialState("user-1");
    expect(state.completed).toEqual([]);
    expect(state.inProgress).toEqual([]);
    expect(state.reachedMilestones).toEqual([]);
  });

  it("form-llc is available at initial state (entry point)", () => {
    const state = createInitialState("user-1");
    expect(isCapabilityAvailable(capabilityGraph, state, "form-llc")).toBe(true);
  });

  it("obtain-ein is locked at initial state", () => {
    const state = createInitialState("user-1");
    expect(isCapabilityAvailable(capabilityGraph, state, "obtain-ein")).toBe(false);
    expect(getCapabilityStatus(capabilityGraph, state, "obtain-ein")).toBe("locked");
  });
});

describe("state-engine: available capabilities", () => {
  it("only form-llc is available at start", () => {
    const state = createInitialState("user-1");
    const available = getAvailableCapabilities(capabilityGraph, state);
    expect(available.length).toBe(1);
    expect(available[0].id).toBe("form-llc");
  });

  it("all other 15 capabilities are locked at start", () => {
    const state = createInitialState("user-1");
    const locked = getLockedCapabilities(capabilityGraph, state);
    expect(locked.length).toBe(15);
  });

  it("after form-llc, 7 capabilities become available", () => {
    const state = createInitialState("user-1");
    const { state: newState } = completeCapability(capabilityGraph, state, "form-llc");
    const available = getAvailableCapabilities(capabilityGraph, newState);
    const availableIds = available.map((c) => c.id);
    expect(availableIds).toContain("obtain-ein");
    expect(availableIds).toContain("register-dba");
    expect(availableIds).toContain("obtain-local-license");
    expect(availableIds).toContain("obtain-business-insurance");
    expect(availableIds).toContain("create-contracts");
    // These require obtain-ein, so still locked
    expect(availableIds).not.toContain("open-business-bank-account");
    expect(availableIds).not.toContain("set-up-accounting");
  });
});

describe("state-engine: completing capabilities", () => {
  it("completeCapability marks the capability as completed", () => {
    const state = createInitialState("user-1");
    const result = completeCapability(capabilityGraph, state, "form-llc");
    expect(result.state.completed).toContain("form-llc");
    expect(result.state.inProgress).not.toContain("form-llc");
  });

  it("completeCapability removes from inProgress", () => {
    const state = createInitialState("user-1");
    const inProgress = startCapability(state, "form-llc");
    expect(inProgress.inProgress).toContain("form-llc");
    const result = completeCapability(capabilityGraph, inProgress, "form-llc");
    expect(result.state.inProgress).not.toContain("form-llc");
    expect(result.state.completed).toContain("form-llc");
  });

  it("completing form-llc unlocks obtain-ein and other post-LLC caps", () => {
    const state = createInitialState("user-1");
    const result = completeCapability(capabilityGraph, state, "form-llc");
    const unlockedIds = result.newlyUnlockedCapabilities.map((c) => c.id);
    expect(unlockedIds).toContain("obtain-ein");
    expect(unlockedIds).toContain("register-dba");
    expect(unlockedIds).toContain("obtain-local-license");
    expect(unlockedIds).toContain("obtain-business-insurance");
    expect(unlockedIds).toContain("create-contracts");
  });

  it("completing form-llc does NOT unlock capabilities that also need EIN", () => {
    const state = createInitialState("user-1");
    const result = completeCapability(capabilityGraph, state, "form-llc");
    const unlockedIds = result.newlyUnlockedCapabilities.map((c) => c.id);
    // open-business-bank-account requires obtain-ein, not just form-llc
    expect(unlockedIds).not.toContain("open-business-bank-account");
    expect(unlockedIds).not.toContain("set-up-accounting");
  });

  it("completing obtain-ein after form-llc unlocks banking", () => {
    const state = createInitialState("user-1");
    const { state: s1 } = completeCapability(capabilityGraph, state, "form-llc");
    const result = completeCapability(capabilityGraph, s1, "obtain-ein");
    const unlockedIds = result.newlyUnlockedCapabilities.map((c) => c.id);
    expect(unlockedIds).toContain("open-business-bank-account");
    expect(unlockedIds).toContain("set-up-accounting");
  });
});

describe("state-engine: milestones", () => {
  it("completing form-llc reaches the llc-established milestone", () => {
    const state = createInitialState("user-1");
    const result = completeCapability(capabilityGraph, state, "form-llc");
    expect(result.newlyReachedMilestones.length).toBe(1);
    expect(result.newlyReachedMilestones[0].id).toBe("llc-established");
    expect(result.state.reachedMilestones).toContain("llc-established");
  });

  it("completing all business-operational capabilities reaches that milestone", () => {
    const state = createInitialState("user-1");
    // Complete form-llc first
    const { state: s1 } = completeCapability(capabilityGraph, state, "form-llc");
    // Complete obtain-ein
    const { state: s2 } = completeCapability(capabilityGraph, s1, "obtain-ein");
    // Complete remaining business-operational capabilities
    const { state: s3 } = completeCapability(capabilityGraph, s2, "register-dba");
    const { state: s4 } = completeCapability(capabilityGraph, s3, "open-business-bank-account");
    const { state: s5 } = completeCapability(capabilityGraph, s4, "obtain-local-license");
    const { state: s6 } = completeCapability(capabilityGraph, s5, "obtain-business-insurance");
    const { state: s7 } = completeCapability(capabilityGraph, s6, "set-up-accounting");
    const result = completeCapability(capabilityGraph, s7, "create-contracts");

    expect(result.newlyReachedMilestones.some((m) => m.id === "business-operational")).toBe(true);
    expect(result.state.reachedMilestones).toContain("business-operational");
  });

  it("reaching business-operational milestone unlocks growing-business capabilities", () => {
    const state = createInitialState("user-1");
    let currentState = state;
    // Complete all business-operational capabilities
    for (const capId of [
      "form-llc",
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

    const available = getAvailableCapabilities(capabilityGraph, currentState);
    const availableIds = available.map((c) => c.id);
    expect(availableIds).toContain("hire-employees");
    expect(availableIds).toContain("obtain-business-credit");
    expect(availableIds).toContain("government-contracting");
    expect(availableIds).toContain("obtain-financing");
  });

  it("checkMilestones only returns newly reached milestones", () => {
    const state = createInitialState("user-1");
    const { state: s1 } = completeCapability(capabilityGraph, state, "form-llc");
    // llc-established should already be in reachedMilestones
    const newMilestones = checkMilestones(capabilityGraph, s1);
    expect(newMilestones).not.toContain("llc-established");
  });

  it("getMilestoneUnlocks returns capabilities for a milestone", () => {
    const state = createInitialState("user-1");
    const unlocks = getMilestoneUnlocks(capabilityGraph, state, "business-operational");
    expect(unlocks.length).toBeGreaterThan(0);
    expect(unlocks.some((c) => c.id === "hire-employees")).toBe(true);
  });
});

describe("state-engine: capability status", () => {
  it("returns locked for unknown capability", () => {
    const state = createInitialState("user-1");
    expect(getCapabilityStatus(capabilityGraph, state, "unknown-id")).toBe("locked");
  });

  it("returns completed for finished capability", () => {
    const state = createInitialState("user-1");
    const { state: s1 } = completeCapability(capabilityGraph, state, "form-llc");
    expect(getCapabilityStatus(capabilityGraph, s1, "form-llc")).toBe("completed");
  });

  it("returns in-progress for started capability", () => {
    const state = createInitialState("user-1");
    const inProgress = startCapability(state, "form-llc");
    expect(getCapabilityStatus(capabilityGraph, inProgress, "form-llc")).toBe("in-progress");
  });
});

describe("state-engine: life state summary", () => {
  it("summarizes initial state correctly", () => {
    const state = createInitialState("user-1");
    const summary = getLifeStateSummary(capabilityGraph, state);
    expect(summary.totalCompleted).toBe(0);
    expect(summary.totalInProgress).toBe(0);
    expect(summary.reachedMilestones.length).toBe(0);
    expect(summary.availableCapabilities.length).toBe(1); // form-llc
    expect(summary.lockedCapabilities.length).toBe(15);
  });

  it("summarizes state after completing form-llc", () => {
    const state = createInitialState("user-1");
    const { state: s1 } = completeCapability(capabilityGraph, state, "form-llc");
    const summary = getLifeStateSummary(capabilityGraph, s1);
    expect(summary.totalCompleted).toBe(1);
    expect(summary.reachedMilestones.length).toBe(1);
    expect(summary.availableCapabilities.length).toBe(5); // ein, dba, license, insurance, contracts
  });
});

describe("state-engine: start capability", () => {
  it("adds to inProgress", () => {
    const state = createInitialState("user-1");
    const updated = startCapability(state, "form-llc");
    expect(updated.inProgress).toContain("form-llc");
  });

  it("does not duplicate if already in progress", () => {
    const state = createInitialState("user-1");
    const s1 = startCapability(state, "form-llc");
    const s2 = startCapability(s1, "form-llc");
    expect(s2.inProgress.filter((id) => id === "form-llc").length).toBe(1);
  });

  it("does not start if already completed", () => {
    const state = createInitialState("user-1");
    const { state: s1 } = completeCapability(capabilityGraph, state, "form-llc");
    const s2 = startCapability(s1, "form-llc");
    expect(s2.inProgress).not.toContain("form-llc");
  });
});

describe("state-engine: full business formation journey", () => {
  it("can progress from individual to business-operational", () => {
    let currentState = createInitialState("user-journey-1");

    // Complete form-llc
    const r1 = completeCapability(capabilityGraph, currentState, "form-llc");
    currentState = r1.state;
    expect(r1.newlyReachedMilestones[0].id).toBe("llc-established");

    // Complete all business-operational capabilities
    const opCaps = [
      "obtain-ein",
      "register-dba",
      "open-business-bank-account",
      "obtain-local-license",
      "obtain-business-insurance",
      "set-up-accounting",
      "create-contracts",
    ];
    for (const capId of opCaps) {
      const result = completeCapability(capabilityGraph, currentState, capId);
      currentState = result.state;
    }

    expect(currentState.reachedMilestones).toContain("business-operational");
    expect(currentState.completed.length).toBe(8); // form-llc + 7 operational

    // Growing-business capabilities should now be available
    const available = getAvailableCapabilities(capabilityGraph, currentState);
    const availableIds = available.map((c) => c.id);
    expect(availableIds).toContain("obtain-business-credit");
    expect(availableIds).toContain("hire-employees");
    expect(availableIds).toContain("government-contracting");
  });

  it("can progress from business-operational to growing-business to mature-business", () => {
    let currentState = createInitialState("user-journey-2");

    // Complete everything up to business-operational
    const opCaps = [
      "form-llc",
      "obtain-ein",
      "register-dba",
      "open-business-bank-account",
      "obtain-local-license",
      "obtain-business-insurance",
      "set-up-accounting",
      "create-contracts",
    ];
    for (const capId of opCaps) {
      const result = completeCapability(capabilityGraph, currentState, capId);
      currentState = result.state;
    }

    // Complete growing-business capabilities
    const growingCaps = [
      "obtain-business-credit",
      "hire-employees",
      "government-contracting",
      "obtain-financing",
      "expand-to-another-state",
    ];
    for (const capId of growingCaps) {
      const result = completeCapability(capabilityGraph, currentState, capId);
      currentState = result.state;
    }

    expect(currentState.reachedMilestones).toContain("growing-business");

    // Mature-business capabilities should now be available
    const available = getAvailableCapabilities(capabilityGraph, currentState);
    const availableIds = available.map((c) => c.id);
    expect(availableIds).toContain("acquire-business");
    expect(availableIds).toContain("multi-state-expansion");
    expect(availableIds).toContain("subsidiary");
    expect(availableIds).toContain("business-sale");
  });
});
