import test from 'node:test';
import assert from 'node:assert/strict';
import * as gameCore from '../src/game-core.js';

import {
  advanceProgress,
  collectCoins,
  createPlayer,
  getLevel,
  getLevels,
  getPlayerOutcome,
  parseProgress,
  rectsOverlap,
  respawnAtCheckpoint,
  stepEnemies,
  stepPlayer,
} from '../src/game-core.js';
import { createInput } from '../src/input.js';
import { clearProgress, loadProgress, saveProgress } from '../src/storage.js';

const EMPTY_PROGRESS = {
  version: 2,
  unlocked: 1,
  completed: [],
  bestScores: {},
  goals: {},
  selectedHero: 'tavi',
  unlockedHeroes: ['tavi'],
};

test('defines exactly 20 named levels', () => {
  const levels = getLevels();

  assert.equal(levels.length, 20);
  assert.ok(levels.every((level) => level.name.length > 0));
});

test('returns the final level and rejects indexes outside the map', () => {
  assert.equal(getLevel(19).id, 20);
  assert.throws(() => getLevel(20), RangeError);
});

test('unlocks the next level and records a first best score after finishing', () => {
  const progress = advanceProgress(
    { unlocked: 1, completed: [], bestScores: {} },
    0,
    { finished: true, score: 800 },
  );

  assert.deepEqual(progress, {
    version: 2,
    unlocked: 2,
    completed: [0],
    bestScores: { 0: 800 },
    goals: { 0: { fruit: false, medal: false } },
    selectedHero: 'tavi',
    unlockedHeroes: ['tavi'],
  });
});

test('collects only coins overlapping the player', () => {
  const result = collectCoins(
    { x: 50, y: 50, width: 20, height: 20 },
    [
      { x: 55, y: 55, size: 12 },
      { x: 200, y: 50, size: 12 },
    ],
  );

  assert.equal(result.collected, 1);
  assert.equal(result.coins.length, 1);
  assert.equal(result.coins[0].x, 200);
});

test('groups levels into five four-level jungle worlds', () => {
  const worlds = new Set(getLevels().map((level) => level.world));

  assert.equal(worlds.size, 5);
  for (const world of worlds) {
    assert.equal(getLevels().filter((level) => level.world === world).length, 4);
  }
});

test('provides playable anchors and hazards for every level', () => {
  for (const level of getLevels()) {
    assert.ok(level.width > 2000);
    assert.ok(level.platforms.length >= 6);
    assert.ok(level.coins.length >= 6);
    assert.ok(level.hazards.length >= 1);
    assert.ok(level.enemies.length >= 1);
    assert.ok(level.checkpoint.x > level.spawn.x);
    assert.ok(level.finish.x > level.checkpoint.x);
  }
});

test('gives all 20 levels a distinct platform route', () => {
  const signatures = getLevels().map((level) => level.platforms
    .map(({ x, y, width, height }) => [x, y, width, height].join(','))
    .join('|'));

  assert.equal(new Set(signatures).size, 20);
});

test('spreads every DX mechanic across the level set', () => {
  const levels = getLevels();

  for (const field of ['movingPlatforms', 'springs', 'crumbles', 'keys', 'gates', 'switches', 'medals', 'mounts']) {
    assert.ok(levels.some((level) => Array.isArray(level[field]) && level[field].length > 0), field);
  }
});

test('validates every built-in level and reports malformed geometry', () => {
  assert.ok(getLevels().every((level) => gameCore.validateLevel(level).length === 0));

  const broken = getLevel(0);
  broken.finish.x = broken.width + 1;
  assert.ok(gameCore.validateLevel(broken).some((error) => error.includes('finish')));
});

test('moves a platform predictably around its origin', () => {
  const [platform] = gameCore.stepMovingPlatforms([
    {
      id: 'leaf-lift',
      x: 100,
      y: 200,
      width: 120,
      height: 22,
      baseX: 100,
      baseY: 200,
      rangeX: 50,
      rangeY: 0,
      speed: 1,
      phase: 0,
    },
  ], Math.PI / 2);

  assert.equal(platform.x, 150);
  assert.equal(platform.y, 200);
});

