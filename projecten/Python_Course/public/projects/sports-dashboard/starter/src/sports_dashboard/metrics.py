"""Reproducible dashboard metrics kept separate from chart rendering."""
from collections.abc import Iterable

def summarize_matches(matches: Iterable[dict[str, object]]) -> dict[str, object]:
    """Return documented KPIs and chart-ready series."""
    raise NotImplementedError("Implement deterministic dashboard metrics")
