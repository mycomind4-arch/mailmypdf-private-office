import { describe, expect, it } from "vitest";
import { mapStatus, MailMyPDFProvider } from "./mailmypdf-provider";
import type { MailingOrderDraft, MailingRecipient } from "@/domain/mailing";

const recipient: MailingRecipient = {
  name: "ABC Construction",
  address1: "123 Main St",
  city: "Springfield",
  state: "IL",
  postalCode: "62701",
};

const baseDraft: MailingOrderDraft = {
  workflowId: "contractor-dispute",
  documentId: "doc-1",
  recipient,
  method: "certified",
  idempotencyKey: "matter-1:doc-1",
};

describe("MailMyPDF provider: status mapping", () => {
  it("maps known statuses correctly", () => {
    expect(mapStatus("created")).toBe("submitted");
    expect(mapStatus("submitted")).toBe("submitted");
    expect(mapStatus("mailed")).toBe("mailed");
    expect(mapStatus("sent")).toBe("mailed");
    expect(mapStatus("in_transit")).toBe("in_transit");
    expect(mapStatus("in-transit")).toBe("in_transit");
    expect(mapStatus("delivered")).toBe("delivered");
    expect(mapStatus("failed")).toBe("failed");
    expect(mapStatus("cancelled")).toBe("cancelled");
    expect(mapStatus("canceled")).toBe("cancelled");
    expect(mapStatus("refunded")).toBe("refunded");
  });

  it("throws on unknown status", () => {
    expect(() => mapStatus("unknown_status")).toThrow(/Unknown MailMyPDF fulfillment status/);
  });
});

describe("MailMyPDF provider: createLetter validation", () => {
  it("throws when documentId is missing", async () => {
    const provider = new MailMyPDFProvider();
    await expect(
      provider.createLetter({ ...baseDraft, documentId: "" }),
    ).rejects.toThrow(/documentId/);
  });

  it("throws when idempotency key is empty", async () => {
    const provider = new MailMyPDFProvider();
    await expect(
      provider.createLetter({ ...baseDraft, idempotencyKey: "" }),
    ).rejects.toThrow(/idempotency key/);
  });

  it("throws when idempotency key is whitespace", async () => {
    const provider = new MailMyPDFProvider();
    await expect(
      provider.createLetter({ ...baseDraft, idempotencyKey: "  " }),
    ).rejects.toThrow(/idempotency key/);
  });
});

describe("MailMyPDF provider: getStatus validation", () => {
  it("throws when provider order ID is empty", async () => {
    const provider = new MailMyPDFProvider();
    await expect(provider.getStatus("")).rejects.toThrow(/Provider order ID/);
    await expect(provider.getStatus("  ")).rejects.toThrow(/Provider order ID/);
  });
});
