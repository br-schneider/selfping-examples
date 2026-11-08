import { notify } from "../lib/notify.mjs";

try {
  console.log(await notify("Production deploy failed. Check the GitHub Actions run before retrying."));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
