# Hap

Swipe-webapp voor maaltijdkeuze met 1.024 lokale recepten, voedings- en dieetfilters, berekende macro's, broninstructies, een lokaal lerend smaakprofiel en een werkende Jumbo-handoff.

## Starten

```powershell
npm install
npm run dev -- --port 8000
```

Voor een productieachtige lokale server met de prijsproxy:

```powershell
npm run build
npm start
```

## Data en integraties

- Recepten: 789 recepten opgehaald via de officiële gratis TheMealDB API en 235 expliciet gelabelde variaties. Elke kaart bewaart de bronlink en attributie. Kookinstructies staan in een aparte luie databundel, zodat ze pas bij volledige details worden geladen. Opnieuw genereren kan met `npm run generate:recipes`.
- Voeding: macro's worden per portie berekend uit ingrediëntgewichten en per-100g referentiewaarden gebaseerd op USDA FoodData Central. Onbekende ingrediënten krijgen een conservatieve fallback en verlagen zichtbaar het dekkingspercentage.
- Jumbo-prijzen: live productzoeking via de gratis publieke PrijsProfeet endpoint, server-side geproxied vanwege CORS. Bronvermelding staat in de interface.
- Jumbo-cart: de publieke Pepesto `/api/predirect` endpoint zet maximaal 30 receptingrediënten om in een gratis cart-handoff. De gebruiker controleert producten en rondt daarna af in Pepesto/Jumbo.

## Smaakmodel

Elke like of skip past lokale gewichten aan voor keuken, categorie, tags, eiwitniveau en bereidingstijd. De leersnelheid neemt af met `0.8 / sqrt(aantal interacties)`. Een kleine deterministische exploratiebonus voorkomt dat nieuwe smaken volledig verdwijnen. Het profiel wordt alleen in `localStorage` bewaard en kan vanuit de profielpagina worden gewist.

## Eetprofiel en filters

- Eetpatronen: alles, vegetarisch, vegan en pescotarisch.
- Doelpresets: gebalanceerd, caloriebewust, high protein, minder koolhydraten, snel klaar en budget.
- Gerechtsoorten en handmatige limieten voor calorieën, koolhydraten, vet, eiwit, tijd en richtprijs.
- Uitsluiting op basis van de 14 EU-allergenengroepen.
- Tot 20 persoonlijke ingrediëntuitsluitingen met suggesties uit de lokale catalogus. Dit is een voorkeurfilter op ingrediëntnaam, geen vervanging voor allergenencontrole.
- Zoekfunctie over titel, keuken, categorie, tags en ingrediënten.
- Ieder actief filter verschijnt als verwijderbare chip op Ontdekken; `Wis filters` herstelt in één actie de volledige standaardset.

Voorkeuren worden lokaal bewaard onder `hap:preferences`; saves en het smaakmodel blijven respectievelijk onder `hap:saved` en `hap:taste` staan.

## Porties en boodschappenlijst

- Recepten zijn schaalbaar van 1 tot 12 porties; herkenbare breuken en verpakkingsmaten schalen mee.
- Recepten kunnen samen op één blijvende boodschappenlijst. Gelijke ingrediënten worden gegroepeerd, terwijl de hoeveelheid en het bronrecept zichtbaar blijven.
- Voeg ook losse boodschappen met een vrije hoeveelheid toe; ze groeperen mee als de naam overeenkomt.
- De lijst sorteert artikelen in herkenbare winkelafdelingen.
- Artikelen kunnen worden afgevinkt. Alleen niet-afgevinkte artikelen gaan mee naar de gecombineerde Jumbo-winkelwagen.
- Markeer vaste voorraad zoals olie of rijst als `altijd in huis`; die keuze blijft voor volgende lijsten staan en gaat niet mee naar Jumbo.
- Gramtotalen zijn secundaire schattingen op basis van de receptdata, geen verpakkings- of aankoopadvies.

De lijst, vinkjes, handmatige artikelen en vaste voorraad worden alleen op dit apparaat bewaard onder `hap:shopping`. Bestaande versie-1-lijsten migreren automatisch.

## Weekplanner

- Plan per kalenderdag één diner en pas het aantal porties per dag aan.
- Blader per week of spring direct terug naar de huidige week.
- `Vul lege dagen` kiest unieke recepten uit de actuele dieetfilters en lokale smaakranking; handmatige keuzes blijven staan.
- Bekijk een compacte weekschatting voor gemiddelde kcal, eiwit en totale richtprijs.
- Voeg alle geplande recepten uit de zichtbare week zonder dubbele receptregels toe aan de boodschappenlijst.

De planner staat lokaal onder `hap:planner`. Automatisch vullen is een praktische receptselectie, geen medisch of volledig voedingsplan.

## Voedingslog

