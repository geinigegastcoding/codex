# Jungle Sprint Implementation Plan

> For agentic workers: REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Build a dependency-free, static browser platformer with 20 original jungle levels, responsive controls, local progress, generated art, and verified screenshots.

**Architecture:** A native HTML shell owns menus, HUD, overlays, accessibility text, and touch controls. A single requestAnimationFrame loop renders a canvas scene while pure functions in src/game-core.js own level data, physics, collectibles, progress, and storage-safe state transitions. Generated imagev2 art is copied into assets/ and treated as a decorative layer only.

**Tech Stack:** HTML, CSS, browser Canvas 2D, ES modules, Web Audio API, Node built-in node:test, Playwright if available for screenshot verification.

---

### Task 1: Create the project shell and failing core tests

**Files:**
- Create: platforms/package.json
- Create: platforms/index.html
- Create: platforms/src/game-core.js
- Create: platforms/tests/game-core.test.js

- [ ] Step 1: Add the minimal package scripts and HTML shell

Create package.json with "test": "node --test tests/*.test.js" and "serve": "python -m http.server 4174". Create an accessible HTML shell with named sections for home-screen, levels-screen, game-screen, a canvas id game-canvas, status text, and real buttons for start, level select, pause, restart, mute, and touch controls. Load src/main.js as a module even though it does not exist yet.

- [ ] Step 2: Write the first failing tests

In tests/game-core.test.js, import the future core module and assert these behaviors: getLevels() returns exactly 20 levels with non-empty names; getLevel(19) is the final level and getLevel(20) throws; advanceProgress({unlocked: 1, completed: [], bestScores: {}}, 0, {score: 800}) returns unlocked: 2, completion [0], and best score 800; collectCoins removes a coin intersecting the player but keeps a non-intersecting coin.

- [ ] Step 3: Run the focused test to confirm the intended failure

Run npm test from platforms/. Expected: FAIL because src/game-core.js is not present yet. Fix only test/import typos if the failure is a syntax error; keep the missing-behavior failure visible.

### Task 2: Implement validated level data and core state transitions

**Files:**
- Modify: platforms/src/game-core.js
- Modify: platforms/tests/game-core.test.js

- [ ] Step 1: Add level schema and 20 deterministic level definitions

Export LEVELS, getLevels, and getLevel. Each level must include id, world, name, theme, width, spawn, platforms, coins, enemies, hazards, checkpoint, and finish. Use compact arrays of rectangles and keep every spawn, checkpoint, and finish above a platform. Vary layouts and themes every four levels, but use only data fields the renderer and physics consume.

- [ ] Step 2: Add pure rectangle and progress helpers

Export rectsOverlap, createPlayer, collectCoins, advanceProgress, parseProgress, and serializeProgress. parseProgress must return {unlocked: 1, completed: [], bestScores: {}} for malformed JSON, clamp unlocked to [1, 20], deduplicate completed indexes, and ignore invalid scores. advanceProgress only unlocks the next level when the current result is finished: true, and only replaces a best score when the new score is higher.

- [ ] Step 3: Add tests for boundaries and storage fallback

Test malformed storage, clamping, duplicate completion entries, no unlock on death, lower-score preservation, rectangle edge behavior, and the exact 20-level world grouping. Run npm test; expected: all tests pass.

### Task 3: Add physics, collisions, and gameplay transitions using TDD

**Files:**
- Modify: platforms/src/game-core.js
- Modify: platforms/tests/game-core.test.js

- [ ] Step 1: Add failing tests for movement behavior

Cover horizontal acceleration/friction, gravity, platform-top landing, jump buffering/coyote time, checkpoint reset after a fall, hazard collision, and finish collision. Each test should pass a small fixture level to a pure stepPlayer or transition function and assert the resulting position/state rather than implementation details.

- [ ] Step 2: Implement the minimal fixed-step player update

Export stepPlayer(player, input, level, delta) with a capped delta, horizontal speed limit, gravity, jump impulse, coyote timer, buffered jump timer, rectangle collision against platforms, and explicit status values playing, dead, or finished. Keep world coordinates in level pixels and clamp the player to level bounds.

- [ ] Step 3: Implement enemy movement and hazard checks

Export stepEnemies(enemies, delta) for deterministic patrol between minX and maxX, plus getPlayerOutcome(player, level, enemies) that returns dead on hazard/enemy/void overlap and finished on finish overlap. Add tests for patrol reversal, enemy collision, hazard collision, and finish priority.

- [ ] Step 4: Run the full core suite

Run npm test. Expected: all core tests pass with no warnings. If a physics edge fails, change the implementation, not the assertion, unless the assertion contradicts the design document.

