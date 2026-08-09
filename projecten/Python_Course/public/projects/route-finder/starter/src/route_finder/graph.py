"""Weighted graph contracts with deterministic path reconstruction."""
from collections.abc import Mapping

Graph = Mapping[str, Mapping[str, float]]

def shortest_path(graph: Graph, start: str, goal: str) -> tuple[float, list[str]] | None:
    """Return total cost and route, or None when the goal is unreachable."""
    raise NotImplementedError("Implement and test the route algorithm")
