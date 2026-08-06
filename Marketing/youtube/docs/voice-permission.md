# Voice Permission Record

> This guardrail records permission; it is not legal advice. Do not set `VOICE_PERMISSION_CONFIRMED=true` until every required field is complete and written evidence is retained.

- **Permission status:** confirmed for an existing Fish Audio platform voice; this is not a private voice clone
- **Voice owner:** Fish Audio platform voice (reference ID is stored in .env.local)
- **Date permission received:** 2026-08-03 (user confirmation in the current Codex task)
- **Permitted platforms:** YouTube and local production renders
- **Commercial use allowed:** Per the existing voice listing and user confirmation
- **AI cloning explicitly allowed:** Not applicable; no new voice clone is being created
- **Permission duration:** Per the existing voice listing
- **Territory:** Per the existing voice listing
- **Editing allowed:** Not applicable beyond normal narration generation
- **Synthetic generation allowed:** Yes, for this production
- **Continued use after collaboration ends:** Per the existing voice listing
- **Evidence location:** User confirmation in the current Codex task, 2026-08-03

## Operational rule

The TTS command refuses to synthesize with a `reference_id` unless both conditions are true:

1. This record documents explicit written permission.
2. `.env.local` contains `VOICE_PERMISSION_CONFIRMED=true`.

A third-party cloned voice may also require YouTube altered/synthetic-content disclosure. Never imply that the voice owner created, owns, or endorses the channel.
