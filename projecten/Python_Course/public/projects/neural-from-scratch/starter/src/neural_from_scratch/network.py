"""Small neural-network primitives with explicit shapes and gradients."""
from collections.abc import Sequence

def dense_forward(inputs: Sequence[float], weights: Sequence[Sequence[float]], biases: Sequence[float]) -> list[float]:
    """Compute one dense-layer forward pass with shape validation."""
    raise NotImplementedError("Implement the first forward pass")
