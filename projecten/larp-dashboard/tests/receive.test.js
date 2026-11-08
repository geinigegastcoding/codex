const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const model = require('../app/src/main/assets/model.js');

const listeners = {};
const saved = {};
let submit;
const form = {
  addEventListener: (type, callback) => { if (type === 'submit') submit = callback; },
  querySelector: () => ({ textContent: '' })
};
const elements = { app: { innerHTML: '' }, portal: { innerHTML: '' }, 'sheet-form': form };
const document = {
  documentElement: { style: {} },
  getElementById: id => elements[id] || null,
  addEventListener: (type, callback) => { listeners[type] = callback; },
  querySelectorAll: () => []
};
const localStorage = {
  getItem: key => saved[key] || null,
  setItem: (key, value) => { saved[key] = value; }
};
const context = vm.createContext({
  ...model, document, localStorage, setTimeout, clearTimeout,
  window: { DashLab: { getProfile: () => 'phantom', setAppearance: () => {} }, scrollTo: () => {}, matchMedia: () => ({ matches: false }) },
  FormData: class { get(key) { return { asset: '1', value: '12.34' }[key]; } }
});
vm.runInContext(fs.readFileSync(path.join(__dirname, '../app/src/main/assets/app.js'), 'utf8'), context);
const click = dataset => listeners.click({ target: { closest: () => ({ dataset }) } });

// Receiving a selected token must update and persist that token's balance.
const before = vm.runInContext('data.phantom.assets[1].value', context);
click({ action: 'wallet-action', kind: 'receive' });
assert.match(elements.app.innerHTML, /class="app phantom phantom-receive"/);
click({ action: 'wallet-receive-token', index: '1' });
assert.match(elements.portal.innerHTML, /value="1" selected>Ethereum \(ETH\)/);
assert.equal(context.window.handleBack(), true);
assert.match(elements.app.innerHTML, /class="app phantom phantom-receive"/);
assert.equal(context.window.handleBack(), true);
assert.doesNotMatch(elements.app.innerHTML, /phantom-receive/);
click({ action: 'wallet-action', kind: 'receive' });
click({ action: 'wallet-receive-token', index: '1' });
submit({ preventDefault() {}, currentTarget: form });
assert.equal(JSON.parse(saved['dashlab.data.v1']).phantom.assets[1].value, before + 12.34);
assert.doesNotMatch(elements.app.innerHTML, /phantom-receive/);
console.log('Receive flow checks passed.');
