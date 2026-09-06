# FitQuest v3 - walkthrough van onboarding en eerste coachloop

**Datum:** 4 september 2026  
**Omgeving:** lokale production preview op `http://localhost:3003/`  
**Testtype:** realistische synthetische gebruiker, volledig ingevuld via de browser  
**Viewport:** desktop, ongeveer 1280 x 720  
**Scope:** volledige onboarding, gegenereerd schema, drie gelogde trainingen en controle van de eerste feedbackloop

## Samenvatting

De onboarding voelt inderdaad volwassen en doelgericht. Iedere stap heeft een duidelijke vraag, de uitleg is meestal rustig en de gebruiker krijgt na afloop een schema dat rekening houdt met dagen, tijdslimieten, materiaal, prioriteiten en veiligheidscontext. De eerste trainingssessie kan volledig worden gelogd en de lokale coachstaat wordt bijgewerkt.

De grootste verbeterpunten zitten niet meer in de basis-onboarding, maar in de overgang van intake naar coaching:

1. De review toont niet alle inputs die het schema daadwerkelijk bepalen.
2. `Nee` voor andere intensieve sport staat vooraf geselecteerd. Daardoor kan een gebruiker zonder bewuste keuze een onjuist profiel opslaan.
3. De gegenereerde sessies bevatten op korte dagen veel oefeningen met slechts een enkele set. Dat voelt minder efficiënt dan een kleiner aantal oefeningen met voldoende productieve sets.
4. De onderliggende progression-engine krijgt logs binnen, maar de gebruiker ziet de volgende actie niet. De kaarten blijven `belasting leren` tonen.
5. De waarschuwingen zijn inhoudelijk nuttig, maar te lang en repetitief gepresenteerd.
6. Het volume-accounting is technisch correct uitgelegd op hoofdlijnen, maar de getoonde getallen kunnen als directe sets worden geïnterpreteerd terwijl het effectieve bijdragen zijn.

Mijn conclusie: FitQuest is op dit moment een goede intake plus een veelbelovende lokale schema-engine. Om echt als coach aan te voelen, moet vooral de zichtbare feedback na een training beter worden gemaakt. De gebruiker moet direct begrijpen: wat ging goed, wat doe ik de volgende keer en waarom?

## Doel van de walkthrough

De activation goal voor deze test was:

> Een gebruiker met een realistisch profiel moet in enkele minuten een uitvoerbare week krijgen, een eerste sessie kunnen loggen en daarna een begrijpelijke volgende actie zien.

De test haalde de eerste twee onderdelen. Het schema werd gegenereerd en drie sessies werden opgeslagen. De derde stap - een duidelijk zichtbare, concrete volgende actie per oefening - is technisch nog niet goed genoeg zichtbaar in de interface.

## Testpersona

Ik heb bewust geen extreem profiel gebruikt. De persona is een ervaren maar niet uitzonderlijke recreatieve lifter met beperkte vrije tijd op twee dagen.

| Onderdeel | Gekozen antwoord |
| --- | --- |
| Doel | Spiergroei |
| Leeftijdscheck | 18+ |
| Ervaring | 1-3 jaar, dus intermediate |
| Trainingsdagen | Maandag, woensdag, vrijdag, zondag |
| Tijd per dag | 60, 45, 75 en 45 minuten |
| Andere intensieve sport | Ja, zaterdag |
| Materiaal | Lichaamsgewicht, dumbbells, barbell |
| Setups | Vloer, bankje, rack |
| Veiligheid | Alleen voorgeschiedenis: schouder |
| Prioriteit 1 | Schouders |
| Prioriteit 2 | Rug |
| Prioriteit 3 | Hamstrings |
| Trainingsstijl | Vrije gewichten |
| Variatie | Gebalanceerd |
| Slaap | 7,5 uur |
| Stress | Gemiddeld |
| Profieltype | Intermediate met ruwe huidige-volumeschatting |

### Huidig direct volume

De volume-input is ingevuld met realistische bandbreedtes. De exacte waarden zijn door de onboarding als midden van de gekozen band gebruikt.

| Spiergroep | Gekozen band | Startwaarde in schema |
| --- | --- | ---: |
| Borst | 9-12 | 10 |
| Rug | 9-12 | 10 |
| Schouders | 5-8 | 6 |
| Biceps | 5-8 | 6 |
| Triceps | 5-8 | 6 |
| Quadriceps | 9-12 | 10 |
| Hamstrings | 5-8 | 6 |
| Bilspieren | 5-8 | 6 |
| Kuiten | 5-8 | 6 |
| Core | 1-4 | 2 |

Dit is een goede test voor v3, omdat de planner dan niet terugvalt op alleen de beginner-default en ook niet door prioriteiten direct extreme extra sets zou moeten maken.

## Walkthrough per onboardingstap

### 1. 18+-bevestiging en gezondheidsscreening

**Actie:** `Ja, ik ben 18+` gekozen.

**Wat goed werkt:**

