# 03. Je eerste skill bouwen

## Doel

Je maakt een skill die een taak uitvoert volgens vaste stappen en de uitkomst controleerbaar maakt.

## De bouwstenen

Een goede skill bevat:

1. trigger en doel;
2. beschikbare input;
3. beslisregels;
4. uitvoerstappen;
5. outputformaat;
6. uitzonderingen;
7. menselijke review;
8. een kleine controle.

## Voorbeeld: e-mail checker

De e-mail checker leest binnenkomende mail, classificeert actie, lezen, wachten, factuur, archief of onduidelijk en maakt daarna een tabel. De agent verzendt niets. De gebruiker controleert phishing, betalingen, juridische berichten en antwoordconcepten.

## Stappen

1. Kies een taak met één duidelijke output.
2. Noteer welke input compleet moet zijn.
3. Schrijf beslisregels in gewone taal.
4. Geef de agent een voorbeeld van een goede en een onduidelijke uitkomst.
5. Zet risicovolle acties achter een expliciete goedkeuring.
6. Sla de skill op in `.agents/skills/naam/SKILL.md`.
7. Spiegel exact dezelfde file naar `.claude/skills/naam/SKILL.md`.
8. Voeg de skill toe aan `skills/skill-registry.yml`.

## Oefening

Schrijf een skill voor het omzetten van een meeting naar drie acties. Test met drie geanonimiseerde notities. Noteer welke zinnen tot verschillende uitkomsten leiden.

## Wanneer een skill geen skill is

Een losse prompt zonder inputcontract, outputvorm of reviewstap is te kwetsbaar voor herhaalbaar werk. Zet de prompt tijdelijk in `plans/` en voeg regels toe zodra je de taak echt uitvoert.

## Controle

Controleer de spiegeling:

```powershell
$a = Get-Content -Raw .agents/skills/naam/SKILL.md
$b = Get-Content -Raw .claude/skills/naam/SKILL.md
if ($a -ne $b) { throw 'Skill mirrors verschillen' }
```

## Scriptkader

Start met een terugkerende taak uit de community. Bouw het bestand live op. Laat een opzettelijk onduidelijke e-mail zien en toon dat de juiste uitkomst `onduidelijk` kan zijn.

