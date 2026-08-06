"""Dry-run-first productivity workflow with explicit, auditable actions."""
from dataclasses import dataclass
from pathlib import Path

@dataclass(frozen=True)
class PlannedAction:
    source: Path
    destination: Path
    reason: str

def plan_actions(root: Path) -> list[PlannedAction]:
    """Plan idempotent changes without modifying the filesystem."""
    raise NotImplementedError("Implement safe workflow planning")
