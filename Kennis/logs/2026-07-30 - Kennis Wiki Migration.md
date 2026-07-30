# 2026-07-30 - Kennis Wiki Migration

- **Session ID**: unavailable

## Summary
Migrated the local Kennis vault to the governed second-brain architecture from `geinigegastcoding/Wiki` commit `22c1800eb6cdc36e7d8327a593e82260f8d3672d`. Moved Magisdata material under `company/`, installed root governance/personal/source structures, preserved all local content, repaired migration-created link ambiguity, and verified structural integrity.

## Files Changed
- `Kennis/.gitignore`, `Kennis/.hermes.md`, `Kennis/00-authority.md`–`04-maintenance.md`, `Kennis/GITHUB-LOGIN.md`, `Kennis/README.md`, `Kennis/index.md`, `Kennis/log.md`, `Kennis/logs.md` (created)
- `Kennis/personal/**`, `Kennis/sources/**`, `Kennis/logs/wiki-maintenance.md` (created)
- `Kennis/{company files and directories}` → `Kennis/company/**` (moved)
- `Kennis/Courses/**` → `Kennis/company/Courses/**` (moved)
- `Kennis/logs/2026-07-11-akal-bakkerij-*.md` → `Kennis/company/` (moved)
- `Kennis/01-navigation.md`, `Kennis/index.md`, `Kennis/company/Readme.md` (modified)
- `Kennis/company/{Daniel Magis,Dashboard and AI Ideas,decisions,Products and Pricing,progress,Status}.md` (modified: path-qualified company Readme links)
- `Kennis/.obsidian/workspace.json` (removed from Git tracking; retained locally and ignored)
- `AGENTS.md`, `.claude/skills/{council,create-sop,strategy-council}/SKILL.md` (modified paths)
- `Kennis/MagisData/` (empty directory removed)

## Key Decisions & Assumptions
- Remote Wiki defines structure; newer/local content remains authoritative and was not overwritten.
- Company training content belongs under `company/Courses/`; historical logs remain unchanged.
- `queries/` and `_archive/` remain demand-created because the remote contains no tracked directories.
- Local Obsidian graph state was preserved; workspace state remains local-only.
- Ten unresolved legacy template asset links match the remote baseline and were documented, not rewritten.

## Next Steps
- Review the migration diff and commit/push only when explicitly desired.
- Optionally repair the ten pre-existing `company/Templates/` asset/file links in a separate task.

## Related Notes
- [[00-authority]]
- [[01-navigation]]
- [[04-maintenance]]
- [[logs/wiki-maintenance]]
- [[company/Readme]]
