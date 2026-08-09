import pytest
from word_insight.analytics import normalize_words, rank_words
pytestmark = pytest.mark.skip(reason="Enable while completing milestones 1 and 2")

def test_normalization_and_tie_breaking_are_deterministic():
    assert rank_words(normalize_words(["B a", "a b"]), 2) == [("a", 2), ("b", 2)]
