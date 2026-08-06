"""Pure text-analysis contracts used by the CLI boundary."""
from collections.abc import Iterable

def normalize_words(lines: Iterable[str]) -> list[str]:
    """Return normalized words without mutating caller-owned input."""
    raise NotImplementedError("Milestone 1: define normalization policy")

def rank_words(words: Iterable[str], limit: int) -> list[tuple[str, int]]:
    """Rank by descending count and then alphabetically."""
    raise NotImplementedError("Milestone 2: implement deterministic ranking")
