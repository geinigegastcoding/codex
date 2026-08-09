import pytest
from flappy_ai.environment import GameState, step
pytestmark = pytest.mark.skip(reason="Enable while implementing the deterministic environment")

def test_equal_inputs_produce_equal_next_states():
    state = GameState(100.0, 0.0, 250.0)
    assert step(state, True, 0.1) == step(state, True, 0.1)
