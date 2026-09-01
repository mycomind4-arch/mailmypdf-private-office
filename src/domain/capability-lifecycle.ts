/**
 * Capability lifecycle integration.
 *
 * Converts an authoritative workflow-completion event into deterministic
 * capability, milestone, and workflow-group state transitions. Callers may
 * persist the returned state and audit events in one transaction boundary.
 */

import type { CapabilityGraph } from "./capability-graph";
import {
  completeCapability,
  type CompletionResult,
  type UserCapabilityState,
} from "./state-engine";
import {
  evaluateWorkflowGroups,
  getNewlyUnlockedWorkflowGroups,
  type WorkflowGroupDefinition,
  type WorkflowGroupEvaluation,
} from "./workflow-group-engine";

export interface CapabilityTransitionInput {
  matterId: string;
  ownerId: string;
  capabilityId: string;
  actorId?: string | null;
  facts?: Readonly<Record<string, unknown>>;
}

export interface CapabilityTransitionEvent {
  eventType:
    | "capability_completed"
    | "milestone_reached"
    | "workflow_group_unlocked";
  matterId: string;
  ownerId: string;
  actorId: string | null;
  metadata: Record<string, unknown>;
}

export interface CapabilityTransitionResult {
  state: UserCapabilityState;
  completion: CompletionResult;
  groupsBefore: WorkflowGroupEvaluation[];
  groupsAfter: WorkflowGroupEvaluation[];
  newlyUnlockedGroups: WorkflowGroupDefinition[];
  events: CapabilityTransitionEvent[];
}

/**
 * Apply one authoritative capability completion and derive all downstream
 * state. This function is pure: persistence is deliberately left to the
 * caller/repository layer.
 */
export function applyCapabilityCompletion(
  graph: CapabilityGraph,
  groups: readonly WorkflowGroupDefinition[],
  state: UserCapabilityState,
  input: CapabilityTransitionInput,
): CapabilityTransitionResult {
  const facts = input.facts ?? {};
  const groupsBefore = evaluateWorkflowGroups(graph, groups, state, facts);
  const completion = completeCapability(graph, state, input.capabilityId);
  const groupsAfter = evaluateWorkflowGroups(graph, groups, completion.state, facts);
  const newlyUnlockedGroups = getNewlyUnlockedWorkflowGroups(
    graph,
    groups,
    state,
    completion.state,
    facts,
  );

  const actorId = input.actorId ?? null;
  const events: CapabilityTransitionEvent[] = [
    {
      eventType: "capability_completed",
      matterId: input.matterId,
      ownerId: input.ownerId,
      actorId,
      metadata: {
        capabilityId: input.capabilityId,
        previousCompletedCount: state.completed.length,
        completedCount: completion.state.completed.length,
      },
    },
    ...completion.newlyReachedMilestones.map((milestone) => ({
      eventType: "milestone_reached" as const,
      matterId: input.matterId,
      ownerId: input.ownerId,
      actorId,
      metadata: { milestoneId: milestone.id },
    })),
    ...newlyUnlockedGroups.map((group) => ({
      eventType: "workflow_group_unlocked" as const,
      matterId: input.matterId,
      ownerId: input.ownerId,
      actorId,
      metadata: { groupId: group.id },
    })),
  ];

  return {
    state: completion.state,
    completion,
    groupsBefore,
    groupsAfter,
    newlyUnlockedGroups,
    events,
  };
}
