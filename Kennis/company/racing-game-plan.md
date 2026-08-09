# Turbo Tinker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (recommended) or superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Build a self-contained, colorful cartoon kart racer in `E:\MData\racing` that uses WebGPU when available, includes five tracks, buildable karts, drifting, AI opponents, and a local server on port 6000.

**Architecture:** `index.html` owns the DOM, render loop, input, WebGPU atmosphere, and Canvas2D scene. `game-core.mjs` contains pure game data and physics functions so the important game rules can run under native Node tests. The browser has no required network dependency.

**Tech Stack:** HTML, CSS, native Canvas2D, native WebGPU, ES modules, Node `node:test`.

---

### Task 1: Create the deterministic game core

**Files:**
- Create: `E:\MData\racing\game-core.mjs`
- Test: `E:\MData\racing\test.mjs`

- [ ] Write tests for build synergy, drift release boost, speed clamping and track progress.
- [ ] Run `node --test racing/test.mjs`; confirm it fails because the module is missing.
- [ ] Implement parts, stat calculation, five track definitions, vector helpers and the minimal kart physics used by the browser.
- [ ] Run `node --test racing/test.mjs`; confirm all tests pass.

### Task 2: Build the game shell and visual system

**Files:**
- Create: `E:\MData\racing\index.html`

- [ ] Add responsive garage, track picker, race HUD, minimap, finish overlay and touch controls.
- [ ] Add the cartoon visual language: cream paper background, coral/cyan/lime palette, rounded cards, chunky labels, sticker shadows and reduced-motion support.
- [ ] Add two stacked canvases: WebGPU atmosphere below and transparent Canvas2D game layer above.
- [ ] Add WebGPU initialization with graceful fallback and a visible renderer badge.

### Task 3: Add garage and race flow

**Files:**
- Modify: `E:\MData\racing\index.html`

- [ ] Render selectable part cards and update all stat bars, speed estimate and synergy copy.
- [ ] Render five tracks from `game-core.mjs` and persist the selected build/track in localStorage.
- [ ] Implement keyboard/touch input, countdown, race timing, laps, boost, restart and finish state.
- [ ] Implement three simple AI karts that follow the selected track's ideal line.

### Task 4: Add cartoon track rendering and feedback

**Files:**
- Modify: `E:\MData\racing\index.html`

- [ ] Draw procedural track borders, curbs, scenery, shadows, kart bodies, skid marks, drift sparks, boost flames and finish confetti.
- [ ] Keep the camera following the player and show standings/minimap state without hiding the driving view.
- [ ] Add sound-free visual feedback so the game works in quiet environments and on browsers that block audio.

### Task 5: Verify locally

**Files:**
- Modify: `E:\MData\racing\index.html` only if verification exposes a bug.

- [ ] Run `node --test racing/test.mjs` and inspect the full output.
- [ ] Start `python -m http.server 6000` in `E:\MData\racing`.
- [ ] Request `http://localhost:6000/` and verify HTTP 200 plus the game entry point.
- [ ] Use a browser smoke check/screenshot when available; confirm garage opens, a track starts, renderer badge resolves, and race controls update.
