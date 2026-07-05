# 2026-07-02 - Council Skill Split

- **Session ID**: 45264fb9-e069-4ae7-954d-d882b69c814d

## Summary
Split the council agent into two distinct skills: a strictly scoped `council` for executing specific topics and a new `strategy-council` for broad business brainstorming and pivots.

## Files Changed
- `C:\Users\Daniël\Desktop\Codex\.agents\skills\council\SKILL.md` (modified)
- `C:\Users\Daniël\Desktop\Codex\.agents\skills\strategy-council\SKILL.md` (created)

## Key Decisions & Assumptions
- Original `council` skill was overly broad, resulting in unwanted business pivots during standard tasks.
- Restricting `council` ensures it sticks to the user's explicit scope without expanding.
- `strategy-council` explicitly includes the "Idea Generator" and focuses on out-of-the-box product ideas.

## Next Steps
- Use `/council` for execution.
- Use `/strategy-council` for business pivots.

## Related Notes
- [[keyword-strategy-council.md]]
