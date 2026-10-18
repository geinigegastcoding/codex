# Ollo marketing plan

**Planning date:** 16 October 2026  
**Product stage:** 0.2.0 review build; no public Play listing, billing, or in-app marketing analytics is established.  
**Scope:** Low-cost validation and launch preparation. This document does not claim proven demand or product outcomes.

## The first audience to test

Start with Dutch-speaking Android users who recognize an automatic Instagram/YouTube/other selected-app opening, but still need their phone for messages, calls, alarms, or useful searches. The most plausible early wedge is people who want a short, chosen interruption at the moment of opening—not people seeking a locked-down phone, medical treatment, or a universal screen-time cure.

This is a **working audience hypothesis**, not a researched market-size claim. Test whether the problem is common and whether people accept the Android permissions before broadening to students, parents, or workplace focus. Ollo is voluntary self-management; avoid shame, “dopamine detox” claims, diagnosis, and guilt about screen time.

## Positioning

**Positioning statement:** For Android users who open selected apps on autopilot, Ollo adds a pause they choose: a block, an intentional opening, or an optional three-question mini challenge. Useful apps, calls, alarms, and emergency routes stay in view. The app works locally, without an account or internet permission.

**Short promise:** *Even pauze. Jij kiest wat daarna gebeurt.*  
**English adaptation:** *A small pause before the scroll. You choose what happens next.*

Lead with an actionable moment, then show the product. The orange pixel mascot has energy and personality: it can pop in, hold a tiny sign, challenge the viewer, or celebrate a deliberate choice. Keep the joke warm and the user in control. Do not depict the user as weak or broken.

### Message order

1. **A familiar moment:** “Ik opende Instagram voor één bericht…”
2. **Show the pause:** selected-app block or opening prompt; optional chess/math/fact quiz. Treat the quiz as a creative hook, with close Android alternatives documented in [[FEATURE-RESEARCH]]; do not describe it as exclusive.
3. **Show control and boundaries:** user chooses apps and rules; essentials/emergency routes exist; ordinary access is not locked away.
4. **Earn trust:** local storage, no account, no server, no internet permission.
5. **Ask for one next step:** see the demo or install the public release when one exists.

## Claims and proof

| Safe to say now | Evidence / wording boundary |
|---|---|
| “Pause selected apps” / “Block apps you choose” | Package-level selection and voluntary blocking are implemented. Avoid “blocks every distraction” or implying device-wide enforcement. |
| “Choose an intentional opening” | Opening prompt, wait/grace options and explicit conscious opening are implemented. |
| “Three questions before opening” | Optional chess, arithmetic or curated-fact quiz; three correct answers and a final conscious-open action. It is off by default and does not bypass a fixed block or limit. |
| “Calls, alarms and essential apps remain accessible” | Designed routes and essential selection exist; do not claim that every manufacturer/device configuration has passed physical-device acceptance. |
| “Works offline; no account or internet permission” | Release manifest and architecture support this claim. User-granted Android Usage Access and Accessibility access are still needed for relevant features. State that clearly before install/setup. |
| “See your Android usage history” | The app shows provider data with coverage/source labels and conservative summaries. Say “available Android usage data”; never promise complete histories or guaranteed savings. |
| “Stored locally. You choose where exports go.” | Ollo stores its settings and measurements on-device and has no server/account. User-selected exports can be saved through a cloud-backed Android document provider and remain outside app deletion. This does not protect data from someone with access to the unlocked device. |

**Do not claim:** reduced screen time, improved focus, productivity, mental-health outcomes, saved hours, better sleep, reliable Shorts/Reels-only blocking, website filtering, cross-device sync, or Play Store availability. These are unsupported, unimplemented, or unverified. Never invent testimonials, downloads, conversion numbers, or customer stories.

### Permission explanation in any install flow

Ollo needs Android Usage Access to read the usage history shown in the app, and Accessibility access to notice when a selected app opens and place Ollo’s pause screen. The current service uses package changes, not screen-content retrieval. Android grants and can revoke these permissions; the app must remain clear about why each is needed. Marketing copy and a website do not replace the separate in-app disclosure and affirmative consent required for Play policy. Recheck the current policy and the exact submission declaration before public release.

## Distribution and offer

