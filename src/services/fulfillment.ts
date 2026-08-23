import { canAuthorizeMatterMail, type MatterAnalysis } from "@/domain/gold-standard";
import { isApprovalValid } from "@/domain/draft-provenance";
import type { MailingMethod, MailingRecipient } from "@/domain/mailing";
import { mailMyPDFProvider } from "@/platform/mailmypdf-provider";

export interface ApprovedMatterSubmissionInput {
  workflowId: string;
  documentId: string;
  analysis: MatterAnalysis;
  draftValidated: boolean;
  humanApproved: boolean;
  recipient: MailingRecipient;
  paymentComplete: boolean;
  stripePaymentId: string;
  mailingMethod: MailingMethod;
  proofReady: boolean;
  idempotencyKey: string;
  matterReference?: string;
  /** Hash of the draft content currently being submitted. */
  currentDraftHash: string;
  /** Hash of the draft content that was approved. */
  approvedDraftHash: string;
}

/**
 * In-process idempotency guard. Prevents duplicate submissions with the same
 * idempotency key within the same server lifetime. The MailMyPDF API also
 * receives the key via the Idempotency-Key header for cross-request safety.
 */
const processedKeys = new Map<string, { providerOrderId: string; status: unknown }>();

export async function submitApprovedMatter(
  input: ApprovedMatterSubmissionInput,
) {
  // --- Gate 1: Idempotency check (before any external call) ---
  const existing = processedKeys.get(input.idempotencyKey);
  if (existing) {
    return { providerOrderId: existing.providerOrderId, status: existing.status };
  }

  // --- Gate 2: Draft version integrity ---
  if (!isApprovalValid(input.currentDraftHash, input.approvedDraftHash)) {
    throw new Error(
      "Draft was modified after approval. The draft must be reviewed and approved again before mailing.",
    );
  }

  // --- Gate 3: Recipient completeness ---
  const recipientComplete = Boolean(
    input.recipient.name &&
      input.recipient.address1 &&
      input.recipient.city &&
      input.recipient.state &&
      input.recipient.postalCode,
  );

  // --- Gate 4: Authorization (analysis + draft + approval + recipient + payment) ---
  if (
    !canAuthorizeMatterMail({
      analysis: input.analysis,
      draftValidated: input.draftValidated,
      humanApproved: input.humanApproved,
      recipientComplete,
      paymentComplete: input.paymentComplete,
    })
  ) {
    throw new Error(
      "Matter cannot be submitted: validation, evidence, approval, recipient, or payment prerequisites are incomplete",
    );
  }

  // --- Gate 5: Payment identifier ---
  if (!input.stripePaymentId.trim())
    throw new Error("Matter mailing requires a verified Stripe payment identifier");
  if (!input.idempotencyKey.trim())
    throw new Error("Matter mailing requires an idempotency key");

  // --- Gate 6: Provider submission ---
  const { providerOrderId } = await mailMyPDFProvider.createLetter({
    workflowId: input.workflowId,
    documentId: input.documentId,
    recipient: input.recipient,
    method: input.mailingMethod,
    stripePaymentId: input.stripePaymentId,
    idempotencyKey: input.idempotencyKey,
    matterReference: input.matterReference ?? input.workflowId,
    matterType: "private-office",
  });

  const status = await mailMyPDFProvider.getStatus(providerOrderId);

  // Record idempotency for future duplicate-suppression
  processedKeys.set(input.idempotencyKey, { providerOrderId, status });

  return { providerOrderId, status };
}

/**
 * Test-only helper to reset the idempotency cache between tests.
 */
export function _resetIdempotencyCache(): void {
  processedKeys.clear();
}
