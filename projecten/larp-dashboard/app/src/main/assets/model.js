function randomSequence(seed) {
  let state = seed >>> 0 || 1;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function seriesForTotal(total, count, seed, decimals = 2) {
  const random = randomSequence(seed);
  const weights = Array.from({ length: count }, (_, i) =>
    0.35 + random() * 0.8 + (i / Math.max(1, count - 1)) * 0.45
  );
  const weightSum = weights.reduce((sum, value) => sum + value, 0);
  const scale = 10 ** decimals;
  const cents = Math.round(total * scale);
  const parts = weights.map((weight, index) => {
    const exact = cents * weight / weightSum;
    return { index, cents: Math.floor(exact), remainder: exact - Math.floor(exact) };
  });
  let missing = cents - parts.reduce((sum, part) => sum + part.cents, 0);
  const largest = [...parts].sort((a, b) => b.remainder - a.remainder);
  for (let i = 0; i < missing; i++) largest[i % count].cents++;
  return parts.map(part => part.cents / scale);
}

function seriesForBalance(total, count, seed) {
  const random = randomSequence(seed);
  let value = 0.67;
  const series = Array.from({ length: count }, (_, i) => {
    value = Math.max(0.15, value + (random() - 0.45) * 0.15);
    return Math.round(total * value * 100) / 100;
  });
  series[count - 1] = total;
  return series;
}

function parseAmount(raw) {
  const value = String(raw).trim();
  if (!/^\d+(?:\.\d{1,8})?$/.test(value)) return null;
  const amount = Number(value);
  return Number.isFinite(amount) && amount <= 1000000000000 ? amount : null;
}

function walletTotal(assets) {
  return Math.round(assets.reduce((sum, asset) => sum + Number(asset.value), 0) * 100) / 100;
}

function scaleWallet(assets, target) {
  const current = walletTotal(assets);
  const cents = Math.round(target * 100);
  const parts = assets.map((asset, index) => {
    const exact = current ? cents * asset.value / current : (index === 0 ? cents : 0);
    return { index, cents: Math.floor(exact), remainder: exact - Math.floor(exact) };
  });
  const missing = cents - parts.reduce((sum, part) => sum + part.cents, 0);
  const largest = [...parts].sort((a, b) => b.remainder - a.remainder);
  for (let i = 0; i < missing; i++) largest[i % largest.length].cents++;
  return assets.map((asset, index) => ({
    ...asset,
    value: parts[index].cents / 100,
    quantity: asset.value ? Math.round(asset.quantity * (parts[index].cents / 100) / asset.value * 1e8) / 1e8 : asset.quantity
  }));
}

function mergeProfiles(saved, defaults) {
  return { ...defaults, ...saved };
}

if (typeof module !== 'undefined') module.exports = { seriesForTotal, seriesForBalance, parseAmount, walletTotal, scaleWallet, mergeProfiles };
