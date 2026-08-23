import { describe, expect, it, vi, beforeEach } from "vitest";

// Mock the MailMyPDF provider before importing the fulfillment service
vi.mock("@/platform/mailmypdf-provider", () => ({
  mailMyPDFProvider: {
    createLetter: vi.fn(),
    getStatus: vi.fn(),
  },
}));

import { submitApprovedMatter, _resetIdempotencyCache } from "./fulfillment";
import type { MatterAnalysis } from "@/domain/gold-standard";
import type { MailingRecipient, MailingMethod } from "@/domain/mailing";
import { mailMyPDFProvider } from "@/platform/mailmypdf-provider";

const recipient: MailingRecipient = {
  name: "ABC Construction",
  address1: "123 Main St",
  city: "Springfield",
  state: "IL",
  postalCode: "62701",
};

const draftHash = "a1b2c3d4e5f6";

function cleanAnalysis(overrides: Partial<MatterAnalysis> = {}): MatterAnalysis {
  return {
    documentId: "doc-1",
    classification: { type: "contractor-dispute", confidence: 0.9 },
    facts: [],
    findings: [
      {
        id: "confirmed",
        state: "confirmed",
        title: "OK",
        detail: "OK",
        severity: "low",
      },
    ],
    evidence: [],
    timeline: [],
    strategy: [],
    blockingIssues: [],
    risks: [],
    generationProvenance: null,
    ...overrides,
  };
}

const validInput = {
  workflowId: "contractor-dispute",
  documentId: "doc-1",
  analysis: cleanAnalysis(),
  draftValidated: true,
  humanApproved: true,
  recipient,
  paymentComplete: true,
  stripePaymentId: "pi_test_123",
  mailingMethod: "certified" as MailingMethod,
  proofReady: true,
  idempotencyKey: "matter-1:doc-1",
  currentDraftHash: draftHash,
  approvedDraftHash: draftHash,
};

beforeEach(() => {
  vi.clearAllMocks();
  _resetIdempotencyCache();
});

describe("fulfillment: approval-gated mailing", () => {
  it("submits when all gates are satisfied", async () => {
    vi.mocked(mailMyPDFProvider.createLetter).mockResolvedValue({
      providerOrderId: "comm-1",
    });
    vi.mocked(mailMyPDFProvider.getStatus).mockResolvedValue({
      state: "submitted",
      trackingNumber: "TRK-1",
      updatedAt: "2026-08-20T00:00:00.000Z",
    });

    const result = await submitApprovedMatter(validInput);
    expect(result.providerOrderId).toBe("comm-1");
    expect(result.status.state).toBe("submitted");
  });

  it("rejects submission when human approval is missing", async () => {
    await expect(
      submitApprovedMatter({ ...validInput, humanApproved: false }),
    ).rejects.toThrow(/prerequisites are incomplete/);
  });

  it("rejects submission when draft is not validated", async () => {
    await expect(
      submitApprovedMatter({ ...validInput, draftValidated: false }),
    ).rejects.toThrow(/prerequisites are incomplete/);
  });

  it("rejects submission when analysis has blocking issues", async () => {
    await expect(
      submitApprovedMatter({
        ...validInput,
        analysis: cleanAnalysis({ blockingIssues: ["Missing evidence"] }),
      }),
    ).rejects.toThrow(/prerequisites are incomplete/);
  });

  it("rejects submission when evidence is unresolved", async () => {
    await expect(
      submitApprovedMatter({
        ...validInput,
        analysis: cleanAnalysis({
          evidence: [
            {
              id: "e1",
              description: "Test",
              status: "requested",
              supportsFindingIds: [],
            },
          ],
        }),
      }),
    ).rejects.toThrow(/prerequisites are incomplete/);
  });

  it("rejects submission when recipient is incomplete", async () => {
    await expect(
      submitApprovedMatter({
        ...validInput,
        recipient: { ...recipient, address1: "" },
      }),
    ).rejects.toThrow(/prerequisites are incomplete/);
  });

  it("rejects submission when payment is not complete", async () => {
    await expect(
      submitApprovedMatter({ ...validInput, paymentComplete: false }),
    ).rejects.toThrow(/prerequisites are incomplete/);
  });

  it("rejects submission when Stripe payment ID is empty", async () => {
    await expect(
      submitApprovedMatter({ ...validInput, stripePaymentId: "" }),
    ).rejects.toThrow(/Stripe payment identifier/);
  });

  it("rejects submission when idempotency key is empty", async () => {
    await expect(
      submitApprovedMatter({ ...validInput, idempotencyKey: "" }),
    ).rejects.toThrow(/idempotency key/);
  });

  it("calls the provider with correct matter type", async () => {
    vi.mocked(mailMyPDFProvider.createLetter).mockResolvedValue({
      providerOrderId: "comm-2",
    });
    vi.mocked(mailMyPDFProvider.getStatus).mockResolvedValue({
      state: "submitted",
      updatedAt: "2026-08-20T00:00:00.000Z",
    });

    await submitApprovedMatter(validInput);
    expect(mailMyPDFProvider.createLetter).toHaveBeenCalledWith(
      expect.objectContaining({ matterType: "private-office" }),
    );
  });
});

