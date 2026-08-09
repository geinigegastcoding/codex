---
title: Kennis maintenance contract
created: 2026-08-08
updated: 2026-08-08
type: system
tags: [system, maintenance, quality]
sources: []
---

# Onderhoudscontract

Voer periodiek een korte, conservatieve audit uit. De audit maakt de vault beter vindbaar en bewaart geschiedenis.

## Checklist

- Controleer frontmatter in actieve notities.
- Zoek gebroken wikilinks en ontbrekende indexverwijzingen.
- Controleer dubbele titels en onduidelijke tags.
- Zoek captures met `needs-review`.
- Controleer grenzen tussen bedrijf en persoonlijk.
- Archiveer alleen duidelijk verouderde informatie.
- Bewaar alle bestanden onder `logs/`.
- Voeg een resultaat toe aan `logs/wiki-maintenance.md`.

## Lokale controle

Gebruik vanuit de projectroot:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/validate-kennis.ps1
```

Meld ontbrekende bestanden en mislukte controles. Stil overslaan is geen geldige uitkomst.