- Log een Hap-recept expliciet met datum, maaltijdtype en 0,25 tot 24 gegeten porties. Bereidingsporties en gegeten porties zijn bewust gescheiden.
- Voeg eten zonder recept handmatig toe met calorieën, eiwit, koolhydraten en vet.
- Bewerk handmatige waarden of wijzig de gegeten porties van een recept; historische receptschattingen worden proportioneel geschaald en niet stil opnieuw berekend.
- Log recente unieke maaltijden opnieuw met één actie, zonder de eerdere logregel te wijzigen.
- Bekijk dagtotalen, resterend of boven referentie, maaltijdgroepen en een feitelijke zeven-dagenhistorie.
- Bekijk gemiddelden over de laatste 30 dagen op basis van gelogde dagen; ontbrekende dagen tellen niet als nul-inname.
- Exporteer alle logregels lokaal als spreadsheetveilige UTF-8 CSV.
- Bekijk maximaal drie smaakgerangschikte recepten die door alle actieve dieetfilters komen en per portie onder de resterende energiereferentie vallen. Dit is een transparante vergelijking, geen compleet dag- of medisch advies.
- Pas alle vier dagdoelen zelf aan. Startwaarden zijn de [EU-referentie-innames voor een gemiddelde volwassene](https://eur-lex.europa.eu/eli/reg/2011/1169): 2.000 kcal, 50 g eiwit, 260 g koolhydraten en 70 g vet.
- Weekplanning wordt nooit automatisch als gegeten geregistreerd; alleen een expliciete logactie telt.

Het voedingslog staat lokaal onder `hap:tracker`. De doelen zijn referenties, geen persoonlijk dieet- of medisch advies. Receptmacro's zijn berekende schattingen; handmatige waarden komen van de gebruiker.

Allergenen en eetpatronen worden uitsluitend afgeleid uit de aangeleverde receptingrediënten. Ze zijn geen medische, halal- of koosjercertificering. Controleer altijd het volledige recept, productverpakkingen, vervangingen en kruisbesmetting. De allergenengroepen volgen de [Europese Commissie](https://food.ec.europa.eu/food-safety/campaign-2026/allergies_en).

## Bediening

- Swipe of gebruik de hart/kruis-knoppen om Hap te trainen.
- Gebruik `←` en `→` om met het toetsenbord te skippen of bewaren.
- `Esc` sluit zoeken, filters en receptdetails.
- Ongedaan maken herstelt het gerecht, smaakmodel en de opgeslagen lijst.

## Installeren en offline

- Hap is een installable PWA met eigen appiconen en een echte browser-installprompt vanuit het profiel.
- Na de eerste productie-laadbeurt blijven de app-shell, lokale receptcatalogus, filters, saves, weekplanner, boodschappen en het voedingslog offline bruikbaar.
- Bekeken receptafbeeldingen krijgen een begrensde runtimecache; nog niet bekeken externe afbeeldingen kunnen offline ontbreken.
- Jumbo-prijzen en de Jumbo-winkelwagen zijn online-only en worden offline zichtbaar uitgeschakeld. Lokale gegevens blijven dan gewoon bewaard.
- De productie-worker ruimt alleen oude `hap-*` caches op en raakt andere sites of browserdata niet.

## Startup en caching

- De appcode, React-runtime, iconen en lokale receptcatalogus worden als afzonderlijke productiechunks gebouwd. Dat houdt stabiele code opnieuw cachebaar wanneer alleen Hap-logica of recepten veranderen.
- `npm run check:bundle` faalt wanneer een JavaScriptchunk boven 1.200.000 bytes komt; de grens wordt niet verhoogd om een waarschuwing te verbergen.
- Alle chunks die de eerste pagina nodig heeft staan als modulepreload in de gebouwde HTML en worden door de productie-worker voor offline gebruik gecachet.

## Lokale back-up

- Vanuit het profiel download je één versioned JSON-back-up met saves, smaakmodel, eetprofiel, boodschappen/voorraad, weekplanner en voedingslog.
- Back-ups bevatten geen afbeeldingen of receptdatabase en worden niet naar een server gestuurd.
- Herstellen is bewust twee stappen: Hap valideert en toont eerst aantallen en exportdatum; pas na `Herstel back-up` en bevestiging wordt huidige lokale data vervangen.
- Onbekende recepten en beschadigde velden worden met dezelfde domeinsanitizers verwijderd of veilig hersteld. Een fout of vreemd bestand verandert niets.

## Controle

```powershell
npm run typecheck
npm test
npm run build
npm run check:bundle
npm run test:pwa
```

De tests controleren onder meer catalogusomvang, alle 14 allergenengroepen, nutrition-berekening, lerende ranking, voorkeurspersistentie, porties, boodschappenlijstpersistentie, dieetbewuste weekplanning, voedingslogdoelen, bewerken, herhalen, historie en CSV-export, expliciet loggen, zoeken, undo, volledige receptdetails en een echte live Jumbo-prijsresponse. `test:pwa` bouwt de productieapp, laat de worker installeren en bewijst daarna een volledige offline reload.
