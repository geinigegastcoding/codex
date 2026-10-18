(function (root) {
  function calculate(input) {
    const errors = [];
    const labels = {
      priceA: "Price hypothesis A",
      priceB: "Price hypothesis B",
      vatPct: "Illustrative VAT rate",
      feePct: "Illustrative Play fee rate",
      refundPct: "Refund share",
      supportCost: "Support cost per new buyer",
      fixedMonthlyCost: "Fixed monthly costs",
      newPurchases: "New purchases per month"
    };
    const required = Object.keys(labels);
    const values = {};

    for (const key of required) {
      const raw = input[key];
      if (raw === "" || raw === null || raw === undefined || (typeof raw === "string" && raw.trim() === "")) {
        errors.push(labels[key] + " is required.");
        continue;
      }
      values[key] = Number(raw);
      if (!Number.isFinite(values[key])) errors.push(labels[key] + " must be a finite number.");
    }

    if (input.feeBase !== "gross" && input.feeBase !== "exVat") errors.push("Choose a fee-base scenario.");
    for (const key of ["priceA", "priceB"]) {
      if (Number.isFinite(values[key]) && values[key] < 0.01) errors.push(labels[key] + " must be at least €0.01.");
    }
    for (const key of ["vatPct", "feePct", "refundPct"]) {
      if (Number.isFinite(values[key]) && (values[key] < 0 || values[key] > 100)) errors.push(labels[key] + " must be between 0% and 100%.");
    }
    for (const key of ["supportCost", "fixedMonthlyCost", "newPurchases"]) {
      if (Number.isFinite(values[key]) && values[key] < 0) errors.push(labels[key] + " cannot be negative.");
    }
    if (Number.isFinite(values.newPurchases) && !Number.isSafeInteger(values.newPurchases)) {
      errors.push("New purchases per month must be a whole number within the safe calculation range.");
    }

    const toCents = function (amount, label) {
      const cents = Math.round((amount + Number.EPSILON) * 100);
      if (!Number.isSafeInteger(cents)) {
        errors.push(label + " exceeds the safe calculation range.");
        return null;
      }
      return cents;
    };

    const inputCents = {};
    for (const key of ["priceA", "priceB", "supportCost", "fixedMonthlyCost"]) {
      if (Number.isFinite(values[key])) inputCents[key] = toCents(values[key], labels[key]);
    }
    if (errors.length) return { valid: false, errors: errors };

    const vatRate = values.vatPct / 100;
    const feeRate = values.feePct / 100;
    const refundRate = values.refundPct / 100;
    const purchases = values.newPurchases;
    const roundCents = function (rawCents, label) {
      const cents = Math.round(rawCents + Number.EPSILON);
      if (!Number.isSafeInteger(cents)) {
        errors.push(label + " exceeds the safe calculation range; reduce the price, cost, or monthly purchase volume.");
        return null;
      }
      return cents;
    };

    const scenarios = [
      { id: "A", grossCents: inputCents.priceA },
      { id: "B", grossCents: inputCents.priceB }
    ].map(function (scenario) {
      const exVatCents = roundCents(scenario.grossCents / (1 + vatRate), "Tax-exclusive price for hypothesis " + scenario.id);
      const vatCents = scenario.grossCents - exVatCents;
      const feeBaseCents = input.feeBase === "gross" ? scenario.grossCents : exVatCents;
      const feeCents = roundCents(feeBaseCents * feeRate, "Play fee for hypothesis " + scenario.id);
      const proceedsBeforeRefundCents = scenario.grossCents - vatCents - feeCents;
      const refundReversalCents = roundCents(proceedsBeforeRefundCents * refundRate, "Refund reversal for hypothesis " + scenario.id);
      const proceedsAfterRefundCents = proceedsBeforeRefundCents - refundReversalCents;
      const contributionCents = roundCents(proceedsAfterRefundCents - inputCents.supportCost, "Per-purchase contribution for hypothesis " + scenario.id);
      const atVolumeCents = roundCents(contributionCents * purchases, "Monthly contribution at selected volume for hypothesis " + scenario.id);
      const monthlyCents = roundCents(atVolumeCents - inputCents.fixedMonthlyCost, "Monthly contribution after fixed costs for hypothesis " + scenario.id);
      const breakEvenUnits = contributionCents > 0 ? Math.ceil(inputCents.fixedMonthlyCost / contributionCents) : null;

      return {
        id: scenario.id,
        grossPrice: scenario.grossCents / 100,
        exVat: exVatCents / 100,
        modeledVat: vatCents / 100,
        feeBaseAmount: feeBaseCents / 100,
        storeFee: feeCents / 100,
        proceedsBeforeRefund: proceedsBeforeRefundCents / 100,
        refundReversal: refundReversalCents / 100,
        proceedsAfterRefund: proceedsAfterRefundCents / 100,
        supportCost: inputCents.supportCost / 100,
        contributionPerPurchase: contributionCents / 100,
        purchasesPerMonth: purchases,
        atVolumeBeforeFixedCosts: atVolumeCents === null ? null : atVolumeCents / 100,
        fixedMonthlyCosts: inputCents.fixedMonthlyCost / 100,
        monthlyContribution: monthlyCents === null ? null : monthlyCents / 100,
        breakEvenUnits: breakEvenUnits
      };
    });

    if (errors.length) return { valid: false, errors: errors };

    return {
      valid: true,
      assumptions: {
        vatPct: values.vatPct,
        feePct: values.feePct,
        feeBase: input.feeBase,
        refundPct: values.refundPct,
        supportCost: inputCents.supportCost / 100,
        fixedMonthlyCost: inputCents.fixedMonthlyCost / 100,
        newPurchases: purchases
      },
      scenarios: scenarios
    };
  }

  const api = { calculate: calculate };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.OlloPricing = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
