# Hap startup performance - design

## Doel

Verwijder de productie-bundelwaarschuwing en maak stabiele afhankelijkheden en de receptcatalogus afzonderlijk cachebaar, zonder gedrag of offline betrouwbaarheid te verliezen.

## Keuzes

- Houd de catalogus direct beschikbaar bij de eerste render; geen nieuwe laadspinner of netwerkafhankelijke databron.
- Gebruik Vite/Rolldown code splitting voor de lokale receptcatalogus, React-runtime en iconen.
- Laat de service worker alle door `index.html` genoemde assets vooraf cachen; de bestaande productie-PWA-test moet bewijzen dat statische chunks offline aanwezig zijn.
- Verhoog de waarschuwinggrens niet. Een geautomatiseerde contractcheck faalt wanneer een JavaScriptchunk groter is dan 1.200.000 bytes.
- Rapporteer zowel ruwe als gzipgrootte zodat optimalisatie niet alleen cosmetisch is.

## Succescriteria

- Geen Vite chunk-waarschuwing bij de productiebuild.
- Iedere JavaScriptchunk blijft onder 1.200.000 bytes.
- De app start, rendert 1.024 recepten en herlaadt na workerinstallatie offline.
- Volledige functionele regressies blijven groen.
