import { describe, expect, it } from "vitest";
import {
  canTransitionMatter,
  transitionMatter,
  type PrivateOfficeMatter,
} from "./matter";

const baseMatter: PrivateOfficeMatter = {
  id: "matter-1",
  ownerId: "user-1",
  workflowId: "contractor-dispute",
  documentId: "doc-1",
  title: "Construction Defect — 123 Main Street",
  status: "review",
  version: 3,
  createdAt: "2026-08-20T00:00:00.000Z",
  updatedAt: "2026-08-20T00:00:00.000Z",
  approvedAt: null,
  submittedAt: null,
  providerOrderId: null,
  trackingNumber: null,
  proofHash: null,
};

describe("matter lifecycle state machine", () => {
  it("records approval time when approval is granted", () => {
    const next = transitionMatter(baseMatter, "approved", "2026-08-20T15:00:00.000Z");
    expect(next.status).toBe("approved");
    expect(next.approvedAt).toBe("2026-08-20T15:00:00.000Z");
    expect(next.version).toBe(4);
  });

  it("requires a provider order before submission", () => {
    const approved = transitionMatter(baseMatter, "approved");
    const paymentPending = transitionMatter(approved, "payment_pending");
    expect(() => transitionMatter(paymentPending, "submitted")).toThrow(/providerOrderId/);
  });

  it("records submission time when submitted with provider order", () => {
    const approved = transitionMatter(baseMatter, "approved");
    const paymentPending = transitionMatter(approved, "payment_pending");
    const submitted = transitionMatter(paymentPending, "submitted", undefined, {
      providerOrderId: "order-1",
    });
    expect(submitted.status).toBe("submitted");
    expect(submitted.submittedAt).toBeTruthy();
    expect(submitted.providerOrderId).toBe("order-1");
  });

  it("requires tracking before tracking state and proof before completion", () => {
    const approved = transitionMatter(baseMatter, "approved");
    const paymentPending = transitionMatter(approved, "payment_pending");
    const submitted = transitionMatter(paymentPending, "submitted", undefined, {
      providerOrderId: "order-1",
    });
    expect(() => transitionMatter(submitted, "tracking")).toThrow(/trackingNumber/);
    const tracking = transitionMatter(submitted, "tracking", undefined, {
      trackingNumber: "TRK-1",
    });
    expect(() => transitionMatter(tracking, "completed")).toThrow(/proofHash/);
    const completed = transitionMatter(tracking, "completed", undefined, {
      proofHash: "hash-1",
    });
    expect(completed.proofHash).toBe("hash-1");
  });

  it("rejects invalid lifecycle jumps", () => {
    expect(() => transitionMatter(baseMatter, "completed")).toThrow(/Invalid matter transition/);
  });

  it("rejects transition from completed (terminal state)", () => {
    const approved = transitionMatter(baseMatter, "approved");
    const paymentPending = transitionMatter(approved, "payment_pending");
    const submitted = transitionMatter(paymentPending, "submitted", undefined, {
      providerOrderId: "order-1",
    });
    const tracking = transitionMatter(submitted, "tracking", undefined, {
      trackingNumber: "TRK-1",
    });
    const completed = transitionMatter(tracking, "completed", undefined, {
      proofHash: "hash-1",
    });
    expect(() => transitionMatter(completed, "draft")).toThrow(/Invalid matter transition/);
  });

  it("allows failed to transition back to review or payment_pending", () => {
    
    expect(canTransitionMatter("failed", "review")).toBe(true);
    expect(canTransitionMatter("failed", "payment_pending")).toBe(true);
    expect(canTransitionMatter("failed", "cancelled")).toBe(true);
  });

  it("increments version on every transition", () => {
    const draft: PrivateOfficeMatter = { ...baseMatter, status: "draft", version: 1 };
    const validated = transitionMatter(draft, "validated");
    expect(validated.version).toBe(2);
    const review = transitionMatter(validated, "review");
    expect(review.version).toBe(3);
  });
});
