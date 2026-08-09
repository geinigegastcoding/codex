import { HEROES, LEVELS as CONTENT_LEVELS } from './game-content.js';

const PLAYER_HEIGHT = 46;
const clone = (value) => JSON.parse(JSON.stringify(value));

export const LEVELS = CONTENT_LEVELS;

export function getLevels() {
  return LEVELS.map(clone);
}

export function getLevel(index) {
  if (!Number.isInteger(index) || index < 0 || index >= LEVELS.length) {
    throw new RangeError('Level index must be between 0 and ' + (LEVELS.length - 1) + '.');
  }
  return clone(LEVELS[index]);
}

export function validateLevel(level) {
  const errors = [];
  if (!level || typeof level !== 'object') {
    return ['level must be an object'];
  }
  if (!Number.isFinite(level.width) || level.width <= 0 || !Number.isFinite(level.height) || level.height <= 0) {
    errors.push('level dimensions must be positive');
  }
  const anchors = ['spawn', 'checkpoint', 'finish'];
  for (const name of anchors) {
    const anchor = level[name];
    if (!anchor || !Number.isFinite(anchor.x) || !Number.isFinite(anchor.y)) {
      errors.push(name + ' is missing');
      continue;
    }
    const width = anchor.width || 1;
    const height = anchor.height || 1;
    if (anchor.x < 0 || anchor.y < 0 || anchor.x + width > level.width || anchor.y + height > level.height) {
      errors.push(name + ' is outside level bounds');
    }
  }
  if (level.finish?.x <= level.spawn?.x) {
    errors.push('finish must be after spawn');
  }
  const collections = [
    'platforms',
    'coins',
    'enemies',
    'hazards',
    'movingPlatforms',
    'springs',
    'crumbles',
    'keys',
    'gates',
    'switches',
    'medals',
    'mounts',
  ];
  const ids = new Set();
  for (const name of collections) {
    if (!Array.isArray(level[name])) {
      errors.push(name + ' must be an array');
      continue;
    }
    for (const item of level[name]) {
      const width = item.width || item.size;
      const height = item.height || item.size;
      if (!Number.isFinite(item.x) || !Number.isFinite(item.y) || !Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
        errors.push(name + ' contains invalid geometry');
      } else if (item.x < 0 || item.y < 0 || item.x + width > level.width || item.y + height > level.height) {
        errors.push(name + ' contains out-of-bounds geometry');
      }
      if (!item.id) {
        errors.push(name + ' contains an item without id');
      } else if (ids.has(item.id)) {
        errors.push('duplicate object id: ' + item.id);
      } else {
        ids.add(item.id);
      }
    }
  }
  return errors;
}

export function getHeroes() {
  return HEROES.map(clone);
}

export function getHero(id) {
  const hero = HEROES.find((entry) => entry.id === id);
  if (!hero) {
    throw new RangeError('Unknown hero: ' + id);
  }
  return clone(hero);
}

export function rectsOverlap(first, second) {
  return (
    first.x < second.x + second.width
    && first.x + first.width > second.x
    && first.y < second.y + second.height
    && first.y + first.height > second.y
  );
}

export function createPlayer(spawn, heroId = 'tavi') {
  const hero = getHero(heroId);
  return {
    x: spawn.x,
    y: spawn.y,
    width: 34,
    height: PLAYER_HEIGHT,
    vx: 0,
    vy: 0,
    onGround: false,
    coyote: 0,
    jumpBuffer: 0,
    invulnerable: 0,
    heroId: hero.id,
    facing: 1,
    airJumps: hero.airJumps,
    groundPound: false,
    mounted: false,
    flutter: 0,
    hasKey: false,
    checkpoint: { x: spawn.x, y: spawn.y },
    lives: 3,
    status: 'playing',
  };
}

