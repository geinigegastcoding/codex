(function (root) {
  function calculate(input) {
    const errors = [];
    const required = ["priceA", "priceB", "vatPct", "feePct", "refundPct", "supportCost", "fixedMonthlyCost", "newPurchases"];
    const values = {};

    for (const key of required) {
      const raw = input[key];
      if (raw === "" || raw === null || raw === undefined || (typeof raw === "string" && raw.trim() === "")) {
        errors.push(key + " is required.");
      } else {
        values[key] = Number(raw);
        if (!Number.isFinite(values[key])) errors.push(key + " must be a valid number.");
      }
    }

    if (input.feeBase !== "gross" && input.feeBase !== "exVat") errors.push("Choose a fee-base scenario.");
    if (Number.isFinite(values.priceA) && values.priceA <= 0) errors.push("Price A must be greater than €0.");
    if (Number.isFinite(values.priceB) && values.priceB <= 0) errors.push("Price B must be greater than €0.");
    for (const key of ["vatPct", "feePct", "refundPct"]) {
      if (Number.isFinite(values[key]) && (values[key] < 0 || values[key] > 100)) errors.push(key + " must be between 0% and 100%.");
    }
    for (const key of ["supportCost", "fixedMonthlyCost", "newPurchases"]) {
      if (Number.isFinite(values[key]) && values[key] < 0) errors.push(key + " cannot be negative.");
    }
    if (Number.isFinite(values.newPurchases) && !Number.isInteger(values.newPurchases)) errors.push("New purchases per month must be a whole number.");

    if (errors.length) return { valid: false, errors: errors };

    const roundCents = function (amount) {
      return Math.round((amount + Number.EPSILON) * 100) / 100;
    };
    const vatRate = values.vatPct / 100;
    const feeRate = values.feePct / 100;
    const refundRate = values.refundPct / 100;
    const support = roundCents(values.supportCost);
    const fixedCosts = roundCents(values.fixedMonthlyCost);
    const purchases = values.newPurchases;

    const scenarios = [
      { id: "A", price: roundCents(values.priceA) },
      { id: "B", price: roundCents(values.priceB) }
    ].map(function (scenario) {
      const exVat = roundCents(scenario.price / (1 + vatRate));
      const vat = roundCents(scenario.price - exVat);
      const feeBaseAmount = input.feeBase === "gross" ? scenario.price : exVat;
      const storeFee = roundCents(feeBaseAmount * feeRate);
      const proceedsBeforeRefund = roundCents(scenario.price - vat - storeFee);
      const refundReversal = roundCents(proceedsBeforeRefund * refundRate);
      const proceedsAfterRefund = roundCents(proceedsBeforeRefund - refundReversal);
      const contributionPerPurchase = roundCents(proceedsAfterRefund - support);
      const atVolumeBeforeFixedCosts = roundCents(contributionPerPurchase * purchases);
      const monthlyContribution = roundCents(atVolumeBeforeFixedCosts - fixedCosts);
      const contributionCents = Math.round(contributionPerPurchase * 100);
      const fixedCostCents = Math.round(fixedCosts * 100);
      const breakEvenUnits = contributionCents > 0 ? Math.ceil(fixedCostCents / contributionCents) : null;

      return {
        id: scenario.id,
        grossPrice: scenario.price,
        exVat: exVat,
        modeledVat: vat,
        feeBaseAmount: roundCents(feeBaseAmount),
        storeFee: storeFee,
        proceedsBeforeRefund: proceedsBeforeRefund,
        refundReversal: refundReversal,
        proceedsAfterRefund: proceedsAfterRefund,
        supportCost: support,
        contributionPerPurchase: contributionPerPurchase,
        purchasesPerMonth: purchases,
        atVolumeBeforeFixedCosts: atVolumeBeforeFixedCosts,
        fixedMonthlyCosts: fixedCosts,
        monthlyContribution: monthlyContribution,
        breakEvenUnits: breakEvenUnits
      };
    });

    return {
      valid: true,
      assumptions: {
        vatPct: values.vatPct,
        feePct: values.feePct,
        feeBase: input.feeBase,
        refundPct: values.refundPct,
        supportCost: support,
        fixedMonthlyCost: fixedCosts,
        newPurchases: purchases
      },
      scenarios: scenarios
    };
  }

  const api = { calculate: calculate };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.OlloPricing = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
