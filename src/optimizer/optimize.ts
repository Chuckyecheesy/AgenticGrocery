import { canonicalJson, sha256 } from "./hash";

export const OPTIMIZER_VERSION = "0.0.0";

export type OptimizationInput = {
  needs: readonly { id: string }[];
  offers: readonly { id: string }[];
};

export type OptimizationResultJson = {
  status: "skeleton";
  included_lines: [];
};

export type OptimizationResult = {
  optimizer_version: typeof OPTIMIZER_VERSION;
  inputs_hash: string;
  result_json: OptimizationResultJson;
  content_hash: string;
};

/**
 * Skeleton of CMP-OPT. It does not select offers or emit prices.
 * With no included lines, the guaranteed total is omitted (TC-OPT-025).
 */
export function optimize(input: OptimizationInput): OptimizationResult {
  const inputsHash = sha256(canonicalJson(input));
  const resultJson: OptimizationResultJson = {
    status: "skeleton",
    included_lines: [],
  };
  const contentHash = sha256(
    canonicalJson({
      optimizer_version: OPTIMIZER_VERSION,
      inputs_hash: inputsHash,
      result_json: resultJson,
    }),
  );

  return {
    optimizer_version: OPTIMIZER_VERSION,
    inputs_hash: inputsHash,
    result_json: resultJson,
    content_hash: contentHash,
  };
}
