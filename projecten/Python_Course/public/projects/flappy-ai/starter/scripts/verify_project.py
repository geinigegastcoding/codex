from __future__ import annotations

import hashlib
import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROJECT_ID = "flappy-ai"
VERIFIER_ID = "flappy-ai-verifier"
RESULT_PATH = ROOT / "reports/evaluation.json"

def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(65536), b""):
            digest.update(chunk)
    return digest.hexdigest()

test_run = subprocess.run(
    [sys.executable, "-m", "pytest"],
    cwd=ROOT,
    text=True,
    capture_output=True,
    check=False,
)
source_files = sorted((ROOT / "src").rglob("*.py"))
unfinished = [
    str(path.relative_to(ROOT))
    for path in source_files
    if "NotImplementedError" in path.read_text(encoding="utf-8")
]
checks = [
    {"id": "tests", "passed": test_run.returncode == 0, "message": test_run.stdout[-2000:] or test_run.stderr[-2000:]},
    {"id": "implementation", "passed": not unfinished, "message": "Complete" if not unfinished else "Unfinished: " + ", ".join(unfinished)},
    {"id": "result", "passed": RESULT_PATH.is_file() and RESULT_PATH.stat().st_size > 0, "message": str(RESULT_PATH.relative_to(ROOT))},
    {"id": "readme", "passed": (ROOT / "README.md").stat().st_size > 300, "message": "README.md"},
]
evidence_files = [path for path in [*source_files, ROOT / "README.md", RESULT_PATH] if path.is_file()]
report = {
    "schemaVersion": 1,
    "reportId": f"{PROJECT_ID}-local-verification",
    "projectId": PROJECT_ID,
    "verifierId": VERIFIER_ID,
    "generatedAt": datetime.now(timezone.utc).isoformat(),
    "checks": checks,
    "files": [
        {"path": str(path.relative_to(ROOT)).replace("\\", "/"), "sha256": sha256(path), "bytes": path.stat().st_size}
        for path in evidence_files
    ],
}
(ROOT / "verification-report.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
print(json.dumps(report, indent=2))
raise SystemExit(0 if all(check["passed"] for check in checks) else 1)
