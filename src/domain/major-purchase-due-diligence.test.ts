import { describe, expect, it } from "vitest";
import { runPrivateOfficeWorkflow } from "./private-office-workflow";
import { workflows } from "./workflows";
import { workflowProfiles } from "./workflow-profiles";
import { canApproveMatter, canAuthorizeMatterMail } from "./gold-standard";

const profile = workflowProfiles["major-purchase-due-diligence"];

const completeFacts: Record<string, string> = {
  purchaseTarget: "Commercial property at 100 Market Street",
  sellerOrCounterparty: "Example Holdings LLC",
  proposedPrice: "$850,000",
  purchaseType: "Real estate",
  transactionStatus: "Under contract; inspection period active",
  knownConcern: "Purchase agreement says one amount while a seller disclosure references another repair cost.",
};

const completeEvidence = Object.fromEntries(
  profile.evidenceRequirements.map((requirement) => {
    const slug = requirement.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return [`evidence-${slug}`, "provided"];
  }),
) as Record<string, "provided">;

describe("major-purchase-due-diligence: registration", () => {
  it("is registered as a Gold Standard workflow", () => {
    expect(workflows["major-purchase-due-diligence"]).toBeDefined();
    expect(workflows["major-purchase-due-diligence"].lifecycle).toBe("gold");
    expect(profile.family).toBe("Major Transactions");
  });

  it("uses the canonical Gold Standard stage chain", () => {
    expect(workflows["major-purchase-due-diligence"].goldStandardStages).toHaveLength(18);
    expect(workflows["major-purchase-due-diligence"].goldStandardStages).toContain("issues-discrepancies");
    expect(workflows["major-purchase-due-diligence"].goldStandardStages).toContain("prove-audit");
  });
});

describe("major-purchase-due-diligence: intake", () => {
  it("blocks when required purchase facts are missing", () => {
    const result = runPrivateOfficeWorkflow({
      workflowId: "major-purchase-due-diligence",
      documentId: "purchase-1",
      text: "Purchase documents.",
      facts: {},
      objective: "",
    });
    expect(result.blocked).toBe(true);
    for (const fact of profile.requiredFacts) {
      expect(result.errors.some((error) => error.includes(fact))).toBe(true);
    }
  });

  it("accepts a complete due-diligence intake with evidence", () => {
    const result = runPrivateOfficeWorkflow({
      workflowId: "major-purchase-due-diligence",
      documentId: "purchase-1",
      text: "Offer dated August 1, 2026. Inspection period ends August 15, 2026. Financing deadline August 22, 2026. Seller disclosure dated July 28, 2026.",
      facts: completeFacts,
      evidenceStatuses: completeEvidence,
      objective: "Determine what must be clarified before committing to the purchase.",
    });
    expect(result.blocked).toBe(false);
    expect(result.analysis.classification.type).toBe("major-purchase-due-diligence");
  });
});

describe("major-purchase-due-diligence: AI-oriented analysis contract", () => {
  it("produces findings, evidence, timeline, risks, and strategy", () => {
    const result = runPrivateOfficeWorkflow({
      workflowId: "major-purchase-due-diligence",
      documentId: "purchase-1",
      text: "Offer dated August 1, 2026. Inspection period ends August 15, 2026. Financing deadline August 22, 2026.",
      facts: completeFacts,
      evidenceStatuses: completeEvidence,
      objective: "Determine what must be clarified before committing to the purchase.",
    });
    expect(result.analysis.findings.length).toBeGreaterThan(0);
    expect(result.analysis.evidence.length).toBe(profile.evidenceRequirements.length);
    expect(result.analysis.timeline.length).toBeGreaterThan(0);
    expect(result.analysis.risks.length).toBeGreaterThan(0);
    expect(result.analysis.strategy.length).toBeGreaterThan(0);
  });

  it("preserves source excerpts for dated transaction events", () => {
    const result = runPrivateOfficeWorkflow({
      workflowId: "major-purchase-due-diligence",
      documentId: "purchase-1",
      text: "Inspection period ends August 15, 2026.",
      facts: completeFacts,
      evidenceStatuses: completeEvidence,
      objective: "Clarify inspection timing.",
    });
    const event = result.analysis.timeline.find((item) => item.date?.includes("August 15, 2026"));
    expect(event).toBeDefined();
    expect(event?.sourceExcerpt).toBeDefined();
  });
});

describe("major-purchase-due-diligence: evidence and gating", () => {
  it("blocks when required supporting records are absent", () => {
    const result = runPrivateOfficeWorkflow({
      workflowId: "major-purchase-due-diligence",
      documentId: "purchase-1",
      text: "Purchase documents.",
      facts: completeFacts,
      evidenceStatuses: {},
      objective: "Review the transaction.",
    });
    expect(result.blocked).toBe(true);
  });

  it("passes analysis approval when facts and evidence are complete", () => {
    const result = runPrivateOfficeWorkflow({
      workflowId: "major-purchase-due-diligence",
      documentId: "purchase-1",
      text: "Purchase documents dated August 1, 2026.",
      facts: completeFacts,
      evidenceStatuses: completeEvidence,
      objective: "Review the transaction.",
    });
    expect(canApproveMatter(result.analysis)).toBe(true);
  });
});

describe("major-purchase-due-diligence: professional-boundary safety", () => {
  it("disclaims professional conclusions", () => {
    expect(profile.disclaimer).toContain("not a law firm");
    expect(profile.disclaimer).toContain("not a financial adviser");
    expect(profile.disclaimer).toContain("not a professional inspection");
  });

  it("does not require unnecessary credentials or secrets", () => {
    const facts = profile.requiredFacts.join(" ").toLowerCase();
    expect(facts).not.toContain("password");
    expect(facts).not.toContain("credential");
    expect(facts).not.toContain("social security");
    expect(facts).not.toContain("credit card");
  });
});

describe("major-purchase-due-diligence: human approval", () => {
  it("does not authorize mailing without explicit human approval", () => {
    const result = runPrivateOfficeWorkflow({
      workflowId: "major-purchase-due-diligence",
      documentId: "purchase-1",
      text: "Purchase documents.",
      facts: completeFacts,
      evidenceStatuses: completeEvidence,
      objective: "Request clarification from the seller before signing.",
    });
    expect(canAuthorizeMatterMail({
      analysis: result.analysis,
      draftValidated: true,
      humanApproved: false,
      recipientComplete: true,
      paymentComplete: true,
    })).toBe(false);
  });
});

describe("major-purchase-due-diligence: regression boundary", () => {
  it("keeps the existing property insurance workflow distinct", () => {
    expect(workflowProfiles["property-insurance-claim"].primaryKeyword).toBe("property insurance claim letter");
    expect(workflowProfiles["major-purchase-due-diligence"].primaryKeyword).toBe("major purchase due diligence");
  });
});
