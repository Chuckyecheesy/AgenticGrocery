import { isModelTool, type ModelTool } from "../model/tools";
import { assertTransition } from "../workflow/transitions";
import { type WorkflowState } from "../workflow/states";

const REJECTED_TOOLS = ["approve", "purchase", "checkout", "pay"] as const;

export class Orchestrator {
  private state: WorkflowState;

  constructor(state: WorkflowState = "draft") {
    this.state = state;
  }

  getState(): WorkflowState {
    return this.state;
  }

  transition(to: WorkflowState): void {
    assertTransition(this.state, to);
    this.state = to;
  }

  acceptToolCall(name: string): ModelTool {
    if ((REJECTED_TOOLS as readonly string[]).includes(name) || !isModelTool(name)) {
      throw new Error(`Rejected tool call: ${name}`);
    }
    return name;
  }
}