There is no price decision to validate yet: version 0.2.0-review has no payments. Keep the first proposition simple and free during product learning. Decide later whether payment belongs in the product only after validating repeat use and support costs; do not imply a paid tier or promise lifetime free access.

The available review APK is private and signed with a development key that differs from the earlier supplied APK; it cannot update that older installation in place. It is not a public Play Store release. Use it only for explicitly recruited review participants with clear sideloading, permission, uninstall/data-loss and signing-key instructions. For public acquisition, first prepare a stable distribution path, owner-controlled signing, listing, permission/policy review, privacy disclosures, support contact, and physical-device acceptance. The current review notes flag calls, alarms, OEM recovery, background reliability, battery cost and permissions for device acceptance.

## Channel choice

Use short vertical videos as a **creative-validation format** because the mascot and visible app interaction make the central moment easy to demonstrate. Publish a small, varied set organically on Instagram Reels and YouTube Shorts; TikTok is a possible additional test if the maker can maintain it. Recut the same core footage with platform-native captions/audio, not a single watermarked export. No selective Reels/Shorts blocker exists in Ollo, so never imply it does.

Pair video with a lightweight product page/repository page that shows the actual setup and permissions, supported Android version, limitations, privacy facts, and current release status. Invite a few people directly through existing personal/community channels only with their consent; ask about their own experience, not for public endorsements. Do not spend on ads in the first 30 days. If organic and setup feedback show a clear audience, consider a small paid test after public distribution is ready.

## 30-day low-budget plan

Budget target: €0 media spend; existing phone/emulator and free editing tools. The time budget can be one maker session per week plus participant sessions. These are activities and learning targets, not expected market results.

| Days | Work | Evidence to collect |
|---|---|---|
| 1–5 | Make a plain product page with a 20-second screen recording, one-line promise, feature/permission explanation, release status and privacy facts. Prepare support/feedback route. | Can a first-time visitor explain what Ollo does, what access it needs, and whether it is public yet? |
| 6–10 | Show the page and onboarding to 5–8 Android users who report automatic checking. Ask for a recent concrete moment and watch them configure one selected app. Do not lead them to praise the idea. | Where the value is understood or misunderstood; setup completion; permission hesitation; mistaken expectations. |
| 11–17 | Film 3 distinct 15–25 second concepts from AD-CONCEPTS.md using real app capture and mascot overlays. Add Dutch captions, keep app UI readable, and label review footage if shared privately. | Record source, concept, posting date, reach/impressions, 3-second/engaged views where available, profile/page visits, qualified feedback and any install inquiry. |
| 18–24 | Post 2–3 organic clips on one or two channels the maker can maintain. Use no paid boost. Reply transparently to questions about permissions and missing features. | Compare hook retention and meaningful page actions per impression; capture questions verbatim with consent. |
| 25–30 | Revise the best-understood concept, run five more observed setup sessions if possible, and write a go/no-go note for public release readiness. | Decide which wedge/message merits another test; list blockers before public promotion. |

### Experiments and decision rules

Treat all numbers below as **provisional operating hypotheses**, not industry benchmarks.

| Hypothesis | Test | Continue if… | Change direction if… |
|---|---|---|---|
| Users recognize automatic opening as a problem they want to address. | 5–8 short interviews; ask about the last real incident before describing Ollo. | At least 4 independently describe a recent unwanted opening and a moment they would welcome a pause. | Fewer than 3 describe this without prompting: interview a different audience or narrow to a specific moment. |
| The “pause before opening” message is clearer than a generic wellbeing message. | Two matched organic clips with the same UI and different hooks. | One hook produces at least 1.5× the other’s 3-second hold or qualified page action rate after 300 impressions per clip; otherwise call the result inconclusive. | If the generic message wins only in likes but loses page actions or comprehension, keep the specific message. |
| Users will grant the necessary Android access when explained honestly. | Observe setup with at least 5 people; explain each permission before its system screen. | 4/5 can explain the purpose and complete setup without facilitator intervention. | If 2+ misunderstand or decline, improve onboarding/disclosure before increasing reach. Never hide access. |
| The optional quiz is a distinctive hook rather than a confusing feature. | Compare quiz-focused creative and selected-app pause creative; ask viewers what happens before opening. | Quiz creative improves accurate recall of Ollo’s behavior without making people think the quiz is mandatory. | If users think quizzes are always required or can bypass hard blocks, remove that framing and show app settings/optional label. |

