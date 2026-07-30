---
title: Wiki Authority and Boundaries
created: 2026-07-26
updated: 2026-07-26
type: system
tags: [system, authority, company, personal]
sources: [sources/turingstation-second-brain.md]
---

# Authority and Boundaries

This vault is the shared context layer for Daniel and Hermes. It is an Obsidian-compatible Markdown repository and the canonical local source for durable context.

## Source-of-truth order

1. The user's explicit current message or voice note.
2. A current, directly verified source (repository, live URL, or tool result).
3. A dated decision or status note in this vault.
4. Historical logs and proposals, which are context—not automatically current truth.
5. Agent inference, always labeled as inference.

## Boundaries

- `company/` contains Magisdata-only context imported from the `Kennis` folder.
- `personal/` is for Daniel's personal life, preferences, ideas, books, places, habits, recipes, plans, health, finances, relationships, and private journal. Sensitive categories are allowed because the user explicitly opted in; treat them as private context and never expose them unnecessarily.
- `logs/` preserves imported company logs unchanged and receives maintenance entries.
- `personal/inbox/` is the landing zone for uncategorized captures; organize it later, never lose it.
- `_archive/` contains superseded material. Archive instead of deleting.
- `sources/` contains external source captures and provenance notes.

Never merge personal facts into company pages or company-only facts into personal pages without an explicit instruction. If a capture is ambiguous, keep it in `personal/inbox/` and mark it `needs-review`.

## Evidence labels

Use `verified`, `reported`, `inferred`, `proposal`, or `historical` in notes when the distinction matters. Do not turn a proposal, old log, placeholder, or council recommendation into a current fact.

## Related system pages

- [[01-navigation]]
- [[02-capture-guide]]
- [[03-operating-model]]
- [[04-maintenance]]
- [[company/Readme]]
