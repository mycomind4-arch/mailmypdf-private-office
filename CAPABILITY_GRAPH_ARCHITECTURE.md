# Capability Graph Architecture — Private Office

**Status: FOUNDATIONAL**
**Scope: Cross-ecosystem architectural concept**

## Vision

Private Office is the orchestration and life-state engine for the MailMyPDF ecosystem. The core idea: completing workflows unlocks new capabilities, which unlock more workflows — creating a compounding system rather than a collection of workflow libraries.

## Ecosystem Architecture

```
                    PRIVATE OFFICE
                 ─────────────────────
                  CAPABILITY GRAPH
                  STATE ENGINE
                  WORKFLOW ORCHESTRATOR
                  PERSONAL CONTEXT
                         │
          ┌──────────────┼──────────────┐
          ↓              ↓              ↓
   SMALL BUSINESS    GOV REPLY      IMMIGRATION
          │              │              │
          ↓              ↓              ↓
     BUSINESS         GOVERNMENT       IMMIGRATION
     WORKFLOWS        WORKFLOWS        WORKFLOWS
          │              │              │
          └──────────────┼──────────────┘
                         ↓
                    MAILMYPDF
                  DOCUMENT + MAIL
                    FULFILLMENT
```

## The Three Products

| Product | Role | Core Question |
|---------|------|---------------|
| Private Office | Orchestration / life-state engine | "What are you trying to accomplish, where are you now, and what becomes possible after each step?" |
| MailMyPDF Small Business | Specialized business workflow vertical | "Which business workflow do you want?" |
| Gov Reply | Specialized government-response vertical | "Which government problem are you trying to resolve?" |

Private Office maintains the Capability Graph. Verticals contribute workflows and capability transitions to the shared graph. MailMyPDF remains the execution/fulfillment infrastructure.

## Core Concepts

### Capability

A discrete thing the user can do or has done — e.g., "form-llc", "obtain-ein", "dispute-debt". Each capability:

- Belongs to a vertical (small-business, gov-reply, immigration, private-office)
- Has prerequisites (other capabilities that must be completed first)
- Unlocks other capabilities upon completion
- May link to a Private Office workflow (the executable process that completes it)
- May contribute to a milestone

### Milestone

A named state the user reaches by completing a set of capabilities — e.g., "Business Operational", "Growing Business". Reaching a milestone can unlock additional capabilities.

### Capability Graph

The full directed graph of capabilities, milestones, and their unlock relationships. The graph is the source of truth for what's possible at any given state.

### User State (Life State)

The user's current set of completed capabilities, in-progress capabilities, and reached milestones. Derived from matter history — when a matter is completed, the corresponding capability is marked complete.

### Workflow Orchestrator

Given a user's state and a goal, determines the path through the capability graph. Answers:

- "What can I do next?" — available capabilities based on current state
- "How do I get to X?" — ordered path from current state to a goal
- "What just became possible?" — newly unlocked capabilities after a completion

## State Transitions

```
LOCKED → AVAILABLE → IN-PROGRESS → COMPLETED
                                    │
                                    ↓
                              MILESTONE CHECK
                                    │
                              ┌─────┴─────┐
                              ↓           ↓
                         NO NEW      NEW CAPABILITIES
                         UNLOCKS     UNLOCKED
```

## Example: Business Formation Journey

```
START (Individual)
  ↓
Create LLC
  ↓
LLC Established
  ↓
┌─────────────────────────────────┐
│ New capabilities unlocked       │
├─────────────────────────────────┤
│ EIN                             │
│ Business Banking                │
│ Business Tax                    │
│ Licensing                       │
│ Contracts                       │
│ Insurance                       │
└─────────────────────────────────┘
  ↓
Business Operational (MILESTONE — all above completed)
  ↓
┌─────────────────────────────────┐
│ New capabilities unlocked       │
├─────────────────────────────────┤
│ Hire Employees                  │
│ Obtain Credit                   │
│ Government Contracting          │
│ Obtain Financing                │
│ Expand to Another State         │
└─────────────────────────────────┘
  ↓
Growing Business (MILESTONE)
  ↓
┌─────────────────────────────────┐
│ New capabilities unlocked       │
├─────────────────────────────────┤
│ Acquisition                     │
│ Investment                      │
│ Multi-State Expansion           │
│ Subsidiary                      │
│ Business Sale                   │
└─────────────────────────────────┘
```

## Domain Model (TypeScript)

```
src/domain/
  capability-graph.ts        — types, graph definition, business formation vertical
  capability-graph.test.ts   — graph integrity tests
  state-engine.ts            — UserState, transitions, milestone detection
  state-engine.test.ts       — state engine tests
  workflow-orchestrator.ts   — goal → path, next recommendations
  workflow-orchestrator.test.ts — orchestrator tests
```

## Anti-Fragmentation

This architecture does not replace the existing workflow system — it wraps it. Each existing Gold Standard workflow (contractor-dispute, property-insurance-claim, etc.) becomes a capability node in the graph. The workflow execution pipeline (18 Gold Standard stages, approval gates, fulfillment) remains unchanged. The capability graph adds a layer above it: state, progression, and recommendation.

Do not create a competing orchestration layer in Small Business or Gov Reply. Those verticals contribute workflows and capability definitions to the shared graph in Private Office.
