import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { normalizePackage } from "./normalize";

describe("package normalization", () => {
  it("converts grams, kilograms, millilitres, litres, and counts to integer base units", () => {
    assert.deepEqual(normalizePackage("500 g"), { dimension: "mass", quantityBase: 500 });
    assert.deepEqual(normalizePackage("1.5 kg"), { dimension: "mass", quantityBase: 1500 });
    assert.deepEqual(normalizePackage("750 ml"), { dimension: "volume", quantityBase: 750 });
    assert.deepEqual(normalizePackage("2 L"), { dimension: "volume", quantityBase: 2000 });
    assert.deepEqual(normalizePackage("12 eggs"), { dimension: "count", quantityBase: 12 });
  });

  it("leaves unparseable text unknown", () => {
    assert.deepEqual(normalizePackage("family pack"), {
      dimension: "unknown",
      quantityBase: null,
    });
  });
});
