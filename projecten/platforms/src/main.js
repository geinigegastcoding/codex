import {
  advanceProgress,
  applyWorldInteractions,
  collectCoins,
  collectMedal,
  computeRunGoals,
  createPlayer,
  dismountMoki,
  getHeroes,
  getLevel,
  getLevels,
  getPlayerOutcome,
  getSolidPlatforms,
  rectsOverlap,
  resolveEnemyContacts,
  resolveTongue,
  respawnAtCheckpoint,
  selectHero,
  stepCrumblePlatforms,
  stepEnemies,
  stepMovingPlatforms,
  stepPlayer,
} from './game-core.js';
import { clearProgress, loadProgress, saveProgress } from './storage.js';
import { createInput } from './input.js';
import { createRenderer } from './game-renderer.js';

const dom = {
  home: document.querySelector('#home-screen'),
  levels: document.querySelector('#levels-screen'),
  game: document.querySelector('#game-screen'),
  result: document.querySelector('#result-screen'),
  start: document.querySelector('#start-button'),
  how: document.querySelector('#how-button'),
  howDialog: document.querySelector('#how-dialog'),
  closeHow: document.querySelector('#close-how-button'),
  backHome: document.querySelector('#back-home-button'),
  backLevels: document.querySelector('#back-levels-button'),
  heroGrid: document.querySelector('#hero-grid'),
  levelGrid: document.querySelector('#level-grid'),
  progressSummary: document.querySelector('#progress-summary'),
  resetProgress: document.querySelector('#reset-progress-button'),
  canvas: document.querySelector('#game-canvas'),
  gameWorld: document.querySelector('#game-world'),
  gameTitle: document.querySelector('#game-title'),
  levelTip: document.querySelector('#level-tip'),
  score: document.querySelector('#score-value'),
  coins: document.querySelector('#coins-value'),
  quest: document.querySelector('#quest-value'),
  lives: document.querySelector('#lives-value'),
  status: document.querySelector('#game-status'),
  pause: document.querySelector('#pause-button'),
  resume: document.querySelector('#resume-button'),
  pauseCard: document.querySelector('#game-pause-card'),
  mute: document.querySelector('#mute-button'),
  resultKicker: document.querySelector('#result-kicker'),
  resultTitle: document.querySelector('#result-title'),
  resultCopy: document.querySelector('#result-copy'),
  resultScore: document.querySelector('#result-score'),
  resultCoins: document.querySelector('#result-coins'),
  resultTime: document.querySelector('#result-time'),
  resultGoals: document.querySelector('#result-goals'),
  resultSticker: document.querySelector('#result-sticker'),
  nextLevel: document.querySelector('#next-level-button'),
  retry: document.querySelector('#retry-button'),
  resultLevels: document.querySelector('#result-levels-button'),
};

const storage = (() => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
})();

const input = createInput(window, document);
const renderer = createRenderer(dom.canvas);
const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
const levels = getLevels();
const heroes = getHeroes();

const state = {
  screen: 'home',
  progress: loadProgress(storage),
  levelIndex: 0,
  level: null,
  player: null,
  coins: [],
  totalCoins: 0,
  collectedCoins: 0,
  enemies: [],
  movingPlatforms: [],
  crumbles: [],
  springs: [],
  keys: [],
  gates: [],
  switches: [],
  mounts: [],
  medal: null,
  medalCollected: false,
  score: 0,
  elapsed: 0,
  checkpointTouched: false,
  paused: false,
  finished: false,
  result: null,
  flash: 0,
  tongue: 0,
  soundEnabled: false,
  debugHitboxes: false,
};

let audioContext;

const formatScore = (value) => String(Math.max(0, Math.floor(value))).padStart(4, '0');

function formatTime(seconds) {
  const total = Math.max(0, Math.floor(seconds));
  return String(Math.floor(total / 60)).padStart(2, '0') + ':' + String(total % 60).padStart(2, '0');
}

function setStatus(message) {
  dom.status.textContent = message;
}

function showScreen(name) {
  const screens = { home: dom.home, levels: dom.levels, game: dom.game, result: dom.result };
  for (const [key, screen] of Object.entries(screens)) {
    const active = key === name;
    screen.hidden = !active;
    screen.classList.toggle('screen--active', active);
  }
  state.screen = name;
  if (name === 'game') {
    window.requestAnimationFrame(() => renderer.resize());
  }
}

function updateProgressSummary() {
  const goals = Object.values(state.progress.goals).reduce((count, goal) => (
    count + (goal.fruit ? 1 : 0) + (goal.medal ? 1 : 0)
  ), 0);
  dom.progressSummary.textContent = state.progress.completed.length
    + ' van 20 levels voltooid · ' + goals + ' extra doelen';
}

