# Python Path

A complete personalized Python course and localhost learning dashboard. It starts with a targeted foundation refresh based on the learner’s diagnostic, then advances through reliable Python, algorithms, APIs and responsible scraping, data analysis, statistics, machine learning, neural networks, and capstone projects.

## What is included

- 8-stage course map with 48 short lessons.
- 24 automatically checked coding exercises with alternative-solution support.
- Staged hints after unsuccessful attempts.
- Browser-side Python through a dedicated Pyodide Web Worker.
- Hard execution timeouts, import restrictions, and output limits.
- Adaptive skill mastery and spaced review.
- Local progress, drafts, streaks, protected rest days, vacation mode, XP, levels, and project milestones.
- 10 projects including a sports predictor, neural network from scratch, recommender, Magis Data tool, and Flappy Bird AI.
- Curated official documentation, YouTube/course resources, and rigorous mathematics support.
- Responsive dark green/black dashboard with accessible chart table views.

## Requirements

- Current Node.js and npm.
- A modern Chromium-family browser for the complete checker and Playwright suite.
- Internet access for installing dependencies and opening external learning resources. Core lesson content and the Python runtime are served locally after installation.

## Install and run

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

## Verify everything

Install Playwright’s browser once if needed:

```bash
npx playwright install chromium
```

Then run:

```bash
npm run verify
```

The verification chain runs lint, TypeScript, unit tests, a production build, Playwright route/persistence/checker tests, and responsive screenshots.

Individual commands:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

## Progress and privacy

Progress is stored under `python-course-workspace:v1` in browser `localStorage`. There is no account, analytics service, remote database, or automatic upload. Clearing browser storage removes local progress unless it was exported from Settings.

The export is readable JSON and contains course progress, code drafts, statistics, and settings. It does not contain API keys. Never place API keys inside exercise code or browser storage.

## Python checker

Pyodide assets are copied into the production build and loaded in a Web Worker. Each attempt receives a fresh Python namespace. The checker:

- validates imports against the exercise allowlist;
- captures and limits output;
- compares behavior rather than requiring one exact implementation;
- terminates the worker after a timeout and starts a clean replacement;
- maps failures to guided feedback rather than revealing the full solution.

The worker is designed to contain normal learner mistakes, not to execute hostile code as a hardened security sandbox.

## Larger local projects

Pygame, NEAT, PyTorch, TensorFlow, live API collection, and live scraping run in a normal local Python project rather than Pyodide. The course provides milestones and prerequisite lessons. Use a virtual environment:

```bash
python -m venv .venv
.venv\Scripts\activate
python -m pip install --upgrade pip
```

Only install the packages required by the selected project. Scraping projects must respect terms, privacy, robots guidance, rate limits, and authorization.

## Adding course content

- Course structure: `src/content/catalog.ts`
- Checked exercises: `src/content/exercises.ts`
- Projects: `src/content/projects.ts`
- External resources: `src/content/resources.ts`
- Diagnostic placement: `src/content/diagnostic.ts`

Every lesson needs objectives, explanation, an example, a challenge, skills, and resources. Every coding exercise needs behavior tests, three increasingly specific hints, starter code, and a reference solution. `validateCatalog()` fails loudly for missing course references.

## Troubleshooting

### Python stays on “Starting Python…”

1. Confirm `npm install` completed.
2. Restart the Vite server.
3. Check that `/pyodide/pyodide.asm.wasm` and related assets are available.
4. Use a current Chromium browser.
5. Check the browser console for a blocked asset or WebAssembly error.

### Progress did not persist

Browser privacy settings can disable local storage. The app remains usable in memory, but persistence requires localStorage access. Export progress regularly.

### A capstone cannot run in the browser

That is expected for Pygame/NEAT and major ML frameworks. Follow the project’s local-environment milestone path instead of trying to install those packages in Pyodide.
