"""League-table domain rules, independent from input and presentation."""
from collections.abc import Iterable

def build_standings(matches: Iterable[dict[str, object]]) -> list[dict[str, object]]:
    """Aggregate points and rank teams using documented tie-break rules."""
    raise NotImplementedError("Implement match validation and standings")
