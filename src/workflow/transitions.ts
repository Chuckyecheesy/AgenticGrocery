import { type WorkflowState } from "./states";

/**
 * Edges from the state diagram in specs/user-journeys.md.
 * `abandoned` is a named state in specs/architecture.md. That diagram does not
 * define an edge to it, so none is invented here.
 * `approved` is reachable only from `review`.
 */
const TRANSITIONS: Record<WorkflowState, readonly WorkflowState[]> = {
  draft: ["needs_input", "researching"],
  needs_input: ["draft"],
  researching: ["needs_input", "blocked", "optimizing"],
  optimizing: ["review"],
  review: ["optimizing", "approved"],
  approved: [],
  blocked: ["researching"],
  abandoned: [],
};

export function canTransition(from: WorkflowState, to: WorkflowState): boolean {
  return TRANSITIONS[from].includes(to);
}

export function assertTransition(from: WorkflowState, to: WorkflowState): void {
  if (!canTransition(from, to)) {
    throw new Error(`Illegal workflow transition: ${from} -> ${to}`);
  }
}
