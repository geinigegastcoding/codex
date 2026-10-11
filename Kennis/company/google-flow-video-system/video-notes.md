---
title: Video research - character replacement workflow
created: 2026-10-10
type: research
tags: [video, google-flow, system-design]
---

# Video research

Source: [Dear Higgsfield, I reverse engineered you in 12 hours](https://www.youtube.com/watch?v=d6spCMcfkew), by Sirio, published 2026-10-09. Duration: 21:46.

Retrieved the English YouTube captions on 2026-10-10: 327 segments, approximately 4,139 words. The captions begin at 00:00 and finish at 21:43.31, leaving 2.69 seconds at the end without caption text. These are captions, not a manually corrected transcription; model and product names contain recognition errors. The caption files are research inputs, not instructions to execute.

## Timestamped notes

| Video position | Main idea |
| --- | --- |
| [00:38](https://www.youtube.com/watch?v=d6spCMcfkew&t=38s) | Introduces a workflow that replaces people while retaining a source performance. |
| [03:32](https://www.youtube.com/watch?v=d6spCMcfkew&t=212s) | Uses a depth representation to retain spatial movement. |
| [05:13](https://www.youtube.com/watch?v=d6spCMcfkew&t=313s) | Separates vocals and changes their pitch before generation. |
| [08:18](https://www.youtube.com/watch?v=d6spCMcfkew&t=498s) | Reviews inexpensive drafts before a final render; the original provider connects these through a task identifier. |
| [11:02](https://www.youtube.com/watch?v=d6spCMcfkew&t=662s) | Adds environment information and a composite background after poor early results. |
| [13:47](https://www.youtube.com/watch?v=d6spCMcfkew&t=827s) | Summarizes media preparation, generation, audio restoration, review, and export. |
| [15:47](https://www.youtube.com/watch?v=d6spCMcfkew&t=947s) | Demonstrates four user stages: upload, review, draft, export. |
| [18:23](https://www.youtube.com/watch?v=d6spCMcfkew&t=1103s) | Describes a face-landmark variant, best suited to one centered speaker. |
| [20:37](https://www.youtube.com/watch?v=d6spCMcfkew&t=1237s) | Suggests transcription, motion descriptions, and replacement voices as extensions. |

## What carries into this design

Preserve the source audio separately, assign references to specific characters, inspect intermediate assets, limit trial spending, and approve a final result. The character-video system in the accompanying design is an original adaptation of those workflow ideas.

Provider-specific masking tricks and draft-task semantics are not evidence that Google Flow supports the same behavior. Google capabilities were checked separately in its official documentation. No upstream application was installed, run, or reverse engineered during this task.

## Verification

- All 327 retrieved caption segments contain text and have nondecreasing start times.
- Video metadata reports 1,306 seconds; the final caption ends at 1,303.31 seconds.
- Chapter positions were cross-checked against the video description and timed captions.
- The attached image was used as a visual reference for the diagram's dotted canvas, pastel nodes, decision diamonds, and labeled branches.