test('a crumble platform disappears after the player stands on it', () => {
  const platforms = [{ id: 'crumb-1', x: 80, y: 220, width: 100, height: 20, timer: 0, active: true }];
  const player = { ...createPlayer({ x: 100, y: 174 }), onGround: true };

  const [platform] = gameCore.stepCrumblePlatforms(platforms, player, 0.7);

  assert.equal(platform.active, false);
  assert.ok(platform.timer >= 0.55);
});

test('collects a hidden medal only when its bounds overlap', () => {
  const player = createPlayer({ x: 50, y: 50 });
  const medal = { id: 'sun-1', x: 60, y: 60, width: 24, height: 24 };

  const result = gameCore.collectMedal(player, medal);

  assert.equal(result.collected, true);
  assert.equal(result.medal, null);
});

test('collecting a key opens only its linked gate', () => {
  const player = createPlayer({ x: 50, y: 50 });
  const result = gameCore.applyWorldInteractions(player, {
    springs: [],
    keys: [{ id: 'key-a', x: 55, y: 55, width: 20, height: 20, gateId: 'gate-a' }],
    gates: [
      { id: 'gate-a', x: 200, y: 100, width: 30, height: 120, open: false },
      { id: 'gate-b', x: 300, y: 100, width: 30, height: 120, open: false },
    ],
    switches: [],
  });

  assert.equal(result.keys.length, 0);
  assert.equal(result.gates.find((gate) => gate.id === 'gate-a').open, true);
  assert.equal(result.gates.find((gate) => gate.id === 'gate-b').open, false);
  assert.equal(result.keyCollected, true);
});

test('stepping on a switch opens its linked gate', () => {
  const player = createPlayer({ x: 50, y: 50 });
  const result = gameCore.applyWorldInteractions(player, {
    springs: [],
    keys: [],
    gates: [{ id: 'echo-gate', x: 200, y: 100, width: 30, height: 120, open: false }],
    switches: [{ id: 'switch-a', x: 55, y: 70, width: 40, height: 18, gateId: 'echo-gate', active: false }],
  });

  assert.equal(result.switches[0].active, true);
  assert.equal(result.gates[0].open, true);
  assert.equal(result.switchActivated, true);
});

test('landing on a spring launches the player upward', () => {
  const player = { ...createPlayer({ x: 50, y: 174 }), vy: 220 };
  const result = gameCore.applyWorldInteractions(player, {
    springs: [{ id: 'spring-a', x: 50, y: 210, width: 42, height: 20 }],
    keys: [],
    gates: [],
    switches: [],
  });

  assert.equal(result.springActivated, true);
  assert.ok(result.player.vy <= -820);
});

test('only active platforms and closed gates are solid', () => {
  const solids = gameCore.getSolidPlatforms({
    platforms: [{ id: 'floor', x: 0, y: 220, width: 200, height: 40 }],
    movingPlatforms: [{ id: 'leaf', x: 20, y: 180, width: 80, height: 20 }],
    crumbles: [
      { id: 'active', x: 100, y: 160, width: 80, height: 20, active: true },
      { id: 'gone', x: 180, y: 160, width: 80, height: 20, active: false },
    ],
    gates: [
      { id: 'closed', x: 260, y: 100, width: 30, height: 120, open: false },
      { id: 'open', x: 320, y: 100, width: 30, height: 120, open: true },
    ],
  });

  assert.deepEqual(solids.map((solid) => solid.id), ['floor', 'leaf', 'active', 'closed']);
});

test('touching Moki mounts the player and removes the pickup', () => {
  const player = createPlayer({ x: 50, y: 50 });
  const result = gameCore.applyWorldInteractions(player, {
    springs: [], keys: [], gates: [], switches: [],
    mounts: [{ id: 'moki-1', x: 55, y: 50, width: 52, height: 46 }],
  });

  assert.equal(result.player.mounted, true);
  assert.equal(result.player.flutter, 0.7);
  assert.equal(result.mounts.length, 0);
  assert.equal(result.mountPicked, true);
});

test('Moki flutter reduces gravity while jump is held', () => {
  const level = { width: 600, height: 540, platforms: [] };
  const player = { ...createPlayer({ x: 50, y: 100 }), mounted: true, flutter: 0.5, vy: 120 };

  const next = stepPlayer(player, { jump: true }, level, 0.05);

  assert.ok(next.vy < 160);
  assert.ok(next.flutter < 0.5);
});