export function resolvePlatformCollision(player, platforms, previousY) {
  const next = { ...player };
  const overlapsX = (platform) => (
    next.x < platform.x + platform.width
    && next.x + next.width > platform.x
  );
  if (next.vy >= 0) {
    const previousBottom = previousY + next.height;
    const nextBottom = next.y + next.height;
    const landing = platforms.find((platform) => (
      previousBottom <= platform.y + 4
      && nextBottom >= platform.y
      && overlapsX(platform)
    ));
    if (landing) {
      next.y = landing.y - next.height;
      next.vy = 0;
      next.onGround = true;
    }
  } else {
    const ceiling = platforms.find((platform) => (
      !platform.oneWay
      && previousY >= platform.y + platform.height
      && next.y <= platform.y + platform.height
      && overlapsX(platform)
    ));
    if (ceiling) {
      next.y = ceiling.y + ceiling.height;
      next.vy = 0;
    }
  }
  return next;
}

export function resolveHorizontalCollision(player, platforms, previousX) {
  const next = { ...player };
  const overlapsY = (platform) => (
    next.y < platform.y + platform.height
    && next.y + next.height > platform.y
  );
  if (next.vx > 0) {
    const previousRight = previousX + next.width;
    const nextRight = next.x + next.width;
    const wall = platforms.find((platform) => (
      !platform.oneWay
      && previousRight <= platform.x
      && nextRight >= platform.x
      && overlapsY(platform)
    ));
    if (wall) {
      next.x = wall.x - next.width;
      next.vx = 0;
    }
  } else if (next.vx < 0) {
    const previousLeft = previousX;
    const nextLeft = next.x;
    const wall = platforms.find((platform) => (
      !platform.oneWay
      && previousLeft >= platform.x + platform.width
      && nextLeft <= platform.x + platform.width
      && overlapsY(platform)
    ));
    if (wall) {
      next.x = wall.x + wall.width;
      next.vx = 0;
    }
  }
  return next;
}

export function stepPlayer(player, input, level, delta) {
  const dt = Math.min(Math.max(delta, 0), 0.05);
  const hero = getHero(player.heroId || 'tavi');
  const next = {
    ...player,
    checkpoint: { ...player.checkpoint },
    onGround: false,
    invulnerable: Math.max(0, (player.invulnerable || 0) - dt),
  };
  const direction = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  if (direction !== 0) {
    next.facing = direction;
  }
  const acceleration = direction === 0 ? 1900 : 1600;
  if (direction !== 0) {
    next.vx += direction * acceleration * dt;
  } else if (Math.abs(next.vx) <= acceleration * dt) {
    next.vx = 0;
  } else {
    next.vx -= Math.sign(next.vx) * acceleration * dt;
  }
  next.vx = Math.max(-hero.speed, Math.min(hero.speed, next.vx));
  next.coyote = player.onGround ? 0.1 : Math.max(0, player.coyote - dt);
  if (player.onGround) {
    next.airJumps = hero.airJumps;
    next.groundPound = false;
  }
  const jumpPressed = Boolean(input.jumpPressed ?? input.jump);
  next.jumpBuffer = jumpPressed ? 0.12 : Math.max(0, player.jumpBuffer - dt);
  if (next.jumpBuffer > 0 && (player.onGround || next.coyote > 0)) {
    next.vy = -hero.jump;
    next.onGround = false;
    next.coyote = 0;
    next.jumpBuffer = 0;
  } else if (jumpPressed && hero.ability === 'double-jump' && next.airJumps > 0) {
    next.vy = -hero.jump * 0.94;
    next.airJumps -= 1;
    next.jumpBuffer = 0;
  }
  if (input.abilityPressed && hero.ability === 'ground-pound' && !player.onGround) {
    next.groundPound = true;
    next.vy = 780;
    next.vx *= 0.35;
  }
  const previousX = next.x;
  next.x += next.vx * dt;
  next.x = Math.max(0, Math.min(level.width - next.width, next.x));
  Object.assign(next, resolveHorizontalCollision(next, level.platforms, previousX));
  const previousY = next.y;
  const fluttering = next.mounted && input.jump && next.vy > 0 && next.flutter > 0;
  if (fluttering) {
    next.flutter = Math.max(0, next.flutter - dt);
  }
  next.vy += (fluttering ? 520 : 1800) * dt;
  next.y += next.vy * dt;
  const landed = resolvePlatformCollision(next, level.platforms, previousY);
  if (landed.onGround) {
    landed.airJumps = hero.airJumps;
    landed.groundPound = false;
    if (landed.mounted) {
      landed.flutter = 0.7;
    }
  }
  landed.status = landed.y > level.height + 120 ? 'dead' : 'playing';
  return landed;
}

