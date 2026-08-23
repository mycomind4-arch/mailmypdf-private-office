import { describe, expect, it } from "vitest";
import { workflowProfiles } from "./workflow-profiles";

describe("contractor-dispute workflow profile", () => {
  const profile = workflowProfiles["contractor-dispute"];

  it("defines SEO keywords targeting contractor dispute intent", () => {
    expect(profile.primaryKeyword).toBe("contractor dispute letter");
    expect(profile.supportingKeywords).toContain("construction defect notice");
    expect(profile.supportingKeywords).toContain("letter to contractor for defective work");
    expect(profile.supportingKeywords).toContain("contractor demand letter");
    expect(profile.supportingKeywords).toContain("how to document contractor dispute");
  });

  it("belongs to the Property family", () => {
    expect(profile.family).toBe("Property");
  });

  it("defines required facts for intake", () => {
    expect(profile.requiredFacts).toContain("property address");
    expect(profile.requiredFacts).toContain("contractor name");
    expect(profile.requiredFacts).toContain("agreement reference");
    expect(profile.requiredFacts).toContain("dispute description");
  });

  it("defines evidence requirements", () => {
    expect(profile.evidenceRequirements).toContain("contract or written agreement");
    expect(profile.evidenceRequirements).toContain("invoices or billing records");
    expect(profile.evidenceRequirements).toContain("photos of defects or incomplete work");
  });

  it("includes a pricing profile", () => {
    expect(profile.pricing.preparationFee).toBeGreaterThan(0);
    expect(profile.pricing.includedResponsePages).toBeGreaterThan(0);
    expect(profile.pricing.certifiedMail).toBeGreaterThan(profile.pricing.standardMail);
    expect(profile.pricing.certifiedReturnReceipt).toBeGreaterThan(profile.pricing.certifiedMail);
  });

  it("includes a deadline policy that does not invent deadlines", () => {
    expect(profile.deadlinePolicy).toContain("Do not invent");
  });

  it("includes a disclaimer stating it is not a law firm", () => {
    expect(profile.disclaimer).toContain("not a law firm");
  });
});
