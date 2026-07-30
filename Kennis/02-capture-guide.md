---
title: Capture Guide
created: 2026-07-26
updated: 2026-07-26
type: system
tags: [system, capture, telegram, personal]
sources: [sources/turingstation-second-brain.md]
---

# Capture Guide

The goal is zero-friction capture. Send a Telegram text or Dutch voice note naturally; Hermes handles Capture and Organize. Dutch is the default language for personal captures, while preserving quoted text and source language where useful. You do not need to name a folder or format.

## Examples

- “Book I want to read is De donkere kamer van Damokles.” → create or update a book note in `personal/resources/books/`, status `want-to-read`.
- “I need a recipe for pasta tonight.” → create a recipe/request note or answer from existing recipes.
- “I had terrible sleep again.” → append a dated habit observation in `personal/journal/` and update the relevant habit page when one exists.
- “Remember that Magisdata should focus on…” → company capture only when explicitly framed as company context.
- “What can I do? I’m bored.” → query personal resources, plans, places, books, and current energy/time context before suggesting something.

## Processing rules

1. Preserve the user's meaning and language; do not over-normalize.
2. Identify domain: `company`, `personal`, or `needs-review`.
3. Create a dedicated note when the item is reusable or likely to be queried later.
4. Update an existing note rather than creating duplicates.
5. Keep the original wording and capture date in a `## Capture` section.
6. Add useful Obsidian links; do not create decorative link spam.
7. Never invent author, dates, prices, locations, diagnoses, or preferences.
8. Ask only when ambiguity changes the destination or could create a consequential mistake.
9. A capture is complete only after the file is written and the navigation/log is updated.
10. Git commits happen during scheduled maintenance, not for every tiny capture.

## Note types

Use frontmatter with `title`, `created`, `updated`, `type`, `tags`, `sources`, and `status` where useful. Typical types: `book`, `recipe`, `place`, `idea`, `habit`, `goal`, `person`, `project`, `journal`, `query`.

## Voice

Telegram voice notes are Dutch by default and should be transcribed by the configured Deepgram Nova-2 provider with language hint `nl`. Never expose or copy credentials into the vault.

## Related pages

- [[00-authority]]
- [[03-operating-model]]
- [[personal/inbox/README]]
- [[personal/resources/books/README]]
