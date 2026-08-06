import pytest
from sports_collector.collector import normalize_records
pytestmark = pytest.mark.skip(reason="Enable while implementing fixture normalization")

def test_normalizer_collects_only_documented_minimal_fields():
    assert normalize_records({"matches": [{"id": "m1", "home": "A", "away": "B", "private_note": "omit"}]}) == [{"id": "m1", "home": "A", "away": "B"}]
