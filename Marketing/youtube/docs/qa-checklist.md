# QA checklist

## Automated

Run `npm run qa -- --slug <slug>`.

- All required video files exist and schemas parse.
- Scene IDs are unique.
- Storyboard references exist and duration matches.
- Asset paths exist and render assets are local.
- Potential factual narration has scene sources.
- Generic opening phrases are rejected.
- Unused assets are reported.
- Secret-like strings are scanned outside ignored build/cache directories.
- Missing master narration is reported.
- Audio peaks and long silent gaps are checked when a master exists.
- A SmokeTest frame renders.

## Manual editorial

- First sentence gives a specific reason to continue.
- Promise is paid off.
- Important claims use primary sources.
- Uncertainty and uncontrolled variables are marked.
- Testing and examples actually occurred.
- Visuals prove or explain narration.
- No section is generic filler.
- Video materially differs from previous uploads.
- It cannot be mistaken for either reference creator.
- Voice/likeness permission and disclosure are resolved.
- The voice owner is not presented as endorsing the channel.

## Visual review

Inspect opening, dense code/UI scenes, captions, source labels and transitions at normal size. Confirm no overflow, unreadably small text or caption collision. Render a low-resolution preview before final output.
