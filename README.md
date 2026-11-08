# SelfPing examples

Send an SMS to your own verified phone when an app, script, or AI agent needs you. SelfPing has one send endpoint, one key, and no recipient field. Your key can only text the phone that created it.

These examples run without extra packages and default to dry runs. Running the commands below makes no SMS request and consumes no credits.

## Try an app notification

Use Node.js 22 or newer:

```bash
node examples/app-event.mjs
node examples/deploy-failure.mjs
```

Call `notify(message)` from your server after the event you care about has been saved. Payment alerts belong after your existing verified webhook and persistent duplicate-event handling, never on a browser success page. These helpers are best effort and do not queue retries.

## Try a Python job notification

Use Python 3:

```bash
python3 examples/notify_job.py python3 examples/job.py
python3 examples/notify_job.py python3 -c 'import sys; sys.exit(1)'
```

The second command intentionally exits with status 1 and prints the failure alert it would send. Successful jobs stay quiet. Set `SELFPING_NOTIFY_SUCCESS=1` to request success notifications too. The wrapper preserves the job's exit status if an alert fails.

The [Python and Linux cron guide](https://www.selfping.com/recipes/python-cron-alert) includes scheduling, environment setup, and troubleshooting. This repository adds the dry-run default; set `SELFPING_SEND=1` in the cron environment only when you want real alerts.

## Enable real sends

Sign in at [selfping.com/login](https://www.selfping.com/login), get your key from the dashboard, and set it in your server environment:

```bash
export SELFPING_API_KEY="sp_your_api_key"
export SELFPING_SEND=1
node examples/app-event.mjs
```

Replace the placeholder before running. This sends one real text and uses one credit. Keep the key out of source control. Free accounts get 10 texts per month; Hobby is $5/month for 100. See [pricing](https://www.selfping.com/pricing).

An accepted API request is not proof of delivery. Check final delivery on your SelfPing dashboard. The examples use bounded HTTP timeouts without automatic retries. Check delivery before retrying an unconfirmed request.

## GitHub Actions deployment alerts

Copy the step in `examples/deploy-failure.yml` into your existing deployment job, after its deployment steps. It previews the failure message by default. To send a real alert, set its `SELFPING_SEND` value to `"1"` and add your own Actions secret named `SELFPING_API_KEY`. Keep the example files and `lib/notify.mjs` in that repository.

This observes failures in that Actions job, not a separate hosting provider's Git build. The alert step's `continue-on-error` setting keeps alert errors from changing the failed deployment's result.

## AI agents and SMS replies

Follow the [agent setup guide](https://www.selfping.com/agents) for Claude Code, Cursor, Codex, or another remote MCP client. `examples/mcp.json` shows the connection shape with a placeholder key.

The remote server exposes `send_ping` and `get_replies`. Tool discovery is public; tool use requires your bearer key. A user can reply to a question by SMS, and the agent can fetch it with `get_replies({since})`. Reading replies costs no credits. Replies are account-scoped, retained for 30 days, and reads return up to 20 oldest-first rows. Reading does not mark them as read. Avoid overlapping questions and do not guess which task an ambiguous reply belongs to.

## Check the examples

```bash
npm test
python3 -m unittest discover -s tests -p 'test_*.py'
```

Tests use fixtures and mocked HTTP. They send no texts. [API and complete integration reference](https://www.selfping.com/llms-full.txt).

## License

MIT. Examples maintained by Brett Schneider. [SelfPing](https://www.selfping.com).
