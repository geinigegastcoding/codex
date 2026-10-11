---
title: Legal bug bounty route assessment
created: 2026-08-09
updated: 2026-09-25
type: income-route-assessment
status: guardian-gate
tags: [personal, income, cybersecurity, bug-bounty, safety]
sources: [https://www.hackerone.com/terms/disclosure-guidelines, https://www.hackerone.com/terms/community/2025, https://www.hackerone.com/policies/privacy, https://www.bugcrowd.com/resources/hacker-resources/standard-disclosure-terms/, https://www.microsoft.com/en-us/msrc/bounty-guidelines, https://www.microsoft.com/en-us/msrc/opensourcebountyprogram, https://algora.io/legal/terms, https://oss.issuehunt.io/issues, https://oss.issuehunt.io/terms, https://business.gov.nl/regulations/starting-a-business-as-a-minor/, https://www.belastingdienst.nl/wps/wcm/connect/nl/belastingaangifte/content/ik-ben-minderjarig-en-verdien-geld]
---

# Legal bug bounty route assessment

## Current decision (2026-09-25)

HackerOne is a possible minor route if the parent/legal guardian agrees to its terms on the minor's behalf and claims any bounty; its guidelines explicitly allow minors to participate. This still needs guardian involvement and local tax/payment handling. Bugcrowd requires age 18 or the local age of majority for monetary compensation, with only a case-by-case Bug Bash exception; Intigriti requires age 18, or at least 16 with parent/guardian permission; Algora's terms require age 18. [HackerOne bounty guidelines](https://www.hackerone.com/terms/disclosure-guidelines) [HackerOne Community Member Terms](https://www.hackerone.com/terms/community/2025) [Bugcrowd disclosure terms](https://www.bugcrowd.com/resources/hacker-resources/standard-disclosure-terms/) [Intigriti researcher terms](https://kb.intigriti.com/en/articles/5466165-researcher-terms-conditions) [Algora terms](https://algora.io/legal/terms)

Microsoft's current bounty terms are a viable exception: researchers age 14+ may participate if a parent/legal guardian gives permission first. For a minor, Microsoft may award the bounty to the guardian, who must sign the payment forms; Microsoft's terms say the bounty is added to the guardian's taxable income. The standard award policy table lists $750-$5,000 based on impact/report quality for qualifying Critical/Important findings on Microsoft-owned domains/cloud services; product-specific terms can control, and a qualifying finding is far from assured. This is highly uncertain income, not a predictable wage. [Microsoft bounty terms and award policy](https://www.microsoft.com/en-us/msrc/bounty-guidelines)

Two candidate routes require a live comparison after guardian permission: Microsoft's Open Source Bounty Program publishes an explicit list of eligible repositories and pays $750-$15,000 only for qualifying Critical/Important findings on the latest maintained branch; HackerOne has many program-specific scopes and minors may participate when a parent/guardian agrees to the platform terms and handles claims. Neither guarantees income. Inspect the exact live program scope, award rules, and guardian/payment requirements before research. [Microsoft Open Source Bounty Program](https://www.microsoft.com/en-us/msrc/opensourcebountyprogram) [HackerOne bounty guidelines](https://www.hackerone.com/terms/disclosure-guidelines) [HackerOne Community Member Terms](https://www.hackerone.com/terms/community/2025)

I checked IssueHunt's currently visible most-funded task pages as an alternate path. The pages contain funded amounts but many entries have 3-4-year-old activity, already-submitted pull requests, or closed/missing repositories; I did not verify a fresh, unclaimed, payable task. IssueHunt's terms also require guardian consent for a minor and do not clarify how a minor's payout would be routed. Do not treat the stale board as an immediate cash route. [IssueHunt funded tasks](https://oss.issuehunt.io/issues) [IssueHunt terms](https://oss.issuehunt.io/terms)

In the Netherlands, minors need parent/guardian permission for legal actions connected to starting a business; handlichting is only available from age 16. The Dutch Tax Administration says a minor's income from work or an own business is generally declared by the minor, while Microsoft's bounty terms attribute a minor's bounty to the parent/guardian. Before accepting a payment, have the guardian confirm Dutch and US tax treatment from the actual award paperwork with the Tax Administration or a qualified tax adviser. [Business.gov.nl: starting a business as a minor](https://business.gov.nl/regulations/starting-a-business-as-a-minor/) [Belastingdienst: minors with income](https://www.belastingdienst.nl/wps/wcm/connect/nl/belastingaangifte/content/ik-ben-minderjarig-en-verdien-geld)

Do not begin Microsoft-target bounty research or access a HackerOne program until the researcher's age and guardian approval are confirmed. For Microsoft, permission must come first; for HackerOne, the guardian must agree to the platform terms on the minor's behalf and handle any bounty claim. Then re-read the live program scope and product-specific terms immediately before any testing. Do not imply that an adult is the researcher or use anyone else's identity.

## Safe use

Use only intentionally vulnerable local labs, CTFs, or a program whose current brief explicitly authorizes the exact target and method. Before any research, read the scope, rate limits, out-of-scope list, disclosure rules, and safe-harbor wording. Keep proof-of-concept data private and report only through the program's official channel.

Never scan random websites, guess passwords, access accounts, exfiltrate data, run denial-of-service tests, send phishing or social-engineering messages, bypass a paywall, or test a third party because a domain happens to look interesting. Authorization must be explicit and in writing through the program.

## Money expectation

Expected immediate income: EUR 0 until an in-scope, original, accepted finding is awarded and all payment paperwork is completed. The Microsoft route has a theoretical payout path only with prior guardian permission and guardian-managed tax/payment paperwork. Do not count advertised maximums as expected earnings.

## Local portfolio idea

Build a defensive Python tool against only Daniel's own files, such as a dependency-risk report or a secret-pattern checker that prints warnings without uploading anything. Include a README, tests, sample input, and a short explanation of false positives. Do not market it as a security audit or run it against anyone else's systems without a separate written agreement.