test('Moki tongue grabs nearby fruit and one small enemy', () => {
  const player = { ...createPlayer({ x: 50, y: 80 }), mounted: true, facing: 1 };
  const result = gameCore.resolveTongue(
    player,
    [
      { id: 'near', x: 105, y: 90, size: 18 },
      { id: 'far', x: 260, y: 90, size: 18 },
    ],
    [
      { id: 'bug', x: 135, y: 85, width: 30, height: 30, kind: 'beetle' },
      { id: 'boss', x: 145, y: 85, width: 40, height: 40, kind: 'boss' },
    ],
  );

  assert.equal(result.collected, 1);
  assert.equal(result.defeated, 1);
  assert.deepEqual(result.coins.map((coin) => coin.id), ['far']);
  assert.deepEqual(result.enemies.map((enemy) => enemy.id), ['boss']);
});

test('dismounting Moki preserves a safe player collider', () => {
  const player = { ...createPlayer({ x: 50, y: 80 }), mounted: true, flutter: 0.3 };

  const next = gameCore.dismountMoki(player);

  assert.equal(next.mounted, false);
  assert.equal(next.flutter, 0);
  assert.deepEqual(
    { x: next.x, y: next.y, width: next.width, height: next.height },
    { x: 50, y: 80, width: 34, height: 46 },
  );
});

test('normalizes malformed progress to a safe first-level state', () => {
  assert.deepEqual(parseProgress('not-json'), EMPTY_PROGRESS);
});

test('clamps and deduplicates stored progress', () => {
  assert.deepEqual(
    parseProgress(JSON.stringify({
      unlocked: 999,
      completed: [2, 2, -1, 19, 22],
      bestScores: { 2: 400, 19: 250, 22: 100, bad: 'nope' },
    })),
    {
      version: 2,
      unlocked: 20,
      completed: [2, 19],
      bestScores: { 2: 400, 19: 250 },
      goals: {},
      selectedHero: 'tavi',
      unlockedHeroes: ['tavi', 'nia', 'bo'],
    },
  );
});

test('migrates version 1 progress and unlocks heroes by completed worlds', () => {
  const progress = parseProgress(JSON.stringify({
    unlocked: 13,
    completed: Array.from({ length: 12 }, (_, index) => index),
    bestScores: { 3: 900, 11: 1400 },
  }));

  assert.equal(progress.version, 2);
  assert.deepEqual(progress.unlockedHeroes, ['tavi', 'nia', 'bo']);
  assert.equal(progress.selectedHero, 'tavi');
  assert.deepEqual(progress.bestScores, { 3: 900, 11: 1400 });
});

test('records fruit and medal goals without erasing earlier goals', () => {
  const first = advanceProgress(EMPTY_PROGRESS, 0, {
    finished: true,
    score: 500,
    goals: { fruit: true, medal: false },
  });
  const second = advanceProgress(first, 0, {
    finished: true,
    score: 450,
    goals: { fruit: false, medal: true },
  });

  assert.deepEqual(second.goals[0], { fruit: true, medal: true });
  assert.equal(second.bestScores[0], 500);
});

test('selects only heroes that progress has unlocked', () => {
  const locked = gameCore.selectHero(EMPTY_PROGRESS, 'nia');
  const unlocked = gameCore.selectHero(
    { ...EMPTY_PROGRESS, unlocked: 5, completed: [0, 1, 2, 3] },
    'nia',
  );

  assert.equal(locked.selectedHero, 'tavi');
  assert.equal(unlocked.selectedHero, 'nia');
  assert.deepEqual(unlocked.unlockedHeroes, ['tavi', 'nia']);
});

test('computes optional run goals from fruit and medal state', () => {
  assert.deepEqual(
    gameCore.computeRunGoals({ collectedCoins: 12, totalCoins: 12, medalCollected: true }),
    { fruit: true, medal: true },
  );
  assert.deepEqual(
    gameCore.computeRunGoals({ collectedCoins: 4, totalCoins: 12, medalCollected: false }),
    { fruit: false, medal: false },
  );
});

