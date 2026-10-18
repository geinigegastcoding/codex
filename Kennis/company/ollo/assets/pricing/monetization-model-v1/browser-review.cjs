const { chromium } = require('C:/Users/Daniël/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const { mkdirSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');
const { pathToFileURL } = require('node:url');
const assert = require('node:assert/strict');

(async () => {
  const phase = process.argv[2] || 'before';
  assert.ok(['before', 'confirmed'].includes(phase));
  const out = join(__dirname, 'qa', phase);
  mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
  const observations = [];
  try {
    for (const [name, width, height] of [['desktop', 1280, 900], ['mobile', 390, 844]]) {
      const context = await browser.newContext({ viewport: { width, height } });
      await context.route(/^https?:/, route => route.abort());
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(pathToFileURL(join(__dirname, 'index.html')).href);
      await page.screenshot({ path: join(out, name + '-inputs.png') });
      writeFileSync(join(out, name + '-snapshot.txt'), await page.locator('body').innerText(), 'utf8');
      await page.getByRole('heading', { name: 'Modeled amounts', exact: true }).scrollIntoViewIfNeeded();
      await page.screenshot({ path: join(out, name + '-results.png') });
      const initial = await page.locator('#results-body').innerText();
      const geometry = await page.evaluate(() => ({ pageWidth: document.documentElement.clientWidth, contentWidth: document.documentElement.scrollWidth, tableViewport: document.getElementById('results-table-wrap').clientWidth, tableWidth: document.querySelector('table').scrollWidth }));
      await page.getByLabel('New purchases per month', { exact: true }).fill('0');
      const afterInput = await page.locator('#results-body').innerText();
      const statusAfterInput = await page.locator('#status').innerText();
      if (phase === 'confirmed') {
        assert.notEqual(afterInput, initial, 'Results must reflect edited inputs immediately');
        assert.match(afterInput, /−?\s*€\s*-?50,00|€\s*-50,00/);
        assert.ok(geometry.contentWidth <= geometry.pageWidth, 'Page must not overflow horizontally');
        if (name === 'mobile') assert.ok(geometry.tableWidth <= geometry.tableViewport + 1, 'Both default hypotheses fit the mobile table');
      }
      await page.getByRole('button', { name: 'Calculate', exact: true }).click();
      await page.getByLabel('One-time customer price, VAT included', { exact: true }).first().fill('');
      await page.getByRole('button', { name: 'Calculate', exact: true }).click();
      const invalidHidden = await page.locator('#results-table-wrap').isHidden();
      const invalidStatus = await page.locator('#status').innerText();
      assert.ok(invalidHidden, 'Invalid inputs must hide numeric results');
      assert.equal(errors.length, 0, errors.join('; '));
      observations.push({ viewport: name, width, height, geometry, resultChangedOnInput: initial !== afterInput, statusAfterInput, invalidHidden, invalidStatus, browserErrors: errors });
      await context.close();
    }
    writeFileSync(join(out, 'results.json'), JSON.stringify({ phase, status: 'passed', browser: await browser.version(), noServer: true, localFileOnly: true, observations }, null, 2) + '\n');
    console.log(JSON.stringify({ phase, observations }, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
