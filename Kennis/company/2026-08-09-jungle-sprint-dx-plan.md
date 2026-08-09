# Jungle Sprint DX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the existing static platformer into Jungle Sprint DX with reliable collisions, distinct levels, three heroes, Moki mount gameplay, richer mechanics, ImageV2 worlds, and verified desktop/mobile play.

**Architecture:** Keep the native ES-module, Canvas 2D, HTML, and CSS stack. Move declarative heroes and levels into `game-content.js`; keep pure simulation in `game-core.js`; let `main.js` own runtime state and `game-renderer.js` own visuals. Generated images remain decorative and never define collision geometry.

**Tech Stack:** Browser Canvas 2D, HTML, CSS, ES modules, Web Audio, localStorage, Node `node:test`, ImageV2, local headless browser verification.

**Workspace rule:** Do not create git commits unless Daniel explicitly asks. Preserve all unrelated dirty files.

---

### Task 1: Lock collision and hero behavior with tests

**Files:**
- Modify: `Projecten/platforms/tests/game-core.test.js`
- Modify: `Projecten/platforms/src/game-core.js`
- Create: `Projecten/platforms/src/game-content.js`

- [ ] **Step 1: Add failing collision tests**

Add focused tests proving that a player stops at a platform side, hits a ceiling without passing through it, lands on top, stomps an enemy only while descending from above, and takes damage on side contact.

```js
test('blocks horizontal movement at a solid platform side', () => {
  const player = { ...createPlayer({ x: 40, y: 174 }), vx: 280, onGround: true };
  const level = fixtureLevel([{ x: 100, y: 120, width: 40, height: 140 }]);
  const next = stepPlayer(player, { right: true }, level, 0.1);
  assert.equal(next.x + next.width, 100);
});

test('stomps only from above', () => {
  const result = resolveEnemyContacts(
    { ...createPlayer({ x: 50, y: 55 }), vy: 300 },
    { x: 50, y: 35, width: 34, height: 46 },
    [{ id: 'bug', x: 50, y: 100, width: 34, height: 30, health: 1 }],
  );
  assert.equal(result.stomped, 1);
  assert.equal(result.enemies.length, 0);
  assert.ok(result.player.vy < 0);
});
```

- [ ] **Step 2: Run the suite and confirm red**

Run: `npm test`

Expected: failures for missing hero/content exports and unresolved side, ceiling, and stomp behavior.

- [ ] **Step 3: Add hero definitions and collision helpers**

Create `game-content.js` with immutable definitions for `tavi`, `nia`, and `bo`. Export through `game-core.js`:

```js
export function getHeroes() { return HEROES.map(clone); }
export function getHero(id) {
  const hero = HEROES.find((entry) => entry.id === id);
  if (!hero) throw new RangeError('Unknown hero: ' + id);
  return clone(hero);
}
```

Update `createPlayer(spawn, heroId = 'tavi')` with `heroId`, `airJumps`, `groundPound`, `mounted`, `hasKey`, and stable `width`/`height` collision bounds.

- [ ] **Step 4: Resolve movement per axis**

Implement horizontal solid collision before vertical movement. Vertical collision must handle landing and ceilings, ignore the underside of `oneWay` platforms, and include closed gates as solids. Keep coyote time and jump buffering. Nia consumes one air jump; Bo starts a ground-pound on `abilityPressed` while airborne.

- [ ] **Step 5: Implement enemy contact results**

Export `resolveEnemyContacts(player, previousPlayer, enemies)`. Return `{ player, enemies, stomped, damaged }`. A descending previous-bottom crossing an enemy top is a stomp; other overlaps set `damaged: true` unless invulnerable.

- [ ] **Step 6: Run tests until green**

Run: `npm test`

Expected: all old tests and new collision/hero tests pass.

### Task 2: Replace repeated levels with validated DX content

**Files:**
- Modify: `Projecten/platforms/src/game-content.js`
- Modify: `Projecten/platforms/src/game-core.js`
- Modify: `Projecten/platforms/tests/game-core.test.js`

- [ ] **Step 1: Add failing content tests**

