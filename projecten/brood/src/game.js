export const UPGRADE_CATALOG = {
  butter: {
    name: 'Dubbele boter',
    description: '+1 hapje per klik',
    baseCost: 25,
    clickPower: 1,
    passivePower: 0,
  },
  toaster: {
    name: 'De broodrooster',
    description: '+1 hapje per seconde',
    baseCost: 50,
    clickPower: 0,
    passivePower: 1,
  },
  bakery: {
    name: 'Mini-bakkerij',
    description: '+5 hapjes per seconde',
    baseCost: 250,
    clickPower: 0,
    passivePower: 5,
  },
};

export const createInitialState = () => ({
  bites: 0,
  totalBites: 0,
  lifetimeBites: 0,
  upgrades: {
    butter: 0,
    toaster: 0,
    bakery: 0,
  },
});

export const getUpgradeCost = (upgradeId, level) => {
  const upgrade = UPGRADE_CATALOG[upgradeId];
  if (!upgrade) return Infinity;
  return upgrade.baseCost * 2 ** level;
};

export const getClickPower = (state) => (
  1 + state.upgrades.butter * UPGRADE_CATALOG.butter.clickPower
);

export const getPassivePerSecond = (state) => Object.entries(UPGRADE_CATALOG)
  .reduce((total, [upgradeId, upgrade]) => (
    total + state.upgrades[upgradeId] * upgrade.passivePower
  ), 0);

export const clickBread = (state) => {
  const earned = getClickPower(state);
  return {
    ...state,
    bites: state.bites + earned,
    totalBites: state.totalBites + earned,
    lifetimeBites: state.lifetimeBites + earned,
  };
};

export const tickGame = (state, seconds = 1) => {
  const earned = getPassivePerSecond(state) * Math.max(0, seconds);
  return {
    ...state,
    bites: state.bites + earned,
    totalBites: state.totalBites + earned,
    lifetimeBites: state.lifetimeBites + earned,
  };
};

export const buyUpgrade = (state, upgradeId) => {
  const upgrade = UPGRADE_CATALOG[upgradeId];
  if (!upgrade) return state;

  const level = state.upgrades[upgradeId];
  const cost = getUpgradeCost(upgradeId, level);
  if (state.bites < cost) return state;

  return {
    ...state,
    bites: state.bites - cost,
    upgrades: {
      ...state.upgrades,
      [upgradeId]: level + 1,
    },
  };
};
