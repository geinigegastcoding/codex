---
title: Wiki Maintenance Contract
created: 2026-07-26
updated: 2026-07-26
type: system
tags: [system, maintenance, quality, github]
sources: []
---

# Wiki Maintenance Contract

The daily audit is conservative and repeatable. It must improve structure without destroying history. Automatic commits and pushes are approved; the job should commit intended wiki changes after auditing and then push `main`.

## Audit checklist

- Validate Markdown frontmatter on system, company, personal, source, query, and archive notes.
- Find broken Obsidian wikilinks such as `[[00-authority]]`, missing index entries, orphan notes, duplicate titles, and invalid tags.
- Check that every active note has at least one useful inbound or outbound link where appropriate.
- Check stale status/decision pages and surface them for review; do not silently rewrite facts.
- Detect possible company/personal boundary violations and unresolved `needs-review` captures.
- Archive only clearly superseded pages, preserve the original, and update links/index.
- Preserve every file in `logs/`; never rewrite imported logs.
- Append an audit result to `logs/wiki-maintenance.md`.
- Commit and push only the wiki repository's own Markdown/config changes to `origin/main`.

## Authority tracking

`00-authority.md` defines the trust model. `03-operating-model.md` defines how Hermes queries and writes. This contract is the maintenance checklist. Changes to these three files require deliberate review and a log entry.

## Failure behavior

If GitHub authentication or push fails, keep local changes, write the failure to the maintenance log, and report it next time. Never delete notes to make a push succeed.

## Related pages

- [[00-authority]]
- [[01-navigation]]
- [[03-operating-model]]
