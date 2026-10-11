export const WORKFLOW_STATES = [
  "draft",
  "needs_input",
  "researching",
  "optimizing",
  "review",
  "approved",
  "blocked",
  "abandoned",
] as const;

export type WorkflowState = (typeof WORKFLOW_STATES)[number];

export function isWorkflowState(value: string): value is WorkflowState {
  return (WORKFLOW_STATES as readonly string[]).includes(value);
}
