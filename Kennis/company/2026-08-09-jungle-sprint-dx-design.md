# Jungle Sprint DX - ontwerp

## Doel

Jungle Sprint wordt een afgeronde, originele browserplatformer met strakke besturing, betrouwbare hitboxes, 20 herkenbaar verschillende levels, meerdere helden en een berijdbaar junglemaatje. De game blijft statisch, dependency-vrij en speelbaar met toetsenbord en touch.

## Technische richting

- Behoud de bestaande HTML-, CSS- en Canvas-architectuur.
- Houd simulatie en collisions als pure functies in `game-core.js`; DOM, audio en opslag blijven adapters.
- Gebruik vaste collision-bounds die losstaan van de getekende vorm.
- Los beweging per as op en gebruik vorige/volgende posities voor platform-, plafond-, wand- en stompdetectie.
- Voeg een optionele debuglaag toe voor hitboxes, bereikbaar met een toetsencombinatie en standaard verborgen.

## Gameplay

- Drie originele helden: Tavi is gebalanceerd, Nia heeft een luchtige tweede sprong en Bo kan een ground-pound uitvoeren. Elk level blijft met iedere held haalbaar.
- Moki is een origineel berijdbaar junglewezen. De speler kan opstappen, afstappen, kort fladderen en met een tong fruit of kleine vijanden pakken.
- Vijanden kunnen van boven worden gestompt; contact van opzij kost een leven tenzij de speler tijdelijk onkwetsbaar is.
- Nieuwe objecten: bewegende platforms, afbrokkelblokken, springbloemen, schakelaars, poorten, sleutels en verborgen zonnemedailles.
- Ieder level heeft drie optionele doelen: finish, alle vruchten en de zonnemedaille. Deze worden lokaal opgeslagen.
- Het laatste level eindigt met een eenvoudige patroonbaas die de aangeleerde mechanics combineert.

## Levels

De bestaande herhaalde levelgenerator wordt vervangen door vijf wereldtemplates met vier handmatig samengestelde varianten:

1. Bamboo Bay introduceert springen, stompen, springbloemen en Moki.
2. Canopy Climb gebruikt verticale routes, bewegende bladeren en geheime hoge paden.
3. Mango Ruins gebruikt sleutels, schakelaars, poorten en afbrokkelstenen.
4. Monsoon Marsh gebruikt modder, regenstoten, drijvende stammen en timing.
5. Emerald Temple combineert routes, mechanics en een eindbaas.

Leveldata blijft declaratief. Een validator controleert bereikbare ankers, geldige objecttypes, bounds, checkpoints en finishes. Elke wereld krijgt een eigen kleurpalet, platformmateriaal, decoratie en ImageV2-achtergrond.

## Visuele richting

- Kleurrijke premium 2.5D-prentenboekstijl met duidelijke silhouetten en hoog contrast rond speelbare objecten.
- ImageV2 levert vijf brede achtergronden en een karakterselectie-illustratie; gegenereerde kunst blijft decoratief zodat collisions exact blijven.
- Canvas voegt per wereld eigen foreground, atmosfeer, materiaaltexturen, lichteffecten en subtiele particles toe.
- Menu, wereldkaart, HUD, levelkaarten en resultaatscherm krijgen een samenhangende avonturenkaart-uitstraling.
- Reduced-motion, focus states, echte buttons, leesbare touch-controls en statusmeldingen blijven behouden.

## Opslag en voortgang

Voortgang migreert veilig van versie 1 naar versie 2. Versie 2 bewaart unlocked levels, beste scores, doelen per level, gekozen held en vrijgespeelde helden. Ongeldige of oude data valt terug zonder crashes of verlies van geldige voltooide levels.

## Verificatie

- Node-tests dekken alle collisionrichtingen, tunnelingranden, stompen, schade, heldvaardigheden, Moki, objectmechanics, levelvalidatie en opslagmigratie.
- Alle 20 levels voldoen aan de validator en bevatten unieke routes/objectcombinaties.
- Browsercontrole bewijst start, karakterkeuze, levelstart, input, pauze, respawn, Moki en resultatenflow zonder console-errors.
- Nieuwe desktop- en mobiele screenshots worden visueel gecontroleerd; debug-hitboxes worden apart vastgelegd om alignment te bevestigen.

## Grenzen

- Geen Nintendo-personages, namen, muziek of gekopieerde assets.
- Geen server, accounts, multiplayer, externe game-engine of runtime-CDN.
- Geen features die niet bijdragen aan bewegen, verkennen, verzamelen of levelprogressie.
