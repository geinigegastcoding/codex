# Luna — working product marketing context

Updated: 15 October 2026. Draft inferred from the current Android project and the owner's decisions. Audience, positioning, pricing, and demand remain hypotheses until tested with external users. This document is in the governed company vault rather than a project .agents folder.

## Product and scope

Luna is a native Android food diary with editable calorie and macro targets, manual and barcode logging, saved foods/meals, daily history, visual insights, and a pixel bunny home-screen widget. Its current visual identity uses Pixelify Sans, readable Silkscreen numbers, stepped navy outlines, and cream/mint/lilac colors.

The initial product is an on-device diary. The owner explicitly accepted JSON export/import instead of automatic cross-device synchronization for this version. Account sign-in is for identity and photo-scan authorization. It does not synchronize the diary. Backups do not include photo files.

Working launch scope: adults aged 18+, Android, initially the Netherlands/EU. Dutch barcode support is present; the interface is principally English. The geographic and language choices are recommendations, not confirmed owner decisions.

## Audience and jobs

Proposed initial audience: adults using Android who want everyday calorie/macro awareness and enjoy a playful, approachable interface. A narrower recruitment group could be Dutch adults who regularly eat packaged supermarket foods and repeat meals. Age, platform, and actual food habits matter more initially than a broad fitness demographic.

Jobs to test:
- Record an ordinary meal and correct its portion without getting stuck.
- Understand the day's calories and macros at a glance.
- Return to a useful food diary through an appealing home-screen companion.

Not a first-launch fit: minors, pregnancy/breastfeeding use excluded by current onboarding, medical nutrition management, people needing automatic multi-device sync, or users expecting a comprehensive micronutrient/clinical tool.

## Problem and differentiation

The working problem is logging friction and difficulty sustaining a habit. These are hypotheses supported by product intent, not established findings from Luna customers.

Candidate promise: **A cozy Android food diary with editable portions and a pixel companion on your home screen.**

The strongest recognizable distinction is the pixel companion/widget experience around a practical diary. Test whether it makes logging easier to resume after the novelty wears off. The angry variant currently signals an existing streak at risk after 18:00 with no food logged that day; any food log clears it. The mascot should communicate logging consistency without judging calorie restriction.

Free barcode scanning and AI meal estimates alone provide weak differentiation: [Cronometer advertises free barcode scanning](https://cronometer.com/), and [YAZIO advertises AI, manual, and barcode logging](https://www.yazio.com/en). This is an inference from their advertised features, not a comparison of their accuracy or usability.

## Competition and naming

Direct category alternatives include YAZIO, Cronometer, MyFitnessPal, and MacroFactor. Notes/spreadsheets and simply stopping tracking are alternatives to adopting another app.

An existing [Luna fasting app](https://play.google.com/store/apps/details?id=com.luna.fastingpro) advertises AI food scanning and calorie counting. Other health apps also use Luna. Name collision is observed; trademark infringement is not established. Complete BOIP/EUIPO and relevant trade-name checks, plus domain/handle availability, before committing marketing spend. A distinctive descriptor may help discoverability but does not substitute for clearance.

## Business model

The code integrates a free local diary and RevenueCat-backed Luna Pro, with photo scanning requiring a verified account and Pro. Test Store integration is not proof of production billing. The intended offering includes monthly, yearly, and lifetime products; real consumer prices and live Play configuration are unverified.

Recommendation: validate the free diary first. If paid AI ships, meter it clearly and price it against actual recurring costs. Review the lifetime product carefully because one payment would otherwise fund an ongoing service.

Gemini's terms affect the proposed market and age scope. An EEA release needs an eligible paid-service configuration; adult-only positioning and access also need review. See [Gemini terms](https://ai.google.dev/gemini-api/terms).

## Objections and switching

Likely objections to test, not invented customer quotes:
- Can I find the foods I actually eat?
- Will I lose my diary when I change phones or uninstall?
- Is a cute app reliable enough for portions and nutrition?
- What leaves my phone, especially when I scan a photo?
- What precisely is free, paid, or limited?

The attraction is approachable design and convenient daily logging. The switching barrier is an established diary, favorite foods, learned portions, and trust in another database. JSON import currently means Luna-format backup restoration, not universal migration from competitors.

## Voice and claims

Voice: playful, calm, practical, readable, and respectful. Avoid moral labels for food, pressure to eat less, or shame for missing a day.

Claims should match the release:
- Describe available entry methods and editable estimates.
- Explain local diary storage and backup limitations.
- Describe AI results as estimates requiring review.
- Avoid claims of clinical accuracy, guaranteed weight loss, automatic sync, unlimited AI, or comprehensive food search without evidence.

## Proof and customer language

Verified engineering evidence exists for the debug prototype: 98 unit tests, lint with zero errors, and 18 distinct native checks across targeted runs on API 35, recorded on 14 October. This is not retention evidence, a medical accuracy study, or proof of a production release.

The owner's positive feedback about the home UI is internal feedback. No external testimonial, customer count, adoption metric, or willingness-to-pay result was verified. Do not turn these unknowns into store claims.

## Goals and measurement

First conversion: an interested adult joins a clearly described Android beta.
Product activation: completes setup and saves a first food.
Habit signal: voluntarily returns to log on multiple days.
Commercial signal: understands Pro's value and limits, with a viable contribution margin.

Measure with appropriate consent. Do not collect body measurements, food names, photos, or diary contents merely to optimize marketing.

## Decisions still needed

Final cleared name; launch countries/language; verified Play account and seller identity; public privacy/support/deletion pages; free/Pro boundary; AI availability and limits; real prices and taxes; support ownership; and beta evidence.

The execution plan is [Luna launch readiness research](C:/Users/Daniël/Desktop/Codex/Kennis/company/calorie-tracker-launch-readiness-2026-10-15.md).

