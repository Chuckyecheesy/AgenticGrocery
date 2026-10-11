import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { applicationStatus, healthStatus } from "./status";

describe("http status", () => {
  it("reports a skeleton without a built UI", () => {
    assert.deepEqual(applicationStatus(), {
      name: "agentic-grocery",
      status: "skeleton",
      ui: "not_built",
      optimizer_version: "0.0.0",
    });
  });

  it("reports health without product data", () => {
    assert.deepEqual(healthStatus(), { status: "ok" });
  });
});
