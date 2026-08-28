import type { WorkflowId } from "./workflows";

export interface WorkflowProfile {
  id: WorkflowId;
  slug: string;
  family: string;
  primaryKeyword: string;
  supportingKeywords: string[];
  searchIntent: "transactional" | "commercial" | "problem";
  problem: string;
  outcome: string;
  recipientRole: string;
  requiredFacts: string[];
  evidenceRequirements: string[];
  deadlinePolicy: string;
  objectivePrompt: string;
  draftSubject: string;
  disclaimer: string;
  pricing: {
    preparationFee: number;
    includedResponsePages: number;
    responsePagePrice: number;
    supportingPagePrice: number;
    standardMail: number;
    certifiedMail: number;
    certifiedReturnReceipt?: number;
    registeredMail?: number;
  };
}

const privateOfficeDisclaimer =
  "Private Office provides document preparation, evidence organization, and mailing assistance. It is not a law firm and does not provide legal advice, legal representation, or guarantee any outcome. You remain responsible for the facts and decisions in your matter.";

export const workflowProfiles: Record<WorkflowId, WorkflowProfile> = {
  "contractor-dispute": {
    id: "contractor-dispute", slug: "contractor-dispute", family: "Property", primaryKeyword: "contractor dispute letter",
    supportingKeywords: ["contractor dispute letter template", "construction defect notice", "letter to contractor for defective work", "contractor demand letter", "how to document contractor dispute"], searchIntent: "commercial",
    problem: "A contractor performed defective, incomplete, or unauthorized work, or disputes have arisen over billing, scope, or performance under a construction or improvement agreement.",
    outcome: "Create a documented contractor dispute letter identifying the property, the contractor, the agreement, the defects or issues, the relevant dates, the evidence, and the requested resolution.", recipientRole: "contractor",
    requiredFacts: ["property address", "contractor name", "agreement reference", "dispute description"],
    evidenceRequirements: ["contract or written agreement", "invoices or billing records", "payment records or receipts", "photos of defects or incomplete work", "correspondence with contractor", "permits or inspection reports when relevant"],
    deadlinePolicy: "Capture all dates visible in the agreement, invoices, and correspondence. Flag any stated deadlines for cure, response, or filing. Do not invent a statutory deadline — surface date facts for human review.",
    objectivePrompt: "What specific resolution are you requesting from the contractor — repair, refund, completion, correction, or other action?", draftSubject: "Notice of Contractor Dispute", disclaimer: privateOfficeDisclaimer,
    pricing: { preparationFee: 24.99, includedResponsePages: 4, responsePagePrice: 0.45, supportingPagePrice: 0.25, standardMail: 5.49, certifiedMail: 12.99, certifiedReturnReceipt: 18.99, registeredMail: 24.99 },
  },
  "property-insurance-claim": {
    id: "property-insurance-claim", slug: "property-insurance-claim", family: "Property", primaryKeyword: "property insurance claim letter",
    supportingKeywords: ["insurance claim dispute letter", "denied insurance claim letter", "insurance claim reconsideration letter", "insurance supplemental claim letter", "insurance claim underpayment", "property damage insurance claim"], searchIntent: "commercial",
    problem: "A property owner's insurance claim has been denied, underpaid, delayed, or disputed by the insurer — or a supplemental claim is needed for additional damage or repair costs discovered after the initial claim.",
    outcome: "Create a documented property insurance claim letter identifying the property, the policy, the claim, the damage, the insurer's position, the evidence, the chronology, and the requested resolution.", recipientRole: "insurer",
    requiredFacts: ["property address", "insurer name", "claim number", "date of loss", "description of damage", "insurer position"],
    evidenceRequirements: ["policy documents or declarations page", "claim correspondence from insurer", "denial letter or explanation of benefits", "payment statements or claim summaries", "repair estimates or contractor bids", "photographs of property damage", "inspection reports or engineer reports", "receipts for repairs or temporary mitigation", "prior communications with insurer"],
    deadlinePolicy: "Insurance claim timelines are governed by the policy, state law, and the claim's procedural posture. Capture all dates visible in correspondence, denial letters, and policy documents. Distinguish known deadlines explicitly stated in policy or correspondence from potential deadlines that depend on jurisdiction or policy provisions. Flag any stated response deadlines or proof-of-loss requirements as known deadlines. Flag any limitation periods or statutory deadlines as potential deadlines requiring verification. Do not invent a statutory deadline. Potential deadline identified — verify against the applicable policy and jurisdiction. Surface all date facts for human review.",
    objectivePrompt: "What specific resolution are you requesting from the insurer — reconsideration of denial, supplemental payment, additional inspection, written explanation, or other documented resolution?", draftSubject: "Property Insurance Claim Correspondence", disclaimer: privateOfficeDisclaimer,
    pricing: { preparationFee: 29.99, includedResponsePages: 4, responsePagePrice: 0.45, supportingPagePrice: 0.25, standardMail: 5.49, certifiedMail: 12.99, certifiedReturnReceipt: 18.99, registeredMail: 24.99 },
  },
  "bank-wire-dispute": {
    id: "bank-wire-dispute", slug: "bank-wire-dispute", family: "Financial", primaryKeyword: "bank wire transfer dispute letter",
    supportingKeywords: ["wire transfer dispute", "unauthorized wire transfer letter", "bank transfer dispute letter", "wire transfer recall request", "bank reimbursement request", "wire fraud documentation", "disputed transaction letter"], searchIntent: "commercial",
    problem: "A bank or wire transfer has been disputed — an unauthorized wire, mistaken transfer, beneficiary or account error, bank refusal, delayed investigation, or disputed transaction — and the account holder needs to document the matter with transaction records, chronology, and professional correspondence to the financial institution.",
    outcome: "Create a documented bank and wire transfer dispute letter identifying the financial institution, the account holder, the transaction, the dispute, the bank's response, the evidence, the chronology, and the requested resolution.", recipientRole: "bank",
    requiredFacts: ["financial institution", "account holder name", "transaction date", "transaction amount", "dispute description", "bank response"],
    evidenceRequirements: ["bank statement showing the transaction", "wire transfer confirmation or receipt", "transaction confirmation or transfer record", "bank correspondence regarding the dispute", "dispute or recall request documentation", "bank investigation response or status update", "beneficiary or recipient information", "relevant invoices contracts or agreements", "supporting communications email chat or phone logs"],
    deadlinePolicy: "Financial transaction dispute timelines vary by transaction type, institution, jurisdiction, account type, applicable agreement, and whether the transaction is classified as unauthorized or fraudulent. Capture all dates visible in bank statements, correspondence, and account agreements. Distinguish known deadlines explicitly stated in bank correspondence, account agreements, or documented policy from potential deadlines that depend on jurisdiction, regulator rules, or fraud classification. Flag any stated response deadlines, investigation timeframes, or claim windows as known deadlines. Flag any regulatory deadlines or statutory limitation periods as potential deadlines requiring verification. Do not invent a regulatory deadline. Potential deadline identified — verify against the applicable account agreement, institution policy, and jurisdiction. Surface all date facts for human review.",
    objectivePrompt: "What specific resolution are you requesting from the financial institution — investigation, recall, correction, reimbursement, written explanation, status update, document preservation, or other documented resolution?", draftSubject: "Bank and Wire Transfer Dispute Correspondence",
    disclaimer: "Private Office provides document preparation, evidence organization, and mailing assistance. It is not a law firm, bank, regulator, or law enforcement agency and does not provide legal advice, determine whether a transaction was legally unauthorized, or guarantee any outcome including recovery. You remain responsible for the facts and decisions in your matter.",
    pricing: { preparationFee: 34.99, includedResponsePages: 4, responsePagePrice: 0.45, supportingPagePrice: 0.25, standardMail: 5.49, certifiedMail: 12.99, certifiedReturnReceipt: 18.99, registeredMail: 24.99 },
  },
  "trust-beneficiary-notice": {
    id: "trust-beneficiary-notice", slug: "trust-beneficiary-notice", family: "Trust & Estate", primaryKeyword: "trust beneficiary notice",
    supportingKeywords: ["beneficiary letter to trustee", "request trust accounting", "beneficiary information request", "trustee communication letter", "trust distribution request", "beneficiary request for trust documents", "trust beneficiary correspondence"], searchIntent: "commercial",
    problem: "A trust beneficiary needs to document a trust matter — requesting information, accounting, distribution status, clarification from the trustee, or submitting documentation — and requires professional correspondence with a clear factual record, chronology, and proof of delivery.",
    outcome: "Create a documented trust beneficiary notice or correspondence identifying the trust, the trustee, the beneficiary, the matter, the trustee's position, the evidence, the chronology, and the requested resolution.", recipientRole: "trustee",
    requiredFacts: ["trust name", "trustee name", "beneficiary name", "relevant date", "matter description", "trustee position"],
    evidenceRequirements: ["trust instrument or trust document", "amendments or restatements", "trustee correspondence", "beneficiary notice or prior communication", "accounting or financial records", "distribution records", "inventory or asset documentation", "court documents when applicable", "death certificate when relevant", "supporting communications"],
    deadlinePolicy: "Trust and beneficiary deadlines depend on jurisdiction, trust language, event type, applicable statute, notice date, trustee action, and court involvement. Capture all dates visible in trust documents, trustee correspondence, and court filings. Distinguish known deadlines explicitly stated in the trust instrument, trustee correspondence, or court orders from potential deadlines that depend on jurisdiction, applicable statute, or trust provisions. Flag any stated response deadlines, notice periods, or accounting timeframes as known deadlines. Flag any statutory limitation periods, trust-code deadlines, or court-imposed deadlines as potential deadlines requiring verification. Do not invent a legal deadline. Potential deadline identified — verify against the applicable trust documents, jurisdiction, and professional guidance. Surface all date facts for human review.",
    objectivePrompt: "What specific resolution are you requesting from the trustee — provide accounting, distribute assets, respond to information request, clarify trust provisions, acknowledge beneficiary status, preserve documents, or other documented resolution?", draftSubject: "Trust Beneficiary Correspondence",
    disclaimer: "Private Office provides document preparation, evidence organization, and mailing assistance. It is not a law firm, fiduciary, trustee, court, or government agency and does not provide legal advice, determine beneficiary status, interpret trust instruments as legal conclusions, determine whether a trustee has violated fiduciary duties, or guarantee any outcome including inheritance or distribution. You remain responsible for the facts and decisions in your matter.",
    pricing: { preparationFee: 39.99, includedResponsePages: 4, responsePagePrice: 0.45, supportingPagePrice: 0.25, standardMail: 5.49, certifiedMail: 12.99, certifiedReturnReceipt: 18.99, registeredMail: 24.99 },
  },
  "security-deposit-dispute": {
    id: "security-deposit-dispute", slug: "security-deposit-dispute", family: "Property", primaryKeyword: "security deposit dispute letter",
    supportingKeywords: ["security deposit return letter", "landlord security deposit dispute", "deduction dispute letter", "move-out condition letter", "security deposit demand letter", "landlord tenant deposit dispute", "unauthorized deduction letter"], searchIntent: "commercial",
    problem: "A tenant's security deposit has not been returned, has been partially returned with disputed deductions, or the landlord has charged for damage the tenant disputes — and the tenant needs to document the dispute with lease evidence, move-in and move-out condition records, correspondence, and professional correspondence to the landlord or property manager.",
    outcome: "Create a documented security deposit dispute letter identifying the rental property, the landlord or property manager, the lease, the deposit amount, the disputed deductions, the condition evidence, the chronology, and the requested resolution.", recipientRole: "landlord",
    requiredFacts: ["rental property address", "landlord or property manager name", "lease or rental agreement reference", "deposit amount", "dispute description", "landlord response"],
    evidenceRequirements: ["lease or rental agreement", "move-in inspection or condition report", "move-out inspection or condition report", "photos of move-in and move-out condition", "security deposit receipt or statement", "deduction itemization or itemized statement", "correspondence with landlord or property manager", "rent payment records", "repair receipts or estimates when relevant"],
    deadlinePolicy: "Security deposit return timelines are governed by the lease, state law, and the jurisdiction. Capture all dates visible in the lease, correspondence, and deposit statements. Distinguish known deadlines explicitly stated in the lease, deposit itemization, or landlord correspondence from potential deadlines that depend on jurisdiction or state statute. Flag any stated return deadlines or response timeframes as known deadlines. Flag any statutory deadlines or limitation periods as potential deadlines requiring verification. Do not invent a statutory deadline. Potential deadline identified — verify against the applicable lease, state law, and jurisdiction. Surface all date facts for human review.",
    objectivePrompt: "What specific resolution are you requesting from the landlord or property manager — full deposit return, corrected deduction, written explanation, refund of unauthorized charges, or other documented resolution?", draftSubject: "Security Deposit Dispute Correspondence",
    disclaimer: "Private Office provides document preparation, evidence organization, and mailing assistance. It is not a law firm, landlord-tenant court, housing authority, or government agency and does not provide legal advice, determine the lawful amount of a deposit, interpret lease provisions as legal conclusions, or guarantee any outcome including deposit return. You remain responsible for the facts and decisions in your matter.",
    pricing: { preparationFee: 27.99, includedResponsePages: 4, responsePagePrice: 0.45, supportingPagePrice: 0.25, standardMail: 5.49, certifiedMail: 12.99, certifiedReturnReceipt: 18.99, registeredMail: 24.99 },
  },
  "insurance-claim-command-center": {
    id: "insurance-claim-command-center", slug: "insurance-claim-command-center", family: "Insurance & Risk", primaryKeyword: "insurance claim document organizer",
    supportingKeywords: ["insurance claim organizer", "insurance claim evidence organizer", "insurance claim timeline", "insurance claim document review", "insurance claim dispute preparation", "insurance claim command center", "insurance claim records organizer"], searchIntent: "commercial",
    problem: "A complex insurance matter has accumulated policies, estimates, photographs, statements, adjuster communications, payment records, and other documents that need to be organized into one reliable factual record before the next decision or communication.",
    outcome: "Create a private claim command center that organizes source documents, extracts and attributes facts, builds a chronology, identifies gaps and discrepancies, surfaces stated and potential deadlines for verification, maps evidence, and produces a review-ready action and correspondence record.", recipientRole: "insurer or claim counterparty",
    requiredFacts: ["insured or claimant name", "insurer name", "claim number", "policy reference", "date of loss", "loss description", "claim status"],
    evidenceRequirements: ["policy or declarations page", "claim acknowledgment or claim correspondence", "coverage position, denial, reservation, or payment letter when applicable", "loss photographs, videos, or inspection records", "repair estimates, invoices, or valuation documents", "payment records and claim summaries", "adjuster, insurer, contractor, or expert communications", "proof of mitigation or emergency expenses when applicable", "prior submissions and supporting exhibits", "appeal, reconsideration, supplemental, or escalation correspondence when applicable"],
    deadlinePolicy: "Insurance deadlines may arise from policy provisions, correspondence, claim procedures, jurisdiction-specific rules, or court or regulatory processes. Extract and classify dates into known stated deadlines versus potential deadlines requiring verification. Never invent a deadline or convert a date into a legal conclusion. Surface the exact source and context for each important date so the user can verify it with the policy, insurer, regulator, or qualified professional.",
    objectivePrompt: "What outcome are you trying to accomplish with this claim matter — organize the file, prepare for a new submission, request reconsideration, document a supplemental claim, prepare for professional review, or another specific objective?", draftSubject: "Insurance Claim Correspondence",
    disclaimer: "Private Office provides document organization, evidence analysis, chronology, correspondence preparation, and mailing assistance. It is not a law firm, insurance company, claims adjuster, regulator, public adjuster, or financial adviser. It does not determine coverage, liability, damages, claim validity, or legal rights, and it does not guarantee payment or recovery. AI-generated observations are assistive and must be reviewed against the source documents before use.",
    pricing: { preparationFee: 49.99, includedResponsePages: 5, responsePagePrice: 0.45, supportingPagePrice: 0.25, standardMail: 5.49, certifiedMail: 12.99, certifiedReturnReceipt: 18.99, registeredMail: 24.99 },
  },
  "estate-legacy-document-organizer": {
    id: "estate-legacy-document-organizer", slug: "estate-legacy-document-organizer", family: "Trust & Estate", primaryKeyword: "estate document organizer",
    supportingKeywords: ["estate planning document organizer", "legacy document organizer", "estate documents checklist", "organize will trust documents", "estate file organizer", "estate records organization", "family legacy document organizer"], searchIntent: "commercial",
    problem: "Important estate and legacy documents are spread across files, folders, statements, policies, and correspondence, making it difficult to know what exists, what changed, what is missing, and which dates or relationships require attention.",
    outcome: "Create a structured private-office legacy record that organizes the user's source documents, extracts factual details with provenance, maps people and assets at a high level, builds a chronology, flags possible gaps or inconsistencies, and produces a professional-review question set without making legal, tax, or financial conclusions.", recipientRole: "estate-planning professional, fiduciary, institution, or other designated recipient",
    requiredFacts: ["document owner name", "document set or matter type", "key event or review date", "known jurisdiction"],
    evidenceRequirements: ["will or testamentary document when applicable", "trust instrument, amendments, or restatements when applicable", "durable power of attorney documents when applicable", "health care directive or advance directive when applicable", "beneficiary designation records when applicable", "life insurance policy and beneficiary records when applicable", "real property deeds or ownership records", "business ownership or entity documents when applicable", "retirement or investment account statements or beneficiary confirmations when applicable", "important family, fiduciary, court, or professional correspondence", "prior estate-planning summaries or attorney correspondence when available"],
    deadlinePolicy: "Estate and legacy matters can contain dates that matter for review, but the significance of a date depends on the document, jurisdiction, current status, and professional context. Capture exact dates and source references, distinguish document dates from asserted deadlines, and flag deadlines or expiration concerns for verification. Never infer legal validity, tax treatment, beneficiary rights, or required action solely from an extracted date.",
    objectivePrompt: "What is the purpose of organizing these documents — annual review, family recordkeeping, preparation for an attorney meeting, administration after a death, preparing a professional handoff, or another specific objective?", draftSubject: "Estate & Legacy Document Summary",
    disclaimer: "Private Office provides document organization, factual extraction, evidence mapping, chronology, and correspondence preparation. It is not a law firm, estate planner, fiduciary, financial adviser, tax professional, court, or government agency and does not provide legal, tax, investment, or estate-planning advice. It does not determine the validity or legal effect of a will, trust, beneficiary designation, deed, power of attorney, or other document. AI observations are assistive and must be checked against the original documents and appropriate professional advice.",
    pricing: { preparationFee: 44.99, includedResponsePages: 5, responsePagePrice: 0.45, supportingPagePrice: 0.25, standardMail: 5.49, certifiedMail: 12.99, certifiedReturnReceipt: 18.99, registeredMail: 24.99 },
  },
};
