#!/usr/bin/env python3
"""Train and test a Dutch Hangman letter policy, split by word length."""

from __future__ import annotations

import argparse
import math
import pickle
import random
import sys
from collections import Counter, defaultdict
from pathlib import Path
from tempfile import TemporaryDirectory
from typing import NamedTuple

try:
    from sklearn.tree import DecisionTreeClassifier
except ImportError as exc:  # pragma: no cover - depends on the local Python setup
    raise SystemExit(
        "scikit-learn ontbreekt. Installeer het met: python -m pip install scikit-learn"
    ) from exc


UNKNOWN = "_"
MODEL_VERSION = 2
VOWELS = set("aeiouyáéíóúàèìòùëï")
DEFAULT_MAX_MISSES = 7
DEMO_WORDS = Path(__file__).with_name("woorden_demo.txt")
DEFAULT_WORDS = Path(__file__).with_name("woorden_opentaal_galgje.txt")
DEFAULT_FREQUENCY = Path(__file__).with_name("woorden_frequentie_10000.txt")
DEFAULT_MODEL = Path(__file__).with_name("galgje_model.pkl")

HANGMAN_STAGES = (
    "  +---+\n  |   |\n      |\n      |\n      |\n=========",
    "  +---+\n  |   |\n  O   |\n      |\n      |\n=========",
    "  +---+\n  |   |\n  O   |\n  |   |\n      |\n=========",
    "  +---+\n  |   |\n  O   |\n /|   |\n      |\n=========",
    "  +---+\n  |   |\n  O   |\n /|\\  |\n      |\n=========",
    "  +---+\n  |   |\n  O   |\n /|\\  |\n /    |\n=========",
    "  +---+\n  |   |\n  O   |\n /|\\  |\n / \\  |\n=========",
    "  +---+\n  |   |\n  X   |\n /|\\  |\n / \\  |\n=========",
)

FEATURE_NAMES = (
    "hit_kans",
    "letterdekking",
    "partitie_gini",
    "verwachte_kandidaatfractie",
    "grootste_partitie",
    "aantal_uitkomsten",
    "is_klinker",
    "letter_index",
    "log_kandidaten",
    "onbekend_fractie",
    "foute_gokken",
    "levens_over",
)


class GameResult(NamedTuple):
    secret: str
    pattern: str
    won: bool
    guesses: int
    misses: int
    tree_guesses: int


def normalise_word(raw: str) -> str | None:
    raw = raw.strip()
    if not raw or len(raw.split()) != 1:
        return None
    word = raw
    word = word.casefold()
    if not word or not word.isalpha() or len(word) < 2:
        return None
    return word


def load_words(path: Path) -> tuple[list[str], int]:
    if not path.is_file():
        raise FileNotFoundError(f"Woordenlijst niet gevonden: {path}")

    words: set[str] = set()
    skipped = 0
    for raw_line in path.read_text(encoding="utf-8-sig").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        word = normalise_word(line)
        if word is None:
            skipped += 1
        else:
            words.add(word)

    if not words:
        raise ValueError(f"Geen geldige woorden gevonden in {path}")
    return sorted(words), skipped


def load_frequency_weights(path: Path) -> tuple[dict[str, float], float, int]:
    """Load a ranked word list as a light prior without excluding other words."""

    if not path.is_file():
        raise FileNotFoundError(f"Frequentielijst niet gevonden: {path}")

    weights: dict[str, float] = {}
    skipped = 0
    for raw_line in path.read_text(encoding="utf-8-sig").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        word = normalise_word(line)
        if word is None:
            skipped += 1
            continue
        if word in weights:
            continue
        rank = len(weights) + 1
        weights[word] = 1.0 / rank

    if not weights:
        raise ValueError(f"Geen geldige rangwoorden gevonden in {path}")

    # ponytail: keep the complete OpenTaal dictionary, but make an unranked
    # entry much less likely than a word with a known corpus rank.
    floor = 1.0 / (len(weights) * 100.0)
    return weights, floor, skipped


def group_by_length(words: list[str]) -> dict[str, list[str]]:
    grouped: defaultdict[str, list[str]] = defaultdict(list)
    for word in words:
        grouped[str(len(word))].append(word)
    return dict(sorted(grouped.items(), key=lambda item: int(item[0])))


