const express = require('express');
const { WebSocketServer } = require('ws');
const path = require('path');
const fs = require('fs');
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const { EdgeTTS } = require('node-edge-tts');
const { spawn } = require('child_process');

process.on('uncaughtException', (err) => {
    fs.appendFileSync(__dirname + '/mcp-crash.log', 'Uncaught Exception: ' + err.stack + '\n');
});
process.on('unhandledRejection', (reason, promise) => {
    fs.appendFileSync(__dirname + '/mcp-crash.log', 'Unhandled Rejection: ' + reason + '\n');
});

const PORT = 3000;
const WS_PORT = 15986;

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
    console.error(`Jarvis Web UI running on http://localhost:${PORT}`);
}).on('error', (e) => {
    console.error(`Express error:`, e.message);
});

const wss = new WebSocketServer({ port: WS_PORT });
wss.on('error', (e) => {
    console.error(`WSS error:`, e.message);
});

let activeWs = null;
let listenResolver = null;
let speakResolver = null;
let currentSttProcess = null;

wss.on('connection', (ws) => {
    activeWs = ws;
    console.error('Frontend connected to Jarvis WebSocket');
    
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.type === 'transcript' && listenResolver) {
            listenResolver(data.text);
            listenResolver = null;
            // Kill STT process — user typed manually instead
            if (currentSttProcess && !currentSttProcess.killed) {
                currentSttProcess.kill();
                currentSttProcess = null;
            }
        }
        if (data.type === 'playback_complete' && speakResolver) {
            speakResolver(true);
            speakResolver = null;
        }
    });

    ws.on('close', () => {
        activeWs = null;
    });
});

const mcpServer = new Server(
    { name: "jarvis-mcp", version: "1.0.0" },
    { capabilities: { tools: {} } }
);

mcpServer.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
        {
            name: "jarvis_listen",
            description: "Listen to the user's voice and return the transcribed text.",
            inputSchema: { type: "object", properties: {} }
        },
        {
            name: "jarvis_speak",
            description: "Speak text aloud to the user using neural TTS.",
            inputSchema: {
                type: "object",
                properties: { text: { type: "string" } },
                required: ["text"]
            }
        }
    ]
}));

mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    
    if (name === "jarvis_listen") {
        // Notify browser to show listening UI
        if (activeWs) {
            activeWs.send(JSON.stringify({ type: 'listen_start' }));
        }

        const transcript = await new Promise((resolve) => {
            // Browser manual text input can also resolve this
            listenResolver = resolve;

            // Start local STT via Python script (uses Google Web Speech API)
            const ps = spawn('python', [
                path.join(__dirname, 'stt.py')
            ], { windowsHide: true });

            currentSttProcess = ps;

            let output = '';
            ps.stdout.on('data', (d) => { output += d.toString(); });
            ps.stderr.on('data', (d) => { console.error('[STT]', d.toString()); });

            ps.on('close', () => {
                currentSttProcess = null;
                if (listenResolver) {
                    const text = output.trim() || '[no speech detected]';
                    listenResolver(text);
                    listenResolver = null;
                }
            });
        });

        // Notify browser that listening ended
        if (activeWs) {
            activeWs.send(JSON.stringify({ type: 'listen_end' }));
        }

        return { content: [{ type: "text", text: transcript }] };
    }

    if (name === "jarvis_speak") {
        if (!activeWs) {
            return { content: [{ type: "text", text: "Error: Jarvis frontend is not connected." }], isError: true };
        }
        const text = args.text;
        
        try {
            const audioDir = path.join(__dirname, 'public', 'audio');
            if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });
            
            const filename = `speech_${Date.now()}.mp3`;
            const filepath = path.join(audioDir, filename);
            
            // Using a good default English neural voice; can be updated to Dutch if requested
            const tts = new EdgeTTS({ voice: 'en-US-AriaNeural' });
            await tts.ttsPromise(text, filepath);
            
            activeWs.send(JSON.stringify({ type: 'speak', url: `/audio/${filename}`, text }));
            await new Promise(resolve => { speakResolver = resolve; });
            
            // Cleanup audio file after 30 seconds
            setTimeout(() => {
                if(fs.existsSync(filepath)) fs.unlinkSync(filepath);
            }, 30000);
            
            return { content: [{ type: "text", text: "Successfully spoken." }] };
        } catch (err) {
            console.error(err);
            activeWs.send(JSON.stringify({ type: 'speak_error', text: 'System error: unable to generate audio' }));
            return { content: [{ type: "text", text: `Error generating audio: ${err.message}` }], isError: true };
        }
    }
    
    throw new Error(`Unknown tool: ${name}`);
});

async function main() {
    const transport = new StdioServerTransport();
    await mcpServer.connect(transport);
    console.error("Jarvis MCP Server running on stdio");
}

main().catch(console.error);
