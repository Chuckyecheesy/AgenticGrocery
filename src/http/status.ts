import { OPTIMIZER_VERSION } from "../optimizer/optimize";

export type ApplicationStatus = {
  name: "agentic-grocery";
  status: "skeleton";
  ui: "not_built";
  optimizer_version: typeof OPTIMIZER_VERSION;
};

export function applicationStatus(): ApplicationStatus {
  return {
    name: "agentic-grocery",
    status: "skeleton",
    ui: "not_built",
    optimizer_version: OPTIMIZER_VERSION,
  };
}

export function healthStatus(): { status: "ok" } {
  return { status: "ok" };
}
