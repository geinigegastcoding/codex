"""Authorized, rate-limited collection boundaries using fixture-first development."""
from dataclasses import dataclass

@dataclass(frozen=True)
class CollectionPolicy:
    allowed_hosts: frozenset[str]
    requests_per_minute: int
    cache_directory: str

def normalize_records(payload: object) -> list[dict[str, object]]:
    """Validate a saved fixture and return the minimal approved fields."""
    raise NotImplementedError("Implement fixture normalization before networking")
