import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowUpRight,
  ArrowsClockwise,
  Bread,
  Check,
  ChefHat,
  Clock,
  Lightning,
  Sparkle,
  Storefront,
} from '@phosphor-icons/react';
import { useEffect, useMemo, useState } from 'react';
import {
  buyUpgrade,
  clickBread,
  createInitialState,
  getClickPower,
  getPassivePerSecond,
  getUpgradeCost,
  tickGame,
  UPGRADE_CATALOG,
} from './game.js';

const STORAGE_KEY = 'brood-bazooka-save-v1';

const UPGRADE_ICONS = {
  butter: Lightning,
  toaster: ChefHat,
  bakery: Storefront,
};

const MILESTONES = [
  { target: 100, label: 'Eerste korst', detail: 'Je bent officieel vers gebakken.' },
  { target: 1000, label: 'Broodbaas', detail: 'De buurt ruikt inmiddels mee.' },
  { target: 10000, label: 'Kruimelkoning', detail: 'Een legende in de bakkerij.' },
];

const formatNumber = (value) => new Intl.NumberFormat('nl-NL', {
  maximumFractionDigits: 0,
}).format(value);

const loadSavedGame = () => {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    if (!saved || typeof saved !== 'object') return createInitialState();
    const initial = createInitialState();
    return {
      ...initial,
      ...saved,
      upgrades: { ...initial.upgrades, ...(saved.upgrades || {}) },
    };
  } catch {
    return createInitialState();
  }
};

