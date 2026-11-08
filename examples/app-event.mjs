import { notify } from "../lib/notify.mjs";

try {
  console.log(await notify("A new subscription received its first payment. Check your billing dashboard."));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