function buildHeroButton(hero) {
  const unlocked = state.progress.unlockedHeroes.includes(hero.id);
  const selected = state.progress.selectedHero === hero.id;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'hero-button' + (selected ? ' hero-button--selected' : '') + (!unlocked ? ' hero-button--locked' : '');
  button.dataset.hero = hero.id;
  button.disabled = !unlocked;
  button.style.setProperty('--hero-primary', hero.colors[0]);
  button.style.setProperty('--hero-secondary', hero.colors[1]);
  button.setAttribute('aria-pressed', String(selected));

  const portrait = document.createElement('span');
  portrait.className = 'hero-portrait hero-portrait--' + hero.id;
  portrait.setAttribute('aria-hidden', 'true');
  const copy = document.createElement('span');
  copy.className = 'hero-button-copy';
  const name = document.createElement('strong');
  name.textContent = hero.name;
  const title = document.createElement('small');
  title.textContent = unlocked ? hero.title : hero.id === 'nia' ? 'Vrij na wereld 1' : 'Vrij na wereld 3';
  copy.append(name, title);
  const marker = document.createElement('span');
  marker.className = 'hero-marker';
  marker.textContent = selected ? '✓' : unlocked ? '→' : '•';
  marker.setAttribute('aria-hidden', 'true');
  button.append(portrait, copy, marker);
  return button;
}

function renderHeroes() {
  dom.heroGrid.replaceChildren(...heroes.map(buildHeroButton));
}

function buildLevelButton(level, index) {
  const button = document.createElement('button');
  const unlocked = index + 1 <= state.progress.unlocked;
  const completed = state.progress.completed.includes(index);
  const goals = state.progress.goals[index] || { fruit: false, medal: false };
  button.type = 'button';
  button.className = 'level-button' + (completed ? ' level-button--complete' : '') + (!unlocked ? ' level-button--locked' : '');
  button.disabled = !unlocked;
  button.dataset.level = String(index);

  const number = document.createElement('span');
  number.className = 'level-number';
  number.textContent = String(index + 1).padStart(2, '0');
  const name = document.createElement('span');
  name.className = 'level-name';
  name.textContent = level.name;
  const meta = document.createElement('span');
  meta.className = 'level-meta';
  meta.textContent = completed
    ? 'Beste ' + formatScore(state.progress.bestScores[index] || 0)
    : unlocked ? 'Klaar voor jou' : 'Nog vergrendeld';
  const goalRow = document.createElement('span');
  goalRow.className = 'level-goals';
  goalRow.textContent = (goals.fruit ? '●' : '○') + ' fruit  ' + (goals.medal ? '◆' : '◇') + ' zon';
  const icon = document.createElement('span');
  icon.className = 'level-icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = completed ? '✓' : unlocked ? '→' : '•';
  button.append(number, name, meta, goalRow, icon);
  return button;
}

function renderLevels() {
  renderHeroes();
  dom.levelGrid.replaceChildren();
  let currentWorld = '';
  levels.forEach((level, index) => {
    if (level.world !== currentWorld) {
      currentWorld = level.world;
      const worldHeading = document.createElement('div');
      worldHeading.className = 'world-heading';
      const kicker = document.createElement('span');
      kicker.className = 'world-kicker';
      kicker.textContent = 'WERELD ' + (level.worldIndex + 1);
      const name = document.createElement('strong');
      name.textContent = level.world;
      worldHeading.append(kicker, name);
      dom.levelGrid.append(worldHeading);
    }
    dom.levelGrid.append(buildLevelButton(level, index));
  });
  updateProgressSummary();
}

function updateHud() {
  if (!state.level || !state.player) {
    return;
  }
  dom.score.textContent = formatScore(state.score);
  dom.coins.textContent = state.collectedCoins + '/' + state.totalCoins;
  dom.lives.textContent = '♥'.repeat(Math.max(0, state.player.lives)) + '♡'.repeat(Math.max(0, 3 - state.player.lives));
  const quest = [state.medalCollected ? '◆' : '◇'];
  if (state.player.hasKey) quest.push('SLEUTEL');
  if (state.player.mounted) quest.push('MOKI');
  dom.quest.textContent = quest.join(' · ');
  dom.gameWorld.textContent = state.level.world.toUpperCase();
  dom.gameTitle.textContent = 'Level ' + state.level.id + ' · ' + state.level.name;
  dom.levelTip.textContent = state.level.tip;
}

