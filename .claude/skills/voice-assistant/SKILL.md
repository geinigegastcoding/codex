---
name: voice-assistant
description: Activates the continuous Voice Assistant loop using Jarvis MCP (jarvis_listen and jarvis_speak).
---
# voice-assistant Skill

This skill enables a hands-free, continuous Voice Assistant mode. Activate this skill when the user types `/voice`, "Voice assistant modus", or asks to start continuous voice mode.

## Prerequisites
The Jarvis MCP server must be running and the user must have the frontend open at `http://localhost:3000`.

## Architecture & Loop execution
To prevent hitting token output limits during an endless loop, you MUST execute the loop across multiple conversation turns using the `schedule` tool. Do NOT attempt to loop indefinitely within a single turn.

**Step 1: Initialization (First Turn)**
- Output a text message to the user acknowledging that Voice Assistant mode is starting.
- Remind the user to open `http://localhost:3000` if they haven't already.
- Call the `jarvis_speak` tool with a welcome message (e.g., "Voice Assistant started. I'm listening.").
  - *Note: If this returns an error like "Jarvis frontend is not connected", tell the user to refresh their Jarvis web page and try again.*
- Call the `schedule` tool with `DurationSeconds=1` and `Prompt="Begin listen cycle"`.
- End your turn by stopping tool calls.

**Step 2: The Continuous Loop (Subsequent Turns)**
When you are woken up by the `schedule` notification (e.g., "Begin listen cycle"):
1. Call the MCP tool `jarvis_listen`. This tool will block until the user speaks and will return the transcribed text.
2. If the user's text implies they want to stop (e.g., "stop", "quit", "exit", "done"), call `jarvis_speak` with a goodbye message and **do not** call `schedule`. End your turn.
3. If the user asks a question or gives a command, process it, think of an answer, and call `jarvis_speak` to read your answer aloud.
4. After speaking, call `schedule` with `DurationSeconds=1` and `Prompt="Begin listen cycle"`.
5. End your turn. The timer will wake you up immediately to listen again.

## Guidelines
- Be concise in your spoken answers, as listening to long generated text can be tedious for the user.
- Do NOT output large text blocks to the chat while in this mode unless explicitly asked to generate code or a file.
- If `jarvis_listen` or `jarvis_speak` throws an error during the loop (e.g. frontend disconnected), inform the user via text and break the loop by not calling `schedule`.
