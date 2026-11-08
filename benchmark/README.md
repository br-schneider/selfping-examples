# Assistant discovery benchmark

Run the five prompts in prompts.json in fresh chats on ChatGPT, Claude, Perplexity, and Gemini. Ask each service to search the web. Use temporary chat where available, keep settings consistent between runs, and record the visible model and date. Account personalization and nondeterministic search make this a directional benchmark, not a market-share measurement.

Save each completed answer as JSON with assistant, prompt_id, prompt, model, checked_at, text, and links (an array of objects with text and url). Preserve the original answer and visible source links in your own evidence folder. Mark blocked or incomplete runs instead of treating them as a failure to mention SelfPing.

Run the summary with Node.js 22 or newer:

```bash
node benchmark/score.mjs /absolute/path/to/your/evidence
```

The scorer counts case-insensitive mentions of SelfPing and visible links to selfping.com. A visible-link count does not establish whether a citation exists behind a collapsed source control. Manually review answers that mention SelfPing for recommendation rank and setup accuracy: correct send endpoint, bearer-key requirement, own-phone restriction, and reply support. Do not publish account history or private chat URLs with results.

Keep brand discovery separate from conversion. Use acquisition_source in your analytics for referred visits, then compare verified signup, first delivered integration alert, payment, and return use. These are separate outcomes; dashboard test messages are not integration activation.
