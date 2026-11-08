# Phantom Wallet video research

## Source and method

- Source: [Phantom Wallet walkthrough](https://www.youtube.com/watch?v=8xQDjhsR4t8)
- Local source: `C:\Users\daniel\AppData\Local\Temp\dashlab-video-research\phantom.mp4` (1920x1080, 23.976 fps, 14:46.80; container creation metadata 2024-11-20). Video shows an Android handset, but OS version, handset model, and app version are not legible/identified.
- Scouted dashboard and around the requested deposit (~4:07), withdraw (~6:40), and swap (~11:16) portions. Extracted consecutive source-rate frames over 3-second windows at 04:05, 06:38, and 11:15 (about 72 frames/window; 0.0417 sec/frame). Contact sheets are in `E:\MData\screenshots\larp-dashboard\research\phantom\`.
- Contact sheets include the presenter alongside the phone screen. These are source-composited video frames, not clean app screenshots. Small labels should be treated cautiously.

## Observations

The home portfolio is a narrow, dark mobile surface: account selector/header; large centered USD total with green change; four compact action tiles (Receive, Send, Swap, Buy); a chart area/placeholder with helper copy; vertically stacked token rows with icons, token names, token balances and right-aligned USD values/change; fixed bottom navigation with five icons. The sampled portfolio total moves slightly (about $22.22 to $22.21), so values are live/demo content rather than stable design details. A green tint/gradient sits behind the balance, while the rest uses near-black/charcoal cards, muted gray copy, purple accents, and green positive figures. Rounded cards and controls are visible. Typeface appears to be a compact modern sans, likely system-like; exact family, sizes, and colors cannot be measured reliably from the scaled recording. Phone aspect ratio is portrait; screen pixel dimensions are not recoverable from the video.

Phantom's [2023 brand announcement](https://phantom.com/learn/blog/introducing-phantom-s-new-brand-identity) identifies a custom global typeface called Phantom, made with F37 Foundry. The video frames do not establish whether every wallet UI label in the recording uses that font or a system fallback.

### Receive/deposit — 04:00 scout and sequential 04:05–04:08

The scout shows the home screen followed by a full-screen `Receive SOL` page: back arrow and title at top, large QR region, account/address row with Copy control, explanatory text, and a wide purple `Share address` button near the bottom. No secret phrase is visible. The 3-second source-rate contact sheet stays mostly on the portfolio, with the receive page only apparent at the end of the broader scouting sequence. A clean touch-to-transition sequence is not captured in the selected 04:05 window; therefore do not infer animation type, duration, or easing. The observed result is a page-level navigation, not evidence of a bottom sheet.

### Withdraw/send — 06:30 scout and sequential 06:38–06:41

The scout shows `Send USDC` with address field, network/asset context, amount entry, warning/help text in yellow, and a bottom amount/withdraw action. In the subsequent route a `Send SOL` recipient page appears with a name/address field and bottom `Next` button; a SOL asset detail page is also visible (balance, action row, staking and price detail). The short 06:38 source-rate sheet remains on the send form; it does not clearly capture the tap that opened it or a resulting confirmation. The interface includes dark blue-gray input panels and yellow caution copy. Exact amounts and all fine print are too small to transcribe safely.

### Swap — 11:06 scout and sequential 11:15–11:18

The home screen opens a `Swap Tokens` page. The page has an input token selector/amount area, a central direction/swap control, and a `Select Token` destination row; the bottom navigation remains visible. In the wider scout, token selection leads to token detail screens and the swap view appears again. The selected sequential window mostly shows the home screen and presenter; it does not provide a legible, frame-by-frame tap or completed quote/result. Do not claim a swap confirmation or specific transition motion from this evidence.

## Motion, certainty, and useful direction

At 23.976 fps, adjacent frames are approximately 41.7 ms apart. Sequential sampling confirms persistent screens and route changes in the recorded walkthrough, but selected intervals do not show enough unoccluded phone pixels to time transitions or distinguish animation from an edit/cut. The video composition occasionally cuts/zooms to the presenter, so those are editorial cuts, not app motion. No chart plot is legibly rendered in the sampled home state; the visible chart panel contains explanatory/placeholder copy. Avoid inventing curve behavior.

Supported ideas for the fictional LARP dashboard: keep a clear total above compact primary actions, show assets as dense icon/name/value rows, and use a focused receive page with a prominent copy/share action. Keep any simulated address explicitly fictional. The recording does not support copying wallet network behavior, real transaction warnings, precise colors/spacing, or animation timings.

## Evidence files

- `E:\MData\screenshots\larp-dashboard\research\phantom\scout-portfolio.png`
- `E:\MData\screenshots\larp-dashboard\research\phantom\scout-deposit.png`
- `E:\MData\screenshots\larp-dashboard\research\phantom\scout-withdraw.png`
- `E:\MData\screenshots\larp-dashboard\research\phantom\scout-swap.png`
- `E:\MData\screenshots\larp-dashboard\research\phantom\deposit-sequential.png`
- `E:\MData\screenshots\larp-dashboard\research\phantom\withdraw-sequential.png`
- `E:\MData\screenshots\larp-dashboard\research\phantom\swap-sequential.png`

These are ffmpeg contact sheets derived from the attributed local source video. No app code was changed.
