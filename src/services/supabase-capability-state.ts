/**
 * Supabase adapter for User Capability State
 *
 * Loads and persists the user's capability graph state to Supabase.
 * State changes go through the server (service role) to enforce graph integrity.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { UserCapabilityState } from "./state-engine";
import { createInitialState, completeCapability, startCapability } from "./state-engine";
import { capabilityGraph } from "./capability-graph";

interface CapabilityStateRow {
  id: string;
  owner_id: string;
  completed_capabilities: string[];
  in_progress_capabilities: string[];
  reached_milestones: string[];
  created_at: string;
  updated_at: string;
}

export class SupabaseCapabilityStateRepository {
  constructor(private client: SupabaseClient) {}

  /**
   * Load the user's capability state from Supabase.
   * Returns initial state if no record exists yet.
   */
  async load(userId: string): Promise<UserCapabilityState> {
    const { data, error } = await this.client
      .from("user_capability_state")
      .select("*")
      .eq("owner_id", userId)
      .maybeSingle();

    if (error || !data) {
      return createInitialState(userId);
    }

    const row = data as CapabilityStateRow;
    return {
      userId: row.owner_id,
      completed: row.completed_capabilities ?? [],
      inProgress: row.in_progress_capabilities ?? [],
      reachedMilestones: row.reached_milestones ?? [],
      updatedAt: row.updated_at,
    };
  }

  /**
   * Save the full state (service role — bypasses RLS).
   * Used by server functions after validating a state transition.
   */
  async save(client: SupabaseClient, state: UserCapabilityState): Promise<void> {
    const { error } = await client
      .from("user_capability_state")
      .upsert(
        {
          owner_id: state.userId,
          completed_capabilities: state.completed,
          in_progress_capabilities: state.inProgress,
          reached_milestones: state.reachedMilestones,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "owner_id" },
      );

    if (error) {
      throw new Error(`Failed to save capability state: ${error.message}`);
    }
  }

  /**
   * Complete a capability and persist the resulting state.
   * Records an audit event for the completion and any milestone transitions.
   */
  async completeCapability(
    serviceClient: SupabaseClient,
    userId: string,
    capabilityId: string,
  ): Promise<{
    state: UserCapabilityState;
    completedCapabilityId: string;
    newlyReachedMilestones: { id: string; title: string }[];
    newlyUnlockedCapabilities: { id: string; title: string }[];
  }> {
    // Load current state
    const currentState = await this.load(userId);

    // Check if already completed
    if (currentState.completed.includes(capabilityId)) {
      return {
        state: currentState,
        completedCapabilityId: capabilityId,
        newlyReachedMilestones: [],
        newlyUnlockedCapabilities: [],
      };
    }

    // Apply the completion
    const result = completeCapability(capabilityGraph, currentState, capabilityId);

    // Persist the new state
    await this.save(serviceClient, result.state);

    // Record audit event for completion
    await serviceClient.from("user_capability_events").insert({
      owner_id: userId,
      event_type: "capability_completed",
      capability_id: capabilityId,
      metadata: {},
    });

    // Record audit events for milestone transitions
    for (const milestone of result.newlyReachedMilestones) {
      await serviceClient.from("user_capability_events").insert({
        owner_id: userId,
        event_type: "milestone_reached",
        milestone_id: milestone.id,
        metadata: { title: milestone.title, description: milestone.description },
      });
    }

    return {
      state: result.state,
      completedCapabilityId: result.completedCapabilityId,
      newlyReachedMilestones: result.newlyReachedMilestones.map((m) => ({
        id: m.id,
        title: m.title,
      })),
      newlyUnlockedCapabilities: result.newlyUnlockedCapabilities.map((c) => ({
        id: c.id,
        title: c.title,
      })),
    };
  }

  /**
   * Mark a capability as in-progress.
   */
  async startCapability(
    serviceClient: SupabaseClient,
    userId: string,
    capabilityId: string,
  ): Promise<UserCapabilityState> {
    const currentState = await this.load(userId);
    const newState = startCapability(currentState, capabilityId);
    await this.save(serviceClient, newState);

    await serviceClient.from("user_capability_events").insert({
      owner_id: userId,
      event_type: "capability_started",
      capability_id: capabilityId,
      metadata: {},
    });

    return newState;
  }

  /**
   * Derive completed capabilities from matter history.
   * When a matter reaches 'completed' status, the corresponding capability
   * (linked via workflowId) is marked complete.
   */
  async syncFromMatters(
    serviceClient: SupabaseClient,
    userId: string,
    completedWorkflowIds: string[],
  ): Promise<UserCapabilityState> {
    const currentState = await this.load(userId);
    let state = currentState;

    for (const workflowId of completedWorkflowIds) {
      // Find the capability linked to this workflow
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
      await this.save(serviceClient, state);
    }

    return state;
  }
}
