# Turbo Tinker — racing game ontwerp

## Doel

Een toegankelijke browsergame waarin de speler een kart samenstelt, de invloed van onderdelen direct ziet en ermee racet op vijf kleurrijke cartoontracks. De game moet meteen speelbaar zijn zonder account, build-stap of asset-download.

## Richting

- Visuele stijl: kleurrijke cartoon-arcade met dikke lijnen, zachte schaduwen, confetti, stickerachtige panels en duidelijke kleurcodering.
- Renderer: WebGPU voor de atmosferische achtergrond als die beschikbaar is; een Canvas2D-game-laag tekent de track en karts. Bij ontbrekende WebGPU valt alles terug naar Canvas2D.
- Runtime: één `racing/index.html` als ingang, met een kleine importeerbare `racing/game-core.mjs` voor deterministische regels en tests.
- Geen externe runtime-dependencies: native WebGPU/Canvas, CSS en standaard browser-API's houden lokaal testen betrouwbaar.

## Spelervaring

1. De startpagina opent in de garage.
2. De speler kiest chassis, motor, banden en spoiler. Elk onderdeel wijzigt snelheid, acceleratie, grip, handling en drift. Goede combinaties geven een kleine synergy-bonus.
3. De speler kiest één van vijf tracks en start een race tegen drie cartoon-AI-karts.
4. Rijden werkt met WASD/pijltjestoetsen: gas, rem en sturen. Shift activeert drift; bij loslaten wordt driftenergie omgezet in boost.
5. De race heeft drie rondes, een eenvoudige maar leesbare minimap/HUD en een finishscherm met tijd, positie en gekozen build.
6. Touch-knoppen blijven zichtbaar op kleine schermen.

## Kernonderdelen

- `game-core.mjs`: onderdelen, statberekening, track-data, vector/physics helpers en raceprogressie.
- `index.html`: layout, styling, garage UI, race loop, WebGPU setup, Canvas2D rendering, input en overlays.
- `test.mjs`: native Node tests voor statsynergy, snelheid/drag, drift-release-boost en trackprogressie.

## Vereisten voor klaar

- Vijf selecteerbare tracks met elk een eigen naam, kleurpalet en route.
- Onderdelen zijn echt samen te stellen; de gecombineerde stats beïnvloeden de race.
- Drift voelt merkbaar anders dan normaal sturen en kan boost opleveren.
- Race kan starten, rondes tellen, finishen en opnieuw gestart worden.
- WebGPU-status is zichtbaar en de fallback werkt zonder WebGPU.
- `node --test racing/test.mjs` slaagt en `http://localhost:6000` serveert de game.
- Layout blijft bruikbaar op desktop en smalle schermen.

## Bewuste vereenvoudigingen

- De trackgeometrie is procedural/polyline in plaats van een externe 3D-asset pipeline.
- De AI volgt de ideale lijn met kleine variatie; er is geen complexe collision/online multiplayer.
- WebGPU tekent de animated sky/atmosphere; de dynamische spelwereld blijft in Canvas2D zodat het spel klein, inspecteerbaar en fallback-veilig blijft.
