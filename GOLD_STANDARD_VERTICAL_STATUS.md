# Private Office — Gold Standard Vertical Status

## Completed

### Identity
- MailMyPDF Account auth context with persistent Supabase sessions.
- Password, signup, magic-link, and reset-password flows.
- Server bearer-token authentication guard.
- TanStack server-function auth middleware injects and revalidates the current account token.

### Domain
- PrivateOfficeMatter entity with Zod schema, state machine, and transition guards.
- Matter repository interface with ownership/version-conflict errors.
- Workflow registry with Contractor Dispute as the first Gold Standard workflow.
- Workflow profiles with SEO keywords, required facts, evidence requirements, deadline policy, and pricing.
- Gold Standard analysis: facts, findings, evidence, timeline, risks, strategy with provenance tracking.
- Full pipeline executor with 18 Gold Standard stages, blocking gates, and consequential-action gates.
- Approval-gated mailing: canApproveMatter, canAuthorizeMatterMail, canCompleteMatterProof.

### Capability Graph
- Capability, CapabilityMilestone, CapabilityGraph types with validation.
- Business Formation vertical: 16 capabilities (form-llc through business-sale).
- Dispute & Defense vertical: 6 capabilities linked to Gold Standard workflows via workflowId.
- 6 milestones: LLC Established, Business Operational, Growing Business, Mature Business, Dispute Resolution, Financial Protection.
- 7 entry points (form-llc + all 6 dispute/defense workflows).
- Cross-vertical connections: form-llc unlocks contractor-dispute, bank-wire-dispute unlocks debt-validation-dispute.
- Reactive flag distinguishing defensive matters from proactive building.
- State engine: UserCapabilityState, capability completion with milestone detection and unlock cascade.
- Workflow orchestrator: planPath (goal → ordered steps), recommendNext (prioritized next actions), findGoalCapability (natural-language goal matching).
- Supabase persistence: user_capability_state table with RLS, audit trail via user_capability_events.
- syncFromMatters: derives completed capabilities from matter history.

### Fulfillment
- MailMyPDF adapter uses canonical `/v1/documents` and `/v1/communications` endpoints.
- Provider idempotency is carried in `Idempotency-Key`.
- Approval-gated fulfillment service enforces all gates before submission.
- Mailing is idempotent by key.

### Persistence
- Supabase schema for matters, evidence, events, and mailing intents with RLS.
- Owner-scoped RLS policies on all tables.
- Owner immutability guard on mailing intents.
- User capability state table with owner-scoped RLS and audit events.

### UI
- Homepage with lifecycle, features, and workflow directory.
- Auth page with sign-in, signup, magic-link, and reset-password.
- Dashboard with matter list and workflow directory.
- Capability dashboard at /capabilities with life state summary, goal planner, recommendations, and locked capabilities.
- Private Office chrome with Matters, Capabilities, and Workflows navigation.
- Contractor Dispute authority page with full SEO content and interactive workspace.
- Debt Validation Dispute authority page with FDCPA-aware SEO content.
- 404 page with ecosystem navigation.

### SEO
- Contractor Dispute authority page following the 20-section standard.
- Debt Validation Dispute authority page with FDCPA 1692g references.
- Meta tags, OG tags, and Twitter cards.
- Search intent targeting per workflow.

### Tests
- Comprehensive Vitest test suite covering domain, intake, analysis, evidence, draft, approval, fulfillment, and SEO.
- Capability graph integrity tests: validation, circular dependency detection, milestone references.
- State engine tests: transitions, milestone cascades, full business formation journey, regression.
- Workflow orchestrator tests: path planning, topological ordering, recommendations, real-world scenarios.

## Workflows

| # | Workflow | Family | Lifecycle | Authority Page |
|---|----------|--------|-----------|----------------|
| 1 | Contractor Dispute | Property | Gold | ✓ |
| 2 | Property Insurance Claim | Property | Gold | ✓ |
| 3 | Bank & Wire Transfer Dispute | Financial | Gold | ✓ |
| 4 | Trust Beneficiary Notice | Trust & Estate | Gold | ✓ |
| 5 | Security Deposit Dispute | Property | Gold | ✓ |
| 6 | Debt Validation Dispute | Financial | Gold | ✓ |

## Capability Graph Stats

- 22 capabilities across 3 verticals
- 6 milestones
- 7 entry points
- 6 workflows linked via workflowId

## Non-negotiable rule

Never bypass the matter evidence/validation/human-approval gates to reach payment or physical mailing.