def normalise_pattern(raw: str) -> str:
    pattern = raw.strip().casefold().replace("?", UNKNOWN).replace(" ", "")
    if not pattern or any(char != UNKNOWN and not char.isalpha() for char in pattern):
        raise ValueError("Patroon moet alleen letters, '_' of '?' bevatten")
    return pattern


def parse_letters(raw: str) -> set[str]:
    letters = raw.strip().casefold().replace(",", "").replace(" ", "")
    if any(not char.isalpha() for char in letters):
        raise ValueError("Foute letters mogen alleen letters bevatten")
    return set(letters)


def reveal_word(word: str, pattern: str, revealed: set[str]) -> str:
    return "".join(
        char if pattern[index] != UNKNOWN or char in revealed else UNKNOWN
        for index, char in enumerate(word)
    )


def fits_state(word: str, pattern: str, wrong: set[str]) -> bool:
    if len(word) != len(pattern) or any(char in wrong for char in word):
        return False

    known = {char for char in pattern if char != UNKNOWN}
    for index, symbol in enumerate(pattern):
        if symbol != UNKNOWN and word[index] != symbol:
            return False
        if symbol == UNKNOWN and word[index] in known:
            return False
    return True


def candidates_for_state(words: list[str], pattern: str, wrong: set[str]) -> list[str]:
    return [word for word in words if fits_state(word, pattern, wrong)]


def letter_metrics(
    candidates: list[str],
    pattern: str,
    alphabet: list[str],
    weights: dict[str, float] | None = None,
    default_weight: float = 1.0,
) -> dict[str, dict[str, float]]:
    """Calculate the useful information of every letter in one game state."""

    candidate_count = len(candidates)
    if not candidate_count:
        return {}
    if default_weight <= 0:
        raise ValueError("default_weight moet positief zijn")

    unknown_positions = [index for index, char in enumerate(pattern) if char == UNKNOWN]
    masks: dict[str, Counter[tuple[int, ...]]] = {
        letter: Counter() for letter in alphabet
    }
    hits: Counter[str] = Counter()
    occurrences: Counter[str] = Counter()
    total_weight = 0.0

    # One pass over the candidate words is enough; each word contributes only
    # for letters that can reveal at least one unknown position.
    for word in candidates:
        weight = float(default_weight if weights is None else weights.get(word, default_weight))
        if weight <= 0:
            raise ValueError("Woordgewichten moeten positief zijn")
        total_weight += weight
        positions_by_letter: defaultdict[str, list[int]] = defaultdict(list)
        for index in unknown_positions:
            positions_by_letter[word[index]].append(index)
        for letter, positions in positions_by_letter.items():
            if letter not in masks:
                continue
            mask = tuple(positions)
            masks[letter][mask] += weight
            hits[letter] += weight
            occurrences[letter] += len(positions) * weight

    unknown_count = max(1, len(unknown_positions))
    metrics: dict[str, dict[str, float]] = {}
    for letter in alphabet:
        partitions = masks[letter].copy()
        partitions[()] += total_weight - hits[letter]
        probabilities = [weight / total_weight for weight in partitions.values()]
        expected_remaining = sum(probability * probability for probability in probabilities)
        metrics[letter] = {
            "hit_rate": hits[letter] / total_weight,
            "occurrence_rate": occurrences[letter] / (total_weight * unknown_count),
            "partition_gini": 1.0 - expected_remaining,
            "expected_remaining": expected_remaining,
            "largest_partition": max(probabilities),
            "outcome_count": len(partitions) / candidate_count,
        }
    return metrics


def teacher_key(letter: str, metrics: dict[str, dict[str, float]], alphabet: list[str]) -> tuple[float, ...]:
    values = metrics[letter]
    return (
        values["hit_rate"],
        values["partition_gini"],
        values["occurrence_rate"],
        -values["expected_remaining"],
        -values["largest_partition"],
        -float(alphabet.index(letter)),
    )


