import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assertConnectorMayRun } from "./connector";

describe("connectors", () => {
  it("refuses to run a source that is not authorized", () => {
    assert.throws(
      () =>
        assertConnectorMayRun({
          sourceId: "example-source",
          licenceStatus: "not_authorized",
        }),
      /not authorized/,
    );
  });

  it("allows an authorized source to pass the gate", () => {
    assert.doesNotThrow(() =>
      assertConnectorMayRun({
        sourceId: "example-source",
        licenceStatus: "authorized",
      }),
    );
  });
});