function playTone(frequency, duration = 0.08) {
  if (!state.soundEnabled) {
    return;
  }
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    audioContext ||= new AudioContextClass();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.frequency.value = frequency;
    oscillator.type = 'triangle';
    gain.gain.setValueAtTime(0.055, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  } catch {
    state.soundEnabled = false;
  }
}

function startLevel(index) {
  if (index < 0 || index >= levels.length || index + 1 > state.progress.unlocked) {
    return;
  }
  state.levelIndex = index;
  state.level = getLevel(index);
  state.player = createPlayer(state.level.spawn, state.progress.selectedHero);
  state.player.onGround = true;
  state.coins = state.level.coins.map((coin) => ({ ...coin }));
  state.totalCoins = state.coins.length;
  state.collectedCoins = 0;
  state.enemies = state.level.enemies.map((enemy) => ({ ...enemy }));
  state.movingPlatforms = state.level.movingPlatforms.map((platform) => ({ ...platform }));
  state.crumbles = state.level.crumbles.map((platform) => ({ ...platform }));
  state.springs = state.level.springs.map((spring) => ({ ...spring }));
  state.keys = state.level.keys.map((key) => ({ ...key }));
  state.gates = state.level.gates.map((gate) => ({ ...gate }));
  state.switches = state.level.switches.map((item) => ({ ...item }));
  state.mounts = state.level.mounts.map((mount) => ({ ...mount }));
  state.medal = state.level.medals[0] ? { ...state.level.medals[0] } : null;
  state.medalCollected = false;
  state.score = 0;
  state.elapsed = 0;
  state.checkpointTouched = false;
  state.paused = false;
  state.finished = false;
  state.result = null;
  state.flash = 0;
  state.tongue = 0;
  dom.pauseCard.hidden = true;
  showScreen('game');
  updateHud();
  const hero = heroes.find((entry) => entry.id === state.player.heroId);
  setStatus('Level ' + state.level.id + '. ' + hero.name + ' is klaar voor vertrek.');
  playTone(420, 0.1);
}

function openLevels() {
  renderLevels();
  showScreen('levels');
}

function renderResultGoals(goals) {
  const items = [
    ['Finish', true],
    ['Alle fruit', goals.fruit],
    ['Zonnemedaille', goals.medal],
  ];
  dom.resultGoals.replaceChildren(...items.map(([label, complete]) => {
    const item = document.createElement('span');
    item.className = 'result-goal' + (complete ? ' result-goal--complete' : '');
    item.textContent = (complete ? '✓ ' : '○ ') + label;
    return item;
  }));
}

function finishRun(finished) {
  state.finished = true;
  state.paused = true;
  const goals = computeRunGoals(state);
  const finalScore = finished
    ? state.score + Math.max(0, 1600 - Math.floor(state.elapsed * 32)) + state.player.lives * 150
    : state.score;
  state.result = { finished, score: finalScore, goals };
  let unlockCopy = '';
  if (finished) {
    const previousHeroes = new Set(state.progress.unlockedHeroes);
    state.progress = advanceProgress(state.progress, state.levelIndex, state.result);
    saveProgress(storage, state.progress);
    const newHero = state.progress.unlockedHeroes.find((id) => !previousHeroes.has(id));
    if (newHero) {
      unlockCopy = ' ' + heroes.find((hero) => hero.id === newHero).name + ' is vrijgespeeld!';
    }
    playTone(720, 0.18);
    renderer.burst(state.player.x + 20, state.player.y + 20, '#f5cc4c', 18);
  }
  dom.resultKicker.textContent = finished ? 'LEVEL VOLTOOID' : 'JUNGLE RESET';
  dom.resultTitle.textContent = finished ? 'Padmeester!' : 'Bijna daar.';
  dom.resultCopy.textContent = finished
    ? 'Je hebt ' + state.level.name + ' doorkruist.' + unlockCopy
    : 'De jungle onthoudt je route. Probeer het nog een keer.';
  dom.resultSticker.textContent = finished ? '✦' : '↻';
  dom.resultSticker.classList.toggle('result-sticker--fail', !finished);
  dom.resultScore.textContent = formatScore(finalScore);
  dom.resultCoins.textContent = state.collectedCoins + '/' + state.totalCoins;
  dom.resultTime.textContent = formatTime(state.elapsed);
  renderResultGoals(goals);
  dom.nextLevel.hidden = !finished || state.levelIndex >= levels.length - 1;
  showScreen('result');
}

