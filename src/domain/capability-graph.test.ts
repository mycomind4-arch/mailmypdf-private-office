import { describe, expect, it } from "vitest";
import {
  capabilityGraph,
  validateGraph,
  getCapability,
  getCapabilitiesByVertical,
  getMilestone,
} from "./capability-graph";

describe("capability-graph: graph integrity", () => {
  it("has no validation errors", () => {
    const errors = validateGraph(capabilityGraph);
    expect(errors).toEqual([]);
  });

  it("has entry points with no prerequisites", () => {
    expect(capabilityGraph.entryPoints.length).toBeGreaterThan(0);
    for (const id of capabilityGraph.entryPoints) {
      const cap = getCapability(capabilityGraph, id);
      expect(cap).toBeDefined();
      expect(cap!.prerequisites).toEqual([]);
    }
  });

  it("form-llc is an entry point", () => {
    expect(capabilityGraph.entryPoints).toContain("form-llc");
  });
});

describe("capability-graph: business formation vertical", () => {
  it("has the expected number of capabilities", () => {
    const count = Object.keys(capabilityGraph.capabilities).length;
    expect(count).toBe(16);
  });

  it("form-llc unlocks the post-LLC capability set", () => {
    const llc = getCapability(capabilityGraph, "form-llc");
    expect(llc).toBeDefined();
    expect(llc!.unlocks).toContain("obtain-ein");
    expect(llc!.unlocks).toContain("open-business-bank-account");
    expect(llc!.unlocks).toContain("obtain-local-license");
    expect(llc!.unlocks).toContain("obtain-business-insurance");
    expect(llc!.unlocks).toContain("set-up-accounting");
    expect(llc!.unlocks).toContain("create-contracts");
  });

  it("obtain-ein requires form-llc", () => {
    const ein = getCapability(capabilityGraph, "obtain-ein");
    expect(ein!.prerequisites).toContain("form-llc");
  });

  it("open-business-bank-account requires obtain-ein (transitive dependency)", () => {
    const bank = getCapability(capabilityGraph, "open-business-bank-account");
    expect(bank!.prerequisites).toContain("obtain-ein");
    expect(bank!.prerequisites).not.toContain("form-llc");
  });

  it("hire-employees requires both EIN and insurance", () => {
    const hire = getCapability(capabilityGraph, "hire-employees");
    expect(hire!.prerequisites).toContain("obtain-ein");
    expect(hire!.prerequisites).toContain("obtain-business-insurance");
  });

  it("business-sale requires acquire-business", () => {
    const sale = getCapability(capabilityGraph, "business-sale");
    expect(sale!.prerequisites).toContain("acquire-business");
  });
});

describe("capability-graph: milestones", () => {
  it("has 4 milestones", () => {
    expect(Object.keys(capabilityGraph.milestones).length).toBe(4);
  });

  it("business-operational milestone requires 7 capabilities", () => {
    const ms = getMilestone(capabilityGraph, "business-operational");
    expect(ms).toBeDefined();
    expect(ms!.capabilities.length).toBe(7);
    expect(ms!.capabilities).toContain("obtain-ein");
    expect(ms!.capabilities).toContain("create-contracts");
  });

  it("business-operational milestone unlocks growing-business capabilities", () => {
    const ms = getMilestone(capabilityGraph, "business-operational");
    expect(ms!.unlocks).toContain("hire-employees");
    expect(ms!.unlocks).toContain("obtain-business-credit");
    expect(ms!.unlocks).toContain("obtain-financing");
  });

  it("growing-business milestone unlocks mature-business capabilities", () => {
    const ms = getMilestone(capabilityGraph, "growing-business");
    expect(ms!.unlocks).toContain("acquire-business");
    expect(ms!.unlocks).toContain("multi-state-expansion");
    expect(ms!.unlocks).toContain("subsidiary");
    expect(ms!.unlocks).toContain("business-sale");
  });

  it("each capability with a milestoneId references a valid milestone", () => {
    for (const cap of Object.values(capabilityGraph.capabilities)) {
      if (cap.milestoneId) {
        expect(capabilityGraph.milestones[cap.milestoneId]).toBeDefined();
      }
    }
  });
});

describe("capability-graph: verticals", () => {
  it("capabilities span multiple verticals", () => {
    const verticals = new Set(
      Object.values(capabilityGraph.capabilities).map((c) => c.vertical),
    );
    expect(verticals.size).toBeGreaterThanOrEqual(2);
    expect(verticals.has("small-business")).toBe(true);
    expect(verticals.has("private-office")).toBe(true);
    expect(verticals.has("gov-reply")).toBe(true);
  });

  it("government-contracting belongs to gov-reply vertical", () => {
    const govCon = getCapability(capabilityGraph, "government-contracting");
    expect(govCon!.vertical).toBe("gov-reply");
  });

  it("create-contracts belongs to private-office vertical", () => {
    const contracts = getCapability(capabilityGraph, "create-contracts");
    expect(contracts!.vertical).toBe("private-office");
  });

  it("getCapabilitiesByVertical returns correct set", () => {
    const smallBiz = getCapabilitiesByVertical(capabilityGraph, "small-business");
    expect(smallBiz.length).toBeGreaterThan(0);
    expect(smallBiz.every((c) => c.vertical === "small-business")).toBe(true);
  });
});

describe("capability-graph: no circular dependencies", () => {
  it("validateGraph does not report circular dependencies", () => {
    const errors = validateGraph(capabilityGraph);
    expect(errors.filter((e) => e.includes("Circular"))).toEqual([]);
  });
});