def teacher_guess(
    metrics: dict[str, dict[str, float]], guessed: set[str], alphabet: list[str]
) -> str:
    available = [letter for letter in alphabet if letter not in guessed]
    if not available:
        raise ValueError("Geen ongegokte letters meer")

    useful = [letter for letter in available if metrics[letter]["hit_rate"] > 0]
    # ponytail: greedy one-step Bayes policy; exact game-theoretic search is
    # much slower and only practical for very small candidate pools.
    return max(useful or available, key=lambda letter: teacher_key(letter, metrics, alphabet))


def feature_vector(
    letter: str,
    metrics: dict[str, dict[str, float]],
    pattern: str,
    wrong: set[str],
    misses_left: int,
    alphabet: list[str],
    candidate_count: int,
) -> list[float]:
    values = metrics[letter]
    alphabet_index = alphabet.index(letter) / max(1, len(alphabet) - 1)
    return [
        values["hit_rate"],
        values["occurrence_rate"],
        values["partition_gini"],
        values["expected_remaining"],
        values["largest_partition"],
        values["outcome_count"],
        float(letter in VOWELS),
        alphabet_index,
        math.log1p(candidate_count),
        pattern.count(UNKNOWN) / len(pattern),
        float(len(wrong)),
        float(misses_left),
    ]


def build_training_data(
    words: list[str],
    alphabet: list[str],
    states_per_length: int,
    random_states_per_word: int,
    max_misses: int,
    max_training_words: int,
    rng: random.Random,
    word_weights: dict[str, float] | None = None,
    word_weight_floor: float = 1.0,
) -> tuple[list[list[float]], list[int], int]:
    X: list[list[float]] = []
    y: list[int] = []
    states_created = 0

    by_length = group_by_length(words)
    for length_key, length_words in by_length.items():
        if states_created >= states_per_length:
            break

        pool = list(length_words)
        if max_training_words > 0 and len(pool) > max_training_words:
            pool = rng.sample(pool, max_training_words)
        rng.shuffle(pool)

        seen_states: set[tuple[str, tuple[str, ...], int]] = set()

        def add_state(pattern: str, wrong: set[str]) -> bool:
            nonlocal states_created
            if states_created >= states_per_length:
                return False
            misses_left = max_misses - len(wrong)
            if misses_left <= 0 or UNKNOWN not in pattern:
                return True

            candidates = candidates_for_state(pool, pattern, wrong)
            if not candidates:
                return True

            state_key = (pattern, tuple(sorted(wrong)), misses_left)
            if state_key in seen_states:
                return True
            seen_states.add(state_key)

            guessed = {char for char in pattern if char != UNKNOWN} | wrong
            metrics = letter_metrics(
                candidates,
                pattern,
                alphabet,
                weights=word_weights,
                default_weight=word_weight_floor,
            )
            available = [letter for letter in alphabet if letter not in guessed]
            if not available:
                return True
            best = teacher_guess(metrics, guessed, alphabet)
            for letter in available:
                X.append(
                    feature_vector(
                        letter,
                        metrics,
                        pattern,
                        wrong,
                        misses_left,
                        alphabet,
                        len(candidates),
                    )
                )
                y.append(int(letter == best))
            states_created += 1
            return True

        for target in pool:
            pattern = UNKNOWN * int(length_key)
            wrong: set[str] = set()
            for _ in range(len(target) + max_misses + 1):
                if not add_state(pattern, wrong):
                    break
                if UNKNOWN not in pattern or len(wrong) >= max_misses:
                    break
                candidates = candidates_for_state(pool, pattern, wrong)
                if not candidates:
                    break
                guessed = {char for char in pattern if char != UNKNOWN} | wrong
                metrics = letter_metrics(
                    candidates,
                    pattern,
                    alphabet,
                    weights=word_weights,
                    default_weight=word_weight_floor,
                )
                letter = teacher_guess(metrics, guessed, alphabet)
                if letter in target:
                    pattern = reveal_word(target, pattern, {letter})
                else:
                    wrong.add(letter)
            if states_created >= states_per_length:
                break

            target_letters = set(target)
            wrong_candidates = [letter for letter in alphabet if letter not in target_letters]
            for _ in range(random_states_per_word):
                reveal_count = rng.randrange(max(1, len(target_letters)))
                revealed = set(rng.sample(sorted(target_letters), reveal_count))
                wrong_count = rng.randrange(max_misses)
                random_wrong = set(rng.sample(wrong_candidates, min(wrong_count, len(wrong_candidates))))
                add_state(reveal_word(target, UNKNOWN * len(target), revealed), random_wrong)
                if states_created >= states_per_length:
                    break
            if states_created >= states_per_length:
                break

        # A tiny length group can have too few reachable states. Add random
        # states until the requested cap is reached or all attempts are spent.
        attempts = 0
        while states_created < states_per_length and pool and attempts < states_per_length * 3:
            attempts += 1
            target = rng.choice(pool)
            target_letters = set(target)
            reveal_count = rng.randrange(max(1, len(target_letters)))
            revealed = set(rng.sample(sorted(target_letters), reveal_count))
            wrong_candidates = [letter for letter in alphabet if letter not in target_letters]
            wrong_count = rng.randrange(max_misses)
            random_wrong = set(rng.sample(wrong_candidates, min(wrong_count, len(wrong_candidates))))
            add_state(reveal_word(target, UNKNOWN * len(target), revealed), random_wrong)

    return X, y, states_created


