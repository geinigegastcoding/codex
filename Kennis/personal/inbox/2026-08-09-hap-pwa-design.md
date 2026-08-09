# Hap installable/offline - design

## Doel

Maak Hap installeerbaar op telefoon en desktop en houd alle lokale kernfuncties bruikbaar wanneer internet tijdelijk wegvalt.

## Beslissingen

- Geen extra PWA-framework: een kleine, expliciete service worker past bij de huidige Vite-app en voorkomt nieuwe runtime-afhankelijkheden.
- De productie-index, gehashte JS/CSS-assets, manifest en appiconen worden bij installatie gecachet.
- Navigatie gebruikt network-first met de gecachete app-shell als fallback.
- Lokale assets gebruiken cache-first; bekeken externe receptafbeeldingen krijgen een begrensde runtimecache.
- Jumbo-prijs- en cartrequests blijven online-only. Offline wordt zichtbaar uitgelegd en acties worden uitgeschakeld, niet stil overgeslagen.
- Receptcatalogus, filters, saves, weekplanner, voedingslog en boodschappenstaat blijven lokaal en werken offline nadat de app eenmaal online is geladen.
- Een nieuwe service worker neemt gecontroleerd over; caches hebben een versienaam en oude Hap-caches worden verwijderd.

## Manifest en iconen

- Naam `Hap`, standalone display, Nederlands, cream achtergrond en groen thema.
- 192px en 512px PNG-iconen plus maskable variant, gebaseerd op het bestaande Hap-merk.
- Apple touch icon en manifestlink staan in `index.html`.

## UX

- Een compacte offlinebalk meldt dat lokaal werken doorgaat en Jumbo tijdelijk niet beschikbaar is.
- Het profiel toont installatiegereedheid en gebruikt de browser-installprompt wanneer die beschikbaar is.
- Geen nep-installatieknop wanneer de browser de prompt niet ondersteunt; dan staat er korte browsermenu-uitleg.

## Succescriteria

- Manifest en service worker zijn geldig en via dev/productieserver bereikbaar.
- Productiebuild registreert de worker; dev niet.
- App-shell en gehashte assets worden gecachet zonder hardcoded buildhashes.
- Online-only acties zijn in offline toestand aantoonbaar uitgeschakeld.
- Bestaande 38 tests blijven groen en PWA-contracttests komen erbij.
