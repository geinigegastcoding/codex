# 07. Onderhoud zonder chaos

## Doel

Je kunt een wekelijkse audit uitvoeren, fouten terugvinden en je systeem klein houden.

## Weekritme

1. Maandag: kies de ene workflow die aandacht krijgt.
2. Tijdens de week: bewaar fouten en ontbrekende context in `output/` of een log.
3. Vrijdag: controleer links, skills, output en open captures.
4. Noteer één kleine verbetering en één punt dat blijft liggen.
5. Archiveer oude concepten als de status duidelijk is.

## Audit

Controleer:

- kernbestanden en frontmatter;
- gebroken wikilinks;
- spiegeling tussen `.agents` en `.claude`;
- open `needs-review` captures;
- onduidelijke bronstatus;
- output zonder reviewstatus;
- secrets in nieuwe files.

## Herstelpad

Als een workflow faalt, ga terug naar de laatste input die nog klopt. Repareer de kleinste oorzaak. Voeg een testvoorbeeld toe als de fout later opnieuw kan ontstaan.

## Oefening

Plan 20 minuten voor een eerste audit. Schrijf het resultaat in `Kennis/logs/wiki-maintenance.md`. Een log met open punten is goed; een rapport zonder bewijs is dat niet.

## Controle

Gebruik `scripts/validate-kennis.ps1` en `scripts/validate-template.ps1`. Bewaar de terminaluitvoer in je projectnotitie als bewijs wanneer je dit met een klant of deelnemer deelt.

## Scriptkader

Laat zien hoe je een foutmelding leest. Voer de check opnieuw uit na een kleine reparatie. De boodschap is simpel: onderhoud hoort bij het systeem, geen losse schoonmaakronde achteraf.