function loseLife(message) {
  state.flash = 0.6;
  renderer.burst(state.player.x + 17, state.player.y + 20, '#f16f79', 12);
  state.player = respawnAtCheckpoint(state.player);
  playTone(160, 0.12);
  if (state.player.status === 'dead') {
    finishRun(false);
    return true;
  }
  setStatus(message + ' Nog ' + state.player.lives + ' levens over.');
  return false;
}

function tick(delta) {
  if (!state.level || state.paused || state.finished) {
    return;
  }
  state.elapsed += delta;
  state.flash = Math.max(0, state.flash - delta);
  state.tongue = Math.max(0, state.tongue - delta);
  const controls = input.snapshot();

  if (controls.down && controls.abilityPressed && state.player.mounted) {
    state.player = dismountMoki(state.player);
    controls.abilityPressed = false;
    setStatus('Je bent van Moki afgestapt.');
  }

  state.movingPlatforms = stepMovingPlatforms(state.movingPlatforms, state.elapsed);
  state.crumbles = stepCrumblePlatforms(state.crumbles, state.player, delta);
  const solids = getSolidPlatforms({
    platforms: state.level.platforms,
    movingPlatforms: state.movingPlatforms,
    crumbles: state.crumbles,
    gates: state.gates,
  });
  const previousPlayer = { ...state.player };
  state.player = stepPlayer(state.player, controls, { ...state.level, platforms: solids }, delta);

  const interactions = applyWorldInteractions(state.player, {
    springs: state.springs,
    keys: state.keys,
    gates: state.gates,
    switches: state.switches,
    mounts: state.mounts,
  });
  state.player = interactions.player;
  state.keys = interactions.keys;
  state.gates = interactions.gates;
  state.switches = interactions.switches;
  state.mounts = interactions.mounts;
  if (interactions.springActivated) {
    renderer.burst(state.player.x + 17, state.player.y + state.player.height, '#ffdf54', 8);
    playTone(680, 0.08);
  }
  if (interactions.keyCollected || interactions.switchActivated) {
    renderer.burst(state.player.x + 17, state.player.y + 18, '#74e0c6', 12);
    setStatus(interactions.keyCollected ? 'Sleutel gevonden. De poort is open.' : 'Schakelaar geactiveerd.');
    playTone(610, 0.1);
  }
  if (interactions.mountPicked) {
    renderer.burst(state.player.x + 20, state.player.y + 28, '#9ee45e', 16);
    setStatus('Moki helpt mee! X gebruikt zijn tong; houd springen vast om te fladderen.');
    playTone(760, 0.12);
  }

  if (controls.abilityPressed && state.player.mounted) {
    const tongue = resolveTongue(state.player, state.coins, state.enemies);
    state.coins = tongue.coins;
    state.enemies = tongue.enemies;
    state.collectedCoins += tongue.collected;
    state.score += tongue.collected * 100 + tongue.defeated * 250;
    state.tongue = 0.18;
    if (tongue.collected || tongue.defeated) {
      renderer.burst(state.player.x + state.player.facing * 80, state.player.y + 18, '#f18b9c', 9);
      playTone(590, 0.07);
    }
  }

  state.enemies = stepEnemies(state.enemies, delta);
  const enemyContact = resolveEnemyContacts(state.player, previousPlayer, state.enemies);
  state.player = enemyContact.player;
  state.enemies = enemyContact.enemies;
  if (enemyContact.stomped > 0) {
    state.score += enemyContact.stomped * 250;
    renderer.burst(state.player.x + 17, state.player.y + state.player.height, '#ffcf54', 10);
    playTone(470, 0.06);
  }
  if (enemyContact.damaged && loseLife('Een junglebewoner raakte je.')) {
    return;
  }

  const coinResult = collectCoins(state.player, state.coins);
  if (coinResult.collected > 0) {
    state.coins = coinResult.coins;
    state.collectedCoins += coinResult.collected;
    state.score += coinResult.collected * 100;
    renderer.burst(state.player.x + 17, state.player.y + 18, '#f5cc4c', 8);
    playTone(560, 0.06);
  }

  const medalResult = collectMedal(state.player, state.medal);
  if (medalResult.collected) {
    state.medal = null;
    state.medalCollected = true;
    state.score += 750;
    renderer.burst(state.player.x + 17, state.player.y + 18, '#fff3a5', 18);
    setStatus('Zonnemedaille gevonden!');
    playTone(820, 0.14);
  }

  if (!state.checkpointTouched && rectsOverlap(state.player, state.level.checkpoint)) {
    state.checkpointTouched = true;
    state.player = {
      ...state.player,
      checkpoint: { x: state.level.checkpoint.x, y: state.level.checkpoint.y },
    };
    renderer.burst(state.level.checkpoint.x + 12, state.level.checkpoint.y + 10, '#f5cc4c', 12);
    setStatus('Checkpoint bereikt. Je respawnt hier.');
    playTone(640, 0.1);
  }

  const outcome = getPlayerOutcome(state.player, state.level, []);
  if (outcome === 'finished') {
    const guardianAlive = state.enemies.some((enemy) => enemy.kind === 'boss');
    if (!guardianAlive) {
      finishRun(true);
      return;
    }
    setStatus('De tempelwachter bewaakt de finish nog.');
  }
  if (outcome === 'dead' && loseLife('Oeps.')) {
    return;
  }
  updateHud();
}

