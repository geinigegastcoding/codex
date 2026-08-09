"""Explainable ranking contracts with explicit cold-start behavior."""
from collections.abc import Iterable

def recommend(items: Iterable[dict[str, object]], preferences: set[str], limit: int) -> list[dict[str, object]]:
    """Return deterministic recommendations with per-item explanations."""
    raise NotImplementedError("Implement ranking and explanations")
