import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { UnconfiguredModelAdapter } from "../model/adapter";
import { Orchestrator } from "./orchestrator";

describe("orchestrator skeleton", () => {
  it("starts in draft and can reach review only along legal edges", () => {
    const orchestrator = new Orchestrator();
    assert.equal(orchestrator.getState(), "draft");

    orchestrator.transition("researching");
    orchestrator.transition("optimizing");
    orchestrator.transition("review");
    assert.equal(orchestrator.getState(), "review");
  });

  it("refuses to approve from draft", () => {
    const orchestrator = new Orchestrator();
    assert.throws(() => orchestrator.transition("approved"), /Illegal workflow transition/);
  });

  it("accepts a known tool and rejects approval or payment tools", () => {
    const orchestrator = new Orchestrator();
    assert.equal(orchestrator.acceptToolCall("optimize"), "optimize");
    assert.throws(() => orchestrator.acceptToolCall("approve"), /Rejected tool call/);
    assert.throws(() => orchestrator.acceptToolCall("checkout"), /Rejected tool call/);
    assert.throws(() => orchestrator.acceptToolCall("delete_audit"), /Rejected tool call/);
  });
});

describe("model adapter", () => {
  it("does not call a provider when none is configured", async () => {
    const adapter = new UnconfiguredModelAdapter();
    await assert.rejects(adapter.complete([]), /No model provider is configured/);
  });
});
