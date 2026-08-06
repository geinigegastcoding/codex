from __future__ import annotations

import json
import textwrap
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "projects"

PROJECTS = [
    ("word-insight", "word_insight", "Word Insight Analyzer", "examples/report.json"),
    ("sports-table", "sports_table", "Sports League Table", "examples/standings.json"),
    ("route-finder", "route_finder", "Route Finder", "examples/route-report.json"),
    ("sports-collector", "sports_collector", "Responsible Sports Data Collector", "data/clean/sports-records.json"),
    ("sports-dashboard", "sports_dashboard", "Sports Performance Dashboard", "reports/dashboard.html"),
    ("sports-predictor", "sports_predictor", "Sports Match Predictor", "reports/model-card.md"),
    ("neural-from-scratch", "neural_from_scratch", "Neural Network from Scratch", "reports/training-report.html"),
    ("flappy-ai", "flappy_ai", "Flappy Bird AI", "reports/evaluation.json"),
    ("recommender", "explainable_recommender", "Explainable Recommender", "reports/evaluation.json"),
    ("magis-tool", "magis_tool", "Magis Data Productivity Tool", "reports/workflow-result.json"),
]

PROJECT_SCAFFOLDS = {
    "word-insight": {
        "module": "analytics.py",
        "source": '''
            """Pure text-analysis contracts used by the CLI boundary."""
            from collections.abc import Iterable

            def normalize_words(lines: Iterable[str]) -> list[str]:
                """Return normalized words without mutating caller-owned input."""
                raise NotImplementedError("Milestone 1: define normalization policy")

            def rank_words(words: Iterable[str], limit: int) -> list[tuple[str, int]]:
                """Rank by descending count and then alphabetically."""
                raise NotImplementedError("Milestone 2: implement deterministic ranking")
        ''',
        "fixture": ("fixtures/text-cases.json", {"lines": ["Data data!", "Python, data."], "limit": 2, "expected": [["data", 3], ["python", 1]]}),
        "test": '''
            import pytest
            from word_insight.analytics import normalize_words, rank_words
            pytestmark = pytest.mark.skip(reason="Enable while completing milestones 1 and 2")

            def test_normalization_and_tie_breaking_are_deterministic():
                assert rank_words(normalize_words(["B a", "a b"]), 2) == [("a", 2), ("b", 2)]
        ''',
    },
    "sports-table": {
        "module": "standings.py",
        "source": '''
            """League-table domain rules, independent from input and presentation."""
            from collections.abc import Iterable

            def build_standings(matches: Iterable[dict[str, object]]) -> list[dict[str, object]]:
                """Aggregate points and rank teams using documented tie-break rules."""
                raise NotImplementedError("Implement match validation and standings")
        ''',
        "fixture": ("fixtures/matches.json", {"matches": [{"home": "A", "away": "B", "home_goals": 2, "away_goals": 1}]}),
        "test": '''
            import pytest
            from sports_table.standings import build_standings
            pytestmark = pytest.mark.skip(reason="Enable while implementing the standings contract")

            def test_a_win_awards_three_points_and_preserves_goal_difference():
                table = build_standings([{"home": "A", "away": "B", "home_goals": 2, "away_goals": 1}])
                assert table[0]["team"] == "A" and table[0]["points"] == 3 and table[0]["goal_difference"] == 1
        ''',
    },
    "route-finder": {
        "module": "graph.py",
        "source": '''
            """Weighted graph contracts with deterministic path reconstruction."""
            from collections.abc import Mapping

            Graph = Mapping[str, Mapping[str, float]]

            def shortest_path(graph: Graph, start: str, goal: str) -> tuple[float, list[str]] | None:
                """Return total cost and route, or None when the goal is unreachable."""
                raise NotImplementedError("Implement and test the route algorithm")
        ''',
        "fixture": ("fixtures/graph.json", {"A": {"B": 2, "C": 8}, "B": {"C": 3}, "C": {}}),
        "test": '''
            import pytest
            from route_finder.graph import shortest_path
            pytestmark = pytest.mark.skip(reason="Enable while implementing the graph algorithm")

            def test_shortest_path_returns_cost_and_reconstructed_route():
                assert shortest_path({"A": {"B": 2, "C": 8}, "B": {"C": 3}, "C": {}}, "A", "C") == (5, ["A", "B", "C"])
        ''',
    },
    "sports-collector": {
        "module": "collector.py",
        "source": '''
            """Authorized, rate-limited collection boundaries using fixture-first development."""
            from dataclasses import dataclass

            @dataclass(frozen=True)
            class CollectionPolicy:
                allowed_hosts: frozenset[str]
                requests_per_minute: int
                cache_directory: str

            def normalize_records(payload: object) -> list[dict[str, object]]:
                """Validate a saved fixture and return the minimal approved fields."""
                raise NotImplementedError("Implement fixture normalization before networking")
        ''',
        "fixture": ("fixtures/api-response.json", {"source": "authorized-fixture", "matches": [{"id": "m1", "home": "A", "away": "B"}]}),
        "test": '''
            import pytest
            from sports_collector.collector import normalize_records
            pytestmark = pytest.mark.skip(reason="Enable while implementing fixture normalization")

            def test_normalizer_collects_only_documented_minimal_fields():
                assert normalize_records({"matches": [{"id": "m1", "home": "A", "away": "B", "private_note": "omit"}]}) == [{"id": "m1", "home": "A", "away": "B"}]
        ''',
    },
    "sports-dashboard": {
        "module": "metrics.py",
        "source": '''
            """Reproducible dashboard metrics kept separate from chart rendering."""
            from collections.abc import Iterable

            def summarize_matches(matches: Iterable[dict[str, object]]) -> dict[str, object]:
                """Return documented KPIs and chart-ready series."""
                raise NotImplementedError("Implement deterministic dashboard metrics")
        ''',
        "fixture": ("fixtures/dashboard-matches.json", {"matches": [{"team": "A", "points": 3}, {"team": "A", "points": 1}, {"team": "B", "points": 0}]}),
        "test": '''
            import pytest
            from sports_dashboard.metrics import summarize_matches
            pytestmark = pytest.mark.skip(reason="Enable while implementing dashboard metrics")

            def test_summary_keeps_totals_and_chart_series_consistent():
                summary = summarize_matches([{"team": "A", "points": 3}, {"team": "A", "points": 1}])
                assert summary["total_points"] == 4 and sum(summary["points_by_team"].values()) == 4
        ''',
    },
    "sports-predictor": {
        "module": "features.py",
        "source": '''
            """Leakage-resistant feature and evaluation contracts."""
            from collections.abc import Sequence

            def chronological_split(rows: Sequence[dict[str, object]], cutoff: str) -> tuple[list[dict[str, object]], list[dict[str, object]]]:
                """Split observations by event time without future-data leakage."""
                raise NotImplementedError("Implement chronological validation")
        ''',
        "fixture": ("fixtures/historical-matches.json", {"matches": [{"date": "2025-01-01", "result": "H"}, {"date": "2025-02-01", "result": "D"}]}),
        "test": '''
            import pytest
            from sports_predictor.features import chronological_split
            pytestmark = pytest.mark.skip(reason="Enable while implementing leakage-safe features")

            def test_split_never_places_future_rows_in_training_data():
                train, test = chronological_split([{"date": "2025-01-01"}, {"date": "2025-02-01"}], "2025-02-01")
                assert train == [{"date": "2025-01-01"}] and test == [{"date": "2025-02-01"}]
        ''',
    },
    "neural-from-scratch": {
        "module": "network.py",
        "source": '''
            """Small neural-network primitives with explicit shapes and gradients."""
            from collections.abc import Sequence

            def dense_forward(inputs: Sequence[float], weights: Sequence[Sequence[float]], biases: Sequence[float]) -> list[float]:
                """Compute one dense-layer forward pass with shape validation."""
                raise NotImplementedError("Implement the first forward pass")
        ''',
        "fixture": ("fixtures/tiny-network.json", {"inputs": [1.0, -1.0], "weights": [[0.5, 0.25], [-0.5, 1.0]], "biases": [0.0, 0.5]}),
        "test": '''
            import pytest
            from neural_from_scratch.network import dense_forward
            pytestmark = pytest.mark.skip(reason="Enable while implementing neural primitives")

            def test_dense_forward_matches_a_hand_calculation():
                assert dense_forward([1.0, -1.0], [[0.5, 0.25], [-0.5, 1.0]], [0.0, 0.5]) == [0.25, -1.0]
        ''',
    },
    "flappy-ai": {
        "module": "environment.py",
        "source": '''
            """Deterministic game-state transition used by training and evaluation."""
            from dataclasses import dataclass

            @dataclass(frozen=True)
            class GameState:
                bird_y: float
                velocity: float
                pipe_x: float
                score: int = 0

            def step(state: GameState, flap: bool, delta: float) -> GameState:
                """Advance one deterministic simulation step without rendering."""
                raise NotImplementedError("Implement the testable environment transition")
        ''',
        "fixture": ("fixtures/scenario.json", {"bird_y": 100.0, "velocity": 0.0, "pipe_x": 250.0, "score": 0}),
        "test": '''
            import pytest
            from flappy_ai.environment import GameState, step
            pytestmark = pytest.mark.skip(reason="Enable while implementing the deterministic environment")

            def test_equal_inputs_produce_equal_next_states():
                state = GameState(100.0, 0.0, 250.0)
                assert step(state, True, 0.1) == step(state, True, 0.1)
        ''',
    },
    "recommender": {
        "module": "recommendations.py",
        "source": '''
            """Explainable ranking contracts with explicit cold-start behavior."""
            from collections.abc import Iterable

            def recommend(items: Iterable[dict[str, object]], preferences: set[str], limit: int) -> list[dict[str, object]]:
                """Return deterministic recommendations with per-item explanations."""
                raise NotImplementedError("Implement ranking and explanations")
        ''',
        "fixture": ("fixtures/catalog.json", {"items": [{"id": "p1", "tags": ["python", "data"]}, {"id": "p2", "tags": ["games"]}]}),
        "test": '''
            import pytest
            from explainable_recommender.recommendations import recommend
            pytestmark = pytest.mark.skip(reason="Enable while implementing explainable ranking")

            def test_every_recommendation_contains_a_reason():
                results = recommend([{"id": "p1", "tags": ["python"]}], {"python"}, 1)
                assert results[0]["id"] == "p1" and results[0]["reason"]
        ''',
    },
    "magis-tool": {
        "module": "workflow.py",
        "source": '''
            """Dry-run-first productivity workflow with explicit, auditable actions."""
            from dataclasses import dataclass
            from pathlib import Path

            @dataclass(frozen=True)
            class PlannedAction:
                source: Path
                destination: Path
                reason: str

            def plan_actions(root: Path) -> list[PlannedAction]:
                """Plan idempotent changes without modifying the filesystem."""
                raise NotImplementedError("Implement safe workflow planning")
        ''',
        "fixture": ("fixtures/inbox.json", {"files": [{"name": "report.csv", "category": "data"}, {"name": "notes.md", "category": "notes"}]}),
        "test": '''
            import pytest
            from magis_tool.workflow import plan_actions
            pytestmark = pytest.mark.skip(reason="Enable while implementing dry-run planning")

            def test_planning_is_deterministic_and_has_no_side_effects(tmp_path):
                (tmp_path / "report.csv").write_text("value\\n1", encoding="utf-8")
                assert plan_actions(tmp_path) == plan_actions(tmp_path)
                assert (tmp_path / "report.csv").exists()
        ''',
    },
}


