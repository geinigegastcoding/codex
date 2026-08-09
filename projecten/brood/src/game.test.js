import { describe, expect, it } from 'vitest';
import {
  buyUpgrade,
  clickBread,
  createInitialState,
  getUpgradeCost,
  tickGame,
} from './game.js';

describe('Brood Bazooka game rules', () => {
  it('adds one bite per click and keeps a visible total for the player', () => {
    const next = clickBread(createInitialState());

    expect(next.bites).toBe(1);
    expect(next.totalBites).toBe(1);
    expect(next.lifetimeBites).toBe(1);
  });

  it('only buys an upgrade when the player can afford its current price', () => {
    const start = { ...createInitialState(), bites: 25 };
    const bought = buyUpgrade(start, 'butter');

    expect(bought.upgrades.butter).toBe(1);
    expect(bought.bites).toBe(0);
    expect(buyUpgrade(bought, 'butter')).toEqual(bought);
    expect(getUpgradeCost('butter', bought.upgrades.butter)).toBe(50);
  });

  it('turns passive bakery income into bites without overcounting lifetime stats', () => {
    const start = { ...createInitialState(), upgrades: { ...createInitialState().upgrades, toaster: 2 } };
    const next = tickGame(start, 2);

    expect(next.bites).toBe(4);
    expect(next.totalBites).toBe(4);
    expect(next.lifetimeBites).toBe(4);
  });
});
