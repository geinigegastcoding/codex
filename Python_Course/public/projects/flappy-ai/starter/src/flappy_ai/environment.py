"""Deterministic game-state transition used by training and evaluation."""
from dataclasses import dataclass

@dataclass(frozen=True)
class GameState:
    bird_y: float
    velocity: float
    pipe_x: float
    score: int = 0

def step(state: GameState, flap: bool, delta: float) -> GameState:
    """Advance one deterministic simulation step without rendering."""
    raise NotImplementedError("Implement the testable environment transition")
