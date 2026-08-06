import pytest
from sports_table.standings import build_standings
pytestmark = pytest.mark.skip(reason="Enable while implementing the standings contract")

def test_a_win_awards_three_points_and_preserves_goal_difference():
    table = build_standings([{"home": "A", "away": "B", "home_goals": 2, "away_goals": 1}])
    assert table[0]["team"] == "A" and table[0]["points"] == 3 and table[0]["goal_difference"] == 1