- De eerste stap is duidelijk en niet omslachtig.
- De leeftijdscheck staat vroeg genoeg in de flow.
- De gebruiker wordt niet meteen overspoeld met trainingsdetails.

**Beoordeling:** geen blocker. Deze stap voelt als een goede korte poort voordat trainingsadvies wordt getoond.

### 2. Trainingservaring

**Actie:** `1-3 jaar` gekozen.

**Wat goed werkt:**

- De antwoordopties zijn begrijpelijker dan alleen beginner/intermediate/advanced.
- De keuze heeft een duidelijke consequentie: intermediate krijgt de huidige-volumestap.
- De flow blijft compact; er wordt geen irrelevante kracht- of max-test gevraagd.

**Kans:** zet eventueel onder de keuze nog explicieter dat ervaring niet automatisch betekent dat iemand meer volume nodig heeft. De huidige copy is al redelijk voorzichtig, maar dit blijft een gevoelig algoritmisch signaal.

### 3. Huidige directe sets per spiergroep

**Actie:** alle tien spiergroepen ingevuld met bovenstaande bandbreedtes.

**Wat goed werkt:**

- De vraag is passend voor intermediate/advanced en ontbreekt bij beginners.
- Een ruwe bandbreedte is haalbaar; de gebruiker hoeft geen perfect logboek te reconstrueren.
- De uitleg maakt duidelijk dat dit een startpunt is en dat logs later belangrijker worden.
- `Onbekend` blijft beschikbaar, wat beter is dan schijnnauwkeurigheid afdwingen.

**Kans:** de knop kan nu ook door wanneer alle waarden op `Onbekend` staan. Dat is verdedigbaar, maar maak visueel expliciet dat `Onbekend` een bewuste keuze is: bijvoorbeeld `Ik weet dit niet - start conservatief`. Zo begrijpt de gebruiker waarom doorgaan toch veilig is.

### 4. Trainingsdagen en tijd per dag

**Actie:** maandag 60, woensdag 45, vrijdag 75 en zondag 45 minuten.

**Wat goed werkt:**

- Dagkeuze en individuele tijdslimieten zitten in een aparte, overzichtelijke stap.
- De korte dagen waren belangrijk voor de realistische test; de planner respecteerde ze later daadwerkelijk.
- Er wordt geen universele trainingsduur opgedrongen.

**Kans:** de tijdselectie begint met een waarde van 60 minuten. Dat werkt als default, maar voelt als een opgeslagen antwoord zodra de gebruiker snel verder klikt. Combineer dit met een review waarin per dag expliciet staat: `Ma 60 min, Wo 45 min, Vr 75 min, Zo 45 min`.

### 5. Apparatuur en setups

**Actie:** lichaamsgewicht, dumbbells en barbell; vloer, bankje en rack.

**Wat goed werkt:**

- Materiaal en setup worden apart gevraagd. Dat is algoritmisch beter dan alleen een generieke lijst met apparatuur.
- De latere oefenkeuze hield rekening met de combinatie.
- De gebruiker krijgt geen oefening met machines of kabels opgedrongen.

**Kans:** op een kleine viewport kunnen materiaal- en setupkaarten visueel dicht op elkaar staan. De selectie is functioneel duidelijk, maar een korte samenvatting na de stap zou helpen: `3 materiaaltypes, 3 setups geselecteerd`.

### 6. Andere intensieve sport

**Actie:** `Ja`, zaterdag geselecteerd.

**Belangrijke bevinding:** voordat `Ja` werd gekozen, stond `Nee` al visueel geselecteerd en was de knop om door te gaan actief.

Dit is een datakwaliteitsrisico. Een gebruiker die de stap leest maar niet bewust op een kaart klikt, kan zonder het te merken opslaan dat hij geen andere sport doet. Dat is extra relevant omdat andere sportdagen de weekplanning en vermoeidheidswaarschuwingen beïnvloeden.

**Aanbeveling:** begin met `Geen keuze` en laat de gebruiker expliciet `Nee` of `Ja` kiezen. Als `Ja` is gekozen, moeten de dagen verplicht worden ingevuld. Als `Nee` is gekozen, mag doorgaan meteen beschikbaar zijn.

De huidige vraag is verder precies compact genoeg. Er is voor v3 geen aparte sportmodule nodig; ja/nee plus dagen is voldoende.

### 7. Klachten, restricties en vrijgave

**Actie:** `Alleen voorgeschiedenis`, gebied `Schouder`.

**Wat goed werkt:**

- Het onderscheid tussen actieve klachten, medische restricties, vrijgave met restricties en voorgeschiedenis is inhoudelijk sterk.
- De copy maakt duidelijk dat voorgeschiedenis context is en niet automatisch het hele plan blokkeert.
- De safety-stap voelt niet alsof FitQuest een diagnose probeert te stellen.
- De footer herhaalt de belangrijkste grens: bij pijn stoppen, loggen en niet blind doorgaan.

**Beoordeling:** dit is een van de beste onderdelen van de flow.

