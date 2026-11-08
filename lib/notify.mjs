export async function notify(message, { send = process.env.SELFPING_SEND === "1", key = process.env.SELFPING_API_KEY, request = fetch } = {}) {
  if (!send) return { dryRun: true, message };
  if (!key || key === "sp_your_api_key") throw new Error("Set your own SELFPING_API_KEY before enabling sends");
  const response = await request("https://www.selfping.com/api/sms", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ message }),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`SelfPing did not accept the alert (HTTP ${response.status})`);
  return { accepted: true, delivered: "check your SelfPing dashboard" };
}
