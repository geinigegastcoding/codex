---
title: Daniel — Codex workflow preferences
created: 2026-09-25
updated: 2026-09-25
type: preference
tags: [personal, codex, workflow]
---

# Codex workflow preferences

- When Codex needs Daniel to provide a password, API key, login, approval, or other manual input, it should keep working on independent tasks instead of waiting idle.
- It should create and open a clearly visible fullscreen Notepad handoff file containing the exact action Daniel needs to take and the relevant task context.
- Secrets must not be written into the handoff file, chat, source code, or committed files. Use an interactive local prompt or another secure input path.
- When Daniel returns, Codex should re-check the pending handle/state and continue automatically.