Assert 20 levels, five worlds, unique route signatures, valid bounds, one finish/checkpoint per level, and mechanic coverage.

```js
test('gives all 20 levels distinct route signatures', () => {
  const signatures = getLevels().map(levelSignature);
  assert.equal(new Set(signatures).size, 20);
});

test('covers every DX mechanic', () => {
  const levels = getLevels();
  for (const field of ['movingPlatforms', 'springs', 'crumbles', 'keys', 'gates', 'medals', 'mounts']) {
    assert.ok(levels.some((level) => level[field].length > 0), field);
  }
});
```

- [ ] **Step 2: Define five world presets and 20 explicit blueprints**

Each blueprint supplies width, route platforms, ground segments, hazards, enemies, checkpoint, finish, coins, medal, and selected mechanics. Do not reuse one geometry with only a Y offset. Keep all routes playable by the slowest hero.

- [ ] **Step 3: Add level validation**

Export `validateLevel(level)` returning an array of human-readable errors. Validate positive dimensions, in-bounds rectangles, spawn/checkpoint/finish presence, known mechanic arrays, unique object IDs, and finish after spawn. Throw during module initialization if any built-in level fails.

- [ ] **Step 4: Add moving, spring, crumble, key, gate, switch, and medal helpers**

Export pure functions:

```js
stepMovingPlatforms(platforms, elapsed)
stepCrumblePlatforms(platforms, player, delta)
applyWorldInteractions(player, worldState)
collectMedal(player, medal)
```

`applyWorldInteractions` returns the next player, key/switch state, open gates, spring activation, and mount pickup without mutating input.

- [ ] **Step 5: Run tests until green**

Run: `npm test`

Expected: 20 valid, distinct levels and all mechanic tests pass.

### Task 3: Add Moki, abilities, goals, and progress migration

**Files:**
- Modify: `Projecten/platforms/src/game-core.js`
- Modify: `Projecten/platforms/src/storage.js`
- Modify: `Projecten/platforms/src/input.js`
- Modify: `Projecten/platforms/tests/game-core.test.js`

- [ ] **Step 1: Add failing Moki and storage tests**

Test mount pickup, flutter gravity, tongue-range coin/enemy interaction, safe dismount state, v1-to-v2 progress migration, selected hero validation, unlocked heroes, and per-level goals.

- [ ] **Step 2: Implement Moki interaction**

Mount on overlap with a level mount object. While mounted, reduce falling gravity when jump is held and flutter energy remains. `resolveTongue(player, coins, enemies)` reaches 112 pixels in facing direction, collects fruit and removes one non-boss enemy. `down + abilityPressed` dismounts when there is clear space.

- [ ] **Step 3: Extend input without changing existing controls**

Map `Shift`, `x`, `X`, and a touch ability button to `ability`. Map `ArrowDown`, `s`, and `S` to `down`. Return one-frame `jumpPressed` and `abilityPressed` values from `snapshot()` while preserving held state.

- [ ] **Step 4: Migrate progress to version 2**

Use this normalized shape:

```js
{
  version: 2,
  unlocked: 1,
  completed: [],
  bestScores: {},
  goals: {},
  selectedHero: 'tavi',
  unlockedHeroes: ['tavi']
}
```

Preserve valid v1 unlocked/completed/best score fields. Unlock Nia after world 1 and Bo after world 3.

- [ ] **Step 5: Run tests until green**

Run: `npm test`

Expected: all behavior and migration tests pass.

### Task 4: Wire DX state, menus, and gameplay

**Files:**
- Modify: `Projecten/platforms/index.html`
- Modify: `Projecten/platforms/src/main.js`
- Modify: `Projecten/platforms/src/styles.css`

- [ ] **Step 1: Add accessible hero and goal UI**

Add a three-button hero selector to the level screen, one ability touch button, HUD chips for the medal/key/mount state, goal badges on level cards, and a hidden debug status label. All interactive elements remain real buttons with focus styles and Dutch labels.

- [ ] **Step 2: Extend level runtime state**

Track dynamic platforms, crumble timers, keys, switches, gates, medal, mount, defeated enemies, hero, debug mode, and goal results. Reset them from fresh cloned level data on start/retry.

