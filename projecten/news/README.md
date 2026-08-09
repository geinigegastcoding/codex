# Sift

Sift is a calm, personal information layer: it finds the few events worth knowing for one person, groups coverage around the event, and explains why each item made the cut.

This folder contains the product work and a functional front-end prototype. The prototype uses illustrative demo stories; it does not fetch live news, authenticate users, or republish publisher text.

## Run the prototype

```powershell
node server.mjs
```

Open `http://localhost:4173`.

The prototype itself has no runtime dependency. If you want to run the browser smoke test, install the optional dev dependency with `npm install` and run `npm test`.

## Product decisions

- The primary object is a story/event, not an article.
- The feed is intentionally short. Empty space is a valid result.
- Every recommendation has a visible explanation and source list.
- Explicit interests and blocks outrank inferred behavior.
- Global importance can override a profile, but only as a labelled, rate-limited lane.
- The MVP proves usefulness with curated demo data before investing in a broad crawler or custom recommender.

## Documents

- [Product specification](docs/product-spec.md) - challenge, target user, experience, MVP/V2/later.
- [Research](docs/research.md) - competitors, source options, API constraints, and copyright boundaries.
- [Architecture](docs/architecture.md) - ranking, event model, ingestion pipeline, schema, privacy, and stack.
- [MVP plan](docs/mvp-plan.md) - exact build order, experiments, definition of done, and cuts.

## Design direction

The interface is inspired by the friendly clarity of Duolingo's design language, without copying its brand assets: confident green as the action color, rounded geometry, compact progress cues, playful micro-feedback, and strong accessibility states. The editorial layer stays quiet and information-dense so it feels like a reading tool rather than a social feed.

%% ponytail: static prototype first; live ingestion waits for a validated selection hypothesis %%