export function respawnAtCheckpoint(player) {
  if (player.lives <= 1) {
    return { ...player, lives: 0, status: 'dead' };
  }
  return {
    ...player,
    x: player.checkpoint.x,
    y: player.checkpoint.y,
    vx: 0,
    vy: 0,
    onGround: false,
    coyote: 0,
    jumpBuffer: 0,
    invulnerable: 6,
    mounted: false,
    flutter: 0,
    lives: player.lives - 1,
    status: 'playing',
  };
}

export function stepEnemies(enemies, delta) {
  return enemies.map((enemy) => {
    const next = { ...enemy };
    const direction = next.direction || 1;
    next.x += (next.speed || 40) * direction * delta;
    if (next.x <= next.minX) {
      next.x = next.minX;
      next.direction = 1;
    } else if (next.x >= next.maxX) {
      next.x = next.maxX;
      next.direction = -1;
    }
    return next;
  });
}

export function stepMovingPlatforms(platforms, elapsed) {
  return platforms.map((platform) => {
    const wave = Math.sin(elapsed * (platform.speed || 1) + (platform.phase || 0));
    return {
      ...platform,
      x: platform.baseX + (platform.rangeX || 0) * wave,
      y: platform.baseY + (platform.rangeY || 0) * wave,
    };
  });
}

export function stepCrumblePlatforms(platforms, player, delta) {
  return platforms.map((platform) => {
    if (!platform.active) {
      return { ...platform };
    }
    const standing = player.y + player.height >= platform.y - 2
      && player.y + player.height <= platform.y + 5
      && player.x < platform.x + platform.width
      && player.x + player.width > platform.x;
    const timer = standing ? (platform.timer || 0) + Math.max(0, delta) : platform.timer || 0;
    return { ...platform, timer, active: timer < 0.55 };
  });
}

export function getSolidPlatforms(world) {
  return [
    ...(world.platforms || []),
    ...(world.movingPlatforms || []),
    ...(world.crumbles || []).filter((platform) => platform.active),
    ...(world.gates || []).filter((gate) => !gate.open),
  ];
}

export function applyWorldInteractions(player, world) {
  const nextPlayer = { ...player };
  let springActivated = false;
  for (const spring of world.springs || []) {
    if (nextPlayer.vy >= 0 && rectsOverlap(nextPlayer, spring)) {
      nextPlayer.y = spring.y - nextPlayer.height;
      nextPlayer.vy = -840;
      nextPlayer.onGround = false;
      nextPlayer.groundPound = false;
      springActivated = true;
      break;
    }
  }

  const openedGateIds = new Set();
  let keyCollected = false;
  const keys = (world.keys || []).filter((key) => {
    if (!rectsOverlap(nextPlayer, key)) {
      return true;
    }
    keyCollected = true;
    openedGateIds.add(key.gateId);
    return false;
  }).map((key) => ({ ...key }));
  nextPlayer.hasKey ||= keyCollected;

  let switchActivated = false;
  const switches = (world.switches || []).map((item) => {
    const active = item.active || rectsOverlap(nextPlayer, item);
    if (active && !item.active) {
      switchActivated = true;
    }
    if (active) {
      openedGateIds.add(item.gateId);
    }
    return { ...item, active };
  });
  const gates = (world.gates || []).map((gate) => ({
    ...gate,
    open: gate.open || openedGateIds.has(gate.id),
  }));

  let mountPicked = false;
  const mounts = (world.mounts || []).filter((mount) => {
    if (nextPlayer.mounted || !rectsOverlap(nextPlayer, mount)) {
      return true;
    }
    nextPlayer.mounted = true;
    nextPlayer.flutter = 0.7;
    mountPicked = true;
    return false;
  }).map((mount) => ({ ...mount }));

  return {
    player: nextPlayer,
    keys,
    gates,
    switches,
    mounts,
    springActivated,
    keyCollected,
    switchActivated,
    mountPicked,
  };
}

