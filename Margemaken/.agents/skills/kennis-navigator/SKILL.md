---
name: kennis-navigator
description: Navigeer, schrijf en onderhoud een Kennis-vault met duidelijke bronstatus, links, grenzen en onderhoudslog.
---

# Kennis navigator

## Doel

Houd de Kennis-vault klein, vindbaar en actueel. De agent gebruikt de vault als contextlaag en laat zien welke bron voor een antwoord is gebruikt.

## Start van iedere taak

1. Lees `Kennis/00-authority.md`.
2. Lees `Kennis/01-navigation.md`.
3. Zoek op onderwerp in `Kennis/` voordat je een nieuwe notitie maakt.
4. Lees relevante status-, besluit- en projectnotities volledig.
5. Bepaal of de informatie onder `company/`, `personal/`, `sources/`, `queries/` of een werkmap hoort.

## Schrijven

1. Gebruik frontmatter met `title`, `created`, `updated`, `type`, `tags`, `sources` en waar nodig `status`.
2. Behoud de oorspronkelijke formulering in een `## Capture`-blok wanneer iets als capture wordt aangeleverd.
3. Voeg nuttige links naar index, project of bron toe.
4. Werk `Kennis/index.md` of de relevante README bij bij een nieuwe duurzame categorie.
5. Voeg bij structurele wijzigingen een regel toe aan `Kennis/logs/wiki-maintenance.md`.

## Grenzen

- Bedrijfsinformatie gaat naar `company/`.
- Persoonlijke informatie gaat naar `personal/`.
- Bij twijfel gaat de capture naar `personal/inbox/` met `needs-review`.
- Oude informatie krijgt `historical` of gaat naar `_archive/`; verwijder haar niet stil.
- Geen credentials, tokens of volledige mailboxinhoud in Kennis.
- Een inferentie wordt altijd als `inferred` gemarkeerd.

## Controle

Voer de lokale Kennis-check uit via `powershell -File scripts/validate-kennis.ps1`. Rapporteer ontbrekende links, ontbrekende frontmatter en onopgeloste captures. Claim nooit dat een bron gelezen is wanneer de file niet is geopend.

