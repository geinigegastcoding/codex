# 2026-06-28 - Website Council Review

- **Session ID**: b60f11ef-8c42-4980-9c79-25087560da1f

## Summary
Convened a 4-persona council (Notulist, CRO, SEO, Content) to exhaustively review every page of the website for conversions, helpfulness, and technical SEO, logging all findings to `website-council.md`.

## Files Changed
- `..\website-council.md` (created/modified)

## Key Decisions & Assumptions
- The website’s baseline copy, structure, and "Anti-Marketing" philosophy are top 1% for B2B.
- CTAs must dynamically match search intent (no bottom-funnel "free website plan" offers on top-funnel/strategy pages).
- Over-apologetic portfolio disclaimers ("geen resultaatclaim") actively hurt credibility and should be removed.
- Frictionless contact flows are bottlenecked by an unclickable `[at]` email address.
- Schema markup requires expansion (`Person`, `AboutPage`, `ContactPage`, `LocalBusiness`).
- Secondary CTAs on local/service pages break context by routing back to the main services hub rather than proof/cases.

## Next Steps
- Implement dynamic CTA component overrides for `ContentPage` and `LandingRoutePage`.
- Implement a clickable email solution (React obfuscation or hidden `mailto:`).
- Remove repetitive defensive disclaimers on portfolio cards.
- Inject missing E-E-A-T and Local schema JSON-LD.
- Standardize "Ik" vs. "We" pronouns sitewide.

## Related Notes
- [[website-council.md]]
- [[council.md]]
- [[Status.md]]
