const assert = require("node:assert/strict");
const { calculate } = require("./model.js");

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
assert.ok(emptyInput.errors.some((error) => error.includes("priceA is required")));

console.log("Ollo pricing math checks passed: gross-basis examples, fee-base sensitivity, zero volume, unviable margin, and blank-input validation.");
