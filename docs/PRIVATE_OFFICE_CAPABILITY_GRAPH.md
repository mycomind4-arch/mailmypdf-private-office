# Private Office Capability Graph — Canonical Specification

**Status:** FOUNDATIONAL / NORMATIVE
**Version:** 1.0
**Owner:** Private Office

## 1. Purpose

Private Office is the orchestration layer for the MailMyPDF ecosystem. The product primitive is not a workflow catalog; it is a capability graph that continuously answers:

- What has the user accomplished?
- What capabilities does that create?
- What workflow groups are now unlocked?
- What individual workflows are available now?
- What goal is the user pursuing?
- What is the shortest safe path to that goal?
- What additional capabilities will each completion create?

The compounding loop is:

```text
Workflow
  -> State Change
  -> Capability
  -> Workflow Group
  -> More Workflows
  -> Milestone / New Capability
  -> More Workflow Groups
```

Private Office owns the graph. Domain verticals contribute workflows and capability definitions. MailMyPDF remains the document and mailing execution layer.

## 2. Product Boundary

| Product | Responsibility |
|---|---|
| Private Office | User/life state, goals, capability graph, dependency evaluation, group unlocks, milestones, cross-vertical orchestration, recommendations |
| MailMyPDF Small Business | Business-domain workflow packs |
| Gov Reply | Government-response workflow packs |
| Immigration / Appeal / Dispute / Notice Respond | Domain workflow packs |
| MailMyPDF | PDF, approval, payment, mailing, tracking, proof/fulfillment |

**Architectural rule:** verticals must not implement competing global orchestration engines. They publish domain workflows/capabilities into the Private Office graph contract.

## 3. Core Objects

### Workflow

An executable process that changes user state. A workflow is the mechanism, not the durable state.

### Capability

A durable fact about what the user has accomplished or is now able to do, such as `entity-active`, `ein-established`, `can-contract`, or `creditworthy-business`.

### Workflow Group

A collection of related workflows representing a functional capability area, such as Financial Infrastructure or Employer.

### Milestone

A named state reached when a completion rule is satisfied, such as `llc-established`, `operating-business`, or `financeable-business`.

### Goal

A desired target state or capability. The orchestrator can solve toward it by traversing prerequisites backward and then emitting a forward execution path.

## 4. Canonical Workflow Contract

Every workflow definition should expose:

```ts
interface WorkflowDefinition {
  id: string;
  vertical: VerticalId;
  groupId: string;
  prerequisites: RequirementRule;
  produces: StateChange[];
  grantsCapabilities: string[];
  invalidatesCapabilities?: string[];
  contributesToMilestones?: string[];
  followUpWorkflows?: string[];
  evidenceProduced?: string[];
  deadlines?: DeadlineDefinition[];
  reactive?: boolean;
  jurisdiction?: JurisdictionRule;
  riskLevel?: "low" | "medium" | "high";
}
```

Capabilities and groups should be data-driven rather than encoded in UI conditionals.

## 5. Requirement Operators

The graph must support:

```text
ALL
ANY
THRESHOLD
CONDITIONAL
```

Examples:

```text
ALL:
  entity-active
  ein-established
  accounting-established

ANY:
  llc-established
  corporation-established

2 OF:
  bank-account
  accounting
  payment-processing

IF hasEmployees = true
THEN workers-comp-required
```

The existing flat string-array representation remains valid for simple ALL requirements, but the domain model must be extensible to structured rules.

## 6. Lifecycle and Integrity

Workflow:

```text
LOCKED -> AVAILABLE -> IN_PROGRESS -> COMPLETED
```

Capability:

```text
UNAVAILABLE -> POSSIBLE -> ACQUIRED
```

Milestone:

```text
UNREACHED -> QUALIFIED -> REACHED
```

Completion must be idempotent. Replaying a completion event must not duplicate state, evidence, documents, payments, or unlock events.

Capabilities must come from a completed workflow, trusted event, or validated evidence source. AI recommendations may propose actions, but prerequisite evaluation and authorization are deterministic domain logic.

## 7. Workflow Group Semantics

Each group has an explicit completion rule:

- `ALL_REQUIRED` — every required workflow must be complete.
- `CORE_PLUS_OPTIONAL` — a defined core set is required; optional workflows do not block the group.
- `THRESHOLD` — a minimum number of members must be complete.
- `CONDITIONAL` — the required set depends on facts, jurisdiction, or entity type.

The UI must never represent optional workflows as mandatory.

## 8. State Recalculation

After `workflow.completed`:

