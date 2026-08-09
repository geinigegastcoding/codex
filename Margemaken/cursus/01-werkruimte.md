# 01. Je werkruimte klaarzetten

## Doel

Je kunt uitleggen waar context, projecten, output, skills en tijdelijke bestanden horen.

## De structuur

```text
AI-systeem/
|- .agents/skills/       skills voor agents
|- .claude/skills/       dezelfde skills voor Claude Code
|- Kennis/               duurzame context
|- klanten/              uitvoeringsmateriaal
|- meetings/             ruwe meetingnotities
|- output/               concepten en exports
|- plans/                uitvoeringsplannen
|- projecten/            actieve projecten
|- dashboard/            overzicht
|- cursus/               leerroute
|- scripts/              controles
```

## Stappen

1. Open de hele map in je editor. Open losse bestanden vanuit je Downloads-map wanneer je wilt dat de agent de rest van het systeem mist.
2. Lees `Kennis/00-authority.md` en `Kennis/01-navigation.md`.
3. Controleer dat `.env` en `.mcp.json` niet in Git terechtkomen.
4. Open `skills/skill-registry.yml` en bekijk de beschikbare basisset.
5. Maak een projectmap voor je gekozen taak.
6. Maak een klein `README.md` met doel, eigenaar, status en volgende stap.

## Ontwerpkeuzes

De mapnamen zijn voorspelbaar. `Kennis` is de plaats voor wat later opnieuw nodig is. `output` is voor werk dat nog beoordeeld moet worden. Die scheiding voorkomt dat concepten ongemerkt als bedrijfswaarheid worden gelezen.

## Oefening

Sleep of verplaats drie bestaande bestanden naar de juiste plek. Schrijf per bestand op waarom het daar hoort. Een bestand dat nergens past gaat naar `overig/` en krijgt later een bestemming.

## Controle

Run:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/validate-template.ps1
```

De controle moet slagen. Een fout is informatie: lees de melding, los de oorzaak op en voer het script opnieuw uit.

## Scriptkader

Toon het mappenpaneel alsof de deelnemer voor het eerst in de werkruimte zit. Open alleen de mappen die je in de uitleg gebruikt. Leg uit dat een goede structuur vooral minder zoekwerk oplevert.

