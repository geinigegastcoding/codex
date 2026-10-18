# Google Play feature graphic draft

**Status:** unpublished listing draft; not submitted to Play Console. This graphic is a concise brand-and-value illustration, not a screenshot or a promise of results.

**Copy:** “Ollo” / “Een pauze. Jouw keuze.”

**Composition:** 1024×500 landscape, opaque 24-bit PNG. Warm orange outer field, inset cream panel, charcoal and orange typography, the unmodified orange pixel mascot, and one small pixel spark. The name, line of copy, and mascot are centered within a conservative middle area; decorative pixels sit at the outer edges. No CTA, store badge, device, UI mockup, efficacy, health, price, exclusivity, accolade, or customer claim.

**Alt text draft (under 140 characters):** De oranje pixelmascotte van Ollo naast de tekst ‘Een pauze. Jouw keuze.’ op een crèmekleurig vlak.

**Platform check (2026-10-17):** Google's [official preview-assets requirements](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en-en) specify JPEG or 24-bit PNG with no alpha at exactly 1024×500 (lines 108–112). The recommendations say to keep key branding and focal elements toward the center, avoid cutoff zones, keep background decoration at the edges, use a vibrant color theme, and avoid store badges (lines 113–138). Google provides no numeric safe-zone dimensions in the page text, so this draft uses generous margins rather than asserting a particular crop measurement.

**Source:** `render.mjs` composes the copied `inputs/ollo_mascot.png` over vector shapes using the already installed Sharp runtime. The mascot input remains byte-identical to Ollo's source asset. `verification.json` records dimensions, PNG alpha/channel checks, exact input and output SHA-256, and runtime details. This technical check does not establish Play acceptance or listing publication.
