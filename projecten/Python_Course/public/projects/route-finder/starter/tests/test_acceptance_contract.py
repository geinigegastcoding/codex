import pytest
from route_finder.graph import shortest_path
pytestmark = pytest.mark.skip(reason="Enable while implementing the graph algorithm")

def test_shortest_path_returns_cost_and_reconstructed_route():
    assert shortest_path({"A": {"B": 2, "C": 8}, "B": {"C": 3}, "C": {}}, "A", "C") == (5, ["A", "B", "C"])