### Task 4: Generate and validate the jungle art asset

**Files:**
- Create: platforms/assets/jungle-horizon.png

- [ ] Step 1: Generate the wide imagev2 asset

Use the built-in image generation tool with a prompt for a wide, painterly 2.5D jungle horizon: saturated emerald canopy, oversized leaves, colorful flowers, warm sun shafts, layered depth, clean negative space near the center for UI, no text, no logos, no recognizable franchise characters, no UI chrome. Keep it decorative and readable under a dark translucent canvas overlay.

- [ ] Step 2: Copy the selected image into the project

Copy the generated result from the tool output into platforms/assets/jungle-horizon.png without overwriting any existing file. Inspect the final local image and confirm it is a valid raster asset with the intended palette and aspect ratio.

### Task 5: Build the gameplay renderer and input loop

**Files:**
- Create: platforms/src/main.js
- Create: platforms/src/game-renderer.js
- Create: platforms/src/input.js
- Create: platforms/src/storage.js

- [ ] Step 1: Add input and storage adapters

Implement keyboard listeners for ArrowLeft/ArrowRight, A/D, Space/W/ArrowUp, Escape, R, and M. Implement pointer/touch buttons that set the same input state. storage.js should read/write the validated progress format under one namespaced localStorage key and catch storage access errors.

- [ ] Step 2: Add the canvas renderer

Render the generated horizon with parallax offset, gradient sky tint, code-drawn jungle silhouettes, platforms, vines, coins, enemies, the player, checkpoint glow, finish gate, particles, and a subtle camera follow. Use devicePixelRatio safely, resize from the CSS box, and render a readable world at both desktop and mobile sizes.

- [ ] Step 3: Wire the state machine and screens

In main.js, implement the screen state (home, levels, playing, result), level selection, pause/restart/mute buttons, fixed-step accumulator, level reset, checkpoint respawn, finish result, and local progress refresh. Keep DOM updates in small functions and keep physics in game-core.js.

- [ ] Step 4: Add a first browser smoke check

Start the static server with npm run serve on port 4174, load the page, and verify that the home screen renders, Start opens the level grid, Level 1 opens the canvas, keyboard input moves the player, and Restart returns to the spawn. Capture any console errors before styling further.

### Task 6: Finish the jungle UI, motion, and responsive touch experience

**Files:**
- Create: platforms/src/styles.css
- Modify: platforms/index.html
- Modify: platforms/src/main.js

- [ ] Step 1: Add the visual system

Use a deep leaf-green base, banana-yellow highlight, guava-pink accent, cyan water accent, a distinctive display font fallback stack, layered gradients, paper-like grain, rounded game panels, clear section rhythm, and visible focus states. Keep text high contrast and avoid generic purple/glow styling.

- [ ] Step 2: Add responsive breakpoints and touch controls

Make the game board fit within the viewport without horizontal scrolling; collapse the level grid to one/two columns on narrow screens; keep touch controls above the safe bottom area; add prefers-reduced-motion overrides and aria-live status updates.

- [ ] Step 3: Add polished feedback

Use small CSS transitions for screen changes, canvas particles for coin/checkpoint/finish events, Web Audio tones only after explicit mute toggle, and clear result buttons for retry, next level, and level map. Ensure every button has a working handler.

### Task 7: Verify, screenshot, and fix regressions

**Files:**
- Create: platforms/screenshots/desktop-home.png
- Create: platforms/screenshots/desktop-game.png
- Create: platforms/screenshots/mobile-levels.png
- Create: platforms/screenshots/mobile-game.png

- [ ] Step 1: Run automated verification

Run npm test from platforms/; expected: all tests pass. Run the static server on port 4174 and use a browser automation command if available to check HTTP 200, no console errors, Start -> levels -> Level 1 flow, level 20 unlock rendering, and a touch/keyboard action.

- [ ] Step 2: Capture desktop and mobile screenshots

Capture the home screen and active gameplay at a desktop viewport, plus level selection and gameplay at a narrow mobile viewport. Inspect all four images for clipping, unreadable contrast, hidden controls, broken art, and unbalanced spacing.

- [ ] Step 3: Fix only verified issues and rerun all checks

Apply focused fixes for any observed layout, input, or runtime error. Rerun npm test, reload the app, repeat the screenshots, and inspect the final diff limited to platforms/.

### Self-review checklist

- Level count is exactly 20 and all five jungle worlds appear.
- Core behaviors have red-green tests and the final suite is green.
- No route, button, asset, or storage path is left as a placeholder.
- Desktop and mobile screenshots show the full UI without overflow or inaccessible controls.
- The app remains dependency-free and does not touch unrelated dirty files in E:\MData.