def train_bundle(
    words: list[str],
    states_per_length: int = 500,
    random_states_per_word: int = 2,
    max_misses: int = DEFAULT_MAX_MISSES,
    max_training_words: int = 2000,
    max_depth: int = 14,
    min_samples_leaf: int = 2,
    seed: int = 42,
    word_weights: dict[str, float] | None = None,
    word_weight_floor: float = 1.0,
    frequency_source: str | None = None,
) -> dict:
    if max_misses < 1:
        raise ValueError("--max-misses moet minstens 1 zijn")
    if states_per_length < 1:
        raise ValueError("--states-per-length moet minstens 1 zijn")
    if word_weight_floor <= 0:
        raise ValueError("word_weight_floor moet positief zijn")

    alphabet = sorted(set("".join(words)))
    rng = random.Random(seed)
    models: dict[str, object | None] = {}
    stats: dict[str, dict[str, float | int]] = {}
    grouped = group_by_length(words)

    for length_key, length_words in grouped.items():
        X, y, states = build_training_data(
            length_words,
            alphabet,
            states_per_length,
            random_states_per_word,
            max_misses,
            max_training_words,
            rng,
            word_weights=word_weights,
            word_weight_floor=word_weight_floor,
        )
        if not X:
            models[length_key] = None
            stats[length_key] = {"words": len(length_words), "states": 0, "examples": 0}
            continue

        model: object | None = None
        accuracy: float | None = None
        if len(set(y)) >= 2:
            model = DecisionTreeClassifier(
                max_depth=max_depth,
                min_samples_leaf=min_samples_leaf,
                class_weight="balanced",
                random_state=seed,
            )
            model.fit(X, y)
            accuracy = float(model.score(X, y))
        models[length_key] = model
        stats[length_key] = {
            "words": len(length_words),
            "states": states,
            "examples": len(X),
            "accuracy": accuracy if accuracy is not None else 1.0,
            "depth": int(model.get_depth()) if model is not None else 0,
        }

    return {
        "version": MODEL_VERSION,
        "alphabet": alphabet,
        "max_misses": max_misses,
        "words_by_length": grouped,
        "word_weights_by_length": {
            key: {
                word: float(word_weights[word])
                for word in length_words
                if word_weights is not None and word in word_weights
            }
            for key, length_words in grouped.items()
        },
        "word_weight_floor": float(word_weight_floor),
        "frequency_source": frequency_source,
        "models": models,
        "feature_names": FEATURE_NAMES,
        "training": stats,
    }


