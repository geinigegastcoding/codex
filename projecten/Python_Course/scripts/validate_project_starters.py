from __future__ import annotations

import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path
from zipfile import ZipFile

ROOT = Path(__file__).resolve().parents[1]
PROJECTS = [
    ("word-insight", "word_insight", "analytics.py", "text-cases.json"),
    ("sports-table", "sports_table", "standings.py", "matches.json"),
    ("route-finder", "route_finder", "graph.py", "graph.json"),
    ("sports-collector", "sports_collector", "collector.py", "api-response.json"),
    ("sports-dashboard", "sports_dashboard", "metrics.py", "dashboard-matches.json"),
    ("sports-predictor", "sports_predictor", "features.py", "historical-matches.json"),
    ("neural-from-scratch", "neural_from_scratch", "network.py", "tiny-network.json"),
    ("flappy-ai", "flappy_ai", "environment.py", "scenario.json"),
    ("recommender", "explainable_recommender", "recommendations.py", "catalog.json"),
    ("magis-tool", "magis_tool", "workflow.py", "inbox.json"),
]


def run() -> None:
    for project_id, package, domain_module, fixture_name in PROJECTS:
        archive = ROOT / "public" / "projects" / project_id / f"{project_id}.zip"
        if not archive.is_file() or archive.stat().st_size == 0:
            raise AssertionError(f"Missing bundle: {archive}")
        with tempfile.TemporaryDirectory() as temporary:
            with ZipFile(archive) as bundle:
                if bundle.testzip() is not None:
                    raise AssertionError(f"Corrupt bundle: {archive}")
                bundle.extractall(temporary)
            workspace = Path(temporary) / project_id
            required = [
                workspace / "pyproject.toml",
                workspace / "README.md",
                workspace / "src" / package / "__init__.py",
                workspace / "src" / package / domain_module,
                workspace / "fixtures" / fixture_name,
                workspace / "tests" / "test_starter.py",
                workspace / "tests" / "test_acceptance_contract.py",
                workspace / "scripts" / "verify_project.py",
            ]
            if not all(path.is_file() and path.stat().st_size > 0 for path in required):
                raise AssertionError(f"Incomplete bundle: {project_id}")
            environment = {**os.environ, "PYTHONPATH": str(workspace / "src")}
            tests = subprocess.run([sys.executable, "-m", "pytest", "-q"], cwd=workspace, env=environment, capture_output=True, text=True, check=False)
            if tests.returncode != 0:
                raise AssertionError(f"Starter tests failed for {project_id}:\n{tests.stdout}\n{tests.stderr}")
            verifier = subprocess.run([sys.executable, "scripts/verify_project.py"], cwd=workspace, env=environment, capture_output=True, text=True, check=False)
            if verifier.returncode != 1:
                raise AssertionError(f"Incomplete starter verifier should fail for {project_id}")
            report = json.loads((workspace / "verification-report.json").read_text(encoding="utf-8"))
            checks = {check["id"]: check["passed"] for check in report["checks"]}
            if checks != {"tests": True, "implementation": False, "result": False, "readme": True}:
                raise AssertionError(f"Unexpected starter checks for {project_id}: {checks}")
    print(f"Validated {len(PROJECTS)} starter bundles")


if __name__ == "__main__":
    run()
