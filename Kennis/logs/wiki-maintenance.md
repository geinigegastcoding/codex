---
title: Wiki Maintenance Log
created: 2026-07-26
updated: 2026-07-26
type: log
tags: [system, maintenance, github]
sources: []
---

# Wiki Maintenance Log

Automated daily audits append entries here. Imported Magisdata logs are kept separately and are not rewritten.

## [2026-07-26] initialization

- Initial audit log created.

## [2026-07-26] audit | Daily wiki maintenance

- Audited 75 Markdown files, excluding imported historical files under `logs/`.
- Findings: 0 broken wikilinks after conservative repairs, 0 duplicate titles, 46 orphan active notes, 52 missing index entries, 60 frontmatter findings (primarily legacy/imported company notes and structural Markdown; one malformed legacy template YAML), 0 stale status/decision notes, 0 unresolved `needs-review` captures, and 3 pages over 200 lines.
- Actions: repaired links in `logs.md` and `personal/areas/habits.md`; added personal area/resource/journal notes to `index.md` and `01-navigation.md`. No notes archived or deleted; imported logs unchanged.
- Changed files: `logs.md`, `personal/areas/habits.md`, `index.md`, `01-navigation.md`, `logs/wiki-maintenance.md`.
- Push status: succeeded to `origin/main` after commit `5e1bf80`.

## [2026-07-27] audit | Daily wiki maintenance

- Audited 75 Markdown files, excluding imported historical Markdown under `logs/`; raw HTML sources were excluded.
- Findings: 0 broken wikilinks, 0 duplicate titles, 37 orphan active notes, 56 missing index entries (mostly legacy/imported company material and structural files), 0 frontmatter defects in scoped system/personal/source/query notes, 0 unresolved `needs-review` captures, 0 stale status/decision notes, and 3 oversized company pages (>200 lines).
- Tag audit: no out-of-pattern tags detected; the vault has no separate explicit tag-taxonomy file. No raw-source drift was present for the audited Markdown set.
- Actions: no notes archived, deleted, or rewritten; no conservative repairs were necessary. Legacy/imported files remain preserved. Important navigation entries were already present in `index.md` and `01-navigation.md`.
- Changed files: `logs/wiki-maintenance.md`.
- Push status: succeeded to `origin/main` after commit `abf5ac6`.

## [2026-07-28] audit | Daily wiki maintenance

- Audited 76 Markdown files, excluding imported historical Markdown under `logs/` and raw HTML sources.
- Findings: 0 broken wikilinks after case-insensitive Obsidian resolution and one attachment-path repair, 0 duplicate titles, 39 orphan active notes (mostly legacy/imported company material), 0 missing important navigation entries after repair, 0 frontmatter defects in scoped system/personal/source/query notes, 0 invalid tags, 0 stale status/decision notes, 0 unresolved `needs-review` captures, and 3 oversized company pages (>200 lines).
- Actions: preserved all information; added important company and personal navigation entries, updated navigation dates, and repaired the attachment link in `company/Journals-WrittenByDaniël/Improving Codex.md`. No notes archived or deleted; imported logs unchanged.
- Changed files: `index.md`, `01-navigation.md`, `company/Journals-WrittenByDaniël/Improving Codex.md`, `logs/wiki-maintenance.md`.
- Push status: succeeded to `origin/main` after commit `e585ef2`.

## [2026-07-29] audit | Daily wiki maintenance

- Audited 75 Markdown files, excluding imported historical Markdown under `logs/` and raw HTML sources.
- Findings: 0 broken wikilinks, 0 duplicate titles, 45 orphan active notes (primarily legacy/imported company material plus root utility notes), 0 missing important navigation entries, 0 frontmatter defects in 14 scoped system/personal/source/query notes, 0 invalid tags, 0 stale status/decision notes, 0 unresolved `needs-review` captures, and 3 oversized company pages (>200 lines).
- Actions: preserved all information; no notes archived, deleted, or rewritten; imported files under `logs/` remain unchanged. No navigation repairs were necessary.
- Changed files: `logs/wiki-maintenance.md`.
- Push status: succeeded to `origin/main` after commit `60ca21e`.

## [2026-07-29] migration | Local Kennis aligned with Wiki system

- Baseline: `geinigegastcoding/Wiki` commit `22c1800eb6cdc36e7d8327a593e82260f8d3672d`; all 119 remote files are present in the local vault.
- Actions: moved the existing Magisdata corpus under `company/`; installed the root authority/navigation/capture/operating/maintenance system plus `personal/` and `sources/`; kept imported historical logs unchanged; retained local Obsidian graph state and kept `workspace.json` local-only.
- Local additions preserved: all 7 files in `company/Courses/Stedelijk Gymnasium Leiden - AI voor docenten/` and `logs/2026-07-29 - Personal Dashboard Workspace.md`.
- Validation: all 105 pre-migration local files accounted for, 0 former company items left at vault root, 0 broken wikilinks, 0 ambiguous wikilinks after 7 path-qualification repairs, 0 scoped frontmatter failures, and no `.env` files introduced.
- Known baseline warning: 10 legacy Markdown asset/file links remain unresolved in `company/Templates/`; the same 10 unresolved links are present in the pinned remote Wiki and were not introduced by this migration.
- Related active instructions updated: `AGENTS.md`, council output paths, strategy-council output paths, and SOP output paths now use the governed `company/` layout.
- Git status: changes left uncommitted; no commit or push was requested.
