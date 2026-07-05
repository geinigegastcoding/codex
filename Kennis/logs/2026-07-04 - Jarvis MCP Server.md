# 2026-07-04 - Jarvis MCP Server

- **Session ID**: 622919ab-71d7-4b4a-b0be-bad00fed1bcc

## Summary
Created a local Jarvis Voice Assistant web application and Node.js MCP bridge with `node-edge-tts`, and registered it in the Antigravity `mcp_config.json` configuration.

## Files Changed
- `C:\Users\Daniël\Desktop\Codex\AGENTS.md` (modified)
- `C:\Users\Daniël\Desktop\Codex\Jarvis\README.md` (created)
- `C:\Users\Daniël\Desktop\Codex\Jarvis\package.json` (created)
- `C:\Users\Daniël\Desktop\Codex\Jarvis\server.js` (created)
- `C:\Users\Daniël\Desktop\Codex\Jarvis\public\index.html` (created)
- `C:\Users\Daniël\Desktop\Codex\Jarvis\public\style.css` (created)
- `C:\Users\Daniël\Desktop\Codex\Jarvis\public\app.js` (created)
- `C:\Users\Daniël\Desktop\Codex\Jarvis\start.ps1` (created)
- `C:\Users\Daniël\.gemini\config\mcp_config.json` (modified)

## Key Decisions & Assumptions
- Used `node-edge-tts` for TTS generation without external python dependencies.
- Added explicit `navigator.mediaDevices.getUserMedia` call on boot to bypass browser microphone permission blocks.
- Clarified that `mcp_config.json` dynamically spawns the MCP server alongside the Antigravity session.

## Next Steps
- Restart the Antigravity session to load the new MCP configuration.
- Execute the Voice Assistant loop prompt in the CLI.

## Related Notes
- [[AGENTS]]