**Niet in deze persona getest:** de actieve-klachtenroute en een restrictie die specifieke patronen blokkeert. Die paden moeten in een aparte safety-check opnieuw worden doorlopen, omdat een realistische gezonde gebruiker deze blokkade niet activeert.

### 8. Prioriteitsspieren

**Actie:** Schouders, Rug, Hamstrings in die volgorde.

**Wat goed werkt:**

- De vraag is directer en bruikbaarder dan een subjectieve rating per spier.
- Maximaal drie geordende keuzes houden de input compact.
- De uitleg zegt expliciet dat prioriteit niet automatisch enorme sets toevoegt.
- In het schema zijn de prioriteiten zichtbaar als `Schouders - Rug - Hamstrings`.

**Beoordeling:** goede productkeuze. Dit is precies het signaal dat de planner nodig heeft zonder te doen alsof een gebruiker met een lage rating automatisch vier extra sets nodig heeft.

### 9. Trainingsstijl en variatie

**Actie:** vrije gewichten, gebalanceerde variatie, 7,5 uur slaap, gemiddelde stress.

**Wat goed werkt:**

- De stijlkeuze had zichtbaar effect op de oefenselectie.
- Slaap en stress worden gebruikt als context, niet als pseudo-medische diagnose.
- De gebruiker krijgt geen lange vragenlijst over elk detail van de training.

**Kans:** laat op de review kort zien dat dit ook is opgeslagen. Vooral de combinatie `vrije gewichten` en de geselecteerde apparatuur bepaalt waarom bijvoorbeeld geen cable- of machinevariant verschijnt.

### 10. Overzicht en schema genereren

**Wat goed werkt:**

- Het overzicht geeft vertrouwen voordat het schema wordt gebouwd.
- De gebruiker ziet ervaring, dagen, materiaal, prioriteiten en safety-context.
- De copy zegt opnieuw dat logs de volgende aanpassing sturen.
- De overgang naar het schema is duidelijk: `Schema bouwen`.

**Wat ontbreekt in de review:**

- individuele minuten per dag;
- andere sportdag(en);
- setups zoals vloer, bankje en rack;
- huidige-volumebanden of een compacte samenvatting daarvan;
- trainingsstijl en variatievoorkeur.

Dit zijn geen cosmetische profielvelden. Ze bepalen direct waarom een oefening of setverdeling in het schema staat. Een gebruiker kan op de review dus nog niet volledig controleren of de planner hem goed heeft begrepen.

## Het gegenereerde schema

### Eerste gegenereerde week

| Dag | Training | Focus | Schatting | Limiet | Oefeningen |
| --- | --- | --- | ---: | ---: | ---: |
| Ma | Lower A | Hamstrings + Quadriceps | 59 min | 60 | 6 |
| Wo | Upper A | Schouders + Rug | 45 min | 45 | 7 |
| Vr | Lower B | Hamstrings + Quadriceps | 68 min | 75 | 6 |
| Zo | Upper B | Schouders + Rug | 44 min | 45 | 7 |

Elke training werd als `Past binnen tijd` getoond. Geen enkele sessie overschreed de individuele limiet. Dat is belangrijk: het tijdmodel is niet alleen een label, het had in deze test zichtbaar invloed op de output.

### Lower A - maandag

1. Barbell back squat - 3 x 6-10, 120 seconden rust, RIR 2
2. Dumbbell Romanian deadlift - 1 x 6-10, 120 seconden rust, RIR 2
3. Reverse lunge - 3 x 6-10, 120 seconden rust, RIR 2
4. Barbell calf raise - 1 x 10-15, 75 seconden rust, RIR 2
5. Dumbbell dead bug - 1 x 10-15, 75 seconden rust, RIR 2
6. Single-leg glute bridge - 3 x 6-10, 120 seconden rust, RIR 2

De dag is inhoudelijk logisch, maar de tijdsfitting heeft de Romanian deadlift, calf raise en core klein gemaakt. De bilspierbelasting blijft relatief zwaar door de reverse lunge en drie sets glute bridge. Dat kan bewust zijn vanuit de prioriteits- en volumeboekhouding, maar de gebruiker krijgt niet uitgelegd waarom de hamstringoefening slechts een enkele set heeft.

### Upper A - woensdag

1. Barbell bench press - 1 x 6-10
2. Barbell row - 3 x 6-10
3. Barbell overhead press - 1 x 6-10
4. Dumbbell pullover - 3 x 6-10
5. Dumbbell lateral raise - 1 x 10-15
6. Barbell curl - 1 x 10-15
7. Close-grip push-up - 1 x 6-10

Dit is het duidelijkste voorbeeld van setfragmentatie: zeven oefeningen in 45 minuten, waarvan vijf oefeningen slechts een enkele werkset hebben. Voor de gebruiker voelt dit als veel wisselen en weinig focus. Een kortere sessie met bijvoorbeeld vier of vijf oefeningen en meer sets per gekozen oefening zou waarschijnlijk beter uitvoerbaar en begrijpelijker zijn.

