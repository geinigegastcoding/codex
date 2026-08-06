import pytest
from sports_dashboard.metrics import summarize_matches
pytestmark = pytest.mark.skip(reason="Enable while implementing dashboard metrics")

def test_summary_keeps_totals_and_chart_series_consistent():
    summary = summarize_matches([{"team": "A", "points": 3}, {"team": "A", "points": 1}])
    assert summary["total_points"] == 4 and sum(summary["points_by_team"].values()) == 4
