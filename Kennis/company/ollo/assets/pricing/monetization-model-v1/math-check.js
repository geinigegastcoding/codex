const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { calculate } = require("./model.js");

const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8").replace(/^\uFEFF/, "");
const modelSource = fs.readFileSync(path.join(__dirname, "model.js"), "utf8").replace(/^\uFEFF/, "").trimEnd();
const inlineModel = html.match(/<script id="pricing-model">\r?\n([\s\S]*?)\r?\n<\/script>/);
assert.ok(inlineModel, "The standalone HTML must contain its inline pricing model.");
assert.equal(inlineModel[1].trimEnd(), modelSource, "The inline model must exactly match model.js.");

const defaults = {
  priceA: "9.99",
  priceB: "14.99",
  vatPct: "21",
  feePct: "15",
  feeBase: "gross",
  refundPct: "0",
  supportCost: "0",
  fixedMonthlyCost: "0",
  newPurchases: "100"
};

const gross = calculate(defaults);
assert.equal(gross.valid, true);
assert.equal(gross.scenarios[0].proceedsBeforeRefund, 6.76);
assert.equal(gross.scenarios[1].proceedsBeforeRefund, 10.14);

const exVat = calculate({ ...defaults, feeBase: "exVat" });
assert.equal(exVat.scenarios[0].storeFee, 1.24);
assert.equal(exVat.scenarios[0].proceedsBeforeRefund, 7.02);
assert.notEqual(exVat.scenarios[0].proceedsBeforeRefund, gross.scenarios[0].proceedsBeforeRefund);

const zeroVolume = calculate({ ...defaults, supportCost: "1", fixedMonthlyCost: "50", newPurchases: "0" });
assert.equal(zeroVolume.scenarios[0].contributionPerPurchase, 5.76);
assert.equal(zeroVolume.scenarios[0].monthlyContribution, -50);
assert.equal(zeroVolume.scenarios[0].breakEvenUnits, 9);

const unviable = calculate({ ...defaults, supportCost: "20", fixedMonthlyCost: "50" });
assert.ok(unviable.scenarios[0].contributionPerPurchase < 0);
assert.equal(unviable.scenarios[0].breakEvenUnits, null);

const emptyInput = calculate({ ...defaults, priceA: "" });
assert.equal(emptyInput.valid, false);
assert.ok(emptyInput.errors.some((error) => error === "Price hypothesis A is required."));

const subCentPrice = calculate({ ...defaults, priceA: "0.009" });
assert.equal(subCentPrice.valid, false);
assert.ok(subCentPrice.errors.some((error) => error.includes("Price hypothesis A must be at least €0.01.")));

const hugePrice = calculate({ ...defaults, priceA: "1e308" });
assert.equal(hugePrice.valid, false);
assert.ok(hugePrice.errors.some((error) => error.includes("Price hypothesis A exceeds the safe calculation range.")));
assert.ok(hugePrice.errors.every((error) => !error.includes("priceA")));

const hugeVolume = calculate({ ...defaults, newPurchases: "9007199254740991" });
assert.equal(hugeVolume.valid, false);
assert.ok(hugeVolume.errors.some((error) => error.includes("Monthly contribution at selected volume for hypothesis A exceeds the safe calculation range;")));

const fullRefund = calculate({ ...defaults, refundPct: "100", supportCost: "0", fixedMonthlyCost: "50" });
assert.equal(fullRefund.scenarios[0].contributionPerPurchase, 0);
assert.equal(fullRefund.scenarios[0].monthlyContribution, -50);
assert.equal(fullRefund.scenarios[0].breakEvenUnits, null);

const unsafeMarginAtZeroVolume = calculate({ ...defaults, priceA: 8e13, vatPct: 100, feePct: 100, supportCost: 8e13, newPurchases: 0 });
assert.equal(unsafeMarginAtZeroVolume.valid, false, "Zero monthly volume must not hide an unsafe per-purchase amount.");
assert.ok(unsafeMarginAtZeroVolume.errors.some((error) => error.includes("Per-purchase contribution for hypothesis A exceeds the safe calculation range;")));

console.log("Ollo pricing checks passed: inline/source parity, gross and alternative fee bases, volume and margin edges, unsafe amounts/volume, sub-cent prices, and full refunds.");

