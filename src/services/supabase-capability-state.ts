/**
 * Supabase adapter for User Capability State
 *
 * Loads and persists the user's capability graph state to Supabase.
 * Uses the REST API with the service-role key (server-only), matching
 * the pattern used by the matter, evidence, and event repositories.
 *
 * Tables:
 *   user_capability_state (one row per owner)
 *   user_capability_events (insert-only audit trail)
 */
import type { UserCapabilityState } from "@/domain/state-engine";
import {
  createInitialState,
  completeCapability,
  startCapability,
} from "@/domain/state-engine";
import { capabilityGraph } from "@/domain/capability-graph";

function config() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key)
    throw new Error(
      "Supabase capability state persistence is not configured: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required",
    );
  return {
    stateBase: `${url.replace(/\/$/, "")}/rest/v1/user_capability_state`,
    eventsBase: `${url.replace(/\/$/, "")}/rest/v1/user_capability_events`,
    key,
  };
}

function headers(
  key: string,
  extra?: Record<string, string>,
): Record<string, string> {
  return {
    apikey: key,
    authorization: `Bearer ${key}`,
    "content-type": "application/json",
    ...extra,
  };
}

interface CapabilityStateRow {
  id: string;
  owner_id: string;
  completed_capabilities: string[];
  in_progress_capabilities: string[];
  reached_milestones: string[];
  created_at: string;
  updated_at: string;
}

function fromRow(row: CapabilityStateRow): UserCapabilityState {
  return {
    userId: row.owner_id,
    completed: row.completed_capabilities ?? [],
    inProgress: row.in_progress_capabilities ?? [],
    reachedMilestones: row.reached_milestones ?? [],
    updatedAt: row.updated_at,
  };
}

function rowFromState(state: UserCapabilityState) {
  const now = new Date().toISOString();
  return {
    owner_id: state.userId,
    completed_capabilities: state.completed,
    in_progress_capabilities: state.inProgress,
    reached_milestones: state.reachedMilestones,
    updated_at: now,
  };
}

async function insertEvent(
  eventsBase: string,
  key: string,
  ownerId: string,
  eventType: string,
  payload: Record<string, unknown>,
): Promise<void> {
  const response = await fetch(eventsBase, {
    method: "POST",
    headers: headers(key, { Prefer: "return=minimal" }),
    body: JSON.stringify({
      id: crypto.randomUUID(),
      owner_id: ownerId,
      event_type: eventType,
      metadata: JSON.stringify(payload),
      created_at: new Date().toISOString(),
    }),
  });
  if (!response.ok)
    throw new Error(`Supabase capability event insert failed: ${response.status}`);
}

export const supabaseCapabilityStateRepository = {
  /**
   * Load the user's capability state from Supabase.
   * Returns initial state if no record exists yet.
   */
  async load(userId: string): Promise<UserCapabilityState> {
    const { stateBase, key } = config();
    const response = await fetch(
      `${stateBase}?owner_id=eq.${encodeURIComponent(userId)}&limit=1`,
      { headers: headers(key) },
    );
    if (!response.ok)
      throw new Error(`Supabase capability state load failed: ${response.status}`);
    const rows = (await response.json()) as CapabilityStateRow[];
    if (!rows[0]) return createInitialState(userId);
    return fromRow(rows[0]);
  },

  /**
   * Save the full state (service role — bypasses RLS).
   */
  async save(state: UserCapabilityState): Promise<void> {
    const { stateBase, key } = config();
    const response = await fetch(
      `${stateBase}?owner_id=eq.${encodeURIComponent(state.userId)}`,
      {
        method: "POST",
        headers: headers(key, {
          Prefer: "return=minimal,upsert=merge",
        }),
        body: JSON.stringify(rowFromState(state)),
      },
    );
    if (!response.ok)
      throw new Error(`Supabase capability state save failed: ${response.status}`);
  },

  /**
   * Complete a capability and persist the resulting state.
   * Records an audit event for the completion and any milestone transitions.
   */
  async completeCapability(
    userId: string,
    capabilityId: string,
  ): Promise<{
    state: UserCapabilityState;
    completedCapabilityId: string;
    newlyReachedMilestones: { id: string; title: string; description: string }[];
    newlyUnlockedCapabilities: { id: string; title: string }[];
  }> {
    const { eventsBase, key } = config();
    const currentState = await this.load(userId);

    if (currentState.completed.includes(capabilityId)) {
      return {
        state: currentState,
        completedCapabilityId: capabilityId,
        newlyReachedMilestones: [],
        newlyUnlockedCapabilities: [],
      };
    }

    const result = completeCapability(capabilityGraph, currentState, capabilityId);
    await this.save(result.state);

    await insertEvent(eventsBase, key, userId, "capability_completed", {
      capability_id: capabilityId,
    });

    for (const milestone of result.newlyReachedMilestones) {
      await insertEvent(eventsBase, key, userId, "milestone_reached", {
        milestone_id: milestone.id,
        title: milestone.title,
        description: milestone.description,
      });
    }

    return {
      state: result.state,
      completedCapabilityId: result.completedCapabilityId,
      newlyReachedMilestones: result.newlyReachedMilestones,
      newlyUnlockedCapabilities: result.newlyUnlockedCapabilities,
    };
  },

  /**
   * Mark a capability as in-progress.
   */
  async startCapability(
    userId: string,
    capabilityId: string,
  ): Promise<UserCapabilityState> {
    const { eventsBase, key } = config();
    const currentState = await this.load(userId);
    const newState = startCapability(currentState, capabilityId);
    await this.save(newState);

    await insertEvent(eventsBase, key, userId, "capability_started", {
      capability_id: capabilityId,
    });

    return newState;
  },

  /**
   * Derive completed capabilities from matter history.
   * When a matter reaches 'completed' status, the corresponding capability
   * (linked via workflowId) is marked complete.
   */
  async syncFromMatters(
    userId: string,
    completedWorkflowIds: string[],
  ): Promise<UserCapabilityState> {
    const currentState = await this.load(userId);
    let state = currentState;

    for (const workflowId of completedWorkflowIds) {
      const capEntry = Object.entries(capabilityGraph.capabilities).find(
        ([, cap]) => cap.workflowId === workflowId,
      );
      if (!capEntry) continue;

      const capId = capEntry[0];
      if (!state.completed.includes(capId)) {
        const result = completeCapability(capabilityGraph, state, capId);
        state = result.state;
      }
    }

    if (state !== currentState) {
      await this.save(state);
    }

    return state;
  },
};
