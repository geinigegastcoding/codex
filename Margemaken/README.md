# AI-systeem template

Dit is de v1-template voor een persoonlijk AI-systeem. De map is bedoeld als werkruimte voor een ondernemer die met een agent wil werken vanuit een vaste structuur.

## Begin hier

1. Open `AGENTS.md` en lees de werkafspraken.
2. Vul `Kennis/company/` en `Kennis/personal/` met eigen context.
3. Start met `cursus/00-start-hier.md`.
4. Open `dashboard/` en pas de voorbeelddata aan.
5. Installeer of activeer alleen skills die bij een echte workflow horen.

## Mappen

- `.agents/` en `.claude/` bevatten dezelfde skills voor verschillende agents.
- `Kennis/` is de duurzame contextlaag. De map is schoon gestart en bevat geen klantdata.
- `cursus/` bevat de lessen, oefeningen, checklists en videoscripts.
- `dashboard/` is een lichte React/Vite-template in de Magisdata-stijl.
- `klanten/`, `projecten/`, `meetings/`, `plans/` en `output/` zijn werkmappen buiten de Kennis-vault.
- `community/` bevat de structuur voor de leeromgeving.
- `scripts/` bevat lokale controles voor Kennis en skills.

## Veilig starten

Kopieer `.env.example` naar `.env` en vul alleen waarden in die je echt nodig hebt. Zet nooit tokens, wachtwoorden of mailboxinhoud in Git. Het voorbeeldbestand `.mcp.json.example` bevat expres geen echte verbindingen.

Gebruik de agent voor classificatie, concepten en samenvattingen. Laat de agent geen mail versturen, pagina publiceren of betaalactie uitvoeren zonder een expliciete menselijke controle.

## Definitie van een werkend systeem

Een workflow is klaar wanneer de invoer bekend is, de agent weet waar context staat, de uitvoer een vaste bestemming heeft, fouten zichtbaar worden en iemand het resultaat kan goedkeuren. Een mooie demo zonder herhaalbaar proces telt hier niet als afgerond systeem.

