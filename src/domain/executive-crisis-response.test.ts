import { describe, expect, it } from "vitest";
import "./workflow-profile-extensions";
import { runPrivateOfficeWorkflow } from "./private-office-workflow";
import { workflows } from "./workflows";
import { workflowProfiles } from "./workflow-profiles";
import { canApproveMatter, canAuthorizeMatterMail } from "./gold-standard";

const profile = workflowProfiles["executive-crisis-response"];

const completeFacts: Record<string, string> = {
  matterSubject: "Executive conduct inquiry",
  primaryOrganization: "Northstar Holdings",
  materialEventDate: "August 20, 2026",
  currentMatterStatus: "Written inquiry received; response requested by September 2, 2026.",
  executiveAccount: "The executive states that the disputed decision followed the company's documented approval process and contemporaneous meeting record.",
  reportedAllegation: "The incoming letter alleges that the executive bypassed an internal approval process.",
};

function completeEvidence(): Record<string, "provided"> {
  return Object.fromEntries(
    profile.evidenceRequirements.map((requirement) => {
      const slug = requirement.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      return [`evidence-${slug}`, "provided"];
    }),
  ) as Record<string, "provided">;
}

describe("executive-crisis-response: registration", () => {
  it("is registered as a Gold Standard workflow", () => {
    expect(profile).toBeDefined();
    expect(profile.id).toBe("executive-crisis-response");
    expect(workflows["executive-crisis-response"].lifecycle).toBe("gold");
    expect(workflows["executive-crisis-response"].goldStandardStages).toHaveLength(18);
  });

  it("uses the Executive & High-Stakes workflow family", () => {
    expect(profile.family).toBe("Executive & High-Stakes");
    expect(profile.requiredFacts).toContain("reported allegation or demand");
  });
});

describe("executive-crisis-response: intake blocking", () => {
  it("blocks when required facts are missing", () => {
    const result = runPrivateOfficeWorkflow({
      workflowId: "executive-crisis-response",
      documentId: "doc-1",
      text: "Incoming executive matter correspondence.",
      facts: {},
      objective: "",
    });
    expect(result.blocked).toBe(true);
    expect(profile.requiredFacts.every((fact) => result.errors.some((error) => error.includes(fact)))).toBe(true);
  });

  it("accepts a complete intake and produces an analysis", () => {
    const result = runPrivateOfficeWorkflow({
      workflowId: "executive-crisis-response",
      documentId: "doc-1",
      text: "Inquiry received August 20, 2026. Response requested by September 2, 2026. The letter alleges an approval-process issue.",
      facts: completeFacts,
      evidenceStatuses: completeEvidence(),
      objective: "Correct the factual record and provide a measured response.",
    });
    expect(result.blocked).toBe(false);
    expect(result.analysis.classification.type).toBe("executive-crisis-response");
  });
});

describe("executive-crisis-response: evidence and chronology", () => {
  it("requires the workflow evidence set before approval", () => {
    const result = runPrivateOfficeWorkflow({
      workflowId: "executive-crisis-response",
      documentId: "doc-1",
      text: "Matter correspondence.",
      facts: completeFacts,
      evidenceStatuses: {},
      objective: "Document the matter.",
    });
    expect(result.blocked).toBe(true);
  });

  it("generates findings, evidence, risk, strategy, and timeline", () => {
    const result = runPrivateOfficeWorkflow({
      workflowId: "executive-crisis-response",
      documentId: "doc-1",
      text: "Inquiry received August 20, 2026. Response requested by September 2, 2026. Meeting notes dated August 21, 2026 document the approval discussion.",
      facts: completeFacts,
      evidenceStatuses: completeEvidence(),
      objective: "Correct the factual record and provide a measured response.",
    });
    expect(result.analysis.findings.length).toBeGreaterThan(0);
    expect(result.analysis.evidence.length).toBe(profile.evidenceRequirements.length);
    expect(result.analysis.risks.length).toBeGreaterThan(0);
    expect(result.analysis.strategy.length).toBeGreaterThan(0);
    expect(result.analysis.timeline.length).toBeGreaterThan(0);
  });

  it("preserves a source excerpt on extracted timeline events", () => {
    const result = runPrivateOfficeWorkflow({
      workflowId: "executive-crisis-response",
      documentId: "doc-1",
      text: "Inquiry received August 20, 2026 and response requested by September 2, 2026.",
      facts: completeFacts,
      evidenceStatuses: completeEvidence(),
      objective: "Document the matter.",
    });
    const event = result.analysis.timeline.find((item) => item.date?.includes("August 20"));
    expect(event).toBeDefined();
    expect(event?.sourceExcerpt).toBeDefined();
  });
});

describe("executive-crisis-response: source and allegation safety", () => {
  it("does not treat an allegation as a verified legal conclusion", () => {
    const result = runPrivateOfficeWorkflow({
      workflowId: "executive-crisis-response",
      documentId: "doc-1",
      text: "The letter alleges that the executive engaged in misconduct.",
      facts: completeFacts,
      evidenceStatuses: completeEvidence(),
      objective: "Respond to the allegation.",
    });
    const findingText = result.analysis.findings.map((finding) => `${finding.title} ${finding.detail}`).join(" ").toLowerCase();
    expect(findingText).not.toContain("legally established misconduct");
    expect(findingText).not.toContain("confirmed legal violation");
  });

  it("does not require passwords, private keys, or government identifiers", () => {
    const required = profile.requiredFacts.join(" ").toLowerCase();
    expect(required).not.toContain("password");
    expect(required).not.toContain("private key");
    expect(required).not.toContain("social security");
    expect(required).not.toContain("ssn");
  });
});

describe("executive-crisis-response: draft and authorization", () => {
  it("generates a review-gated correspondence draft from controlled facts", () => {
    const result = runPrivateOfficeWorkflow({
      workflowId: "executive-crisis-response",
      documentId: "doc-1",
      text: "Inquiry received August 20, 2026. Response requested by September 2, 2026.",
      facts: completeFacts,
      evidenceStatuses: completeEvidence(),
      objective: "Correct the factual record and provide a measured response.",
    });
    expect(result.draft).toContain("Executive Matter Correspondence");
    expect(result.draft).toContain("[DRAFT — REVIEW BEFORE SENDING]");
    expect(result.draft).toContain("Northstar Holdings");
  });

  it("passes the analysis approval gate only when the controlled matter is complete", () => {
    const result = runPrivateOfficeWorkflow({
      workflowId: "executive-crisis-response",
      documentId: "doc-1",
      text: "Inquiry received August 20, 2026.",
      facts: completeFacts,
      evidenceStatuses: completeEvidence(),
      objective: "Document the matter.",
    });
    expect(canApproveMatter(result.analysis)).toBe(true);
  });

  it("never authorizes consequential mailing without explicit human approval", () => {
    const result = runPrivateOfficeWorkflow({
      workflowId: "executive-crisis-response",
      documentId: "doc-1",
      text: "Inquiry received August 20, 2026.",
      facts: completeFacts,
      evidenceStatuses: completeEvidence(),
      objective: "Document the matter.",
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

describe("executive-crisis-response: boundary regression", () => {
  it("keeps the narrower property insurance workflow independently registered", () => {
    expect(workflows["property-insurance-claim"].lifecycle).toBe("gold");
    expect(workflowProfiles["property-insurance-claim"].requiredFacts).toContain("claim number");
    expect(workflowProfiles["executive-crisis-response"].requiredFacts).not.toContain("claim number");
  });
});
