import { describe, expect, it } from "vitest";
import { runPrivateOfficeWorkflow } from "./private-office-workflow";
import { workflows } from "./workflows";
import { workflowProfiles } from "./workflow-profiles";
import { canApproveMatter, canAuthorizeMatterMail } from "./gold-standard";

const profile = workflowProfiles["insurance-claim-command-center"];

const completeFacts: Record<string, string> = {
  insuredName: "Jane Smith",
  insurerName: "ABC Insurance Company",
  claimNumber: "CLM-2026-001234",
  policyReference: "POL-123456",
  dateOfLoss: "March 15, 2026",
  lossDescription: "A severe storm damaged the roof and caused interior water intrusion.",
  claimStatus: "Partially paid; supplemental damage remains under review.",
};

function completeEvidence(): Record<string, "provided"> {
  return Object.fromEntries(
    profile.evidenceRequirements.map((requirement) => {
      const slug = requirement.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      return [`evidence-${slug}`, "provided"];
    }),
  ) as Record<string, "provided">;
}

describe("insurance-claim-command-center: registration", () => {
  it("is registered as a gold workflow", () => {
    expect(profile).toBeDefined();
    expect(workflows["insurance-claim-command-center"].lifecycle).toBe("gold");
  });

  it("uses the full Gold Standard pipeline", () => {
    expect(workflows["insurance-claim-command-center"].goldStandardStages).toEqual([
      "secure-ingest", "classify", "extract", "understand", "facts-provenance",
      "timeline-deadlines", "issues-discrepancies", "evidence", "authority-research",
      "risk", "strategy", "draft", "validate", "blocking-gates", "human-review",
      "authorized-mail", "track", "prove-audit",
    ]);
  });
});

describe("insurance-claim-command-center: intake", () => {
  it("blocks when required facts are missing", () => {
    const result = runPrivateOfficeWorkflow({
      workflowId: "insurance-claim-command-center",
      documentId: "doc-1",
      text: "Insurance claim documents.",
      facts: {},
      objective: "",
    });
    expect(result.blocked).toBe(true);
    expect(profile.requiredFacts.every((fact) => result.errors.some((error) => error.includes(fact)))).toBe(true);
  });

  it("accepts a complete command-center intake", () => {
    const result = runPrivateOfficeWorkflow({
      workflowId: "insurance-claim-command-center",
      documentId: "doc-1",
      text: "Claim opened March 16, 2026. Partial payment issued April 10, 2026. Supplemental review requested April 20, 2026.",
      facts: completeFacts,
      evidenceStatuses: completeEvidence(),
      objective: "Document the claim and request supplemental consideration.",
    });
    expect(result.blocked).toBe(false);
    expect(result.analysis.classification.type).toBe("insurance-claim-command-center");
  });
});

describe("insurance-claim-command-center: AI-ready analysis contract", () => {
  it("produces findings, timeline, evidence, risks, and strategy", () => {
    const result = runPrivateOfficeWorkflow({
      workflowId: "insurance-claim-command-center",
      documentId: "doc-1",
      text: "Date of loss: March 15, 2026. Claim opened March 16, 2026. Partial payment issued April 10, 2026. Supplemental review requested April 20, 2026.",
      facts: completeFacts,
      evidenceStatuses: completeEvidence(),
      objective: "Document the claim and request supplemental consideration.",
    });
    expect(result.analysis.findings.length).toBeGreaterThan(0);
    expect(result.analysis.timeline.length).toBeGreaterThan(0);
    expect(result.analysis.evidence.length).toBe(profile.evidenceRequirements.length);
    expect(result.analysis.risks.length).toBeGreaterThan(0);
    expect(result.analysis.strategy.length).toBeGreaterThan(0);
  });

  it("preserves source excerpts on extracted timeline events", () => {
    const result = runPrivateOfficeWorkflow({
      workflowId: "insurance-claim-command-center",
      documentId: "doc-1",
      text: "Supplemental review requested April 20, 2026.",
      facts: completeFacts,
      evidenceStatuses: completeEvidence(),
      objective: "Request supplemental consideration.",
    });
    const event = result.analysis.timeline.find((item) => item.date?.includes("April 20"));
    expect(event).toBeDefined();
    expect(event?.sourceExcerpt).toBeDefined();
  });
});

describe("insurance-claim-command-center: evidence and blocking gates", () => {
  it("blocks when command-center evidence has not been supplied", () => {
    const result = runPrivateOfficeWorkflow({
      workflowId: "insurance-claim-command-center",
      documentId: "doc-1",
      text: "Claim documents.",
      facts: completeFacts,
      evidenceStatuses: {},
      objective: "Document the claim.",
    });
    expect(result.blocked).toBe(true);
  });

  it("passes approval analysis when evidence and facts are complete", () => {
    const result = runPrivateOfficeWorkflow({
      workflowId: "insurance-claim-command-center",
      documentId: "doc-1",
      text: "Claim opened March 16, 2026.",
      facts: completeFacts,
      evidenceStatuses: completeEvidence(),
      objective: "Document the claim.",
    });
    expect(canApproveMatter(result.analysis)).toBe(true);
  });
});

describe("insurance-claim-command-center: draft and authorization", () => {
  it("generates a clearly labeled insurance correspondence draft using intake facts", () => {
    const result = runPrivateOfficeWorkflow({
      workflowId: "insurance-claim-command-center",
      documentId: "doc-1",
      text: "Claim opened March 16, 2026.",
      facts: completeFacts,
      evidenceStatuses: completeEvidence(),
      objective: "Document the claim and request supplemental consideration.",
    });
    expect(result.draft).toContain("Insurance Claim Correspondence");
    expect(result.draft).toContain("[DRAFT — REVIEW BEFORE SENDING]");
    expect(result.draft).toContain("ABC Insurance Company");
    expect(result.draft).toContain("CLM-2026-001234");
  });

  it("does not authorize consequential mailing without explicit human approval", () => {
    const result = runPrivateOfficeWorkflow({
      workflowId: "insurance-claim-command-center",
      documentId: "doc-1",
      text: "Claim opened March 16, 2026.",
      facts: completeFacts,
      evidenceStatuses: completeEvidence(),
      objective: "Document the claim.",
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

describe("insurance-claim-command-center: regression boundaries", () => {
  it("leaves the property-specific insurance workflow independently registered", () => {
    expect(workflows["property-insurance-claim"].lifecycle).toBe("gold");
    expect(workflowProfiles["property-insurance-claim"].requiredFacts).toContain("property address");
    expect(workflowProfiles["insurance-claim-command-center"].requiredFacts).toContain("policy reference");
  });
});