export function resolveEnemyContacts(player, previousPlayer, enemies) {
  const nextPlayer = { ...player };
  const remaining = [];
  let stomped = 0;
  let damaged = false;
  for (const enemy of enemies) {
    if (!rectsOverlap(nextPlayer, enemy)) {
      remaining.push({ ...enemy });
      continue;
    }
    const previousBottom = previousPlayer.y + previousPlayer.height;
    const currentBottom = nextPlayer.y + nextPlayer.height;
    const landedFromAbove = nextPlayer.vy > 0
      && previousBottom <= enemy.y + 6
      && currentBottom >= enemy.y;
    if (landedFromAbove) {
      stomped += 1;
      nextPlayer.y = enemy.y - nextPlayer.height;
      nextPlayer.vy = nextPlayer.groundPound ? -560 : -420;
      nextPlayer.groundPound = false;
      if ((enemy.health || 1) > 1) {
        remaining.push({ ...enemy, health: enemy.health - 1 });
      }
    } else {
      remaining.push({ ...enemy });
      damaged ||= (nextPlayer.invulnerable || 0) <= 0;
    }
  }
  return { player: nextPlayer, enemies: remaining, stomped, damaged };
}

export function getPlayerOutcome(player, level, enemies = []) {
  if (level.finish && rectsOverlap(player, level.finish)) {
    return 'finished';
  }
  if (
    ((player.invulnerable || 0) <= 0
      && (level.hazards.some((hazard) => rectsOverlap(player, hazard))
        || enemies.some((enemy) => rectsOverlap(player, enemy))))
    || player.y > level.height + 120
  ) {
    return 'dead';
  }
  return 'playing';
}

export function collectCoins(player, coins) {
  let collected = 0;
  const remaining = coins.filter((coin) => {
    const hit = rectsOverlap(player, {
      x: coin.x,
      y: coin.y,
      width: coin.size,
      height: coin.size,
    });
    if (hit) {
      collected += 1;
    }
    return !hit;
  });
  return { coins: remaining, collected };
}

export function collectMedal(player, medal) {
  if (!medal || !rectsOverlap(player, medal)) {
    return { medal: medal ? { ...medal } : null, collected: false };
  }
  return { medal: null, collected: true };
}

export function resolveTongue(player, coins, enemies) {
  if (!player.mounted) {
    return {
      coins: coins.map((coin) => ({ ...coin })),
      enemies: enemies.map((enemy) => ({ ...enemy })),
      collected: 0,
      defeated: 0,
    };
  }
  const facing = player.facing < 0 ? -1 : 1;
  const reach = {
    x: facing > 0 ? player.x + player.width : player.x - 112,
    y: player.y + 7,
    width: 112,
    height: 32,
  };
  let collected = 0;
  const remainingCoins = coins.filter((coin) => {
    const hit = rectsOverlap(reach, { x: coin.x, y: coin.y, width: coin.size, height: coin.size });
    collected += hit ? 1 : 0;
    return !hit;
  }).map((coin) => ({ ...coin }));
  let defeated = 0;
  const remainingEnemies = enemies.filter((enemy) => {
    const hit = defeated === 0 && enemy.kind !== 'boss' && rectsOverlap(reach, enemy);
    defeated += hit ? 1 : 0;
    return !hit;
  }).map((enemy) => ({ ...enemy }));
  return { coins: remainingCoins, enemies: remainingEnemies, collected, defeated };
}

export function dismountMoki(player) {
  return { ...player, mounted: false, flutter: 0 };
}

const HERO_ORDER = ['tavi', 'nia', 'bo'];
const emptyProgress = () => ({
  version: 2,
  unlocked: 1,
  completed: [],
  bestScores: {},
  goals: {},
  selectedHero: 'tavi',
  unlockedHeroes: ['tavi'],
});

export function getUnlockedHeroIds(progress) {
  const unlocked = Number.isFinite(progress?.unlocked) ? progress.unlocked : 1;
  const completed = Array.isArray(progress?.completed) ? progress.completed : [];
  const stored = Array.isArray(progress?.unlockedHeroes) ? progress.unlockedHeroes : [];
  const result = new Set(['tavi']);
  stored.filter((id) => HERO_ORDER.includes(id)).forEach((id) => result.add(id));
  if (unlocked >= 5 || completed.some((index) => index >= 3)) {
    result.add('nia');
  }
  if (unlocked >= 13 || completed.some((index) => index >= 11)) {
    result.add('bo');
  }
  return HERO_ORDER.filter((id) => result.has(id));
}

