import { describe, expect, it } from "vitest";
import { runPrivateOfficeWorkflow } from "./private-office-workflow";
import { workflows } from "./workflows";
import { workflowProfiles } from "./workflow-profiles";
import { canApproveMatter, canAuthorizeMatterMail } from "./gold-standard";

const profile = workflowProfiles["estate-legacy-document-organizer"];

function buildEvidenceStatuses(status: "provided" = "provided"): Record<string, "provided"> {
  return Object.fromEntries(
    profile.evidenceRequirements.map((requirement) => {
      const slug = requirement.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      return [`evidence-${slug}`, status];
    }),
  ) as Record<string, "provided">;
}

const completeFacts: Record<string, string> = {
  documentOwnerName: "Jane B. Smith",
  documentSetType: "Estate planning review",
  keyEventDate: "August 28, 2026",
  knownJurisdiction: "State of California",
};

describe("estate-legacy-document-organizer: registration", () => {
  it("is registered as a gold workflow", () => {
    expect(profile).toBeDefined();
    expect(profile.id).toBe("estate-legacy-document-organizer");
    expect(workflows["estate-legacy-document-organizer"].lifecycle).toBe("gold");
  });

  it("uses the same Gold Standard stage contract as the existing workflows", () => {
    expect(workflows["estate-legacy-document-organizer"].goldStandardStages).toHaveLength(18);
    expect(workflows["estate-legacy-document-organizer"].goldStandardStages).toContain("facts-provenance");
    expect(workflows["estate-legacy-document-organizer"].goldStandardStages).toContain("prove-audit");
  });
});

describe("estate-legacy-document-organizer: intake", () => {
  it("blocks when required facts are missing", () => {
    const result = runPrivateOfficeWorkflow({
      workflowId: "estate-legacy-document-organizer",
      documentId: "doc-1",
      text: "Estate documents.",
      facts: {},
      objective: "",
    });
    expect(result.blocked).toBe(true);
    expect(profile.requiredFacts.every((fact) => result.errors.some((error) => error.includes(fact)))).toBe(true);
  });

  it("accepts complete intake with a separate objective", () => {
    const result = runPrivateOfficeWorkflow({
      workflowId: "estate-legacy-document-organizer",
      documentId: "doc-1",
      text: "Will dated January 10, 2022. Trust restated March 4, 2024. Deed recorded May 5, 2025.",
      facts: completeFacts,
      evidenceStatuses: buildEvidenceStatuses(),
      objective: "Prepare a concise file for an upcoming attorney meeting.",
    });
    expect(result.blocked).toBe(false);
    expect(result.analysis.classification.type).toBe("estate-legacy-document-organizer");
  });
});

describe("estate-legacy-document-organizer: AI-oriented analysis", () => {
  it("produces the core analysis surfaces", () => {
    const result = runPrivateOfficeWorkflow({
      workflowId: "estate-legacy-document-organizer",
      documentId: "doc-1",
      text: "Will dated January 10, 2022. Trust restated March 4, 2024. Deed recorded May 5, 2025. Beneficiary confirmation dated July 1, 2026.",
      facts: completeFacts,
      evidenceStatuses: buildEvidenceStatuses(),
      objective: "Prepare a concise file for an upcoming attorney meeting.",
    });
    expect(result.analysis.findings.length).toBeGreaterThan(0);
    expect(result.analysis.timeline.length).toBeGreaterThan(0);
    expect(result.analysis.evidence.length).toBe(profile.evidenceRequirements.length);
    expect(result.analysis.risks.length).toBeGreaterThan(0);
    expect(result.analysis.strategy.length).toBeGreaterThan(0);
  });

  it("keeps timeline observations tied to source excerpts", () => {
    const result = runPrivateOfficeWorkflow({
      workflowId: "estate-legacy-document-organizer",
      documentId: "doc-1",
      text: "Trust restated March 4, 2024.",
      facts: completeFacts,
      evidenceStatuses: buildEvidenceStatuses(),
      objective: "Prepare for professional review.",
    });
    const event = result.analysis.timeline.find((item) => item.date?.includes("March 4, 2024"));
    expect(event).toBeDefined();
    expect(event?.sourceExcerpt).toBeDefined();
  });
});

describe("estate-legacy-document-organizer: evidence gates", () => {
  it("blocks when supporting documents are not supplied", () => {
    const result = runPrivateOfficeWorkflow({
      workflowId: "estate-legacy-document-organizer",
      documentId: "doc-1",
      text: "Estate documents.",
      facts: completeFacts,
      evidenceStatuses: {},
      objective: "Prepare for professional review.",
    });
    expect(result.blocked).toBe(true);
  });

  it("passes the approval analysis gate when facts and evidence are complete", () => {
    const result = runPrivateOfficeWorkflow({
      workflowId: "estate-legacy-document-organizer",
      documentId: "doc-1",
      text: "Will dated January 10, 2022.",
      facts: completeFacts,
      evidenceStatuses: buildEvidenceStatuses(),
      objective: "Prepare for professional review.",
    });
    expect(canApproveMatter(result.analysis)).toBe(true);
  });
});

describe("estate-legacy-document-organizer: privacy and legal-conclusion safety", () => {
  it("does not require sensitive identifiers", () => {
    const required = profile.requiredFacts.join(" ").toLowerCase();
    const evidence = profile.evidenceRequirements.join(" ").toLowerCase();
    const all = `${required} ${evidence}`;
    expect(all).not.toContain("social security");
    expect(all).not.toContain("ssn");
    expect(all).not.toContain("password");
    expect(all).not.toContain("login credential");
    expect(all).not.toContain("full bank account number");
  });

  it("does not authorize mailing without explicit human approval", () => {
    const result = runPrivateOfficeWorkflow({
      workflowId: "estate-legacy-document-organizer",
      documentId: "doc-1",
      text: "Will dated January 10, 2022.",
      facts: completeFacts,
      evidenceStatuses: buildEvidenceStatuses(),
      objective: "Prepare a professional handoff.",
    });
    expect(canAuthorizeMatterMail({
      analysis: result.analysis,
      draftValidated: true,
      humanApproved: false,
      recipientComplete: true,
      paymentComplete: true,
    })).toBe(false);
  });

  it("uses assistive language rather than legal-status conclusions", () => {
    const result = runPrivateOfficeWorkflow({
      workflowId: "estate-legacy-document-organizer",
      documentId: "doc-1",
      text: "Will dated January 10, 2022 names Jane Smith. Trust restated March 4, 2024.",
      facts: completeFacts,
      evidenceStatuses: buildEvidenceStatuses(),
      objective: "Prepare for professional review.",
    });
    const findingText = result.analysis.findings.map((item) => `${item.title} ${item.detail}`).join(" ").toLowerCase();
    expect(findingText).not.toContain("legally valid will");
    expect(findingText).not.toContain("legally confirmed beneficiary");
  });
});

describe("estate-legacy-document-organizer: regression boundary", () => {
  it("leaves the existing trust beneficiary workflow independent", () => {
    expect(workflows["trust-beneficiary-notice"].lifecycle).toBe("gold");
    expect(workflowProfiles["trust-beneficiary-notice"].requiredFacts).toContain("trust name");
    expect(workflowProfiles["estate-legacy-document-organizer"].requiredFacts).toContain("document owner name");
  });
});
