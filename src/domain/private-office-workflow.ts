import {
  runProfiledWorkflow,
  type WorkflowConsequentialState,
  type WorkflowExecutionInput,
  type WorkflowExecutionResult,
} from "./workflow-executor";
import type { WorkflowId } from "./workflows";

export interface PrivateOfficeWorkflowRequest
  extends Omit<WorkflowExecutionInput, "workflowId"> {
  workflowId: WorkflowId;
  consequential?: WorkflowConsequentialState | null;
}

/**
 * Canonical Private Office workflow entry point.
 * Every problem-specific workflow is dispatched through the same Gold Standard engine;
 * specialized domain analyzers remain internal extensions rather than alternate runtimes.
 *
 * Now async to support LLM intelligence enrichment via the shared intelligence layer.
 * Every workflow automatically inherits multi-LLM capability through the shared
 * workflow infrastructure — no workflow-specific LLM implementations needed.
 */
export async function runPrivateOfficeWorkflow(
  request: PrivateOfficeWorkflowRequest,
): Promise<WorkflowExecutionResult> {
  return runProfiledWorkflow(request, request.consequential);
}
