# Schaakapp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dependency-free local chess app in `E:/MData/schaak` with anime-waifu avatars, full local chess rules, responsive UI, and a small Node self-test.

**Architecture:** Keep the app in three runtime files: semantic HTML, visual CSS, and a single JavaScript module that owns chess state, legal move generation, rendering, and controls. Use DiceBear Lorelei URLs as public avatar sources and inline SVG data URLs as deterministic fallbacks. Keep the rules engine pure enough for a Node test harness.

**Tech Stack:** HTML5, CSS3, browser JavaScript, Node.js built-in `assert` only.

---

### Task 1: Establish the rules contract with a failing test

**Files:**
- Create: `schaak/test.mjs`
- Create: `schaak/app.js`

- [x] **Step 1: Write the rules test first**

  Export a small `ChessGame` API from `app.js` and assert the initial position, legal pawn moves, capture, castling, en passant, promotion, checkmate and undo behavior in `test.mjs`.

- [x] **Step 2: Run the test and confirm RED**

  Run `node schaak/test.mjs`; it must fail because the implementation does not exist yet.

- [x] **Step 3: Implement the minimum pure rules engine**

  Add board state, turn state, legal move filtering, king-safety checks, special moves, history snapshots, and exports for the test harness.

- [x] **Step 4: Run the test and confirm GREEN**

  Run `node schaak/test.mjs`; it must exit with code 0 and report the rule checks passed.

### Task 2: Build the playable interface

**Files:**
- Create: `schaak/index.html`
- Create: `schaak/styles.css`
- Modify: `schaak/app.js`

- [x] **Step 1: Add semantic layout and controls**

  Create a header, game status panel, board mount, move list, new-game/undo/flip controls, and accessible live status region.

- [x] **Step 2: Add the moonlit-dojo visual system**

  Style the board, square states, avatar medallions, panels, responsive stacking, hover/focus states, and reduced-motion behavior using only CSS.

- [x] **Step 3: Connect browser rendering and interaction**

  Render the current position from the same `ChessGame`, wire click/tap selection, promotion choice, controls, DiceBear image URLs, and local SVG fallback handling.

### Task 3: Verify behavior and visual fit

**Files:**
- Modify: `schaak/test.mjs` only if a verified edge case needs coverage.

- [x] **Step 1: Run the rules self-test**

  Run `node schaak/test.mjs` and inspect the complete output.

- [x] **Step 2: Serve the folder locally**

  Run a local static server and open `schaak/index.html` in a browser.

- [x] **Step 3: Check desktop and mobile interaction**

  Verify a normal move, capture, undo, new game, flip board, image fallback, promotion prompt, and responsive board sizing at desktop and narrow viewport widths.

- [x] **Step 4: Inspect the final diff**

  Run `git status --short -- schaak docs/superpowers` and confirm only the intended new files exist.
