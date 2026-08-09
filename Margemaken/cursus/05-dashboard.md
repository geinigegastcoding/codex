# 05. Je dashboard gebruiken

## Doel

Je gebruikt het dashboard als overzicht van leren, context en systeemgezondheid.

## Wat de template laat zien

- Overzicht met voortgang en volgende actie.
- Kennis met mapstructuur en captureveld.
- Cursus met modules en statussen.
- Skills met de basisset.
- Community met weekritme en vraagformat.

## Demo-data vervangen

1. Open `dashboard/src/App.tsx`.
2. Vervang voorbeeldmodules door eigen lessen of projecten.
3. Vervang voorbeeldactiviteit door echte logregels.
4. Houd onbekende meetwaarden expliciet zichtbaar.
5. Voeg pas een nieuwe view toe wanneer een bestaande kaart het probleem niet oplost.

## Designregels

Gebruik de bestaande kleurvariabelen en houd contrast goed. Een dashboard moet in enkele seconden duidelijk maken wat aandacht nodig heeft. Versieringen krijgen geen voorrang op een juiste status.

## Oefening

Maak een kaart voor je eigen volgende actie. Zet erin: input, gewenste output, eigenaar en controlepunt. Laat de kaart verwijzen naar een bestand in `plans/` of `projecten/`.

## Controle

Run:

```powershell
npm install
npm run typecheck
npm run build
```

Open daarna de build lokaal op desktop en mobiel. Controleer of tekst leesbaar blijft, knoppen een focusstatus hebben en de demo-disclosure zichtbaar blijft.

## Scriptkader

Begin met de overzichtspagina. Klik naar Kennis, Skills en Cursus. Leg uit dat een dashboard een beslisscherm is. Laat zien welke data nog demo is.

