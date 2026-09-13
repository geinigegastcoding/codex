# UI Inspiration Corpus

Private, local-first UI sourcebook for coding agents. It stores reusable source metadata and license boundaries instead of silently mirroring protected inspiration sites.

## Run it

Requires Node.js 20 or newer. There are no runtime dependencies.

```powershell
npm test
npm run validate
npm start
```

Open the printed local URL, normally `http://127.0.0.1:4173`.

The same commands are available through the CLI:

```powershell
node .\bin\ui-corpus.mjs list --class A
node .\bin\ui-corpus.mjs search tokens
node .\bin\ui-corpus.mjs show shadcn-ui
node .\bin\ui-corpus.mjs pull shadcn-ui
node .\bin\ui-corpus.mjs pull shadcn-ui --file packages/shadcn/package.json
node .\bin\ui-corpus.mjs content shadcn-ui
node .\bin\ui-corpus.mjs content shadcn-ui --file README.md
node .\bin\ui-corpus.mjs validate
node .\bin\ui-corpus.mjs serve --port 4173
```

## Add a source

Create a JSON file containing one record or an array of records, then validate and add it:

```powershell
node .\bin\ui-corpus.mjs add --file .\incoming-source.json
npm run validate
```

The CLI refuses to write records with missing metadata, invalid URLs, duplicate IDs, or an unknown A/B/C/D classification.

`pull` fetches the README and first available standard license file from A-class official GitHub repositories into `content/<id>/`, then writes a manifest containing the source URL, timestamp, byte count, and SHA-256 hash. Extra files must be requested explicitly. C/D records are blocked, and non-repository websites require explicit `content_pull` permission metadata; the CLI never falls back to generic scraping.

`content` reads the local manifest or prints a pulled text file for agent use. Repository pulls use the mutable `HEAD` ref by default; add an explicit commit/ref to source metadata when reproducible provenance is required.

## Boundaries

- A: reusable under the recorded license.
- B: usable only after per-asset, attribution, API, or commercial review.
- C: URL and personal notes only.
- D: do not automate, download, or rehost.

The server is intentionally read-only. Update the corpus through a reviewed JSON record and the CLI so provenance stays visible. The repository contains metadata and links; it does not contain downloaded screenshots or protected third-party assets.