function App() {
  const [game, setGame] = useState(loadSavedGame);
  const [floatingBites, setFloatingBites] = useState([]);
  const [lastUpgrade, setLastUpgrade] = useState(null);
  const [message, setMessage] = useState('Klik op het brood. De rest gaat vanzelf.');

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(game));
  }, [game]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setGame((current) => tickGame(current, 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.code !== 'Space' || event.target instanceof HTMLInputElement) return;
      event.preventDefault();
      handleBite();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [game]);

  const nextMilestone = useMemo(
    () => MILESTONES.find((milestone) => game.lifetimeBites < milestone.target) || MILESTONES[MILESTONES.length - 1],
    [game.lifetimeBites],
  );
  const previousTarget = MILESTONES[MILESTONES.indexOf(nextMilestone) - 1]?.target || 0;
  const milestoneProgress = Math.min(
    100,
    ((game.lifetimeBites - previousTarget) / (nextMilestone.target - previousTarget)) * 100,
  );
  const clickPower = getClickPower(game);
  const passivePerSecond = getPassivePerSecond(game);

  function handleBite() {
    const earned = getClickPower(game);
    setGame((current) => clickBread(current));
    setMessage(`+${formatNumber(earned)} hapje. Lekker bezig.`);
    const biteId = `${Date.now()}-${Math.random()}`;
    const bite = {
      id: biteId,
      value: earned,
      left: 35 + Math.random() * 30,
      top: 31 + Math.random() * 14,
    };
    setFloatingBites((current) => [...current.slice(-5), bite]);
    window.setTimeout(() => {
      setFloatingBites((current) => current.filter((item) => item.id !== biteId));
    }, 900);
  }

  function handleUpgrade(upgradeId) {
    const level = game.upgrades[upgradeId];
    const cost = getUpgradeCost(upgradeId, level);
    const next = buyUpgrade(game, upgradeId);
    if (next === game) {
      setMessage(`Nog ${formatNumber(cost - game.bites)} hapjes nodig voor ${UPGRADE_CATALOG[upgradeId].name}.`);
      return;
    }
    setGame(next);
    setLastUpgrade(upgradeId);
    setMessage(`${UPGRADE_CATALOG[upgradeId].name} staat aan. De oven draait.`);
    window.setTimeout(() => setLastUpgrade(null), 500);
  }

  function handleReset() {
    if (!window.confirm('Alles opnieuw bakken? Je lokale score wordt gewist.')) return;
    const freshGame = createInitialState();
    setGame(freshGame);
    setMessage('Nieuwe dag, nieuwe korst.');
  }

  return (
    <div className="app-shell">
      <div className="grain" aria-hidden="true" />
      <header className="topbar">
        <a className="brand" href="/" aria-label="Brood Bazooka home">
          <span className="brand-mark"><Bread size={24} weight="fill" /></span>
          <span className="brand-name">Brood<span>Bazooka</span></span>
        </a>
        <div className="topbar-tools">
          <span className="save-state"><span className="status-dot" /> lokaal opgeslagen</span>
          <button className="reset-button" type="button" onClick={handleReset}>
            <ArrowsClockwise size={16} weight="bold" />
            Opnieuw bakken
          </button>
        </div>
      </header>

      <main className="game-layout">
        <section className="play-area" aria-labelledby="game-title">
          <div className="play-intro">
            <div>
              <p className="eyebrow"><span className="eyebrow-mark" /> Bakkerij live</p>
              <h1 id="game-title">Eat. Click.<br /><span>Repeat.</span></h1>
              <p className="intro-copy">Bak een imperium van knapperige happen. Eén klik begint de oven.</p>
            </div>
            <div className="streak-stamp">
              <Sparkle size={15} weight="fill" />
              <span>Vers uit de oven</span>
            </div>
          </div>

          <div className="stats-row" aria-label="Spelstatistieken">
            <StatCard label="Hapjes nu" value={formatNumber(game.bites)} accent="coral" />
            <StatCard label="Per klik" value={`+${formatNumber(clickPower)}`} icon={<Lightning size={18} weight="fill" />} />
            <StatCard label="Per seconde" value={`+${formatNumber(passivePerSecond)}`} icon={<Clock size={18} weight="bold" />} />
          </div>

          <div className="loaf-stage">
            <div className="stage-label"><span>Hoofdproduct</span><span>01 / 01</span></div>
            <div className="stage-art">
              <div className="sun-disc" aria-hidden="true" />
              <motion.button
                className="loaf-button"
                type="button"
                onClick={handleBite}
                aria-label={`Eet het brood en krijg ${clickPower} hapje`}
                whileTap={{ scale: 0.94, rotate: -1.5 }}
                animate={{ y: [0, -5, 0], rotate: [0, 0.7, 0] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <img src="/brood-loaf.png" alt="Een vers gebakken brood" />
                <span className="loaf-shine" aria-hidden="true" />
              </motion.button>
              <AnimatePresence>
                {floatingBites.map((bite) => (
                  <motion.span
                    className="floating-bite"
                    key={bite.id}
                    style={{ left: `${bite.left}%`, top: `${bite.top}%` }}
                    initial={{ opacity: 0, scale: 0.6, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: -45 }}
                    exit={{ opacity: 0, y: -76, scale: 0.8 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  >
                    +{formatNumber(bite.value)}
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
            <button className="click-instruction" type="button" onClick={handleBite}>
              <span className="click-pulse" /> Klik of druk op spatie
              <ArrowUpRight size={17} weight="bold" />
            </button>
          </div>

          <div className="milestone-row">
            <div className="milestone-copy">
              <p className="eyebrow">Volgende mijlpaal</p>
              <h2>{nextMilestone.label}</h2>
              <p>{nextMilestone.detail}</p>
            </div>
            <div className="milestone-meter" aria-label={`${formatNumber(game.lifetimeBites)} van ${formatNumber(nextMilestone.target)} hapjes`}>
              <div className="meter-meta"><span>{formatNumber(game.lifetimeBites)} hapjes</span><span>{formatNumber(nextMilestone.target)}</span></div>
              <div className="meter-track"><motion.div className="meter-fill" animate={{ width: `${milestoneProgress}%` }} /></div>
            </div>
          </div>
        </section>

        <aside className="bakery-panel" aria-labelledby="bakery-title">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">De bakkerij</p>
              <h2 id="bakery-title">Maak meer<br /><span>brood.</span></h2>
            </div>
            <div className="oven-icon"><ChefHat size={28} weight="fill" /></div>
          </div>
          <p className="panel-copy">Investeer je hapjes in machines die blijven bakken als jij even knippert.</p>

          <div className="upgrade-list">
            {Object.entries(UPGRADE_CATALOG).map(([upgradeId, upgrade]) => (
              <UpgradeRow
                key={upgradeId}
                upgradeId={upgradeId}
                upgrade={upgrade}
                level={game.upgrades[upgradeId]}
                cost={getUpgradeCost(upgradeId, game.upgrades[upgradeId])}
                canAfford={game.bites >= getUpgradeCost(upgradeId, game.upgrades[upgradeId])}
                icon={UPGRADE_ICONS[upgradeId]}
                isRecent={lastUpgrade === upgradeId}
                onBuy={handleUpgrade}
              />
            ))}
          </div>

          <div className="panel-tip">
            <span className="tip-icon"><Sparkle size={17} weight="fill" /></span>
            <div><strong>Pro tip</strong><p>Een klik is klein. Honderd klikken zijn een strategie.</p></div>
          </div>
          <p className="panel-message" aria-live="polite">{message}</p>
        </aside>
      </main>

      <footer className="footer-line">
        <span>Brood Bazooka / editie 01</span>
        <span><Check size={15} weight="bold" /> volledig lokaal gespeeld</span>
      </footer>
    </div>
  );
}

function StatCard({ label, value, icon, accent }) {
  return (
    <div className={`stat-card ${accent || ''}`}>
      <span className="stat-label">{label}</span>
      <strong>{value}</strong>
      {icon && <span className="stat-icon">{icon}</span>}
    </div>
  );
}

function UpgradeRow({ upgradeId, upgrade, level, cost, canAfford, icon: Icon, isRecent, onBuy }) {
  return (
    <motion.div className={`upgrade-row ${canAfford ? 'is-available' : ''} ${isRecent ? 'is-recent' : ''}`} layout>
      <div className="upgrade-icon"><Icon size={22} weight="fill" /></div>
      <div className="upgrade-info">
        <div className="upgrade-title"><strong>{upgrade.name}</strong><span>lvl {level}</span></div>
        <p>{upgrade.description}</p>
      </div>
      <button
        className="buy-button"
        type="button"
        disabled={!canAfford}
        onClick={() => onBuy(upgradeId)}
        aria-label={`${upgrade.name} kopen voor ${cost} hapjes`}
      >
        <span>{formatNumber(cost)}</span>
        <Bread size={14} weight="fill" />
      </button>
    </motion.div>
  );
}

export default App;
