import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assertTransition, canTransition } from "./transitions";

describe("workflow transitions", () => {
  it("allows the journey from draft through explicit approval", () => {
    const path = [
      ["draft", "researching"],
      ["researching", "optimizing"],
      ["optimizing", "review"],
      ["review", "approved"],
    ] as const;

    for (const [from, to] of path) {
      assert.equal(canTransition(from, to), true);
    }
  });

  it("rejects approval from any state other than review", () => {
    const states = [
      "draft",
      "needs_input",
      "researching",
      "optimizing",
      "approved",
      "blocked",
      "abandoned",
    ] as const;

    for (const from of states) {
      assert.equal(canTransition(from, "approved"), false);
      assert.throws(
        () => assertTransition(from, "approved"),
        /Illegal workflow transition/,
      );
    }
  });

  it("allows a user answer to return from needs_input to draft", () => {
    assert.equal(canTransition("needs_input", "draft"), true);
  });

  it("does not invent an edge into abandoned", () => {
    assert.equal(canTransition("draft", "abandoned"), false);
    assert.equal(canTransition("review", "abandoned"), false);
  });
});
