import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { optimize } from "./optimize";

describe("optimizer skeleton", () => {
  it("returns the same hashes for the same inputs", () => {
    const input = {
      needs: [{ id: "need-1" }],
      offers: [{ id: "offer-1" }],
    };
    const first = optimize(input);
    const second = optimize(input);

    assert.deepEqual(first, second);
    assert.equal(first.optimizer_version, "0.0.0");
    assert.equal(first.inputs_hash, second.inputs_hash);
    assert.equal(first.content_hash, second.content_hash);
  });

  it("omits a guaranteed total when there are no included lines", () => {
    const result = optimize({ needs: [], offers: [] });

    assert.deepEqual(result.result_json.included_lines, []);
    assert.equal("guaranteed_total_cents" in result.result_json, false);
    assert.equal(result.result_json.status, "skeleton");
  });

  it("changes the input hash when the input changes", () => {
    const first = optimize({ needs: [{ id: "a" }], offers: [] });
    const second = optimize({ needs: [{ id: "b" }], offers: [] });

    assert.notEqual(first.inputs_hash, second.inputs_hash);
  });
});
