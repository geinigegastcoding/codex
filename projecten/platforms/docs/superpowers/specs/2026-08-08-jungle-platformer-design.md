# Jungle Sprint — ontwerp

## Doel

Een zelfstandige, statische webgame waarin de speler een vrolijke jungle-held door 20 korte platformlevels loodst. Het moet direct speelbaar zijn in de browser, ook op touchscreens, met duidelijke feedback, lokale voortgang en genoeg variatie om alle werelden uit te spelen.

## Richting

- Originele kleurrijke jungle-cartoonstijl; geen Mario-personages, logo's of gekopieerde assets.
- Vier schermbrede zones in de app: startscherm, levelkeuze, gameplay en resultaten-overlay.
- Canvas voor de gamewereld; HTML/CSS voor HUD, overlays en controls.
- Imagev2 levert één lokale sfeerillustratie voor de jungle-horizon en levelkeuzekaart. Speler, vijanden, coins en platforms worden deterministisch in canvas getekend zodat collisions scherp blijven.
- Responsive layout met desktop keyboard controls en mobiele touch-knoppen.

## Gameplay

- 20 levels, verdeeld over vijf werelden van vier levels: 'Bamboo Bay', 'Canopy Climb', 'Mango Ruins', 'Monsoon Marsh' en 'Emerald Temple'.
- Elk level bevat startpositie, platforms, coins, hazards, vijanden, minimaal één checkpoint en een finish-vlag.
- Beweging: links/rechts, springen, coyote time en jump buffering voor vergevingsgezinde besturing.
- Collision: axis-aligned rectangles, platform-top landing, zijbotsingen en hazard/void death.
- Een level eindigt bij de finish; vallen reset naar het laatste checkpoint en kost één leven.
- Drie levens per level, score uit coins en resterende levens, beste score in localStorage.
- Levelkeuze toont unlocked/completed states. Een level unlockt het volgende pas na finish.
- Pauze, opnieuw starten, mute en reduce-motion instellingen zijn bereikbaar via de HUD.

## Datamodel

Pure game-core functies krijgen expliciete inputs/outputs:

- createPlayer(spawn) maakt een spelerstate.
- stepPlayer(player, input, level, delta) verwerkt één vaste physicsstap.
- resolvePlatformCollision(player, platforms, previousY) voorkomt door platforms heen vallen.
- collectCoins(player, coins) geeft een nieuwe player- en coinstate terug.
- advanceProgress(progress, levelIndex, result) verwerkt unlock en best score.
- getLevel(index) levert één van exact 20 gevalideerde leveldefinities.

De renderlaag leest de state maar muteert die niet. Storage bevat alleen eenvoudige JSON-progressie met validatie en veilige fallback naar level 1.

## UI en toegankelijkheid

- Grote contrastrijke titel, compacte game-card en een levelraster dat op mobiel naar één kolom kan.
- Buttons zijn echte button-elementen met zichtbare focus states en Nederlandse labels.
- Canvas krijgt een tekstuele statusregio voor levelnaam, score, coins, levens en belangrijke events.
- Touch-controls zijn alleen actief op pointer-capable devices, maar blijven bruikbaar met toetsenbord.
- prefers-reduced-motion schakelt parallax, particles en grote transitions terug.

## Grenzen

- Geen server, accounts, multiplayer, externe runtime-assets of muziekdownload.
- Geen nieuwe game-engine of dependency; een lokale ES-module en native browser APIs volstaan.
- Audio blijft optioneel en beperkt tot korte Web Audio feedback-tones, standaard uit tot de speler het aanzet.

## Test- en verificatiecriterium

- Node test suite bewijst levelcount, unlock-regels, coin collection, landing/death/finish transitions en storage-validatie.
- npm test moet volledig groen zijn.
- Een statische HTTP-server moet de app zonder console errors laden.
- Screenshot-check op desktop en smal mobiel bevestigt dat startscherm, levelkeuze en gameplay passen; minimaal één level wordt via browser-interactie geladen.
- Er is geen onafgeronde placeholder, ontbrekende asset of niet-werkende knop in de eindflow.
