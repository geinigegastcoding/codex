import pytest
from sports_predictor.features import chronological_split
pytestmark = pytest.mark.skip(reason="Enable while implementing leakage-safe features")

def test_split_never_places_future_rows_in_training_data():
    train, test = chronological_split([{"date": "2025-01-01"}, {"date": "2025-02-01"}], "2025-02-01")
    assert train == [{"date": "2025-01-01"}] and test == [{"date": "2025-02-01"}]
