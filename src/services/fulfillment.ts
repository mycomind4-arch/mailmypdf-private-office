import { canAuthorizeMatterMail, type MatterAnalysis } from "@/domain/gold-standard";
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
}

export async function submitApprovedMatter(
  input: ApprovedMatterSubmissionInput,
) {
  const recipientComplete = Boolean(
    input.recipient.name &&
      input.recipient.address1 &&
      input.recipient.city &&
      input.recipient.state &&
      input.recipient.postalCode,
  );

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

  if (!input.stripePaymentId.trim())
    throw new Error("Matter mailing requires a verified Stripe payment identifier");
  if (!input.idempotencyKey.trim())
    throw new Error("Matter mailing requires an idempotency key");

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
  return { providerOrderId, status };
}