test('input exposes held controls and consumes one-frame presses', () => {
  const listeners = new Map();
  const target = {
    addEventListener: (name, listener) => listeners.set(name, listener),
    removeEventListener: (name) => listeners.delete(name),
  };
  const root = { querySelectorAll: () => [] };
  const input = createInput(target, root);
  const event = { key: 'x', preventDefault() {} };

  listeners.get('keydown')(event);
  const first = input.snapshot();
  const second = input.snapshot();
  listeners.get('keyup')(event);
  const released = input.snapshot();

  assert.equal(first.ability, true);
  assert.equal(first.abilityPressed, true);
  assert.equal(second.abilityPressed, false);
  assert.equal(released.ability, false);
  input.destroy();
});

test('does not unlock a level when the run ends in death', () => {
  assert.deepEqual(
    advanceProgress(
      { unlocked: 1, completed: [], bestScores: {} },
      0,
      { finished: false, score: 999 },
    ),
    EMPTY_PROGRESS,
  );
});

test('keeps the higher existing best score', () => {
  assert.deepEqual(
    advanceProgress(
      { unlocked: 2, completed: [0], bestScores: { 0: 1200 } },
      0,
      { finished: true, score: 300 },
    ),
    {
      version: 2,
      unlocked: 2,
      completed: [0],
      bestScores: { 0: 1200 },
      goals: { 0: { fruit: false, medal: false } },
      selectedHero: 'tavi',
      unlockedHeroes: ['tavi'],
    },
  );
});

test('treats touching rectangle edges as non-overlapping', () => {
  assert.equal(
    rectsOverlap({ x: 0, y: 0, width: 20, height: 20 }, { x: 20, y: 0, width: 10, height: 10 }),
    false,
  );
});

test('lands on a platform and can jump with a buffered input', () => {
  const level = {
    width: 600,
    height: 540,
    platforms: [{ x: 0, y: 220, width: 600, height: 40 }],
  };
  const falling = createPlayer({ x: 80, y: 160 });
  falling.vy = 500;

  const landed = stepPlayer(falling, {}, level, 0.2);
  assert.equal(landed.onGround, true);
  assert.equal(landed.y, 174);

  const jumped = stepPlayer(landed, { jump: true }, level, 1 / 60);
  assert.ok(jumped.vy < -400);
  assert.equal(jumped.onGround, false);
});

test('solid platforms stop horizontal movement at their side', () => {
  const level = {
    width: 600,
    height: 540,
    platforms: [
      { x: 0, y: 220, width: 600, height: 40 },
      { x: 100, y: 100, width: 40, height: 120 },
    ],
  };
  const player = createPlayer({ x: 65, y: 174 });
  player.vx = 280;
  player.onGround = true;

  const next = stepPlayer(player, { right: true }, level, 0.05);

  assert.equal(next.x + next.width, 100);
  assert.equal(next.vx, 0);
});

test('solid platforms stop upward movement at their underside', () => {
  const level = {
    width: 600,
    height: 540,
    platforms: [
      { x: 0, y: 220, width: 600, height: 40 },
      { x: 40, y: 100, width: 120, height: 20 },
    ],
  };
  const player = createPlayer({ x: 60, y: 140 });
  player.vy = -500;

  const next = stepPlayer(player, {}, level, 0.05);

  assert.equal(next.y, 120);
  assert.equal(next.vy, 0);
});

test('offers three original heroes with distinct movement traits', () => {
  const heroes = gameCore.getHeroes();

  assert.deepEqual(heroes.map((hero) => hero.id), ['tavi', 'nia', 'bo']);
  assert.equal(new Set(heroes.map((hero) => hero.ability)).size, 3);
});

test('Nia can spend one extra jump while airborne', () => {
  const level = { width: 600, height: 540, platforms: [] };
  const player = createPlayer({ x: 80, y: 120 }, 'nia');
  player.vy = 100;

  const next = stepPlayer(player, { jumpPressed: true }, level, 1 / 60);

  assert.ok(next.vy < -400);
  assert.equal(next.airJumps, 0);
});

test('Bo can start a fast ground pound while airborne', () => {
  const level = { width: 600, height: 540, platforms: [] };
  const player = createPlayer({ x: 80, y: 120 }, 'bo');

  const next = stepPlayer(player, { abilityPressed: true }, level, 1 / 60);

  assert.equal(next.groundPound, true);
  assert.ok(next.vy >= 780);
});

