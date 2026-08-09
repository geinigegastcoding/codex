import pytest
from explainable_recommender.recommendations import recommend
pytestmark = pytest.mark.skip(reason="Enable while implementing explainable ranking")

def test_every_recommendation_contains_a_reason():
    results = recommend([{"id": "p1", "tags": ["python"]}], {"python"}, 1)
    assert results[0]["id"] == "p1" and results[0]["reason"]
