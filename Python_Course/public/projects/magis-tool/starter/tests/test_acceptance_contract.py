import pytest
from magis_tool.workflow import plan_actions
pytestmark = pytest.mark.skip(reason="Enable while implementing dry-run planning")

def test_planning_is_deterministic_and_has_no_side_effects(tmp_path):
    (tmp_path / "report.csv").write_text("value\n1", encoding="utf-8")
    assert plan_actions(tmp_path) == plan_actions(tmp_path)
    assert (tmp_path / "report.csv").exists()
