export const MODEL_TOOLS = [
  "get_profile",
  "update_profile",
  "ask_user",
  "resolve_location",
  "find_stores",
  "search_offers",
  "optimize",
  "explain",
] as const;

export type ModelTool = (typeof MODEL_TOOLS)[number];

export function isModelTool(name: string): name is ModelTool {
  return (MODEL_TOOLS as readonly string[]).includes(name);
}
