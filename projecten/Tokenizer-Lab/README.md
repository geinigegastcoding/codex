# Tokenizer Lab

Tokenizer Lab is a small Python learning project for discovering how tokenizers work by implementing the important parts from scratch.

## Learning objective

Build an understanding of text units, vocabularies, merges, encoding, decoding, and compression through your own implementation. No tokenizer library is used to solve the core work.

## Setup

From this directory:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -e ".[dev]"
```

If PowerShell blocks activation, run the project with the interpreter directly instead:

```powershell
.\.venv\Scripts\python.exe -m tokenizer_lab
```

## Run the application

```powershell
python -m tokenizer_lab
```

This currently opens only a basic **Tokenizer Lab** window.

## Run tests

```powershell
pytest
```

## From-scratch rule

The tokenizer algorithms are intentionally not implemented for you. Keep the important tokenizer logic your own work.

## Starting roadmap

### 1. Work with text units

**Goal:** Inspect a short piece of text as a sequence of basic units.

**What to research:** Python strings; Unicode code points; `repr()`; list comprehensions.

**Done when:** You have tests for empty text, spaces, punctuation, and at least one non-ASCII example.

### 2. Define a first token representation

**Goal:** Represent the result of your first tokenizer experiment in a form that is easy to inspect.

**What to research:** `dataclass`; type hints; `list` versus `tuple`; readable object representations.

**Done when:** A small test can compare an expected token sequence with the produced sequence.

### 3. Add a reversible text path

**Goal:** Make your early representation support a verified text round trip.

**What to research:** invariants; pure functions; parameterized pytest tests; edge cases.

**Done when:** tests prove that supported input survives the round trip unchanged.

### 4. Explore repeated adjacent patterns

**Goal:** Inspect which neighboring patterns occur most often in a small corpus.

**What to research:** dictionaries as counters; tuples as dictionary keys; `collections.Counter`; deterministic ordering.

**Done when:** tests cover ties, overlapping occurrences, and a corpus with no repeated pattern.