def write(path: Path, content: str) -> None:
    value = textwrap.dedent(content).lstrip()
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists():
        if path.read_text(encoding="utf-8") != value:
            raise FileExistsError(f"Refusing to overwrite changed file: {path}")
        return
    path.write_text(value, encoding="utf-8")


def build_project(project_id: str, package: str, title: str, result_path: str) -> None:
    target = OUTPUT / project_id / "starter"
    target.mkdir(parents=True, exist_ok=True)

    write(target / "pyproject.toml", f'''
        [build-system]
        requires = ["setuptools>=70"]
        build-backend = "setuptools.build_meta"

        [project]
        name = "{project_id}"
        version = "0.1.0"
        description = "Starter workspace for {title}"
        requires-python = ">=3.11"
        dependencies = ["pytest>=8.0"]

        [tool.pytest.ini_options]
        testpaths = ["tests"]
        addopts = "-q"
    ''')
    write(target / "README.md", f'''
        # {title}

        This starter belongs to the Python Path project workspace. Read the full milestone instructions, acceptance criteria, deliverables, and rubric in the localhost course before implementing it.

        ## Start

        ```powershell
        python -m venv .venv
        .venv\\Scripts\\activate
        python -m pip install -e .
        python -m pytest
        ```

        The starter smoke tests pass. The project verifier intentionally fails until the implementation marker is removed and `{result_path}` exists.

        ## Verify

        ```powershell
        python scripts/verify_project.py
        ```

        Import `verification-report.json` into the project workspace only after every check passes. The report contains file paths, sizes, and SHA-256 hashes; it does not upload source files.
    ''')
    write(target / "src" / package / "__init__.py", f'''
        """{title} project package."""

        PROJECT_ID = "{project_id}"
        PROJECT_TITLE = "{title}"

        def implementation_status() -> str:
            """Return the current starter status for the smoke test."""
            return "starter"
    ''')
    write(target / "src" / package / "domain.py", '''
        """Put pure domain logic here before connecting files, APIs, models, or UI."""

        def build_result(data: object) -> object:
            """Replace this boundary with the first milestone implementation."""
            raise NotImplementedError("Complete the guided milestones before verification")
    ''')
    scaffold = PROJECT_SCAFFOLDS[project_id]
    write(target / "src" / package / scaffold["module"], scaffold["source"])
    write(target / "tests" / "test_acceptance_contract.py", scaffold["test"])
    fixture_path, fixture_data = scaffold["fixture"]
    write(target / fixture_path, json.dumps(fixture_data, indent=2))
    write(target / "tests" / "test_starter.py", f'''
        from {package} import PROJECT_ID, implementation_status

        def test_starter_identity_prevents_working_in_the_wrong_bundle():
            assert PROJECT_ID == "{project_id}"

        def test_starter_is_ready_for_guided_implementation():
            assert implementation_status() == "starter"
    ''')
    write(target / "fixtures" / "sample.json", json.dumps({"project_id": project_id, "records": []}, indent=2))
    write(target / "scripts" / "verify_project.py", f'''
        from __future__ import annotations

        import hashlib
        import json
        import subprocess
        import sys
        from datetime import datetime, timezone
        from pathlib import Path

        ROOT = Path(__file__).resolve().parents[1]
        PROJECT_ID = "{project_id}"
        VERIFIER_ID = "{project_id}-verifier"
        RESULT_PATH = ROOT / "{result_path}"

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
            {{"id": "tests", "passed": test_run.returncode == 0, "message": test_run.stdout[-2000:] or test_run.stderr[-2000:]}},
            {{"id": "implementation", "passed": not unfinished, "message": "Complete" if not unfinished else "Unfinished: " + ", ".join(unfinished)}},
            {{"id": "result", "passed": RESULT_PATH.is_file() and RESULT_PATH.stat().st_size > 0, "message": str(RESULT_PATH.relative_to(ROOT))}},
            {{"id": "readme", "passed": (ROOT / "README.md").stat().st_size > 300, "message": "README.md"}},
        ]
        evidence_files = [path for path in [*source_files, ROOT / "README.md", RESULT_PATH] if path.is_file()]
        report = {{
            "schemaVersion": 1,
            "reportId": f"{{PROJECT_ID}}-local-verification",
            "projectId": PROJECT_ID,
            "verifierId": VERIFIER_ID,
            "generatedAt": datetime.now(timezone.utc).isoformat(),
            "checks": checks,
            "files": [
                {{"path": str(path.relative_to(ROOT)).replace("\\\\", "/"), "sha256": sha256(path), "bytes": path.stat().st_size}}
                for path in evidence_files
            ],
        }}
        (ROOT / "verification-report.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
        print(json.dumps(report, indent=2))
        raise SystemExit(0 if all(check["passed"] for check in checks) else 1)
    ''')
    write(target / ".gitignore", '''
        .venv/
        __pycache__/
        .pytest_cache/
        *.pyc
        verification-report.json
    ''')

    archive = OUTPUT / project_id / f"{project_id}.zip"
    mode = "a" if archive.exists() else "x"
    with ZipFile(archive, mode, ZIP_DEFLATED) as bundle:
        existing = set(bundle.namelist())
        for path in sorted(target.rglob("*")):
            if not path.is_file():
                continue
            archive_path = (Path(project_id) / path.relative_to(target)).as_posix()
            if archive_path not in existing:
                bundle.write(path, archive_path)


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for values in PROJECTS:
        build_project(*values)
    manifest = [
        {"projectId": project_id, "bundle": f"/projects/{project_id}/{project_id}.zip"}
        for project_id, _, _, _ in PROJECTS
    ]
    write(OUTPUT / "manifest.json", json.dumps(manifest, indent=2))
    print(f"Generated {len(PROJECTS)} starter bundles in {OUTPUT}")


if __name__ == "__main__":
    main()
