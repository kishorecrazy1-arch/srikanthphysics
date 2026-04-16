"""
CLI for scheduled daily generation (cron / Task Scheduler).

Example (Windows, daily 05:30):
  cd python\\daily_question_engine
  .\\.venv\\Scripts\\python -m app.jobs.daily --base-url http://127.0.0.1:8000 --subtopic-id <uuid> --count 7

Or set ENGINE_BASE in the environment and omit --base-url.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.request


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description="POST /v1/generate for one subtopic (HTTP).")
    p.add_argument("--base-url", default=os.environ.get("ENGINE_BASE", "http://127.0.0.1:8000"))
    p.add_argument("--subtopic-id", required=True)
    p.add_argument("--difficulty", default="medium", choices=("easy", "medium", "hard"))
    p.add_argument("--count", type=int, default=7)
    p.add_argument("--for-date", default=None, help="YYYY-MM-DD (default: server UTC date)")
    args = p.parse_args(argv)

    url = args.base_url.rstrip("/") + "/v1/generate"
    body = {
        "subtopic_id": args.subtopic_id,
        "difficulty": args.difficulty,
        "count": args.count,
    }
    if args.for_date:
        body["for_date"] = args.for_date

    data = json.dumps(body).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=600) as resp:
            out = resp.read().decode("utf-8")
            print(out)
    except urllib.error.HTTPError as e:
        sys.stderr.write(e.read().decode("utf-8", errors="replace"))
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