### Lower B - vrijdag

1. Romanian deadlift - 3 x 6-10
2. Goblet squat - 3 x 6-10
3. Barbell hip thrust - 3 x 6-10
4. Dumbbell calf raise - 3 x 10-15
5. Dumbbell dead bug - 3 x 10-15
6. Dumbbell split squat - 3 x 6-10

Deze dag is het meest coherent. De langere limiet van 75 minuten maakt een volledige lower-sessie mogelijk zonder dezelfde mate van versnippering als op woensdag en zondag.

### Upper B - zondag

1. Dumbbell pullover - 1 x 6-10
2. Incline dumbbell press - 1 x 6-10
3. One-arm dumbbell row - 2 x 6-10
4. Dumbbell floor press - 3 x 6-10
5. Dumbbell lateral raise - 1 x 10-15
6. Dumbbell curl - 1 x 10-15
7. Close-grip push-up - 1 x 6-10

Ook hier zijn zeven oefeningen in 45 minuten gepland. De prioriteitsschouders krijgen wel exposure, maar de concrete dosis van een enkele set is klein. Het schema zou sterker voelen als de planner expliciet kiest tussen meer exposure en voldoende werksets, in plaats van beide altijd te proberen te behouden.

### Wat het schema goed doet

- De vier dagen vormen een begrijpelijke upper/lower-structuur.
- De andere intensieve sport op zaterdag is niet gecombineerd met een krachttraining; in deze persona ontstond dus geen sport-overlapwaarschuwing.
- De prioriteiten zijn niet vertaald naar een extreme automatische setverhoging.
- Het schema bevat expliciete reps, rust, RIR, stimulus, progression ease en vermoeidheidskosten.
- De geselecteerde oefeningen passen bij het materiaal en de gekozen stijl.
- Er is geen machine-, kabel- of bandvariant binnengeslopen.
- Tijdsbeperkingen zijn zichtbaar in zowel de planning als de waarschuwingen.
- De planner meldt eerlijk dat er in Lower A en Lower B geen toegestane `leg-curl` beschikbaar was.

### Wat het schema beter moet doen

#### 1. Optimaliseer korte trainingen op productieve werksets

De huidige `fitToTime` verlaagt eerst sets en verwijdert pas later oefeningen. Daardoor blijven veel verschillende oefeningen staan met één set. Dat is algoritmisch begrijpelijk, maar niet automatisch de beste gebruikerservaring.

Een betere beslisregel voor korte dagen:

- behoud noodzakelijke bewegingspatronen;
- geef prioriteitsspieren minimaal één goede blootstelling;
- beperk het aantal oefeningen;
- geef de overblijvende oefeningen liever twee of drie werksets;
- gebruik een enkele set alleen voor een bewuste, gelabelde accessoirekeuze.

De planner moet ook kunnen uitleggen: `Je hebt 45 minuten. Daarom kies ik vijf oefeningen met meer effectieve sets in plaats van zeven oefeningen met losse sets.`

#### 2. Leg het ontbrekende leg-curl-patroon menselijk uit

De huidige waarschuwing is technisch: `Lower A heeft geen toegestane oefening voor leg-curl.` Dat is correct, maar niet erg behulpzaam.

Een betere uitleg zou zijn:

> Met je huidige materiaal hebben we geen veilige kniebuigende hamstringoefening beschikbaar. Je hamstrings krijgen wel werk via Romanian deadlifts, maar deze week ontbreekt de leg-curlvariant. Voeg sliders, banden of een machine toe als je dit patroon bewust wilt trainen.

De app moet daarbij niet doen alsof een RDL exact hetzelfde is als een leg curl. De gebruiker mag weten wat wel en niet gedekt wordt.

#### 3. Toon waarom sets zijn verlaagd

Bij Lower A is bijvoorbeeld niet zichtbaar waarom de Romanian deadlift één set heeft terwijl de gebruiker zes huidige directe hamstringsets rapporteerde. De gebruiker ziet alleen het eindresultaat.

Een compacte `Waarom?`-uitleg per afwijking zou veel vertrouwen geven:

- `Verlaagd door je maandaglimiet van 60 minuten`;
- `Behouden omdat dit je prioriteitspatroon is`;
- `Secundaire bijdrage telt mee voor boekhouding, niet als directe set`.

## Volume-audit

De eerste week toonde de volgende effectieve, boekhoudkundige bijdragen. Dit zijn niet allemaal directe sets; secundaire bijdragen zijn oefening-specifiek.

