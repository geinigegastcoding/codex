# J.A.R.V.I.S. Voice Assistant

A complete, production-ready local "Jarvis" Voice Assistant Web Application and Node.js Model Context Protocol (MCP) Server bridge optimized for Windows.

## Quick Start

1. Right-click `start.ps1` and select **Run with PowerShell**.
   - This will automatically install dependencies via `npm install` on the first run.
   - It will start the MCP WebSocket Bridge and Web Server on port `3000`.
2. Open your web browser (Chrome or Edge recommended for Speech Recognition) and navigate to `http://localhost:3000`.
3. Allow Microphone access when prompted by the browser.

## Using the Interface

- **Orb States:** The central orb dynamically visualizes the system's state (Idle, Listening, Processing, Speaking).
- **Language Toggle:** Switch between English and Dutch in the top right.
- **Echo Cancellation Lock:** The microphone automatically suspends when Jarvis speaks, so it doesn't accidentally transcribe its own voice!
- **Chat Log:** Shows all interactions. Type `/clear` or say "slash clear" to reset the context (it will send `/end-conversation` to the AI CLI).

## Configuration for other AI CLIs

The server runs on the standard MCP `stdio` transport. To hook it up to other systems (e.g., Claude Desktop, Cursor), add the following entry to their MCP config files (`claude_desktop_config.json`, etc.):

```json
{
  "mcpServers": {
    "jarvis": {
      "command": "node",
      "args": ["C:\\Users\\Daniël\\Desktop\\Codex\\Jarvis\\server.js"]
    }
  }
}
```

*Note: Antigravity has already been configured for you automatically!*
