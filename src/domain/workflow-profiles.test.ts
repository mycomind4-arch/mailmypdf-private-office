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

describe("property-insurance-claim workflow profile", () => {
  const profile = workflowProfiles["property-insurance-claim"];

  it("is registered in the profile registry", () => {
    expect(profile).toBeDefined();
    expect(profile.id).toBe("property-insurance-claim");
  });

  it("belongs to the Property family", () => {
    expect(profile.family).toBe("Property");
  });

  it("defines SEO keywords targeting property insurance claim intent", () => {
    expect(profile.primaryKeyword).toBe("property insurance claim letter");
    expect(profile.supportingKeywords).toContain("insurance claim dispute letter");
    expect(profile.supportingKeywords).toContain("denied insurance claim letter");
    expect(profile.supportingKeywords).toContain("insurance claim reconsideration letter");
    expect(profile.supportingKeywords).toContain("insurance supplemental claim letter");
    expect(profile.supportingKeywords).toContain("insurance claim underpayment");
    expect(profile.supportingKeywords).toContain("property damage insurance claim");
  });

  it("has commercial search intent", () => {
    expect(profile.searchIntent).toBe("commercial");
  });

  it("defines required facts for insurance claim intake", () => {
    expect(profile.requiredFacts).toContain("property address");
    expect(profile.requiredFacts).toContain("insurer name");
    expect(profile.requiredFacts).toContain("claim number");
    expect(profile.requiredFacts).toContain("date of loss");
    expect(profile.requiredFacts).toContain("description of damage");
    expect(profile.requiredFacts).toContain("insurer position");
  });

  it("requires exactly 6 facts (not including requested resolution, which is the objective)", () => {
    expect(profile.requiredFacts).toHaveLength(6);
  });

  it("does not include requested resolution as a required fact (objective covers it)", () => {
    expect(profile.requiredFacts).not.toContain("requested resolution");
  });

  it("defines evidence requirements for insurance claims", () => {
    expect(profile.evidenceRequirements).toContain("policy documents or declarations page");
    expect(profile.evidenceRequirements).toContain("claim correspondence from insurer");
    expect(profile.evidenceRequirements).toContain("denial letter or explanation of benefits");
    expect(profile.evidenceRequirements).toContain("repair estimates or contractor bids");
    expect(profile.evidenceRequirements).toContain("photographs of property damage");
    expect(profile.evidenceRequirements).toContain("inspection reports or engineer reports");
    expect(profile.evidenceRequirements).toContain("receipts for repairs or temporary mitigation");
  });

  it("targets the insurer as recipient", () => {
    expect(profile.recipientRole).toBe("insurer");
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

  it("deadline policy distinguishes known deadlines from potential deadlines", () => {
    expect(profile.deadlinePolicy).toContain("known deadlines");
    expect(profile.deadlinePolicy).toContain("potential deadlines");
  });

  it("deadline policy includes verification language for uncertain deadlines", () => {
    expect(profile.deadlinePolicy).toContain("verify against the applicable policy and jurisdiction");
  });

  it("deadline policy mentions proof-of-loss", () => {
    expect(profile.deadlinePolicy).toContain("proof-of-loss");
  });

  it("includes a disclaimer stating it is not a law firm", () => {
    expect(profile.disclaimer).toContain("not a law firm");
  });

  it("has a draft subject for insurance claim correspondence", () => {
    expect(profile.draftSubject).toContain("Insurance Claim");
  });

  it("has an objective prompt about requested resolution from the insurer", () => {
    expect(profile.objectivePrompt).toContain("insurer");
    expect(profile.objectivePrompt).toContain("resolution");
  });

  it("describes the problem involving denied, underpaid, or delayed claims", () => {
    expect(profile.problem).toContain("denied");
    expect(profile.problem).toContain("underpaid");
    expect(profile.problem).toContain("delayed");
  });
});
