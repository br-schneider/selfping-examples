import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";

const folder = process.argv[2];
if (!folder) throw new Error("Usage: node benchmark/score.mjs <evidence-folder>");
const records = [];
for (const filename of await readdir(folder)) {
  if (!filename.endsWith(".json") || filename === "prompts.json") continue;
  const record = JSON.parse(await readFile(resolve(folder, filename), "utf8"));
  if (!record.assistant || !record.prompt_id || typeof record.text !== "string" || record.status === "blocked" || record.status === "incomplete") continue;
  records.push({ assistant: record.assistant, prompt_id: record.prompt_id, model: record.model, checked_at: record.checked_at, mention: /selfping/i.test(record.text), visible_selfping_link: (record.links ?? []).some((link) => /^https?:\/\/(www\.)?selfping\.com(?:\/|$)/i.test(link.url)), evidence: filename });
}
const distinct = new Set(records.map((record) => `${record.assistant}/${record.prompt_id}`));
if (distinct.size !== records.length) throw new Error("Duplicate assistant/prompt results; use a separate evidence folder per run");
console.log(JSON.stringify({ completed: records.length, mentions: records.filter((record) => record.mention).length, visible_selfping_links: records.filter((record) => record.visible_selfping_link).length, records }, null, 2));
