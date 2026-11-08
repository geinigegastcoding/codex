const assert = require('node:assert/strict');
const { seriesForTotal, seriesForBalance, parseAmount, walletTotal, scaleWallet, mergeProfiles } = require('../app/src/main/assets/model.js');

// The chart is meaningful only if its daily values add up to the displayed total.
for (const total of [0, 0.01, 12345.67, 999999999.99]) {
  const series = seriesForTotal(total, 30, 17);
  assert.equal(series.length, 30);
  assert.equal(Math.round(series.reduce((sum, value) => sum + value, 0) * 100), Math.round(total * 100));
  assert.ok(series.every(value => Number.isFinite(value) && value >= 0));
  assert.deepEqual(series, seriesForTotal(total, 30, 17));
}
const wholeCounts = seriesForTotal(123, 28, 17, 0);
assert.ok(wholeCounts.every(Number.isInteger));
assert.equal(wholeCounts.reduce((sum, value) => sum + value, 0), 123);

// The wallet chart must end at the edited balance, including an empty wallet.
for (const total of [0, 34.56, 100000]) {
  const series = seriesForBalance(total, 30, 42);
  assert.equal(series.at(-1), total);
  assert.ok(series.every(value => Number.isFinite(value) && value >= 0));
}

assert.equal(parseAmount('1234.56'), 1234.56);
assert.equal(parseAmount('0.12345678'), 0.12345678);
assert.equal(parseAmount('0'), 0);
for (const invalid of ['', '-1', 'abc', '1e9', 'Infinity', '1000000000000.01']) {
  assert.equal(parseAmount(invalid), null);
}
assert.equal(walletTotal([{ value: 45.20 }, { value: 54.80 }]), 100);
const scaled = scaleWallet([{ value: 75, quantity: 3 }, { value: 25, quantity: 1 }], 1000);
assert.equal(walletTotal(scaled), 1000);
assert.deepEqual(scaled.map(asset => asset.value), [750, 250]);
assert.deepEqual(scaled.map(asset => asset.quantity), [30, 10]);
assert.equal(walletTotal(scaleWallet([{ value: 0, quantity: 0 }, { value: 0, quantity: 0 }], 12.34)), 12.34);

// Adding dashboards must not replace the values users saved in older versions.
const oldData = { shopify: { sales: 123456 }, youtube: { views: 9876 }, phantom: { balance: 500 } };
const merged = mergeProfiles(oldData, { shopify: { sales: 1 }, tiktok: { views: 12 }, stripe: { sales: 34 }, amazon: { sales: 56 } });
assert.deepEqual(merged.shopify, { sales: 123456 });
assert.deepEqual(merged.youtube, { views: 9876 });
assert.deepEqual(merged.phantom, { balance: 500 });
assert.deepEqual([merged.tiktok.views, merged.stripe.sales, merged.amazon.sales], [12, 34, 56]);
assert.equal(oldData.tiktok, undefined);
console.log('Dashboard data checks passed.');