function togglePause() {
  if (state.screen !== 'game' || state.finished) {
    return;
  }
  state.paused = !state.paused;
  dom.pauseCard.hidden = !state.paused;
  dom.pause.setAttribute('aria-label', state.paused ? 'Verder spelen' : 'Pauzeren');
  setStatus(state.paused ? 'Gepauzeerd.' : 'Verder spelen.');
}

function toggleMute() {
  state.soundEnabled = !state.soundEnabled;
  dom.mute.textContent = state.soundEnabled ? '♫' : '×';
  dom.mute.setAttribute('aria-label', state.soundEnabled ? 'Geluid uit' : 'Geluid aan');
  if (state.soundEnabled) {
    playTone(480, 0.08);
  }
}

function loop(now) {
  const delta = Math.min(0.05, Math.max(0, (now - (loop.last || now)) / 1000));
  loop.last = now;
  if (state.screen === 'game' && state.level && state.player) {
    tick(delta);
    renderer.render({
      level: state.level,
      player: state.player,
      coins: state.coins,
      enemies: state.enemies,
      movingPlatforms: state.movingPlatforms,
      crumbles: state.crumbles,
      springs: state.springs,
      keys: state.keys,
      gates: state.gates,
      switches: state.switches,
      mounts: state.mounts,
      medal: state.medal,
      elapsed: state.elapsed,
      delta,
      checkpointTouched: state.checkpointTouched,
      paused: state.paused,
      result: state.result,
      flash: state.flash,
      tongue: state.tongue,
      debugHitboxes: state.debugHitboxes,
      reduceMotion,
    });
  }
  window.requestAnimationFrame(loop);
}

dom.start.addEventListener('click', openLevels);
dom.how.addEventListener('click', () => dom.howDialog.showModal());
dom.closeHow.addEventListener('click', () => dom.howDialog.close());
dom.backHome.addEventListener('click', () => showScreen('home'));
dom.backLevels.addEventListener('click', openLevels);
dom.heroGrid.addEventListener('click', (event) => {
  const button = event.target.closest('[data-hero]');
  if (!button || button.disabled) return;
  state.progress = selectHero(state.progress, button.dataset.hero);
  saveProgress(storage, state.progress);
  renderHeroes();
  setStatus(heroes.find((hero) => hero.id === state.progress.selectedHero).name + ' is gekozen.');
});
dom.levelGrid.addEventListener('click', (event) => {
  const button = event.target.closest('[data-level]');
  if (button) {
    startLevel(Number(button.dataset.level));
  }
});
dom.resetProgress.addEventListener('click', () => {
  state.progress = clearProgress(storage);
  renderLevels();
  setStatus('Voortgang gewist.');
});
dom.pause.addEventListener('click', togglePause);
dom.resume.addEventListener('click', togglePause);
dom.mute.addEventListener('click', toggleMute);
dom.retry.addEventListener('click', () => startLevel(state.levelIndex));
dom.resultLevels.addEventListener('click', openLevels);
dom.nextLevel.addEventListener('click', () => {
  if (state.levelIndex < levels.length - 1 && state.result?.finished) {
    startLevel(state.levelIndex + 1);
  } else {
    openLevels();
  }
});
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && state.screen === 'game') {
    togglePause();
  }
  if ((event.key === 'r' || event.key === 'R') && state.screen === 'game' && !state.finished) {
    startLevel(state.levelIndex);
  }
  if ((event.key === 'm' || event.key === 'M') && state.screen === 'game') {
    toggleMute();
  }
  if ((event.key === 'h' || event.key === 'H') && state.screen === 'game') {
    state.debugHitboxes = !state.debugHitboxes;
    setStatus('Hitboxweergave ' + (state.debugHitboxes ? 'aan.' : 'uit.'));
  }
});
window.addEventListener('resize', () => {
  if (state.screen === 'game') {
    renderer.resize();
  }
});

renderLevels();
showScreen('home');
window.requestAnimationFrame(loop);