test('descending onto an enemy stomps it and bounces the player', () => {
  const previous = { ...createPlayer({ x: 50, y: 40 }), vy: 300 };
  const player = { ...previous, y: 60 };
  const enemy = { id: 'bug', x: 50, y: 90, width: 34, height: 30, health: 1 };

  const result = gameCore.resolveEnemyContacts(player, previous, [enemy]);

  assert.equal(result.stomped, 1);
  assert.equal(result.enemies.length, 0);
  assert.ok(result.player.vy < 0);
  assert.equal(result.damaged, false);
});

test('touching an enemy from the side damages the player', () => {
  const previous = createPlayer({ x: 50, y: 70 });
  const player = { ...previous, x: 62 };
  const enemy = { id: 'bug', x: 80, y: 70, width: 34, height: 30, health: 1 };

  const result = gameCore.resolveEnemyContacts(player, previous, [enemy]);

  assert.equal(result.stomped, 0);
  assert.equal(result.damaged, true);
  assert.equal(result.enemies.length, 1);
});

test('stomping the temple guardian removes one health without side damage', () => {
  const previous = { ...createPlayer({ x: 50, y: 34 }, 'bo'), vy: 500, groundPound: true };
  const player = { ...previous, y: 60 };
  const guardian = { id: 'guardian', x: 50, y: 90, width: 64, height: 60, health: 3, kind: 'boss' };

  const result = gameCore.resolveEnemyContacts(player, previous, [guardian]);

  assert.equal(result.stomped, 1);
  assert.equal(result.damaged, false);
  assert.equal(result.enemies[0].health, 2);
});

test('uses coyote time after leaving a platform edge', () => {
  const level = {
    width: 600,
    height: 540,
    platforms: [{ x: 0, y: 220, width: 120, height: 40 }],
  };
  const player = createPlayer({ x: 80, y: 174 });
  player.onGround = true;
  player.coyote = 0.08;
  player.x = 100;

  const jumped = stepPlayer(player, { right: true, jump: true }, level, 1 / 60);
  assert.ok(jumped.vy < -400);
});

test('respawns at the checkpoint and spends one life after death', () => {
  const player = createPlayer({ x: 30, y: 100 });
  player.checkpoint = { x: 320, y: 200 };
  player.lives = 3;
  const respawned = respawnAtCheckpoint(player);

  assert.deepEqual(
    { x: respawned.x, y: respawned.y, lives: respawned.lives, status: respawned.status },
    { x: 320, y: 200, lives: 2, status: 'playing' },
  );
});

test('gives the player a short safe window after respawn', () => {
  const player = createPlayer({ x: 30, y: 100 });
  player.checkpoint = { x: 320, y: 200 };
  const respawned = respawnAtCheckpoint(player);
  const outcome = getPlayerOutcome(
    { ...respawned, x: 430 },
    {
      height: 540,
      finish: { x: 900, y: 200, width: 40, height: 60 },
      hazards: [{ x: 430, y: 200, width: 40, height: 60 }],
    },
    [],
  );

  assert.ok(respawned.invulnerable > 0);
  assert.equal(outcome, 'playing');
});

test('patrol enemies reverse at their boundaries', () => {
  const enemies = stepEnemies(
    [{ x: 20, y: 100, width: 30, height: 30, minX: 0, maxX: 30, speed: 100, direction: 1 }],
    0.2,
  );

  assert.equal(enemies[0].direction, -1);
  assert.equal(enemies[0].x, 30);
});

test('finish wins before overlapping hazards', () => {
  const player = { x: 100, y: 100, width: 30, height: 40 };
  const outcome = getPlayerOutcome(
    player,
    {
      height: 540,
      finish: { x: 100, y: 100, width: 40, height: 60 },
      hazards: [{ x: 100, y: 100, width: 40, height: 60 }],
    },
    [],
  );

  assert.equal(outcome, 'finished');
});

test('storage adapter validates and persists progress without throwing', () => {
  const values = new Map();
  const fakeStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };

  saveProgress(fakeStorage, { unlocked: 4, completed: [0, 1, 2], bestScores: { 2: 740 } });
  assert.deepEqual(loadProgress(fakeStorage), {
    version: 2,
    unlocked: 4,
    completed: [0, 1, 2],
    bestScores: { 2: 740 },
    goals: {},
    selectedHero: 'tavi',
    unlockedHeroes: ['tavi'],
  });

  clearProgress(fakeStorage);
  assert.deepEqual(loadProgress(fakeStorage), EMPTY_PROGRESS);
});