def save_bundle(bundle: dict, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("wb") as handle:
        pickle.dump(bundle, handle, protocol=pickle.HIGHEST_PROTOCOL)


def load_bundle(path: Path) -> dict:
    if not path.is_file():
        raise FileNotFoundError(f"Modelbestand niet gevonden: {path}")
    with path.open("rb") as handle:
        bundle = pickle.load(handle)
    if bundle.get("version") != MODEL_VERSION:
        raise ValueError("Modelbestand heeft een onbekende versie; train opnieuw")
    return bundle


def bundle_with_words(bundle: dict, words: list[str]) -> dict:
    external_alphabet = set("".join(words))
    if not external_alphabet.issubset(set(bundle["alphabet"])):
        missing = "".join(sorted(external_alphabet - set(bundle["alphabet"])))
        raise ValueError(f"Woordenlijst bevat letters die niet in het model zitten: {missing}")
    result = dict(bundle)
    result["words_by_length"] = group_by_length(words)
    stored_weights = bundle.get("word_weights_by_length", {})
    result["word_weights_by_length"] = {
        key: {
            word: float(stored_weights.get(key, {}).get(word))
            for word in length_words
            if word in stored_weights.get(key, {})
        }
        for key, length_words in result["words_by_length"].items()
    }
    return result


def tree_probability(model: object | None, row: list[float]) -> float:
    if model is None:
        return 0.0
    classes = list(model.classes_)
    probabilities = model.predict_proba([row])[0]
    for label, probability in zip(classes, probabilities):
        if int(label) == 1:
            return float(probability)
    return 0.0


def next_guess(
    bundle: dict, pattern: str, wrong: set[str], max_misses: int | None = None
) -> tuple[str, str, int]:
    pattern = normalise_pattern(pattern)
    length_key = str(len(pattern))
    words = bundle["words_by_length"].get(length_key, [])
    if not words:
        raise ValueError(f"Geen getraind woordenboek voor woordlengte {len(pattern)}")

    candidates = candidates_for_state(words, pattern, wrong)
    if not candidates:
        raise ValueError("Geen kandidaten meer; patroon en foute letters spreken elkaar tegen")
    if UNKNOWN not in pattern:
        raise ValueError("Dit woord is al volledig onthuld")

    alphabet = list(bundle["alphabet"])
    miss_limit = int(max_misses if max_misses is not None else bundle["max_misses"])
    if miss_limit < 1:
        raise ValueError("--max-misses moet minstens 1 zijn")
    guessed = {char for char in pattern if char != UNKNOWN} | wrong
    weights = bundle.get("word_weights_by_length", {}).get(length_key, {})
    weight_floor = float(bundle.get("word_weight_floor", 1.0))
    metrics = letter_metrics(
        candidates,
        pattern,
        alphabet,
        weights=weights,
        default_weight=weight_floor,
    )
    available = [letter for letter in alphabet if letter not in guessed]
    if not available:
        raise ValueError("Geen ongegokte letters meer")

    useful = [letter for letter in available if metrics[letter]["hit_rate"] > 0]
    choices = useful or available
    teacher = teacher_guess(metrics, guessed, alphabet)
    model = bundle["models"].get(length_key)
    tree_choice = teacher
    if model is not None:
        scored = []
        for letter in choices:
            row = feature_vector(
                letter,
                metrics,
                pattern,
                wrong,
                miss_limit - len(wrong),
                alphabet,
                len(candidates),
            )
            scored.append((tree_probability(model, row), teacher_key(letter, metrics, alphabet), letter))
        tree_choice = max(scored)[2]

    # The tree chooses among candidates, but the exact candidate statistics
    # prevent a bad generalisation from spending a life on a worse letter.
    if tree_choice == teacher:
        return tree_choice, "decision-tree", len(candidates)
    return teacher, "candidate-fallback", len(candidates)


def solve_secret(
    bundle: dict, secret: str, max_misses: int | None = None, verbose: bool = False
) -> GameResult:
    secret = normalise_word(secret) or ""
    if not secret:
        raise ValueError("Geheim woord is ongeldig")
    length_key = str(len(secret))
    words = bundle["words_by_length"].get(length_key, [])
    if secret not in words:
        raise ValueError(f"{secret!r} staat niet in de woordenlijst van het model")

    limit = int(max_misses if max_misses is not None else bundle["max_misses"])
    if limit < 1:
        raise ValueError("--max-misses moet minstens 1 zijn")
    pattern = UNKNOWN * len(secret)
    wrong: set[str] = set()
    guesses = 0
    tree_guesses = 0
    alphabet = list(bundle["alphabet"])

    while UNKNOWN in pattern:
        if len(wrong) >= limit:
            break
        letter, source, candidate_count = next_guess(bundle, pattern, wrong, limit)
        guesses += 1
        if source == "decision-tree":
            tree_guesses += 1
        if letter in secret:
            pattern = reveal_word(secret, pattern, {letter})
        else:
            wrong.add(letter)
        if verbose:
            print(
                f"{guesses:2}. {letter} ({source}, {candidate_count} kandidaten) -> "
                f"{pattern} | fouten: {''.join(sorted(wrong)) or '-'}"
            )
        if guesses > len(alphabet) + limit:
            raise RuntimeError("Solver bleef gokken; modelbestand is waarschijnlijk beschadigd")

    return GameResult(secret, pattern, UNKNOWN not in pattern, guesses, len(wrong), tree_guesses)


def choose_game_word(bundle: dict, length: int | None, rng: random.Random) -> str:
    by_length = bundle["words_by_length"]
    if length is None:
        # Very long OpenTaal compounds are valid source entries but make a
        # normal round unnecessarily slow, so the default is 4 through 12.
        available_lengths = [
            int(key) for key, words in by_length.items() if words and 4 <= int(key) <= 12
        ]
        if not available_lengths:
            available_lengths = [int(key) for key, words in by_length.items() if words]
        length = rng.choice(available_lengths)

    words = by_length.get(str(length), [])
    if not words:
        raise ValueError(f"Geen woorden beschikbaar voor woordlengte {length}")
    return rng.choice(words)


def command_game(args: argparse.Namespace) -> int:
    bundle = load_bundle(args.model)
    max_misses = int(args.max_misses if args.max_misses is not None else bundle["max_misses"])
    if max_misses < 1:
        raise ValueError("--max-misses moet minstens 1 zijn")

    secret = choose_game_word(bundle, args.length, random.Random(args.seed))
    pattern = UNKNOWN * len(secret)
    guessed: set[str] = set()
    wrong: set[str] = set()
    alphabet = set(bundle["alphabet"])

    print("\nWelkom bij Nederlands galgje. Typ 'stop' om te stoppen.")
    while UNKNOWN in pattern and len(wrong) < max_misses:
        stage = HANGMAN_STAGES[min(len(wrong), len(HANGMAN_STAGES) - 1)]
        print(f"\n{stage}")
        print(f"Woord: {' '.join(pattern)}")
        print(f"Lengte: {len(secret)} | Levens over: {max_misses - len(wrong)}")
        print(f"Foute letters: {''.join(sorted(wrong)) or '-'}")

        try:
            raw = input("Kies een letter: ").strip().casefold()
        except (EOFError, KeyboardInterrupt):
            print("\nSpel gestopt.")
            return 0
        if raw in {"stop", "quit", "exit", "q"}:
            print("Spel gestopt.")
            return 0
        if len(raw) != 1 or not raw.isalpha():
            print("Voer precies één letter in.")
            continue
        if raw not in alphabet:
            print("Deze letter komt niet voor in de gebruikte Nederlandse woordenlijst.")
            continue
        if raw in guessed:
            print("Die letter heb je al geprobeerd.")
            continue

        guessed.add(raw)
        if raw in secret:
            pattern = reveal_word(secret, pattern, {raw})
            print(f"Goed: '{raw}' zit in het woord.")
        else:
            wrong.add(raw)
            print(f"Helaas: '{raw}' zit niet in het woord.")

    if UNKNOWN not in pattern:
        print(f"\n{HANGMAN_STAGES[min(len(wrong), len(HANGMAN_STAGES) - 1)]}")
        print(f"Gewonnen! Het woord was: {secret}")
    else:
        print(f"\n{HANGMAN_STAGES[-1]}")
        print(f"Verloren. Het woord was: {secret}")
    return 0


def evaluate(bundle: dict, words: list[str], games: int, max_misses: int, seed: int) -> None:
    if games < 1:
        raise ValueError("--games moet minstens 1 zijn")
    eligible = [word for word in words if str(len(word)) in bundle["words_by_length"]]
    if not eligible:
        raise ValueError("Geen woorden uit de evaluatielijst hebben een getraind model")

    rng = random.Random(seed)
    results = [solve_secret(bundle, rng.choice(eligible), max_misses) for _ in range(games)]
    wins = sum(result.won for result in results)
    print(f"Gewonnen: {wins}/{games} ({wins / games:.1%})")
    print(f"Gemiddeld aantal gokken: {sum(result.guesses for result in results) / games:.2f}")
    print(f"Gemiddeld aantal fouten: {sum(result.misses for result in results) / games:.2f}")
    print(f"Gokken door de boom: {sum(result.tree_guesses for result in results)}")

    by_length: defaultdict[int, list[GameResult]] = defaultdict(list)
    for result in results:
        by_length[len(result.secret)].append(result)
    for length in sorted(by_length):
        group = by_length[length]
        group_wins = sum(result.won for result in group)
        print(f"  lengte {length}: {group_wins}/{len(group)} gewonnen")


def command_train(args: argparse.Namespace) -> int:
    words, skipped = load_words(args.words)
    print(f"Woorden geladen: {len(words)} unieke woorden uit {args.words}")
    if skipped:
        print(f"Waarschuwing: {skipped} regels overgeslagen (geen schoon woord)")

    word_weights: dict[str, float] | None = None
    word_weight_floor = 1.0
    frequency_source: str | None = None
    if not args.no_frequency:
        word_weights, word_weight_floor, frequency_skipped = load_frequency_weights(args.frequency)
        frequency_source = str(args.frequency)
        print(
            f"Frequentieprior geladen: {len(word_weights)} woorden uit {args.frequency} "
            f"(onbekende woorden krijgen gewicht {word_weight_floor:.2g})"
        )
        if frequency_skipped:
            print(
                f"Waarschuwing: {frequency_skipped} regels uit de frequentielijst "
                "overgeslagen"
            )

    bundle = train_bundle(
        words,
        states_per_length=args.states_per_length,
        random_states_per_word=args.random_states_per_word,
        max_misses=args.max_misses,
        max_training_words=args.max_training_words,
        max_depth=args.max_depth,
        min_samples_leaf=args.min_samples_leaf,
        seed=args.seed,
        word_weights=word_weights,
        word_weight_floor=word_weight_floor,
        frequency_source=frequency_source,
    )
    save_bundle(bundle, args.model)
    print(f"Model opgeslagen: {args.model}")
    for length_key, info in bundle["training"].items():
        print(
            f"  lengte {length_key}: {info['words']} woorden, {info['states']} states, "
            f"{info['examples']} voorbeelden, boomdiepte {info['depth']}"
        )
    return 0


def command_evaluate(args: argparse.Namespace) -> int:
    bundle = load_bundle(args.model)
    words = [word for values in bundle["words_by_length"].values() for word in values]
    if args.words is not None:
        words, skipped = load_words(args.words)
        if skipped:
            print(f"Waarschuwing: {skipped} regels overgeslagen uit {args.words}")
        bundle = bundle_with_words(bundle, words)
    evaluate(bundle, words, args.games, args.max_misses, args.seed)
    return 0


def command_play(args: argparse.Namespace) -> int:
    bundle = load_bundle(args.model)
    secret = args.secret
    if secret is None:
        from getpass import getpass

        secret = getpass("Geef een geheim Nederlands woord voor de AI: ")
    result = solve_secret(bundle, secret, args.max_misses, verbose=True)
    print(
        f"{'Gewonnen' if result.won else 'Verloren'}: {result.secret} | "
        f"{result.guesses} gokken, {result.misses} fouten"
    )
    return 0 if result.won else 1


def command_predict(args: argparse.Namespace) -> int:
    bundle = load_bundle(args.model)
    pattern = normalise_pattern(args.pattern)
    wrong = parse_letters(args.wrong)
    letter, source, candidate_count = next_guess(bundle, pattern, wrong)
    print(f"Kandidaten: {candidate_count}")
    print(f"Volgende letter: {letter} ({source})")
    return 0


def command_self_test(_: argparse.Namespace) -> int:
    words, _ = load_words(DEMO_WORDS)
    word_weights, word_weight_floor, _ = load_frequency_weights(DEFAULT_FREQUENCY)
    bundle = train_bundle(
        words,
        states_per_length=120,
        random_states_per_word=2,
        max_training_words=500,
        seed=7,
        word_weights=word_weights,
        word_weight_floor=word_weight_floor,
        frequency_source=str(DEFAULT_FREQUENCY),
    )
    with TemporaryDirectory() as temp_dir:
        model_path = Path(temp_dir) / "model.pkl"
        save_bundle(bundle, model_path)
        loaded = load_bundle(model_path)
    result = solve_secret(loaded, "computer")
    assert result.won, f"zelftest verloor op {result}"
    assert result.misses <= DEFAULT_MAX_MISSES
    selected = choose_game_word(loaded, 8, random.Random(7))
    assert len(selected) == 8 and selected in loaded["words_by_length"]["8"]
    assert set(loaded["models"]) == set(loaded["words_by_length"])
    print("Zelftest geslaagd: trainen, opslaan/laden en oplossen werken.")
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    subparsers = parser.add_subparsers(dest="command", required=True)

    train = subparsers.add_parser("train", help="Train per woordlengte een beslisboom")
    train.add_argument("--words", type=Path, default=DEFAULT_WORDS)
    train.add_argument("--model", type=Path, default=DEFAULT_MODEL)
    train.add_argument("--states-per-length", type=int, default=500)
    train.add_argument("--random-states-per-word", type=int, default=2)
    train.add_argument("--max-training-words", type=int, default=2000)
    train.add_argument("--max-misses", type=int, default=DEFAULT_MAX_MISSES)
    train.add_argument("--max-depth", type=int, default=14)
    train.add_argument("--min-samples-leaf", type=int, default=2)
    train.add_argument("--frequency", type=Path, default=DEFAULT_FREQUENCY)
    train.add_argument(
        "--no-frequency",
        action="store_true",
        help="Gebruik alle woorden even zwaar (alleen voor experimenten)",
    )
    train.add_argument("--seed", type=int, default=42)
    train.set_defaults(handler=command_train)

    evaluation = subparsers.add_parser("evaluate", help="Speel automatisch veel woorden")
    evaluation.add_argument("--model", type=Path, default=DEFAULT_MODEL)
    evaluation.add_argument("--words", type=Path, default=None)
    evaluation.add_argument("--games", type=int, default=100)
    evaluation.add_argument("--max-misses", type=int, default=DEFAULT_MAX_MISSES)
    evaluation.add_argument("--seed", type=int, default=42)
    evaluation.set_defaults(handler=command_evaluate)

    play = subparsers.add_parser("play", help="Laat de AI een woord raden")
    play.add_argument("--model", type=Path, default=DEFAULT_MODEL)
    play.add_argument("--secret", type=str, default=None)
    play.add_argument("--max-misses", type=int, default=None)
    play.set_defaults(handler=command_play)

    game = subparsers.add_parser("game", help="Speel zelf een volledige galgjeronde")
    game.add_argument("--model", type=Path, default=DEFAULT_MODEL)
    game.add_argument("--length", type=int, default=None, help="Woordlengte; standaard 4 t/m 12")
    game.add_argument("--max-misses", type=int, default=None)
    game.add_argument("--seed", type=int, default=None)
    game.set_defaults(handler=command_game)

    predict = subparsers.add_parser("predict", help="Vraag alleen de volgende letter op")
    predict.add_argument("--model", type=Path, default=DEFAULT_MODEL)
    predict.add_argument("--pattern", required=True, help="Bijvoorbeeld __a__ of ??a??")
    predict.add_argument("--wrong", default="", help="Al foute letters, bijvoorbeeld eirs")
    predict.set_defaults(handler=command_predict)

    self_test = subparsers.add_parser("self-test", help="Voer een kleine ingebouwde controle uit")
    self_test.set_defaults(handler=command_self_test)
    return parser


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    try:
        return args.handler(args)
    except (FileNotFoundError, ValueError, KeyError) as exc:
        print(f"Fout: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