- [ ] **Step 3: Integrate mechanics in a fixed order**

For each tick: snapshot input, step dynamic platforms, step player, apply world interactions, resolve tongue, resolve enemies, collect fruit/medal, resolve damage/finish, update goals/HUD. This order prevents a defeated enemy from also damaging the player in the same frame.

- [ ] **Step 4: Save progress and unlock heroes**

On finish, store score and achieved goals, recompute hero unlocks, refresh the hero selector and level map, and announce unlocks through the live region.

- [ ] **Step 5: Add hidden hitbox debug mode**

Toggle with `H`. Pass `debugHitboxes` to the renderer and announce the state through the live region. Do not show debug controls in the normal UI.

### Task 5: Upgrade renderer and ImageV2 worlds

**Files:**
- Modify: `Projecten/platforms/src/game-renderer.js`
- Modify: `Projecten/platforms/src/styles.css`
- Create: `Projecten/platforms/assets/world-bamboo.png`
- Create: `Projecten/platforms/assets/world-canopy.png`
- Create: `Projecten/platforms/assets/world-ruins.png`
- Create: `Projecten/platforms/assets/world-monsoon.png`
- Create: `Projecten/platforms/assets/world-temple.png`
- Create: `Projecten/platforms/assets/hero-roster.png`

- [ ] **Step 1: Generate six project-bound ImageV2 assets**

Generate one wide painterly 2.5D background per world and one roster illustration. Use consistent shapes, saturated storybook color, depth layers, clear central play space, no text, no logos, no recognizable franchise characters, and no baked UI.

- [ ] **Step 2: Validate and copy assets**

Inspect every raster output, copy it under the exact paths above, verify dimensions and file decoding, and reference only workspace-local files.

- [ ] **Step 3: Render all new entities**

Draw distinct hero silhouettes, Moki with rider/tongue/flutter states, multiple enemy types, moving leaves, crumble cracks, spring flowers, keys, gates, switches, medals, boss health, and debug rectangles. Keep rendered bodies aligned to the core collision bounds.

- [ ] **Step 4: Give each world its own atmosphere**

Select the background by `worldIndex`; vary platform material, near-foreground silhouettes, particles, weather, lighting, and palette. Reduced-motion disables weather drift, camera shake, and decorative particles.

- [ ] **Step 5: Polish responsive screens**

Use the roster art on the hero selector, improve world-map cards and goals, keep the desktop game centered, and fit gameplay plus four touch controls inside narrow mobile viewports without scrolling during play.

### Task 6: Verify the complete game and repair regressions

**Files:**
- Modify as required: `Projecten/platforms/src/*.js`, `Projecten/platforms/src/styles.css`, `Projecten/platforms/index.html`
- Create/replace: `Projecten/platforms/screenshots/dx-desktop-home.png`
- Create/replace: `Projecten/platforms/screenshots/dx-desktop-levels.png`
- Create/replace: `Projecten/platforms/screenshots/dx-desktop-game.png`
- Create/replace: `Projecten/platforms/screenshots/dx-mobile-game.png`
- Create/replace: `Projecten/platforms/screenshots/dx-hitboxes.png`

- [ ] **Step 1: Run automated tests**

Run: `npm test`

Expected: zero failures, warnings, skips, or todos.

- [ ] **Step 2: Start the static server**

Run: `npm run serve`

Expected: HTTP 200 for `/`, every JS module, and all six new image assets.

- [ ] **Step 3: Exercise the browser flow**

Verify home to level map, hero selection, level start, keyboard movement/jump/ability, touch controls, pause, restart, Moki, hitbox toggle, finish/result, persisted reload, and no console errors.

- [ ] **Step 4: Capture and inspect screenshots**

Capture the five named screenshots at desktop and 390-pixel mobile widths. Check clipping, contrast, controls, visual alignment, background decoding, and debug rectangle alignment.

- [ ] **Step 5: Fix observed failures and rerun checks**

Only change behavior demonstrated faulty by tests or browser evidence. Repeat the full suite and final screenshots after fixes.