```text
workflow.completed
  -> apply state changes
  -> grant capabilities
  -> recompute milestones
  -> recompute workflow groups
  -> identify newly available workflows/groups
  -> evaluate active goals
  -> rank recommendations
```

User state conceptually contains:

```text
completedCapabilities
activeWorkflows
reachedMilestones
goals
pendingDeadlines
obligations
evidence
documents
entities
jurisdictions
domainFacts
```

## 9. Canonical LLC Reference Graph

### Group A — FORM_BUSINESS

Representative workflows:

- Choose entity type
- Choose business name
- Check availability
- Select formation jurisdiction
- Select registered agent
- File formation documents
- Receive formation approval
- Create operating agreement
- Establish ownership records

Completion for the LLC path produces:

```text
llc-established
entity-active
```

Unlocks Group B.

### Group B — ESTABLISH_BUSINESS_IDENTITY

Representative workflows:

- Obtain EIN
- Confirm ownership/member records
- Establish business address
- Complete required registrations
- Establish company record book

Completion establishes `business-identity-established` and unlocks downstream infrastructure groups.

### Group C — FINANCIAL_INFRASTRUCTURE

Representative workflows:

- Open business bank account
- Set up accounting
- Set up bookkeeping
- Establish invoicing
- Establish payment processing
- Establish financial controls

Typical completion:

```text
banking-established
AND accounting-established
```

Produces `business-financially-operational`.

### Group D — LEGAL_COMMERCIAL_INFRASTRUCTURE

Representative workflows:

- Client agreement
- Vendor agreement
- NDA
- Contractor agreement
- Terms of service
- Privacy policy
- Signature workflow

Produces `can-contract`.

### Group E — LICENSING_COMPLIANCE

Representative workflows:

- Determine required licenses
- Obtain local business license
- Obtain industry-specific licenses
- Obtain permits
- Complete required state registrations
- Establish compliance calendar

Produces `authorized-to-operate` where applicable.

### Group F — RISK_INFRASTRUCTURE

Representative workflows:

- General liability coverage
- Professional liability where applicable
- Workers' compensation where applicable
- Commercial property coverage where applicable
- Cyber coverage where appropriate
- Business risk assessment

Produces `business-risk-infrastructure-established`.

### Group G — BUSINESS_OPERATIONAL

This is a convergence state, not one arbitrary workflow:

```text
entity-active
AND business-identity-established
AND financial-infrastructure-sufficient
AND legal-commercial-infrastructure-sufficient
AND required-licensing-complete
AND required-risk-infrastructure-complete
```

Produces `operating-business`.

Unlocks groups including Customer Acquisition, Employer, Business Credit, Government Contracting, Financing, and Expansion.

### Group H — EMPLOYER

Typical prerequisites:

```text
entity-active
AND ein-established
AND payroll-infrastructure-ready
```

Workflows include employer registration, payroll, worker classification, hire employee, onboarding, unemployment registration, workers' compensation, payroll tax filing, and termination.

Produces `employer`.

### Group I — BUSINESS_CREDIT

Typical prerequisites:

```text
entity-active
AND ein-established
AND business-bank-account
AND accounting-established
```

Workflows include business credit profile, vendor trade accounts, credit card, trade lines, monitoring, and credit-error disputes.

Produces `creditworthy-business`.

### Group J — GOVERNMENT_CONTRACTING

Eligibility depends on business identity, required registrations, licenses, and program-specific facts.

Workflows include vendor registration, capability statement, solicitation discovery/evaluation, bidding, proposal submission, contract performance, and government invoicing.

Produces `government-contracting-capable`.

### Group K — FINANCING

Typical prerequisites:

```text
creditworthy-business
AND financial-records-available
AND operating-evidence-sufficient
```

Workflows include business credit application, line of credit, equipment financing, term loan, SBA-related financing, investor preparation, equity financing, and valuation.

Produces `financeable-business`.

### Group L — EXPANSION

Workflows include foreign qualification, new state registration, additional locations, additional employees, new products/services, expansion financing, and multi-state compliance.

Produces `growing-business`.

### Group M — ACQUISITION

Typical prerequisites:

```text
financeable-business
AND operating-business
```

Workflows include target search, screening, due diligence, valuation, financing, LOI, asset/equity purchase, and integration.

Produces `acquisition-capable`.

### Group N — ENTERPRISE / EXIT

Workflows include subsidiary formation, enterprise governance, multi-state administration, valuation, sale preparation, buyer diligence, asset/equity sale, and wind-down.

Produces `enterprise` and/or `exit-capable`.

## 10. LLC Compounding Path

