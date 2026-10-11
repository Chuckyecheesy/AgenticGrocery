export type ModelRole = "system" | "user" | "assistant" | "tool";

export type ModelMessage = {
  role: ModelRole;
  content: string;
};

export type ModelToolCall = {
  name: string;
  arguments: unknown;
};

export type ModelTurn = {
  toolCalls: readonly ModelToolCall[];
  explanation: string | null;
};

export interface ModelAdapter {
  complete(messages: readonly ModelMessage[]): Promise<ModelTurn>;
}

export class UnconfiguredModelAdapter implements ModelAdapter {
  complete(): Promise<ModelTurn> {
    return Promise.reject(new Error("No model provider is configured"));
  }
}