| Spiergroep | Direct startvolume | Effectieve weekbijdrage | Verschil | Observatie |
| --- | ---: | ---: | ---: | --- |
| Borst | 10 | 7,1 | -2,9 | Onder persoonlijke start, waarschuwing |
| Rug | 10 | 11,2 | +1,2 | Dicht bij huidig volume |
| Schouders | 6 | 6,9 | +0,9 | Prioriteit zichtbaar zonder sprong |
| Biceps | 6 | 3,8 | -2,2 | Onder persoonlijke start, waarschuwing |
| Triceps | 6 | 5,1 | -0,9 | Redelijk dicht bij start |
| Quadriceps | 10 | 12,0 | +2,0 | Extra compound-bijdragen |
| Hamstrings | 6 | 9,6 | +3,6 | Hinge- en single-leg-bijdragen |
| Bilspieren | 6 | 16,9 | +10,9 | Grote secundaire/compound-bijdrage |
| Kuiten | 6 | 4,0 | -2,0 | Onder persoonlijke start, waarschuwing |
| Core | 2 | 9,5 | +7,5 | Veel indirecte bijdragen in de boekhouding |

### Interpretatie

Het sterke punt is dat de app niet simpelweg alle secundaire sets op nul zet. De scheiding tussen `volumeContribution` en `recoveryContribution` is een goede architectuur.

Het probleem is presentatie. Een gebruiker kan `Bilspieren 16,9` of `Core 9,5` lezen als echte directe werksets. Ook de omgekeerde richting is verwarrend: borst start op 10, maar toont 7,1. Zonder een duidelijke legenda en een detailuitleg lijkt het alsof het algoritme het persoonlijke startvolume negeert.

Aanbevolen interface:

- toon `Directe sets gepland` apart van `Effectieve boekhouding`;
- laat zien welke oefeningen de grootste secundaire bijdrage leveren;
- gebruik woorden als `boekhoudkundige bijdrage`, niet alleen een groot getal naast een spiernaam;
- toon een waarschuwing alleen wanneer een gebruiker echt onder de directe start komt, niet alsof elke effectieve afwijking een fout is.

## Waarschuwingsaudit

Bij de eerste generatie waren er 18 zichtbare waarschuwingen:

| Categorie | Aantal | Betekenis |
| --- | ---: | --- |
| Ontbrekend patroon | 2 | Lower A en Lower B zonder toegestane leg curl |
| Tijdconstraint | 3 | Lower A, Upper A en Upper B moesten worden ingekort |
| Onder startvolume | 3 | Borst, biceps en kuiten onder de persoonlijke start |
| Recovery-overlap | 10 | Herhaalde waarschuwingen voor rug, hamstrings, core en andere overlappen |

### Wat goed werkt

- Het systeem waarschuwt in plaats van beperkingen stil te negeren.
- De recovery-engine kijkt niet alleen naar primaire spieren; rug, hamstrings en core kwamen terug door secundaire belasting.
- De intensieve sport op zaterdag werd in deze week niet onnodig als overlap gemarkeerd.
- De waarschuwingsteksten geven meestal een actie, zoals langer trainen of een veilige swap kiezen.

### Wat niet goed werkt

De waarschuwingsectie wordt snel lang en herhaalt vrijwel dezelfde boodschap per spier en per aangrenzende trainingscombinatie. Daardoor moet de gebruiker door veel oranje meldingen heen voordat duidelijk is wat de belangrijkste actie is.

Aanbevolen presentatie:

1. Sorteer eerst op ernst: blokkade, belangrijke waarschuwing, informatie.
2. Groepeer daarna op oorzaak: tijd, ontbrekend patroon, volume, herstel.
3. Toon een korte samenvatting, bijvoorbeeld `10 hersteloverlappen in 3 spiergroepen`.
4. Laat details uitklappen per spiergroep of trainingspaar.
5. Geef maximaal één primaire aanbeveling bovenaan.

Een goede eerste boodschap voor deze test zou zijn:

> Je schema past binnen je tijden, maar drie spiergroepen krijgen korte hersteltijden tussen trainingen. Houd deze volgorde voorlopig aan en gebruik je logs om te bepalen of de prestaties eronder lijden.

Daaronder kunnen de technische details blijven bestaan voor gebruikers die ze willen controleren.

## Realistisch loggen van drie trainingen

Ik heb geen fictieve API-data ingevoerd. De sessies zijn via de zichtbare logger ingevuld alsof de testpersoon de trainingen echt had uitgevoerd.

### Sessie 1 - Lower A

| Oefening | Gelogde sets | RIR | Voltooid | Klacht |
| --- | --- | ---: | --- | --- |
| Barbell back squat | 8 x 80, 8 x 80, 7 x 77,5 kg | 2 | Ja | Geen |
| Dumbbell Romanian deadlift | 10 x 30 kg | 2 | Ja | Geen |
| Reverse lunge | 8 x 16, 8 x 16, 7 x 16 kg | 2 | Ja | Geen |
| Barbell calf raise | 12 x 50 kg | 2 | Ja | Geen |
| Dumbbell dead bug | 12 x 8 kg | 3 | Ja | Geen |
| Single-leg glute bridge | 10, 10, 10 lichaamsgewicht | 2 | Ja | Geen |

**Sessieduur:** 62 minuten  
**Session RPE:** 8/10  
**Herstel:** Oké  
**Resultaat:** opgeslagen, teller naar 1/4

