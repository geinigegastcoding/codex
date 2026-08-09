# Kai format analysis

## Identity and evidence boundary

`https://www.youtube.com/@kaiexplainsYT` resolved on 3 August 2026 to **Kai**, channel ID `UCgUfJoPtkt7-RiiuYh4vmGA`. Ten videos were sampled. Captions are auto-generated, so uncertain names and punctuation are not silently corrected.

## Sample

The sample spans 399–817 seconds and includes local-AI guides, tool lists, architecture explainers, model/hardware comparisons and replacement workflows. Public views are recorded only as a sample-selection signal. Full metadata is in `research/channels/kaiexplains/videos.json`.

## Script and narrative

### Hooks favor direct scenarios and high-stakes contrasts

- **Observed:** *Running a 80B AI Model on a 8GB GPU* opens “The model file is 160 GB. The graphics…” at [0:00–0:04](https://www.youtube.com/watch?v=5E3qTmQPmP8&t=0s), making the hardware contradiction immediate.
- **Observed:** *HTMX Explained* opens with a concrete button behavior at [0:00–0:07](https://www.youtube.com/watch?v=HPAh1uiE2z0&t=0s), then reveals that no authored JavaScript is involved at [0:07–0:14](https://www.youtube.com/watch?v=HPAh1uiE2z0&t=7s).
- **Observed:** *OmniRoute + Claude Code* starts “I canceled my Claude Code subscription” at [0:00–0:02](https://www.youtube.com/watch?v=k26fT4athQs&t=0s).
- **Observed:** *Best Local AI Models For Every GPU* starts with a directive—“Stop asking what's the best local AI…”—at [0:00–0:03](https://www.youtube.com/watch?v=mtk8p8czzDU&t=0s).
- **Likely inference:** these are intended to compress the problem and opinion into the opening sentence. Retention impact is unknown.

### Personal testing claims require stronger sourcing in our adaptation

- **Observed:** *I Replaced Every AI Subscription I Pay For* says the creator spent a week replacing `$120 a month` at [0:14–0:21](https://www.youtube.com/watch?v=MgHQncHjDhs&t=14s).
- **Observed:** the same opening makes broad claims about provider access, pricing and data at [0:00–0:28](https://www.youtube.com/watch?v=MgHQncHjDhs&t=0s).
- **Rule for our channel:** never inherit a personal-test framing unless the test was actually run and documented. Provider-policy and privacy claims require primary sources and precise wording.

### Pace is higher than the Devsplainers transcript sample

Caption-derived estimates range from **165 to 192 WPM**. Examples: 172 WPM for [HTMX Explained](https://www.youtube.com/watch?v=HPAh1uiE2z0), 180 WPM for [oLLM Guide](https://www.youtube.com/watch?v=5E3qTmQPmP8), 189 WPM for [OmniRoute](https://www.youtube.com/watch?v=k26fT4athQs), and 192 WPM for [AI subscriptions](https://www.youtube.com/watch?v=MgHQncHjDhs). These are estimates from normalized captions.

### Explanation pattern

- **Observed:** the HTMX video demonstrates the output first, identifies the surprising constraint, contrasts it with a React implementation at [0:14–0:29](https://www.youtube.com/watch?v=HPAh1uiE2z0&t=14s), then states the simpler mechanism at [0:32–0:43](https://www.youtube.com/watch?v=HPAh1uiE2z0&t=32s).
- **Observed:** the local-subscription video moves from dissatisfaction to a replacement project, then reveals hardware at [0:28–0:34](https://www.youtube.com/watch?v=MgHQncHjDhs&t=28s).
- **Likely inference:** Kai's sample more often frames the narrator as making a choice, while Devsplainers more often frames a system-level anomaly. This is a sample-level distinction, not a universal claim.

## Visual language

Frame extraction was performed locally with dense opening samples, later fixed intervals and scene-change samples. Missing scene-change-only samples for two videos are reported in `frame-extraction-warnings.json` rather than guessed.

- **Observed:** the oLLM video uses a dark canvas with one numerical or architectural idea per frame: a three-part structure at [0:18](https://www.youtube.com/watch?v=5E3qTmQPmP8&t=18s), a `7.5 GB` focal value at [2:06](https://www.youtube.com/watch?v=5E3qTmQPmP8&t=126s), a storage-bandwidth/token-speed ratio at [3:18](https://www.youtube.com/watch?v=5E3qTmQPmP8&t=198s), and code evidence at [4:12](https://www.youtube.com/watch?v=5E3qTmQPmP8&t=252s).
- **Observed:** red, yellow and blue carry stable semantic roles within that video: bottlenecks or warnings are red, primary quantities are yellow, and comparison/system elements are blue. This is one-video evidence, not a universal palette claim.
- **Observed:** the subscription-replacement video repeatedly contrasts paid services in red with owned or free alternatives in blue, including `$120 / month` versus `yours` at [0:18](https://www.youtube.com/watch?v=MgHQncHjDhs&t=18s), ChatGPT/Claude versus Open WebUI at [2:24](https://www.youtube.com/watch?v=MgHQncHjDhs&t=144s), and Perplexity versus Perplexica at [3:36](https://www.youtube.com/watch?v=MgHQncHjDhs&t=216s).
- **Observed:** HTMX uses restrained server/browser flow diagrams at [1:00–1:30](https://www.youtube.com/watch?v=HPAh1uiE2z0&t=60s), then moves into UI and syntax examples by [2:30–2:45](https://www.youtube.com/watch?v=HPAh1uiE2z0&t=150s). This supports a `behavior → mechanism → implementation` visual sequence.
- **Likely inference:** across these samples, motion graphics are used to simplify comparisons and architecture, while UI/code frames appear when implementation evidence is needed.
- **Unknown:** exact average visual-change interval, caption styling, cursor treatment and transition taxonomy remain unmeasured.

## Packaging

- **Observed:** titles frequently combine a concrete capability with intensity or constraint: “80B AI Model on a 8GB GPU,” “No GPU Needed,” “My Top 3,” and “5 Open Source AI Tools.”
- **Observed:** several titles use “INSANE,” all-caps modifiers, parenthetical benefits, or cancellation framing.
- **Rule for our channel:** retain specificity and constraints, but avoid inherited hype language. A title should state the task, result or tradeoff without pretending every tool is extraordinary.

## Useful mechanisms for an original channel

- Demonstrate the behavior before explaining the abstraction.
- Use a hardware, cost or workflow constraint to make the question precise.
- Compare implementation paths using the same task.
- Finish with a decision rule rather than a generic recommendation.

## Do not copy

Do not mirror “INSANE” packaging, cancellation stories, personal testing claims, exact thumbnails, wording, narration cadence, brand identity, or recognizable edits. Do not claim to have used tools that were not tested.

## Unknowns

Private retention, conversion, production process, sponsorships, causal impact of titles or edits, and whether every stated test was independently reproduced remain unknown.
