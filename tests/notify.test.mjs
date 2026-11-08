import assert from "node:assert/strict";
import test from "node:test";
import { notify } from "../lib/notify.mjs";

test("dry runs never call a service", async () => {
  const result = await notify("Fixture alert", { send: false, request: () => { throw new Error("No network expected"); } });
  assert.equal(result.dryRun, true);
});

test("sending requires a real key and authenticates the single-owner request", async () => {
  await assert.rejects(notify("Fixture", { send: true, key: "sp_your_api_key" }));
  let sent;
  const result = await notify("Fixture", { send: true, key: "sp_fixture_only", request: async (url, options) => { sent = { url, options }; return new Response('{"ok":true}'); } });
  assert.equal(sent.options.headers.Authorization, "Bearer sp_fixture_only");
  assert.deepEqual(JSON.parse(sent.options.body), { message: "Fixture" });
  assert.equal(result.accepted, true);
});

test("HTTP rejection remains visible to the caller", async () => {
  await assert.rejects(notify("Fixture", { send: true, key: "sp_fixture_only", request: async () => new Response("", { status: 429 }) }), /429/);
});
