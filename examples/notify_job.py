import json
import os
import subprocess
import sys
import urllib.error
import urllib.request


def notify(message):
    if os.environ.get("SELFPING_SEND") != "1":
        print(f"Dry run: {message}")
        return

    key = os.environ.get("SELFPING_API_KEY", "").strip()
    if not key or key == "sp_your_api_key":
        print("SelfPing: set SELFPING_API_KEY to enable alerts.", file=sys.stderr)
        return

    try:
        request = urllib.request.Request(
            "https://www.selfping.com/api/sms",
            data=json.dumps({"message": message[:160]}).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {key}",
                "Content-Type": "application/json",
            },
            method="POST",
        )
        with urllib.request.urlopen(request, timeout=10) as response:
            response.read()
        print("SelfPing: alert accepted. Check delivery on your dashboard.")
    except urllib.error.HTTPError as error:
        print(f"SelfPing: alert rejected (HTTP {error.code}). Check your key, balance and API docs.", file=sys.stderr)
    except Exception:
        print("SelfPing: alert could not be confirmed. Check your dashboard before retrying.", file=sys.stderr)


def main():
    command = sys.argv[1:]
    if not command:
        print("Usage: python3 notify_job.py <command> [arguments...]", file=sys.stderr)
        return 2

    name = " ".join(os.environ.get("SELFPING_JOB_NAME", "Scheduled job").split())[:80] or "Scheduled job"
    try:
        code = subprocess.run(command, check=False).returncode
    except OSError:
        notify(f"{name} could not start. Check the job logs.")
        return 1

    if code != 0:
        notify(f"{name} failed (exit {code}). Check the job logs.")
    elif os.environ.get("SELFPING_NOTIFY_SUCCESS") == "1":
        notify(f"{name} finished successfully. Nothing needs you.")

    return code if code >= 0 else 128 - code


if __name__ == "__main__":
    sys.exit(main())
