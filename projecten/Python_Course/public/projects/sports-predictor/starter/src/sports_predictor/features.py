"""Leakage-resistant feature and evaluation contracts."""
from collections.abc import Sequence

def chronological_split(rows: Sequence[dict[str, object]], cutoff: str) -> tuple[list[dict[str, object]], list[dict[str, object]]]:
    """Split observations by event time without future-data leakage."""
    raise NotImplementedError("Implement chronological validation")
