import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { listScheduledJobs } from "./scheduler";

describe("scheduler skeleton", () => {
  it("names the connector refresh and the expiry sweep", () => {
    assert.deepEqual(listScheduledJobs(), ["refresh-connectors", "expire-offers"]);
  });
});