De logger werkte goed: reps, gewicht, RIR, voltooid-status, sessieduur, RPE en herstel konden allemaal worden opgeslagen. De toast bevestigde dat de volgende aanbeveling de data zou gebruiken.

### Sessie 2 - Upper A

| Oefening | Gelogde sets |
| --- | --- |
| Barbell bench press | 8 x 60 kg |
| Barbell row | 8 x 70, 8 x 70, 7 x 70 kg |
| Barbell overhead press | 8 x 35 kg |
| Dumbbell pullover | 10 x 24, 10 x 24, 9 x 24 kg |
| Dumbbell lateral raise | 12 x 8 kg |
| Barbell curl | 10 x 30 kg |
| Close-grip push-up | 8 herhalingen lichaamsgewicht |

**Sessieduur:** 47 minuten  
**Session RPE:** 8/10  
**Herstel:** Oké  
**Resultaat:** opgeslagen, teller naar 2/4

### Sessie 3 - Lower B

| Oefening | Gelogde sets |
| --- | --- |
| Romanian deadlift | 8 x 90, 8 x 90, 7 x 90 kg |
| Goblet squat | 10 x 32, 10 x 32, 9 x 32 kg |
| Barbell hip thrust | 10 x 100, 9 x 100, 9 x 100 kg |
| Dumbbell calf raise | 12 x 24, 12 x 24, 11 x 24 kg |
| Dumbbell dead bug | 12 x 8, 12 x 8, 12 x 8 kg, RIR 3 |
| Dumbbell split squat | 8 x 20, 8 x 20, 7 x 20 kg |

**Sessieduur:** 74 minuten  
**Session RPE:** 8/10  
**Herstel:** Goed  
**Resultaat:** opgeslagen, teller naar 3/4

## Wat veranderde na drie logs?

De planner reageerde wel degelijk op de opgeslagen data. De zichtbare planning veranderde als volgt:

| Dag | Eerste schatting | Na drie logs | Werkelijke gelogde tijd |
| --- | ---: | ---: | ---: |
| Ma Lower A | 59 min | 60 min | 62 min |
| Wo Upper A | 45 min | 44 min | 47 min |
| Vr Lower B | 68 min | 65 min | 74 min |
| Zo Upper B | 44 min | 41 min | Niet gelogd |

Ook de setverdeling veranderde. Na drie logs had Lower A bijvoorbeeld 3 sets Romanian deadlift en 3 sets calf raise, maar minder glute-bridge-sets. Upper A ging naar 2 sets bench press. Lower B kreeg 4 sets dead bug.

Dit bewijst dat de engine niet alleen een statisch schema toont. Tegelijk is de verandering voor de gebruiker niet uitlegbaar:

- de echte sessies waren iets langer dan de eerste schattingen;
- sommige nieuwe schattingen werden toch korter;
- er is geen label dat zegt welke wijziging uit tijdleren kwam en welke uit setaanpassing;
- het scherm blijft per oefening `belasting leren` tonen.

De drie gemeten verhoudingen waren ongeveer 1,05, 1,04 en 1,09 ten opzichte van de eerste planning. Een persoonlijke factor rond 1,06 is dus op zichzelf verdedigbaar. Het probleem is niet dat de factor verandert, maar dat de gebruiker niet ziet hoe de nieuwe schatting tot stand kwam.

## Progression- en coachloopbevindingen

### Positief

- De logger bevat de juiste minimale signalen: reps, gewicht, RIR, completion, discomfort, sessieduur, RPE en herstel.
- De data blijft lokaal opgeslagen.
- De voortgangsteller `1/4`, `2/4`, `3/4` maakt de eerste activatie zichtbaar.
- Een gebruiker kan een veilige swap openen zonder het hele schema opnieuw te bouwen.
- Er werd na deze drie goede sessies geen onterechte deload getoond. Dat is logisch: er was geen pijn, geen lage completion en geen duidelijke regressie.

### Hoofdprobleem: de volgende actie is niet zichtbaar

De UI toont in de exercise cards alleen:

- de oefening;
- de dosis;
- `belasting leren` of een startgewicht;
- rust en RIR;
- de swapknop.

De onderliggende progression-beslissing bevat meer informatie, zoals `start`, `add-reps`, `increase-load`, `repeat`, `reduce-volume` en `swap-review`, maar het veld `progression` wordt niet zichtbaar gerenderd in de kaart.

Daardoor voelt de coachlus voor de gebruiker ongeveer zo:

1. Ik log mijn sessie.
2. De app zegt dat de volgende aanbeveling de data gebruikt.
3. Ik kijk opnieuw.
4. Ik zie nog steeds `belasting leren`.

Dat is het moment waarop het onderscheidende productidee niet landt.

### Technische volgorde die aandacht nodig heeft

De huidige flow berekent de progression-beslissing op de basisprescription en voert daarna de tijdsfitting uit. Daardoor kan een oefening die door de tijdslimiet naar bijvoorbeeld één set wordt teruggebracht nog worden beoordeeld alsof er drie sets gepland waren.