Small samples are directional. Platform view counts are not installs, and the app has no in-app acquisition analytics. Use platform-native aggregate reporting and a simple manual log; do not add tracking SDKs or ask for sensitive usage screenshots as proof. If a public listing becomes available later, compare listing visits and installs there while respecting platform reporting limits.

## Creative rules

- 9:16 vertical, show Ollo/mascot early, keep captions inside the platform safe area, and make dialogue understandable with sound off. Use licensed/platform-cleared music or original sound.
- Make the orange pixel mascot a recognizable guide: a small spark, tiny challenge, or playful “pause” sign. Keep Ollo’s white/orange/charcoal interface visible and real.
- Show one situation and one feature per clip. Use real captures from a build; label any demo data as demo and never present it as the viewer’s result.
- Do not frame a high screen-time number as a moral failure. Do not use fake push alerts, fabricated people/results, or before/after claims.
- Show setup friction honestly where the ad prompts installation. State Android 10+ and the permissions, and avoid a “one tap, fully protected” impression.

## Research notes and sources

Research checked **16 October 2026**. Sources below informed the execution format and policy notes, not a prediction that any channel will perform for Ollo. Platform creative guidance is platform-authored and may be biased toward advertiser outcomes. Its performance statistics should not be treated as independent evidence or Ollo forecasts.

- Google Play, [Use of the AccessibilityService API](https://support.google.com/googleplay/android-developer/answer/10964491?hl=en-en) — scope, declaration, disclosure and consent requirements for apps that are not accessibility tools.
- Google Play, [Best practices for prominent disclosure and consent](https://support.google.com/googleplay/android-developer/answer/11150561?hl=en) — disclosure should occur in-app before the relevant permission request and explain why/how.
- TikTok for Business, [Creative Codes](https://ads.tiktok.com/business/en-US/creative-codes) — vertical framing, hook/body/close, safe zones, sound and trend adaptation. Use as format guidance, not outcome guarantee.
- TikTok for Business, [5 creative tips for TikTok ads](https://ads.tiktok.com/business/creativecenter/quicktok/online/5_creative_tips/pc/en) — mobile-first, native creative and early hooks; recommendations explicitly are guidelines.
- YouTube Help, [Shorts upload tips](https://support.google.com/youtube/answer/12921536) — vertical Shorts workflow and sustainable posting cadence.

Product facts are checked against the repository README, [research and feature status](https://github.com/geinigegastcoding/Ollo/blob/main/docs/RESEARCH.md), and [0.2.0 verification record](https://github.com/geinigegastcoding/Ollo/blob/main/docs/VERIFICATION.md). They describe the review build, not public availability or universal device compatibility.

## Name and app-store discovery check —17 October 2026

Three directly opened public Play listings already use Ollo or OLLO for unrelated products:

| Listing | Publisher | Stated purpose |
|---|---|---|
| [OLLO](https://play.google.com/store/apps/details?id=com.ollo.olloapp) | Think.Web.id | Music and advertising for business premises |
| [Ollo](https://play.google.com/store/apps/details?id=com.ollodrive.user) | Ollo drive | Ride booking |
| [Ollo - Budget & Money Manager](https://play.google.com/store/apps/details?id=com.ollo.ollo) | Low Orbit Labs | Personal finance management |

**Inference for promotion:** the bare name alone does not distinguish this app. Keep the existing descriptive Dutch title hypothesis **“Ollo: pauze voor apps”**, and pair short brand mentions with the selected-app pause purpose or the orange pixel mascot. Once the owner establishes a public listing, link to its verified destination instead of asking people to find a bare-name search result. This adds a discovery consideration; it does not justify renaming the app or changing its visual identity.

The lookup was a small public-web sample, served as English/US Play pages. It did not measure Netherlands on-device search rankings, search volume, audience confusion, name rights or legal availability. The public lookup for the native identifier `app.ollo` returned a tool internal error, so package availability remains unknown; only the owner's Play Console can settle the intended listing setup. No account was accessed, package reserved or application renamed.