export function selectHero(progress, heroId) {
  const next = parseProgress(progress);
  next.selectedHero = next.unlockedHeroes.includes(heroId) ? heroId : next.selectedHero;
  return next;
}

export function computeRunGoals(run) {
  return {
    fruit: run.totalCoins > 0 && run.collectedCoins >= run.totalCoins,
    medal: run.medalCollected === true,
  };
}

export function parseProgress(raw) {
  let value = raw;
  if (typeof raw === 'string') {
    try {
      value = JSON.parse(raw);
    } catch {
      return emptyProgress();
    }
  }
  if (!value || typeof value !== 'object') {
    return emptyProgress();
  }
  const unlocked = Number.isFinite(value.unlocked)
    ? Math.max(1, Math.min(20, Math.floor(value.unlocked)))
    : 1;
  const completed = Array.isArray(value.completed)
    ? [...new Set(value.completed.filter((index) => Number.isInteger(index) && index >= 0 && index < 20))].sort((a, b) => a - b)
    : [];
  const bestScores = {};
  if (value.bestScores && typeof value.bestScores === 'object') {
    for (const [key, score] of Object.entries(value.bestScores)) {
      const index = Number(key);
      if (Number.isInteger(index) && index >= 0 && index < 20 && Number.isFinite(score) && score >= 0) {
        bestScores[index] = Math.floor(score);
      }
    }
  }
  const goals = {};
  if (value.goals && typeof value.goals === 'object') {
    for (const [key, goal] of Object.entries(value.goals)) {
      const index = Number(key);
      if (Number.isInteger(index) && index >= 0 && index < 20 && goal && typeof goal === 'object') {
        goals[index] = { fruit: goal.fruit === true, medal: goal.medal === true };
      }
    }
  }
  const unlockedHeroes = getUnlockedHeroIds({ unlocked, completed, unlockedHeroes: value.unlockedHeroes });
  const selectedHero = unlockedHeroes.includes(value.selectedHero) ? value.selectedHero : 'tavi';
  return {
    version: 2,
    unlocked,
    completed,
    bestScores,
    goals,
    selectedHero,
    unlockedHeroes,
  };
}

export function serializeProgress(progress) {
  return JSON.stringify(parseProgress(progress));
}

export function advanceProgress(progress, levelIndex, result) {
  const current = parseProgress(progress);
  if (!result?.finished || !Number.isInteger(levelIndex) || levelIndex < 0 || levelIndex >= 20) {
    return current;
  }
  const completed = [...new Set([...current.completed, levelIndex])].sort((a, b) => a - b);
  const score = Number.isFinite(result.score) ? Math.max(0, Math.floor(result.score)) : 0;
  const bestScores = { ...current.bestScores };
  if (bestScores[levelIndex] === undefined || score > bestScores[levelIndex]) {
    bestScores[levelIndex] = score;
  }
  const previousGoals = current.goals[levelIndex] || { fruit: false, medal: false };
  const goals = {
    ...current.goals,
    [levelIndex]: {
      fruit: previousGoals.fruit || result.goals?.fruit === true,
      medal: previousGoals.medal || result.goals?.medal === true,
    },
  };
  const next = {
    version: 2,
    unlocked: Math.max(current.unlocked, Math.min(20, levelIndex + 2)),
    completed,
    bestScores,
    goals,
    selectedHero: current.selectedHero,
    unlockedHeroes: current.unlockedHeroes,
  };
  next.unlockedHeroes = getUnlockedHeroIds(next);
  if (!next.unlockedHeroes.includes(next.selectedHero)) {
    next.selectedHero = 'tavi';
  }
  return next;
}

const invalidBuiltInLevels = LEVELS.flatMap((level) => (
  validateLevel(level).map((error) => 'Level ' + level.id + ': ' + error)
));
if (invalidBuiltInLevels.length > 0) {
  throw new Error('Invalid built-in level data:\n' + invalidBuiltInLevels.join('\n'));
}