Concreet voorbeeld uit deze walkthrough:

- de basisprescription van de dumbbell Romanian deadlift was 3 sets;
- Lower A werd vóór het loggen door de tijdsfitting naar 1 set gebracht;
- de gebruiker voltooide die ene set met 10 reps en RIR 2;
- de progression-check kijkt nog naar de oorspronkelijke 3 sets om te bepalen of alle sets de top van de range haalden.

Dat kan progression onnodig tegenhouden. De planner moet eerst de effectieve prescription bepalen en daarna de performance tegen die effectieve prescription beoordelen, of de logger moet expliciet weten hoeveel sets werkelijk als plan golden.

### Aanbevolen zichtbare output

Elke oefening zou na een log één duidelijke status moeten krijgen, bijvoorbeeld:

- `Volgende keer: houd 60 kg en bouw reps op.`
- `Volgende keer: verhoog klein naar 62,5 kg.`
- `Volgende keer: herhaal dezelfde belasting.`
- `Twee missers: tijdelijk een set minder.`
- `Pijn gemeld: kies een veilige swap of laat dit beoordelen.`

Daarnaast verdient de sessie als geheel een korte coach update:

> Goede sessie. Alle geplande sets voltooid en herstel is oké. Houd je huidige belasting aan en bouw volgende keer reps op bij 4 oefeningen.

Dit maakt de feedbacklus begrijpelijk zonder ML of een ingewikkeld dashboard.

## Prioriteiten voor verbetering

### P1 - Maak de volgende aanbeveling zichtbaar

**Finding:** de engine berekent progression, maar de UI toont die beslissing niet.

**Impact:** de gebruiker begrijpt niet wat de log oplevert en krijgt geen concrete volgende actie.

**Aanbeveling:** render `progression.message` op elke exercise card en voeg na opslaan een korte sessiesamenvatting toe.

**Acceptatie:** na iedere opgeslagen sessie is per oefening zichtbaar of de gebruiker reps moet opbouwen, gewicht moet verhogen, moet herhalen, volume moet verlagen of moet swappen.

### P1 - Bereken progression op de gefitte dosis

**Finding:** progression wordt beslist vóór de tijdsfitting.

**Impact:** oefeningen die door tijdsdruk minder sets krijgen kunnen ten onrechte nooit `alle sets gehaald` worden.

**Aanbeveling:** fit eerst op de daglimiet en voer daarna de progression-check uit op de effectieve prescription. Voeg een regressietest toe voor een oefening die van 3 naar 1 set wordt gefit.

**Acceptatie:** één volledig voltooide, effectief geplande set kan progression activeren wanneer de gefitte prescription inderdaad één set bevat.

### P1 - Maak korte trainingen minder versnipperd

**Finding:** Upper A en Upper B hebben zeven oefeningen in 45 minuten, met meerdere enkele sets.

**Impact:** meer transitions, minder focus en een plan dat drukker voelt dan nodig.

**Aanbeveling:** voeg aan de tijdsoptimizer een voorkeur toe voor minder oefeningen met voldoende sets, zolang patronen, prioriteiten en veiligheidsregels behouden blijven.

**Acceptatie:** een 45-minuten-training gebruikt niet standaard zeven oefeningen met vijf single-set accessoires. Als single-set exposure toch gekozen wordt, wordt dat uitgelegd.

### P1 - Laat de gebruiker alle schema-kritische keuzes controleren

**Finding:** de review mist daglimieten, andere sportdagen, setups, huidige volumebanden en trainingsstijl.

**Impact:** de gebruiker kan niet volledig verifiëren of de belangrijkste plannerinputs correct zijn.

**Aanbeveling:** voeg een compacte `Je planning is gebaseerd op`-samenvatting toe met alle relevante keuzes, zonder de review veel langer te maken.

### P1 - Maak de sportkeuze expliciet

**Finding:** `Nee` staat vooraf geselecteerd.

**Impact:** gebruikers kunnen onbewust een foutieve vermoeidheidscontext opslaan.

**Aanbeveling:** start met `Geen keuze`; activeer doorgaan pas na een bewuste keuze. Maak dagen verplicht bij `Ja`.

### P1 - Groepeer waarschuwingen

**Finding:** 18 waarschuwingen worden als een lange herhaalde lijst getoond.

**Impact:** belangrijke acties verdwijnen tussen technische recovery-overlaps.

**Aanbeveling:** groepeer op oorzaak en spiergroep, toon aantallen en laat details uitklappen.

### P1 - Scheid direct volume van effectieve boekhouding

**Finding:** het volume-overzicht toont één waarde naast een startvolume, terwijl de waarde secundaire bijdragen bevat.

**Impact:** getallen zoals `Bilspieren 16,9` en `Core 9,5` kunnen worden gelezen als directe sets.

**Aanbeveling:** toon directe geplande sets en effectieve accounting afzonderlijk, met een `waarom`-detail per grote afwijking.

### P2 - Maak tijdleren transparanter

