import { describe, expect, it } from "vitest";
import { canApproveMatter, canAuthorizeMatterMail } from "./gold-standard";
import { runPrivateOfficeWorkflow } from "./private-office-workflow";
import { workflowProfiles } from "./workflow-profiles";
import { workflows } from "./workflows";

const profile = workflowProfiles["high-value-asset-protection"];
const completeFacts: Record<string, string> = {
  assetDescription: "1967 Porsche 911 S",
  ownerName: "Jane Smith",
  assetReference: "VIN ending 4821",
  custodyLocation: "Private storage facility",
  acquisitionDate: "June 14, 2024",
  knownValue: "Purchase price $185,000; appraisal dated May 2026 references $240,000",
  insuranceStatus: "ABC Specialty Insurance; policy reference POL-9876",
  matterDescription: "Preparing a consolidated record before a proposed sale and reconciling insurance and appraisal records.",
};

function completeEvidence(): Record<string, "provided"> {
  return Object.fromEntries(profile.evidenceRequirements.map((requirement) => {
    const slug = requirement.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return [`evidence-${slug}`, "provided"];
  })) as Record<string, "provided">;
}

describe("high-value-asset-protection: registration", () => {
  it("is registered as a Gold Standard workflow", () => {
    expect(workflows["high-value-asset-protection"]).toBeDefined();
    expect(workflows["high-value-asset-protection"].lifecycle).toBe("gold");
    expect(workflows["high-value-asset-protection"].goldStandardStages).toHaveLength(18);
  });

  it("has asset-protection-specific profile requirements", () => {
    expect(profile.family).toBe("Asset Protection");
    expect(profile.requiredFacts).toContain("asset description");
    expect(profile.requiredFacts).toContain("asset identifier or reference");
  });
});

describe("high-value-asset-protection: intake and evidence", () => {
  it("blocks incomplete intake", () => {
    const result = runPrivateOfficeWorkflow({
      workflowId: "high-value-asset-protection",
      documentId: "doc-1",
      text: "Asset documents.",
      facts: {},
      objective: "",
    });
    expect(result.blocked).toBe(true);
    expect(profile.requiredFacts.every((fact) => result.errors.some((error) => error.includes(fact)))).toBe(true);
  });

  it("accepts complete intake with evidence", () => {
    const result = runPrivateOfficeWorkflow({
      workflowId: "high-value-asset-protection",
      documentId: "doc-1",
      text: "Purchased June 14, 2024. Appraisal dated May 2, 2026. Insurance policy renewed July 1, 2026. Sale discussion began August 10, 2026.",
      facts: completeFacts,
      evidenceStatuses: completeEvidence(),
      objective: "Create a clean asset record and reconcile the supporting documents.",
    });
    expect(result.blocked).toBe(false);
    expect(result.analysis.classification.type).toBe("high-value-asset-protection");
  });

  it("blocks when evidence has not been supplied", () => {
    const result = runPrivateOfficeWorkflow({
      workflowId: "high-value-asset-protection",
      documentId: "doc-1",
      text: "Asset documents.",
      facts: completeFacts,
      evidenceStatuses: {},
      objective: "Create a clean asset record.",
    });
    expect(result.blocked).toBe(true);
  });
});

describe("high-value-asset-protection: AI analysis contract", () => {
  it("produces findings, timeline, evidence, risks, and strategy", () => {
    const result = runPrivateOfficeWorkflow({
      workflowId: "high-value-asset-protection",
      documentId: "doc-1",
      text: "Purchased June 14, 2024. Appraisal dated May 2, 2026. Insurance policy renewed July 1, 2026. Sale discussion began August 10, 2026.",
      facts: completeFacts,
      evidenceStatuses: completeEvidence(),
      objective: "Create a clean asset record and reconcile the supporting documents.",
    });
    expect(result.analysis.findings.length).toBeGreaterThan(0);
    expect(result.analysis.timeline.length).toBeGreaterThan(0);
    expect(result.analysis.evidence.length).toBe(profile.evidenceRequirements.length);
    expect(result.analysis.risks.length).toBeGreaterThan(0);
    expect(result.analysis.strategy.length).toBeGreaterThan(0);
  });

  it("retains source excerpts on timeline events", () => {
    const result = runPrivateOfficeWorkflow({
      workflowId: "high-value-asset-protection",
      documentId: "doc-1",
      text: "Appraisal dated May 2, 2026 establishes the valuation reference.",
      facts: completeFacts,
      evidenceStatuses: completeEvidence(),
      objective: "Reconcile the valuation records.",
    });
    const event = result.analysis.timeline.find((item) => item.date?.includes("May 2, 2026"));
    expect(event).toBeDefined();
    expect(event?.sourceExcerpt).toBeDefined();
  });
});

describe("high-value-asset-protection: professional-conclusion safety", () => {
  it("does not require unnecessary credentials or secrets", () => {
    const required = profile.requiredFacts.join(" ").toLowerCase();
    expect(required).not.toContain("password");
    expect(required).not.toContain("private key");
    expect(required).not.toContain("seed phrase");
    expect(required).not.toContain("full bank account number");
  });

  it("does not turn supplied value into an appraised conclusion", () => {
    const result = runPrivateOfficeWorkflow({
      workflowId: "high-value-asset-protection",
      documentId: "doc-1",
      text: "An appraisal dated May 2, 2026 states $240,000.",
      facts: completeFacts,
      evidenceStatuses: completeEvidence(),
      objective: "Document the valuation record.",
    });
    const text = result.analysis.findings.map((item) => `${item.title} ${item.detail}`).join(" ").toLowerCase();
    expect(text).not.toContain("guaranteed market value");
    expect(text).not.toContain("professionally appraised value");
  });
});

describe("high-value-asset-protection: approval gates", () => {
  it("allows analysis approval only when blocking issues are cleared", () => {
    const result = runPrivateOfficeWorkflow({
      workflowId: "high-value-asset-protection",
      documentId: "doc-1",
      text: "Purchased June 14, 2024.",
      facts: completeFacts,
      evidenceStatuses: completeEvidence(),
      objective: "Create a clean asset record.",
    });
    expect(canApproveMatter(result.analysis)).toBe(true);
  });

  it("never authorizes consequential mailing without explicit human approval", () => {
    const result = runPrivateOfficeWorkflow({
      workflowId: "high-value-asset-protection",
      documentId: "doc-1",
      text: "Purchased June 14, 2024.",
      facts: completeFacts,
      evidenceStatuses: completeEvidence(),
      objective: "Notify a counterparty of the documented asset record.",
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

describe("high-value-asset-protection: regression", () => {
  it("does not replace existing property or financial workflows", () => {
    expect(workflows["property-insurance-claim"].lifecycle).toBe("gold");
    expect(workflows["bank-wire-dispute"].lifecycle).toBe("gold");
    expect(workflows["high-value-asset-protection"].family).toBe("Asset Protection");
  });
});
