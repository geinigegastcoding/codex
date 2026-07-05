const orb = document.getElementById('jarvis-orb');
const statusText = document.getElementById('orb-status');
const chatLog = document.getElementById('chat-log');
const commandInput = document.getElementById('command-input');
const sendBtn = document.getElementById('send-btn');

let ws;
let isListeningActive = false;

// ── WebSocket ──────────────────────────────────────────────

function initWebSocket() {
    ws = new WebSocket(`ws://${window.location.hostname}:15986`);

    ws.onopen = () => {
        setOrbState('idle', 'SYSTEM ONLINE: IDLE');
        addChatMessage('System', 'Connected to J.A.R.V.I.S. Core.');
    };

    ws.onmessage = async (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'listen_start') {
            isListeningActive = true;
            setOrbState('listening', 'LISTENING...');
            commandInput.placeholder = 'Listening... type here as alternative';
        } else if (data.type === 'listen_end') {
            isListeningActive = false;
            setOrbState('processing', 'PROCESSING...');
            commandInput.placeholder = 'Type a command or /clear...';
        } else if (data.type === 'speak') {
            addChatMessage('J.A.R.V.I.S.', data.text);
            await playAudio(data.url);
        } else if (data.type === 'speak_error') {
            addChatMessage('System Error', data.text);
            ws.send(JSON.stringify({ type: 'playback_complete' }));
        }
    };

    ws.onclose = () => {
        setOrbState('idle', 'SYSTEM OFFLINE: RECONNECTING...');
        setTimeout(initWebSocket, 2000);
    };
}

// ── Audio playback (TTS) ───────────────────────────────────

async function playAudio(url) {
    setOrbState('speaking', 'TRANSMITTING...');

    const audio = new Audio(url);
    audio.onended = () => {
        setOrbState('idle', 'SYSTEM ONLINE: IDLE');
        ws.send(JSON.stringify({ type: 'playback_complete' }));
    };

    try {
        await audio.play();
    } catch (err) {
        console.error('[Jarvis] Audio play failed:', err);
        audio.onended();
    }
}

// ── UI Helpers ─────────────────────────────────────────────

function setOrbState(state, status) {
    orb.className = `orb state-${state}`;
    statusText.innerText = status;
}

function addChatMessage(sender, text) {
    const div = document.createElement('div');
    div.className = `msg ${sender === 'You' ? 'user' : 'jarvis'}`;
    div.innerText = `${sender}: ${text}`;
    chatLog.appendChild(div);
    chatLog.scrollTop = chatLog.scrollHeight;
}

// ── Manual text input ──────────────────────────────────────

sendBtn.addEventListener('click', () => {
    const text = commandInput.value.trim();
    if (text) {
        handleManualInput(text);
        commandInput.value = '';
    }
});

commandInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendBtn.click();
});

function handleManualInput(text) {
    if (text.toLowerCase() === '/clear' || text.toLowerCase() === 'slash clear') {
        chatLog.innerHTML = '';
        addChatMessage('System', 'Context cleared.');
        return;
    }

    addChatMessage('You', text);

    if (isListeningActive) {
        setOrbState('processing', 'PROCESSING...');
        ws.send(JSON.stringify({ type: 'transcript', text }));
        isListeningActive = false;
        commandInput.placeholder = 'Type a command or /clear...';
    }
}

// ── Boot ───────────────────────────────────────────────────

initWebSocket();