**Finding:** na drie logs veranderden de schattingen, maar zonder uitleg en soms in een onverwachte richting.

**Impact:** een gebruiker kan denken dat zijn werkelijke tijden niet serieus worden genomen.

**Aanbeveling:** toon bijvoorbeeld `Je laatste 3 sessies waren gemiddeld 6% langer dan de planning. De volgende schatting gebruikt dit.` Maak daarnaast zichtbaar welk verschil door setfitting komt.

### P2 - Vertaal ontbrekende patronen naar coachingtaal

**Finding:** `geen toegestane oefening voor leg-curl` klinkt als een interne foutmelding.

**Impact:** de gebruiker weet niet of hamstrings nu wel of niet voldoende worden getraind.

**Aanbeveling:** leg uit welk deel wel gedekt is, welk patroon ontbreekt en welke materiaalkeuze het kan oplossen.

### P2 - Maak de eerste startbelasting minder leeg

**Finding:** vóór de eerste log toont iedere oefening `belasting leren`.

**Impact:** dit is eerlijk, maar voelt voor een intermediate gebruiker als weinig houvast.

**Aanbeveling:** geef een optionele startschatting waar veilig, of voeg een korte instructie toe: `Kies een gewicht waarmee je de onderkant van de range met ongeveer 2 RIR haalt.`

## Safety-beoordeling

In deze walkthrough was alleen een schoudervoorgeschiedenis actief. De planner overschreef die context niet en gaf geen revalidatieadvies.

Wat ik als vaste veiligheidscriteria zou blijven bewaken:

- actieve of onverklaarde klachten blokkeren automatisch een plan;
- medische restricties blijven hard gelden, ook na `clearedWithRestrictions`;
- voorgeschiedenis beïnvloedt alleen context en niet automatisch de selectie;
- pijn in een log leidt tot stoppen, swap-review of menselijke beoordeling;
- de app suggereert niet dat een veilige swap een medische oplossing is.

De safety-copy in het plan en de footer is op dit moment duidelijk genoeg. De belangrijkste vervolgtest is niet meer de tekst, maar het systematisch doorlopen van de actieve-symptomen- en restrictieroutes in de browser.

## Mobiele en visuele notitie

In de gebruikte desktopbrowser was er geen horizontale overflow en waren de stappen, kaarten en CTA's visueel duidelijk. De vaste in-app browser liet in deze run geen echte viewportwissel naar 390 x 844 toe. Daarom is mobiel gedrag niet volledig afgetekend met een formele mobiele walkthrough; dat verdient een aparte check voordat dit als definitief wordt beschouwd.

## Aanbevolen volgorde voor de volgende implementatieronde

1. Render de daadwerkelijke progression-message en toon een duidelijke `volgende keer`-actie.
2. Herstel de volgorde tussen tijdsfitting en progression-beslissing.
3. Bouw een compacte 45-minuten-optimizer die minder oefeningen met meer werksets prefereert.
4. Maak de sportkeuze expliciet en breid de review uit met alle schema-kritische inputs.
5. Groepeer en prioriteer waarschuwingen.
6. Splits directe sets en effectieve volume-accounting in de UI.
7. Voeg menselijkere uitleg toe bij ontbrekende patronen en tijdsbeperkingen.
8. Herhaal daarna deze walkthrough met een beginner, een advanced gebruiker, een actieve klacht en een echte equipment-beperking.

## Concrete metrics voor lokale evaluatie

Omdat FitQuest local-first blijft, hoeft dit geen cloud analytics te worden. Een lokale debug- of testcounter is genoeg om de volgende iteraties te beoordelen.

- onboarding gestart;
- elke onboardingstap voltooid;
- onboarding verlaten per stap;
- schema gegenereerd;
- eerste training geopend;
- eerste sessie opgeslagen;
- tijd van schema naar eerste log;
- waarschuwing geopend;
- veilige swap bekeken en toegepast;
- progression-message gezien;
- tweede sessie opgeslagen;
- deload voorgesteld en geaccepteerd;
- sessie opnieuw gelogd.

De belangrijkste nieuwe metric is niet `schema generated`, maar `first session saved` gevolgd door `next action understood`. Die laatste kan in een test-build worden gemeten met een simpele knop zoals `Begrepen` of `Volgende training bekijken`.

## Eindconclusie

De onboarding zelf hoeft niet opnieuw uitgevonden te worden. Hij is compact, logisch en voldoende persoonlijk zonder te doen alsof alle trainingsbeslissingen exact voorspelbaar zijn.

De volgende winst zit in de coachlaag. De gebruiker moet na het loggen niet alleen weten dat FitQuest data heeft opgeslagen, maar ook concreet weten wat er bij de volgende blootstelling verandert. Daarnaast moet de planner op korte dagen minder versnipperen en moet het scherm duidelijker uitleggen waarom directe volumes en effectieve bijdragen van elkaar verschillen.

Als deze punten worden opgelost, verschuift FitQuest zichtbaar van `goede schema-generator` naar `coachende hypertrofieplanner`.