```text
CREATE LLC
   -> LLC ESTABLISHED
   -> BUSINESS IDENTITY
   -> FINANCIAL + LEGAL + LICENSING + RISK
   -> OPERATING BUSINESS
   -> EMPLOYER / CREDIT / GOVERNMENT CONTRACTING / FINANCING / EXPANSION
   -> GROWING BUSINESS
   -> ACQUISITION / ENTERPRISE / EXIT
```

The actual sequence is a graph: parallel branches may be completed in different orders, and some branches are conditional.

## 11. Backward Goal Solving

Given a target such as `financeable-business`, the orchestrator traverses prerequisites backward:

```text
financeable-business
  <- creditworthy-business
  <- financial-records-available
  <- operating-business
  <- identity + financial + legal + licensing + risk infrastructure
  <- LLC / other valid entity formation
```

It then emits the minimum viable forward path from the user's current state.

## 12. Next-Best-Workflow Ranking

Recommendations should account for:

```text
Goal relevance
+ prerequisite leverage
+ downstream unlock value
+ milestone proximity
+ deadline urgency
+ risk reduction
+ cross-vertical value
- user burden
- unresolved prerequisites
```

Every recommendation should be explainable, for example:

```text
OBTAIN EIN
Why now: required by several currently blocked workflows.
Unlocks: banking, accounting, selected employer and credit paths.
Next milestone: Business Identified.
```

## 13. Cross-Vertical Unlocks

Capabilities are ecosystem-wide even when the workflow belongs to a vertical.

Examples:

```text
Small Business: Create LLC
  -> entity-active

Gov Reply: IRS notice received
  -> government-notice-present
  -> IRS-response-capable
```

```text
Business: Insurance policy active
  -> insurance-policy-active

Dispute Mail: Claim denied
  -> insurance-dispute-capable
```

```text
Business: Contract active
  -> contract-active

Dispute Mail: Breach occurs
  -> contract-dispute-capable
```

Cross-vertical integration should happen through shared capabilities and events, not app-to-app special cases.

## 14. Reactive Workflows

The same graph must handle event-driven workflows:

```text
IRS notice received
insurance claim denied
bank transfer disputed
contract breached
license renewal due
business administratively dissolved
```

These events create capabilities that activate reactive workflow groups.

## 15. Evidence / Expiration

A UI click is not sufficient evidence of a durable capability when real-world proof is required.

```text
workflow completed
  -> evidence produced
  -> evidence validated
  -> capability granted
```

Capabilities may be `active`, `expiring`, `expired`, `superseded`, or `revoked`. Downstream capabilities must be re-evaluated when an upstream capability expires or is revoked.

## 16. Migration Plan

### Phase 1 — Normalize

- Define explicit workflow groups.
- Separate prerequisites from derived unlocks.
- Add structured requirement operators.
- Make milestone completion rules explicit.

### Phase 2 — State integration

- Connect workflow completion events to capability acquisition.
- Persist capability/milestone transitions.
- Enforce idempotency.

### Phase 3 — Orchestration

- Current-state evaluation.
- Backward goal solving.
- Next-best-workflow ranking.
- Newly-unlocked explanations.

### Phase 4 — Ecosystem

- Publish vertical contribution contract.
- Import capability packs.
- Add cross-vertical transitions.
- Connect reactive government/dispute workflows.

### Phase 5 — Reference implementation

- Implement complete LLC graph.
- Add first-order and second-order unlock tests.
- Validate group/milestone rules against real workflow completion events.

## 17. Acceptance Criteria

The graph is production-ready when:

1. Create LLC produces `llc-established` / `entity-active`.
2. Correct next groups appear automatically.
3. Group completion can unlock another group without UI hard-coding.
4. ALL/ANY/THRESHOLD/CONDITIONAL rules evaluate deterministically.
5. A user can request a target capability and receive a valid dependency path.
6. Completion is idempotent and auditable.
7. Cross-vertical workflows consume shared capabilities.
8. Reactive events can activate reactive workflows.
9. Expiration/revocation re-evaluates downstream state.
10. The system explains why a workflow is available, blocked, or recommended.
11. Existing Gold Standard workflow execution remains the executable layer; the capability graph does not duplicate it.

## 18. Product Principle

```text
WHAT HAVE YOU ACCOMPLISHED?
          ↓
WHAT CAPABILITIES DO YOU NOW HAVE?
          ↓
WHAT BECAME POSSIBLE?
          ↓
WHAT BEST ADVANCES YOUR GOAL?
          ↓
COMPLETE WORKFLOW
          ↓
REPEAT
```

Private Office becomes the system that turns completed actions into an expanding set of possible next actions.