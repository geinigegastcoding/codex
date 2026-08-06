import pytest
from neural_from_scratch.network import dense_forward
pytestmark = pytest.mark.skip(reason="Enable while implementing neural primitives")

def test_dense_forward_matches_a_hand_calculation():
    assert dense_forward([1.0, -1.0], [[0.5, 0.25], [-0.5, 1.0]], [0.0, 0.5]) == [0.25, -1.0]
