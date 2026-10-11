import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { compareUnitPrice, displayCentsPer } from "./money";

describe("integer unit prices", () => {
  it("ranks the specification's illustrative yogurt packs by cross-multiplication", () => {
    // Illustrative figures from specs/optimization.md example 1. Not a market observation.
    const comparison = compareUnitPrice(375, 500, 480, 750);
    assert.equal(comparison, 1);
    assert.equal(displayCentsPer(375, 500, 100), 75);
    assert.equal(displayCentsPer(480, 750, 100), 64);
  });

  it("ranks 2 L at 399 cents ahead of 1 L at 210 cents", () => {
    // Illustrative figures from TC-OPT-002. Not a market observation.
    assert.equal(compareUnitPrice(399, 2000, 210, 1000), -1);
  });

  it("rounds 399 cents for 1500 ml to 27 cents per 100 ml", () => {
    // Illustrative figures from TC-OPT-027. The line total stays 399; this is display only.
    assert.equal(displayCentsPer(399, 1500, 100), 27);
  });

  it("rejects a non-integer cent amount", () => {
    assert.throws(() => compareUnitPrice(1.5, 100, 2, 100), /integer/);
  });
});