describe("fulfillment: draft version integrity", () => {
  it("rejects submission when draft was modified after approval", async () => {
    await expect(
      submitApprovedMatter({
        ...validInput,
        currentDraftHash: "modified-hash",
        approvedDraftHash: draftHash,
      }),
    ).rejects.toThrow(/modified after approval/);
  });

  it("rejects submission when approvedDraftHash is null", async () => {
    await expect(
      submitApprovedMatter({
        ...validInput,
        approvedDraftHash: "",
      }),
    ).rejects.toThrow(/modified after approval/);
  });

  it("accepts submission when hashes match exactly", async () => {
    vi.mocked(mailMyPDFProvider.createLetter).mockResolvedValue({
      providerOrderId: "comm-3",
    });
    vi.mocked(mailMyPDFProvider.getStatus).mockResolvedValue({
      state: "submitted",
      updatedAt: "2026-08-20T00:00:00.000Z",
    });

    const result = await submitApprovedMatter(validInput);
    expect(result.providerOrderId).toBe("comm-3");
  });
});

describe("fulfillment: idempotency", () => {
  it("returns the same result for duplicate submission with same key", async () => {
    vi.mocked(mailMyPDFProvider.createLetter).mockResolvedValue({
      providerOrderId: "comm-idem-1",
    });
    vi.mocked(mailMyPDFProvider.getStatus).mockResolvedValue({
      state: "submitted",
      trackingNumber: "TRK-IDEM",
      updatedAt: "2026-08-20T00:00:00.000Z",
    });

    const first = await submitApprovedMatter(validInput);
    const second = await submitApprovedMatter(validInput);

    expect(first.providerOrderId).toBe("comm-idem-1");
    expect(second.providerOrderId).toBe("comm-idem-1");
    // Provider should only be called once
    expect(mailMyPDFProvider.createLetter).toHaveBeenCalledTimes(1);
  });

  it("allows different submissions with different idempotency keys", async () => {
    vi.mocked(mailMyPDFProvider.createLetter)
      .mockResolvedValueOnce({ providerOrderId: "comm-A" })
      .mockResolvedValueOnce({ providerOrderId: "comm-B" });
    vi.mocked(mailMyPDFProvider.getStatus).mockResolvedValue({
      state: "submitted",
      updatedAt: "2026-08-20T00:00:00.000Z",
    });

    const first = await submitApprovedMatter(validInput);
    const second = await submitApprovedMatter({
      ...validInput,
      idempotencyKey: "matter-2:doc-2",
    });

    expect(first.providerOrderId).toBe("comm-A");
    expect(second.providerOrderId).toBe("comm-B");
    expect(mailMyPDFProvider.createLetter).toHaveBeenCalledTimes(2);
  });

  it("does not call provider on duplicate after successful submission", async () => {
    vi.mocked(mailMyPDFProvider.createLetter).mockResolvedValue({
      providerOrderId: "comm-idem-2",
    });
    vi.mocked(mailMyPDFProvider.getStatus).mockResolvedValue({
      state: "submitted",
      updatedAt: "2026-08-20T00:00:00.000Z",
    });

    await submitApprovedMatter(validInput);
    await submitApprovedMatter(validInput);
    await submitApprovedMatter(validInput);

    expect(mailMyPDFProvider.createLetter).toHaveBeenCalledTimes(1);
    expect(mailMyPDFProvider.getStatus).toHaveBeenCalledTimes(1);
  });
});

describe("fulfillment: provider failure", () => {
  it("rejects on provider failure", async () => {
    vi.mocked(mailMyPDFProvider.createLetter).mockRejectedValue(
      new Error("MailMyPDF API error 500"),
    );

    await expect(submitApprovedMatter(validInput)).rejects.toThrow(
      /MailMyPDF API error/,
    );
  });

  it("does not cache the result when provider fails", async () => {
    vi.mocked(mailMyPDFProvider.createLetter)
      .mockRejectedValueOnce(new Error("Provider error"))
      .mockResolvedValueOnce({ providerOrderId: "comm-retry" });
    vi.mocked(mailMyPDFProvider.getStatus).mockResolvedValue({
      state: "submitted",
      updatedAt: "2026-08-20T00:00:00.000Z",
    });

    // First attempt fails
    await expect(submitApprovedMatter(validInput)).rejects.toThrow();

    // Retry succeeds (key was not cached because provider failed)
    const result = await submitApprovedMatter(validInput);
    expect(result.providerOrderId).toBe("comm-retry");
    expect(mailMyPDFProvider.createLetter).toHaveBeenCalledTimes(2);
  });
});
