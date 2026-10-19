---
title: Reading-app — productonderzoek en ideeën
created: 2026-09-09
updated: 2026-10-12
type: project-research
tags: [personal, reading-app, product, research, android]
status: active
related: design.md
---

# Reading-app — productonderzoek en ideeën

Dit is de lopende onderzoeks- en ideeënlijst voor de Reading-app. Het document is geen bouwopdracht: ideeën blijven hier staan totdat er genoeg bewijs en een expliciete scopebeslissing is. De canonieke huidige productscope staat in [design.md](design.md).

## 1. Huidige producthouding

De app is in de eerste plaats een persoonlijk leesarchief: boeken terugvinden, voortgang bewaren en eigen gedachten later opnieuw kunnen lezen. De huidige ontwerpspecificatie kiest bewust voor lokale opslag, drie leesstatussen, voortgang, eigen rating/review en een typed journal. Er is geen sociale feed gevraagd.

De belangrijkste ontwerpregel voor volgende iteraties:

> Maak het vastleggen en terugvinden van persoonlijke leesgeschiedenis betrouwbaarder voordat je nieuwe manieren toevoegt om meer leesgedrag te meten.

Daarom krijgen zoekbaarheid, data-eigenaarschap, notitieterugwinning en foutbestendigheid voorrang boven streaks, badges, openbare profielen of AI-functies.

## 2. Eerste online onderzoek — samenvatting

De bronnen hieronder zijn vooral Reddit-discussies. Reddit is bruikbaar voor ongepolijste taal en concrete frustraties, maar de steekproef bestaat uit uitgesproken gebruikers en is niet representatief voor alle lezers. De confidence hieronder betekent dus: vertrouwen binnen deze onderzoeksset, niet statistische zekerheid over de hele markt.

| Thema | Wat terugkomt | Confidence | Gevolg voor de app |
|---|---|---:|---|
| Eigen bibliotheek kunnen zoeken en ordenen | Mensen willen hun eigen boeken, lijsten en statussen snel vinden; verborgen of versnipperde lijsten voelen als een defect. | Hoog binnen deze set | Maak cataloguszoeken en zoeken in Mijn bibliotheek expliciet verschillende acties. Voeg lokale tekstzoeking, filters en eenvoudige sortering toe. |
| Catalogusdekking mag handmatige invoer niet blokkeren | Recente Android-trackerreviews beschrijven boeken die niet gevonden worden en een ontbrekende handmatige fallback als reden om de app niet te kunnen gebruiken. | Middel-laag binnen deze set | Behandel handmatig toevoegen en later corrigeren als kernpad van R-07; een online catalogusresultaat is nooit de enige manier om een persoonlijk archief te vullen. |
| Grote collecties vragen om snelle lokale navigatie | Naast zoeken kan een zeer lange persoonlijke lijst behoefte geven aan een alfabetische sprong; dit komt hier uit één recente Bookshelf-feedback en is geen basisbehoefte. | Laag | Houd vrije lokale zoeking als basis en parkeer een letterindex als schaalafhankelijke QOL-optie. |
| Lage invoerfrictie | Een momenteel gelezen boek, duidelijke status en een direct bruikbare boekpagina zijn belangrijker dan een volle homepage; een verse Android-test toont dat een paginaladder en een door de IME bedekte opslagknop de kernflow breken. | Hoog binnen deze set voor de basisroute; middel-laag voor de precieze control | Houd een `Verder lezen`-ingang prominent; kies absolute paginainvoer of `Vul tot pagina`, houd velden/opslaan bereikbaar met het toetsenbord en geef duidelijke validatiefout. Geen timer of statistiek nodig. |
| Meerdere boeken tegelijk kunnen hervatten | Lezers wisselen geregeld tussen fysieke, digitale en audioboeken of tussen boeken voor verschillende plekken en stemmingen; een te grote actieve lijst kan juist overzicht kosten. | Middel | Laat meerdere boeken `Bezig` zijn, maar houd de snelle terugkeerweergave klein en voorspelbaar. Geen harde limiet op de onderliggende collectie. |
| Hervatten na een lange pauze | Een gebruiker kan voortgang onthouden maar toch namen, details of het verhaalverloop kwijt zijn; hulp moet niet aanvoelen als extra administratie. | Laag-middel | Gebruik hooguit bestaande eigen notities, pagina en hoofdstuk als terugkeercontext. Geen automatisch gegenereerde recap of extra meetlaag. |
| Eigen notities en quotes terugvinden | Gebruikers willen notities per boek én alle eigen reviews/notities op één plek zien; export naar Markdown wordt expliciet gevraagd. | Middel | Behandel Journal als doorzoekbaar archief, niet alleen als chronologische feed. |
| Flexibele leeslevenscyclus | DNF, pauzeren, herlezen, verschillende edities en formaat/duur worden genoemd als ontbrekende of belangrijke metadata. Recente feedback laat zien dat één veranderbare voortgang oude reread-journal en statistieken kan beschadigen. | Middel-hoog | Onderzoek eerst aparte leesperioden die oude historie beschermen; voeg geen nieuwe permanente status toe zonder expliciete scopekeuze. |
| Data-portabiliteit en herstel | Verloren of moeilijk te exporteren leesgeschiedenis veroorzaakt sterke frustratie. | Middel-hoog | Een lokale export/backup hoort vroeg op de roadmap, juist omdat de app lokaal wil blijven. |
| Geen verplichte sociale laag | Sommige lezers willen puur tracken en ervaren sociale functies als ruis; anderen waarderen community of buddy reads. | Middel | Houd sociale functies optioneel en buiten de kernnavigatie. Geen openbare feed toevoegen om lege ruimte te vullen. |
| Statistieken zijn aantrekkelijk, maar niet universeel | Sommige lezers waarderen grafieken en timers; anderen willen minder meetdruk of kunnen er angstig van worden. | Laag-middel | Voeg alleen een metric toe als die een concrete reflectievraag beantwoordt en door de gebruiker verborgen kan worden. |
| Sync tussen apparaten | Er is vraag naar gedeelde voortgang tussen meerdere e-readers en telefoons. | Middel | Relevant voor een latere syncfase, maar in conflict met de huidige local-only v1. Geen account of cloud suggereren zonder scopebesluit. |
| Terugkeer vanaf het homescreen | Een recente trackerdiscussie noemt een homescreen-widget als bonus, maar het bewijs is dun en komt deels uit iOS-/e-readercontext. | Laag | Parkeer R-12 als optionele lokale snelkoppeling naar `Verder lezen`; de kernroute in de app blijft eerst leidend. |
| Boekenideeën ontstaan buiten de tracker | Een lezer beschrijft Reddit, Instagram en de boekhandel als ontdekkingsmomenten; een losse notitie wordt later vergeten. | Laag binnen één technische Reddit-thread | Versterk R-05 met een optionele Android-share-target naar een bewerkbare, voorlopige capture; automatische metadata-koppeling blijft controleerbaar en niet stil. |
| Context hoort navigeerbaar te zijn, niet alleen zichtbaar | Recente trackerfeedback vraagt naast auteur-/serietekst om doorklikken naar de volledige auteurscatalogus en de rest van een serie. | Laag-middel binnen één thread | Verfijn R-11 naar lokale serie-/auteurcontext met expliciete links; voeg geen automatische serie-uitbreiding of release-notificaties toe. |
| Rustige, gelabelde UI is een toegankelijkheidsfunctie | Een blinde lezer beschrijft dat esthetisch dichte trackers vaak onbruikbaar zijn met een screenreader. | Laag-middel binnen één Reddit-thread; sterke sample bias | Maak TalkBack-labels, focusvolgorde, tekstschaal en afzonderlijke actiedoelen releasecriteria; voeg geen visuele drukte toe om meer functies te tonen. |

## 2.1 Tweede en derde pass — app stores, portability en Nederlandstalige signalen

Deze sectie combineert recente Google Play-reviews, changelogs en e-readerbronnen met Nederlandstalige Reddit-discussies. App-store reviews en Reddit zijn zelfselectie: ze zijn goed voor concrete breekpunten, maar niet voor featureprioriteiten zonder herhaling. De confidence hieronder blijft daarom gebonden aan de bronnen in deze set.

| Signaal | Nieuwe aanwijzing | Confidence | Gevolg voor de app |
|---|---|---:|---|
| Dataverlies bij migratie of account-/abonnementwissel | Reviews van Bookly in augustus 2026 beschrijven verdwenen audioboekdata, logs en datums na toestelwissel of afloop van Pro; Bookmory noemt in de changelog fixes voor import-merging en verloren records. | Hoog binnen deze app-store-set | Maak export, herstel en importcontrole een zichtbaar onderdeel van betrouwbaarheid. Een verlopen abonnement mag eigen data niet verwijderen. Versterk R-02. |
| Concepten en directe voortgangsinvoer | Een StoryGraph-review vraagt om automatisch bewaren van een reviewconcept na per ongeluk teruggaan. Een Bookly-review vraagt om direct de huidige pagina in te voeren in plaats van alleen pagina’s van die dag te tellen. | Middel-hoog | R-03 moet naast snelle capture ook conceptbehoud en absolute paginainvoer bewaken. Een timer is optioneel; de vaste voortgangswaarde blijft leidend. |
| Nederlandse taal en juiste editie | In recente r/boeken-discussies wordt gezocht naar filteren op Nederlandstalige boeken en wordt catalogusdekking voor Nederlandse boeken als onzeker genoemd. Bookshelf-reviews noemen ontbrekende ISBN-volumes, gedeeltelijke imports en trage of verkeerde editiegegevens. | Middel-hoog | Breid R-07 uit met taal-/formaatinformatie vóór toevoegen, editiecorrectie en een nette handmatige fallback. Nooit stil de verkeerde editie aannemen. |
| Een grote TBR vraagt om keuzehulp zonder algoritme | Een lezer met honderden boeken werkt met een kleine shortlist; anderen wisselen bewust van boek, houden een pauzeerboek aan of herlezen iets vertrouwds. Pushberichten worden juist uitgezet om prikkels te verminderen. | Middel | R-05 wordt een kleine, handmatige shortlist met één primaire volgende keuze. Geen push, streak of willekeurige aanbeveling als standaard. |
| Betrouwbaarheid vóór extra breedte | Reviews noemen crashes rond advertenties, lege of trage schermen, opdringerige reviewprompts, paywalls en falende imports. Dit zijn geen losse polishproblemen: ze onderbreken het archief zelf. | Middel | Voeg aan elke toekomstige feature een laad-, leegte-, fout- en hersteltoestand toe. Geen stille mislukte import of verloren invoer. |
| Vrije metadata is een power-userbehoefte | Een spreadsheetgebruiker houdt onder meer bron, land, genre, publicatiejaar en pagina’s bij; andere reviews vragen om formaat, prijs, conditie of auteur-/seriefilters. | Laag-middel | Parkeer vrije custom fields. Houd de kern klein en voeg alleen een veld toe wanneer een concrete terugvind- of beheeractie het nodig maakt. |
| Verspreide leesworkflow | In een recente r/books-FAQ combineren lezers een fysiek journal, TBR-lijst, notitie-app, tracker en spreadsheet; anderen kiezen juist voor alleen een eenvoudige jaarlijkse lijst omdat meer invoer te veel moeite kost. | Middel-hoog | Houd bibliotheek, voortgang en eigen journal in één rustige kernlus. Voeg geen volledige planner toe; maak de bestaande capture sneller en de export bruikbaar buiten de app. |
| Portabiliteit is ook interoperabiliteit | E-readergebruikers vragen om highlights en notities naar een ander apparaat of Obsidian te krijgen, en noemen het ontbreken van een standaard annotatieformaat. | Middel | Behandel leesbare Markdown naast JSON als een bewuste uitweg uit lock-in. Behoud in export de bron, locatie en relaties tussen eigen notities; bouw nog geen live sync. |
| Een quote kan context van een eigen reflectie nodig hebben | Een recente gebruiker waardeert aparte quote- en notitiegedeelten, maar mist een manier om een notitie aan een specifieke quote te koppelen. | Laag | Onderzoek R-10 als optionele relatie. De quote blijft zelfstandig; een koppeling mag capture niet verplicht langer maken. |

De belangrijkste verschuiving is niet “meer functies”, maar een betrouwbaardere lus: boek kiezen → voortgang of gedachte vastleggen → later terugvinden → gegevens zelf kunnen meenemen.

## 2.2 Vierde pass — herlezen, DNF en interactiedetails

Deze pass combineert recente StoryGraph- en r/books-discussies met actuele Compose-richtlijnen. De e-reader- en trackerbronnen zijn nog steeds vocal-minority samples; de hoge stemmen op sommige threads verhogen de relevantie, maar maken ze niet representatief.

| Signaal | Nieuwe aanwijzing | Confidence | Gevolg voor de app |
|---|---|---:|---|
| Herlezen moet oude historie beschermen | In een StoryGraph-thread met veel waardering beschrijft een lezer dat Goodreads een oude voortgang opnieuw activeerde en eerdere journaling dreigde te beschadigen. Een aparte reread-knop en wisselen van editie hielden oude gegevens intact. | Middel-hoog | Maak R-06 primair een model van aparte leesperioden: eigen start/eind, voortgang, editie en formaat. Een nieuwe periode mag de vorige niet muteren. |
| DNF is ook een uitkomst van een herleesperiode | Een reactie wil een herleesboek op 60% kunnen stoppen en toch de gelezen pagina’s behouden; andere lezers noemen triggers, bibliotheekinleverdatum, verkeerde headspace of een zwaardere editie als redenen om te stoppen. | Middel | Bewaar DNF als uitkomst van de huidige leesperiode, met behoud van pagina’s en een optionele privéreden. Geen verplichte redenencategorieën of sociale weergave. |
| Eenvoudige trackers winnen door lage invoerlast | Een recente trackerdiscussie beschrijft een eenvoudige flow met toevoegen, start, einde, DNF en pauze; andere lezers combineren al meerdere tools en haken af wanneer registratie te uitgebreid wordt. | Middel | Behoud de drie hoofdstatussen als samenvatting en maak perioden optioneel verdiepend. Voeg geen challenges, streaks of uitgebreide statistiek toe om dit model te rechtvaardigen. |
| Formaat hoort bij de leesperiode | Een recente lezer wil fysieke, audio- en digitale edities kunnen onderscheiden en hun stats niet door elkaar laten lopen; een andere bespreking noemt fysieke/e-book/audio-labels als flexibele metadata. | Middel | R-07 moet editie en formaat per leesperiode kunnen bewaren. Een correctie van de huidige editie mag geen historische periode herschrijven. |
| Kleine controls hebben grote, expliciete interactieruimte nodig | Android adviseert minimaal 48dp voor elk interactief element en waarschuwt dat Compose kleine clickables automatisch kan uitbreiden, waardoor naburige targets kunnen overlappen. | Hoog voor platformrichtlijn | Houd zichtbare iconen compact, maar reserveer per actie een expliciet 48dp-raster en test aangrenzende acties afzonderlijk. |

## 2.3 Vijfde pass — reread-integriteit, series en bevestigingen

Deze pass toetst R-06 met een recente foutcase en een aparte discussie over DNF-rating. Daarnaast is gekeken naar serievolgorde als terugvindprobleem en naar de officiële Android-richtlijn voor bevestiging van gebruikersacties. De bronnen blijven zelfselectief; waar lezers het oneens zijn, wordt dat als productkeuze zichtbaar gehouden.

| Signaal | Nieuwe aanwijzing | Confidence | Gevolg voor de app |
|---|---|---:|---|
| Reread-data moet append-only aanvoelen | In juni 2026 beschrijft een gebruiker dat een DNF tijdens een reread de oorspronkelijke review liet verdwijnen. Verwijderen behield de review maar verloor de gelezen pagina’s; een andere editie gebruiken werd een workaround. | Middel-hoog | R-06 moet historische perioden beschermen tegen zowel statuswijziging als verwijdering. Een periode verwijderen vereist een expliciete waarschuwing over pagina’s, notities en review; liever herstelbaar archiveren dan vernietigen. |
| Een DNF is niet automatisch nul sterren | In een recente discussie vinden lezers een DNF op zichzelf voldoende oordeel, terwijl anderen een optionele rating willen omdat redenen uiteenlopen. | Middel, verdeeld signaal | Laat een DNF standaard ongerateerd en laat een gebruiker alleen bewust een persoonlijke rating instellen. Toon DNF niet als 0/5 en laat een reden optioneel en privé. |
| Serievolgorde is een andere taak dan TBR-volgorde | Een serie-lezer mist nieuwe delen en vraagt hoe dit nu met papier, notities of een tool wordt bijgehouden; andere lezers gebruiken tracking vooral om te weten welk deel volgt. | Middel | Voeg R-11 toe: toon serie en volgnummer wanneer betrouwbaar, met een handmatige correctie. Houd `Volgende` uit R-05 een persoonlijke leeskeuze; serievolgorde is bibliografische context. |
| Destructieve feedback moet betekenisvol zijn | Android documenteert `AlertDialog` voor het bevestigen van acties zoals verwijderen, met expliciete bevestig- en annuleeracties. | Hoog voor platformrichtlijn | Gebruik voor verwijderen, restore-vervangen en het sluiten van een periode een benoemde consequentie en bevestiging. Een Back- of buiten-tik mag geen data stil weggooien. |

## 2.4 Zesde pass — herstelbare feedback en bewuste snoei

Deze pass zoekt naar onafhankelijke bevestiging van de bestaande hypotheses en naar kleine interactieregels die de lokale archieflus betrouwbaarder maken. Herhaling zonder nieuw bewijs is geen reden om de scope uit te breiden.

| Signaal | Nieuwe aanwijzing | Confidence | Gevolg voor de app |
|---|---|---:|---|
| Lokale acties hebben korte, niet-blokkerende feedback nodig | Android beschrijft een Snackbar voor bevestiging van een opgeslagen wijziging, offline-status en een verwijderactie met `Undo`. | Hoog voor platformrichtlijn | Geef na een geslaagde lokale write korte feedback. Bied `Ongedaan maken` alleen aan wanneer de verwijdering echt herstelbaar is; laat dit geen vervanging worden voor een bevestigingsdialoog of restore-preview. |
| R-10 kreeg geen tweede onafhankelijke bevestiging | De nieuwe sweep leverde geen extra concrete vraag op om een quote direct aan een eigen reflectie te koppelen. De bestaande bron blijft bruikbaar als hypothese, maar niet als prioriteitsbewijs. | Laag | Parkeer R-10 onder P2. Heropen het pas bij een tweede onafhankelijke bron of een eerstehands signaal. |
| R-06 en R-11 zijn nuttige context, geen nieuwe statuslaag | Reread-/DNF-herstel en serievolgorde blijven terugkomen, maar de bronnen vragen om behoud van context en terugvinden, niet om automatische series, release-alerts of gamification. | Middel | Houd leesperioden en seriegegevens als smalle P1-onderzoeksvragen. Breid de vaste drie statussen of de navigatie niet stil uit. |

## 2.5 Zevende pass — vangen zonder uitwerken

Deze pass kijkt naar het moment vóór een boek aan de catalogus is gekoppeld en naar het verschil tussen een ruwe leesnotitie en latere verwerking. De bronnen komen uit verschillende communities, maar blijven zelfselectief; de gevolgen blijven daarom kleine QOL-varianten binnen bestaande ideeën.

| Signaal | Nieuwe aanwijzing | Confidence | Gevolg voor de app |
|---|---|---:|---|
| Boekideeën ontstaan buiten de leesapp en buiten het leesapparaat | In een r/kobo-vraag wil een lezer suggesties van werk, Reddit of vrienden snel kunnen bewaren en later met kleine gedachten verder verwerken. | Middel binnen één recente thread | Voeg aan R-05 een optionele `Snel parkeren`-variant toe: titel/auteur en een optionele bron zijn genoeg. Markeer het item als onvolledig totdat het aan een catalogusrecord is gekoppeld; maak er geen tweede wishlist- of statusmodel van. |
| Vastleggen en verwerken zijn verschillende momenten | In een recente r/ObsidianMD-discussie scheiden lezers ruwe quotes met paginanummers van latere eigen woorden, verbanden en synthese. Dezelfde thread waarschuwt impliciet tegen de druk om een heel boek vast te leggen. | Middel binnen één discussie, met meerdere onafhankelijke reacties | Versterk R-03: opslaan moet met minimale velden kunnen; titel, locatie en verdere interpretatie mogen later. Bewaar een quote en de eigen reflectie als onderscheiden inhoud, ook als ze later naar elkaar verwijzen. |
| Alle annotaties moeten na het teruggeven van een boek bereikbaar blijven | In een recente r/kobo-featurethread wordt gevraagd om highlights na terugbrengen van een boek en om alle annotaties te zien zonder ieder boek afzonderlijk te openen. | Middel binnen één recente thread | Versterk R-04 met een bron- en locatieverwijzing in elke Journalrij en een algemene annotatieweergave. Een kleurfilter of e-readerintegratie blijft buiten v1. |

## 2.6 Achtste pass — collectie-invoer en cameragrens

Deze pass kijkt naar een aangrenzende maar niet vanzelfsprekende use-case: een fysieke collectie snel catalogiseren. Snelheid is hier niet genoeg reden voor een nieuwe permission; de grens tussen leesarchief en bezit-/leenadministratie blijft expliciet.

| Signaal | Nieuwe aanwijzing | Confidence | Gevolg voor de app |
|---|---|---:|---|
| Een grote fysieke collectie kan batch-invoer aantrekkelijk maken | In r/HomeLibraries noemt een lezer batch-scannen van barcodes als snelle manier om veel boeken te loggen; dezelfde thread noemt ook handmatige invoer voor titels die niet in de catalogus staan. | Middel binnen één recente thread | Houd barcode-/camerascanning als P2-idee bij R-09. Als het ooit wordt heroverwogen, moet elk resultaat eerst zichtbaar worden gecontroleerd en blijft handmatig zoeken de volledige fallback. |
| Cameratoegang hoort bij één expliciete actie, niet bij opstarten | Android adviseert gevoelige permissions pas in context te vragen, uit te leggen waarom, een weigering netjes te verdragen en de rest van de app bruikbaar te laten. | Hoog voor platformrichtlijn | Vraag nooit camera-toegang voor gewone cataloguszoeking of op het eerste scherm. Een toekomstige scanner krijgt een expliciete actie, korte uitleg en een route zonder camera. [Android runtime permissions](https://developer.android.com/training/permissions/requesting). |

## 2.7 Negende pass — meerdere lopende boeken en terugkeercontext

Deze pass onderzoekt of `Verder lezen` als één item te smal is. Recente lezersdiscussies tonen veel parallel lezen, maar ook duidelijke persoonlijke grenzen: sommige lezers houden het bij één boek, anderen wisselen tussen twee of drie formats, en een kleinere groep houdt er veel meer tegelijk aan. Dat is bewijs voor ondersteuning van meerdere `Bezig`-boeken, niet voor een dashboard of een verplichte limiet.

| Signaal | Nieuwe aanwijzing | Confidence | Gevolg voor de app |
|---|---|---:|---|
| Parallel lezen volgt vaak de context | In recente discussies noemen lezers combinaties van fysiek, e-book en audio, of boeken voor werk, thuis, onderweg, verschillende stemmingen en genres. | Middel binnen drie recente Reddit-discussies | Verbreed R-03 van één zichtbaar boek naar één primaire terugkeeractie met een kleine set alternatieven. De bestaande status `Bezig` blijft voldoende; voeg geen nieuwe status toe. |
| Een kleine rotatie helpt, maar te veel actieve keuzes kunnen boeken laten verdwijnen | Sommige lezers noemen twee of drie als praktische bovengrens; andere reacties beschrijven vijf of meer actieve boeken, terwijl dezelfde discussies ook verlies van overzicht of opnieuw beginnen noemen. | Middel, met tegengestelde voorkeuren | Beperk alleen wat snel op het startpunt wordt getoond: maximaal drie terugkeerkaarten. Laat alle andere `Bezig`-boeken via Bibliotheek en statusfilter bereikbaar. Dit is een presentatielimiet, geen datamodelregel. |
| Terugkeercontext hoeft geen automatische samenvatting te zijn | De bronnen ondersteunen vooral snel het juiste boek en formaat terugvinden; ze vragen hier niet om AI-samenvattingen, streaks of sessiemetingen. | Middel-laag voor de precieze UI | Toon bestaande, betrouwbare context zoals huidige pagina/totaal en optioneel hoofdstuk. Een laatste-notitiepreview blijft een later experiment, geen onderdeel van de kleinste versie. |

## 2.8 Tiende pass — hervatten zonder extra taak en herstel van metadata

Deze pass verbindt drie terugkerende breekpunten: terugkomen na een leespauze, de wens voor een minimale voortgangsweergave en het herstellen van een verkeerde status-, datum- of importactie. De steekproef bevat recente r/ereader- en r/boeken-discussies plus een actuele concurrent-changelog; het is richtinggevend, geen representatieve marktmeting.

| Signaal | Nieuwe aanwijzing | Confidence | Gevolg voor de app |
|---|---|---:|---|
| Lang niet lezen maakt hervatten inhoudelijk moeilijk | Een recente r/ereader-vraag beschrijft dat een gebruiker na een drukke periode kleine details, personages en het verhaalverloop vergeet en toch voortgang/boekdetails wil bijhouden zonder dat dit als een extra taak voelt. | Laag-middel binnen één recente vraag | Voeg geen recap-object toe. Het tonen van een door de gebruiker gemaakte `Notitie`/`Samenvatting`, laatste pagina en optioneel hoofdstuk is de kleinste veilige variant; toon niets dat automatisch plotinformatie verzint. |
| Sommige lezers willen alleen een actuele lijst met voortgang | In een recente r/ereader-discussie gebruikt iemand een eenvoudige tracker voor meerdere boeken en media en zegt alleen de lopende boeken met hun huidige voortgang nodig te hebben; handmatige pagina-aanpassing wordt gewaardeerd. | Laag-middel binnen één reactie | Bevestig R-03 als rustige terugkeerweergave. Houd v1 pagina-gebaseerd; percentage of tijd voor audio is een aparte toekomstige datamodelkeuze, geen extra control nu. |
| Verkeerde acties en imports moeten corrigeerbaar zijn | In een Nederlandstalige trackerdiscussie wordt gemeld dat een startactie niet eenvoudig terug te draaien was, een verwijderd boek niet terugkwam in de verlanglijst en geïmporteerde leesdata verkeerde datums kreeg. Bookmory noemt in de actuele release notes juist merge-in-plaats-van-overschrijven, correctie van jaartallen en herstel van gesplitste records. | Middel-laag; gemengde bronsoorten | Versterk R-02, R-06 en R-09: status- en datumcorrecties moeten bestaande data behouden; verwijderen is geen standaard undo. Restore toont conflicten en datums vóór commit, en imports mogen nooit stil overschrijven. |
| Nederlandstalige lezers combineren tools om collectie en leesgeschiedenis te bewaren | In een recente r/boeken-discussie worden Goodreads, StoryGraph, Bookshelf en eigen lijsten voor verschillende doelen gecombineerd; niet-Engelstalige migratie en catalogusdekking blijven onzeker, terwijl handmatig toevoegen als bruikbare fallback wordt genoemd. | Middel binnen één recente communitythread | Houd R-07’s handmatige add/edit en R-02’s export belangrijk. Voeg geen sociale laag toe om die versnippering op te lossen; maak de eigen lokale data de betrouwbare bron. |

## 2.9 Elfde pass — app-store-breekpunten en lokale navigatie

Deze pass legt recente Google Play-reviews van Bookly en Bookshelf naast de al gelezen Bookmory-vermelding. De reviews leveren concrete foutmodi op, maar komen grotendeels uit één app-pagina; ze verhogen dus vooral de aandacht voor betrouwbaarheid en niet automatisch de prioriteit van een nieuwe feature.

| Signaal | Nieuwe aanwijzing | Confidence | Gevolg voor de app |
|---|---|---:|---|
| Eigen data moet toestel- en abonnementswissels overleven | Drie recente Bookly-reviews beschrijven data die niet meeging van iOS naar Android, audioboekdata die bij een toestelwissel verloren ging en logs/datums die na afloop van Pro niet meer te downloaden waren. | Middel-hoog binnen één recente Google Play-set | Maak export en restore zichtbaar vóór een toestelwissel. Toon in een toekomstige importpreview ook niet-ondersteunde velden als overgeslagen; voeg hiervoor geen audiofunctie, account of cloudsync toe. |
| Absolute pagina-invoer is belangrijker dan een sessieteller | Een Bookly-review vraagt om de huidige pagina direct te kunnen invoeren in plaats van alleen te tellen hoeveel pagina’s die dag zijn gelezen. | Middel binnen dezelfde set | Houd de huidige pagina de canonieke voortgangswaarde in R-03. Een sessieverschil, timer of audiotijd is geen noodzakelijke extra control. |
| Een grote collectie vraagt soms om een alfabetische sprong | Een recente Bookshelf-review vraagt om sneller naar een letter in een grote bibliotheek te springen. Dat is een schaalprobleem naast de algemene behoefte aan lokale zoeking, niet bewijs voor een nieuw sorteer- of tagsysteem. | Laag binnen één review | Parkeer bij R-01 een letterindex of alfabetische secties als QOL-variant. Beslis pas na echte schaalpijn; vrije lokale zoeking blijft de basis. |
| Opdringerige prompts en advertenties onderbreken de archieftaak | Bookshelf-reviews noemen een terugkerende reviewprompt en advertenties tijdens zoeken als frictie, ook wanneer de kern van de app verder bruikbaar is. | Middel-laag binnen één app-store-set | Houd de local-only app vrij van advertenties, reviewdruk en commerciële onderbrekingen. Behandel prikkelarme defaults als betrouwbaarheidseis, niet als nieuwe backlogfeature. |

## 2.10 Twaalfde pass — terugkeer buiten de app en eigenaarschap

Deze pass gebruikt een nieuwe r/ReadingSuggestions-discussie over lees-trackers, aanvullende Android/e-readercontexten en de officiële Android-richtlijn voor widgets. De trackerthread bevat meerdere losse voorkeuren en één duidelijke widgetvraag; de andere posts gaan over reader-widgets. Samen ondersteunen ze snelle terugkeer als patroon, maar niet automatisch een tracker-widget als kernscope.

| Signaal | Nieuwe aanwijzing | Confidence | Gevolg voor de app |
|---|---|---:|---|
| Een homescreen-widget kan terugkeerfrictie verlagen | Een lezer noemt een widget voor het homescreen expliciet als bonus bij de keuze van een lees-tracker. Een Android/e-readerpost vraagt om tekst op het homescreen om bij het boek te blijven; een andere gebruiker blijft aan een reader-app vasthouden vanwege diens bookshelf-widget. Andere deelnemers gebruiken juist een notitie-app, spreadsheet of meerdere trackers; de widget is dus een convenience, geen universele kernbehoefte. | Laag-middel voor homescreen-terugkeer; laag voor een specifieke tracker-widget | Parkeer R-12. Als het ooit wordt getest, toon lokaal alleen het primaire `Verder lezen`-boek met titel en pagina/totaal en open met één tik het volledige boekdetail. Geen timer, statistieken of directe bulkbewerking in de widget. |
| Portabiliteit blijft een eigenaarschapsprobleem | In dezelfde thread meldt een gebruiker dat eerdere leesinformatie na het wegvallen van een bibliotheekdienst verdween en dat Bookmory-data aan het toestel gekoppeld voelt zonder betaald plan. Dit is één anekdotische reactie, maar wel een onafhankelijke herhaling van het verliesrisico uit Bookly. | Laag-middel binnen één thread | Versterk R-02 als lokale eigenaarschapsgarantie. Export/restore blijft belangrijker dan integraties met iedere leesdienst. |
| Een widget is een glanceable surface, geen tweede app | Android beschrijft widgets als compacte informatie- en navigatielagen: ze moeten aanpasbaar zijn aan verschillende groottes en naar meer detail in de app leiden. Regelmatige updates mogen de batterij niet onnodig belasten. | Hoog voor platformrichtlijn | Als R-12 ooit wordt heropend: gebruik een responsieve, kleine informatielaag die naar boekdetail deep-linkt, bij lokale wijzigingen bijwerkt en geen volledige captureflow probeert te bevatten. |

## 2.11 Dertiende pass — catalogusuitval en minimale leesgeschiedenis

Deze pass legt recente Google Play-vermeldingen van kleinere Android-trackers naast de bestaande R-03-, R-06- en R-07-keuzes. Reviews zijn directe gebruikerssignalen; appbeschrijvingen en changelogs tonen vooral welke problemen concurrenten proberen af te dekken. Die bronsoorten worden niet samengevoegd tot één confidence-score.

| Signaal | Nieuwe aanwijzing | Confidence | Gevolg voor de app |
|---|---|---:|---|
| Een ontbrekend boek moet handmatig kunnen worden toegevoegd | Twee recente ReadList-reviews noemen ontbrekende titels en het ontbreken van een eigen invoerpad; één review noemt expliciet dat alleen Open Library wordt doorzocht en noemt dat onbruikbaar wanneer het boek daar niet staat. | Laag-middel binnen één app; patroon sluit aan bij eerdere editie-/taalsignalen | Maak in R-07 de tak `geen resultaat` even volledig als een gevonden resultaat: handmatig toevoegen, bronzoekopdracht behouden en later metadata corrigeren. Voeg geen scanner toe als oplossing voor catalogusuitval. |
| Pagina plus een korte eigen terugkeerhint kan genoeg zijn | Een recente Android-tracker positioneert exact paginanummer, meerdere gelijktijdige boeken en een korte notitie over wat er laatst gebeurde als minimale manier om een boek weer op te pakken. Dit is concurrentpositionering, geen reviewbewijs. | Laag-middel voor de behoefte; hoog voor het waargenomen productpatroon | Versterk R-03: absolute pagina blijft leidend en een korte eigen terugkeerhint mag optioneel naast die pagina bestaan. Voeg geen timer of automatisch verhaaloverzicht toe. |
| Notities worden onderdeel van lokale terugvindbaarheid | PagePath noemt in zijn actuele release notes expliciet zoeken in notities vanuit de bibliotheek. Dat laat zien dat notitietekst als retrievalveld kan functioneren, maar bewijst niet dat een tweede zoekingang nodig is. | Laag-middel binnen één changelog | Houd R-04’s algemene Journal-zoeking als canonieke route en neem boeknaam/type mee in de resultaten. Onderzoek een aparte Bibliotheek-zoekingang pas als één centrale Journal-route aantoonbaar tekortschiet. |
| DNF met een reden is een gewenste uitleg, niet automatisch een vierde status | Een Bookfolks-review vraagt om een DNF-lijst met ruimte voor waarom het boek niet werkte; de ontwikkelaar zet dit op de backlog. | Laag-middel binnen één review | Bevestig R-06: bewaar een optionele privéreden bij de huidige leesperiode en toon DNF als uitkomst/historie. Voeg geen vierde hoofdstatus of losse DNF-inbox toe zonder scopebesluit. |

## 2.12 Vijftiende pass — capture buiten de app, navigeerbare context en toegankelijkheid

Deze pass combineert recente Reddit-signalen uit tracker-, e-reader- en self-hosted communities met actuele Android-richtlijnen voor share targets, zoeken en list-detail-layouts. Reddit blijft zelfselectie en bevat hier ook ontwikkelaars en power users; de Android-bronnen onderbouwen interactie- en toegankelijkheidskeuzes, niet de marktvraag.

| Signaal | Nieuwe aanwijzing | Confidence | Gevolg voor de app |
|---|---|---:|---|
| Een ontdekking buiten de app moet als ruwe capture kunnen blijven bestaan | In een self-hosted-thread ontstaat een boekidee via Reddit, Instagram of een boekhandel; de huidige notitie-app-capture wordt later vergeten. De gewenste oplossing is snel invoeren met metadata die nu of later kan worden gekoppeld. | Laag; één technische gebruiker, met bias naar self-hosted/power-userworkflows | R-05 krijgt een kleine share-targetvariant: bewaar eerst titel/URL/ruwe tekst en markeer `Nog niet gekoppeld`; laat de gebruiker later kiezen of corrigeren. |
| Gedeelde tekst moet vóór opslag bevestigbaar en bewerkbaar zijn | Android beschrijft ontvangen `text/plain` en URL’s via de Sharesheet en zegt expliciet dat een share target gedeelde tekst eerst moet laten bevestigen en bewerken. | Hoog voor platformgedrag, niet voor featurevraag | Een toekomstige share-flow opent een gewone capture-editor met ingevulde tekst; er is geen stille automatische toevoeging of onbetrouwbare metadata-match. |
| Automatische voortgang voorkomt vergeten handmatige invoer | In een recente trackerthread noemt één lezer automatische tracking de enige onmisbare functie omdat handmatige invoer anders wordt vergeten. | Laag-middel; één commentaar, bovendien afhankelijk van Kobo/StoryGraph-integratie | Houd directe lokale paginainvoer en `Verder lezen` als kern. Parkeer readerintegraties, automatische tracking en live sync onder de bestaande local-only-scopewaarschuwing. |
| Serie- en auteursmetadata moet een route zijn | Een recente minimalistische trackerthread noemt onderscheid tussen auteur/titel én doorklikken naar een auteurscatalogus en de rest van een serie als ontbrekende flow. | Laag-middel; één gebruikerscommentaar in een productfeedbackthread | R-11 mag naast labelweergave een lokale contextlijst openen; alleen bekende records tonen, zonder automatisch boeken toe te voegen. |
| Accessibility kan de keuze voor een tracker bepalen | Een blinde lezer schrijft dat eenvoudige, ongeclusterde apps beter werken met een screenreader en dat visueel aantrekkelijke apps vaak ongelabelde functies hebben. | Laag-middel; één direct gebruikerssignaal, Reddit-sample bias | Behandel semantische labels, traversal order, tekstschaal en 48dp-doelen als functionele acceptatiecriteria, niet als laatste visuele polish. |
| Een Journal hoeft niet zwaar te worden om waardevol te zijn | In een recente Kindle-discussie wordt een lichte terugblik voorgesteld: één quote, een directe reactie en later eventueel één zin; dezelfde thread bevat ook lezers die alleen noteren wanneer een boek echt blijft hangen. | Laag-middel binnen één thread | Houd R-03 capture-first en R-04 doorzoekbaar, maar voeg geen verplicht sjabloon, weekritueel of statistieklaag toe. |

## 2.13 Zestiende pass — directe voortgang, hervatcontext en rustige Android-UX

Deze pass combineert twee nieuwe Reddit-signalen over een sobere persoonlijke bibliotheek en hervatten met directe Android-testfeedback over pagina-invoer en de IME. De Compose-bronnen zijn actuele platformrichtlijnen: ze onderbouwen de interactie- en toegankelijkheidseis, niet de marktvraag. Reddit blijft zelfselectie; de testercommunity bevat relatief veel ontwikkelaars en mensen die nieuwe apps actief testen.

| Signaal | Nieuwe aanwijzing | Confidence | Gevolg voor de app |
|---|---|---:|---|
| Pagina-voortgang moet een sprong zijn, geen tap-ladder | Een Android-tester beschrijft dat een paginategel steeds de volgende ongelezen pagina invult; bij pagina 120 zijn dat 120 taps. De gewenste oplossing is een sprong naar een absolute pagina of `Vul tot pagina`. | Laag-middel binnen één testerthread; sterke bias naar vroege Android-appfeedback | Versterk R-03: gebruik een absoluut paginaveld als primaire control en maak een eventuele paginategel alleen aanvullende context. Leg ook één afrondingsregel vast zodat Bibliotheek en boekdetail niet verschillende percentages tonen. |
| De IME mag totaalpagina en opslaan niet verbergen | In dezelfde test bedekt het toetsenbord `Total Pages` en `Save`; een lege opslagpoging geeft geen melding. Androids actuele insets- en semanticsdocumentatie beschrijft juist ruimte voor de softwarekeyboard en expliciete foutbetekenis. | Hoog voor de platformregel; laag-middel voor productvraag door één testerthread | Maak R-03 concreet: de invoer scrollt of past zich aan de IME aan, de primaire opslagactie blijft bereikbaar en lege verplichte velden geven zichtbare én voor assistive technology herkenbare foutfeedback. Een stille no-op is geen geldige uitkomst. |
| Een rustige bibliotheek kan de volledige job zijn | Een r/ebooks-vraag zoekt een eenvoudige lijst tussen Kindle en Kobo en wijst challenges, statistieken en extra trackerbreedte af; de gebruiker wil eigen boeken, TBR en gelezen boeken bijhouden. | Middel-laag binnen één directe gebruikersvraag; Reddit-sample bias | Bevestig de bestaande private/local-first houding: de kern moet nuttig blijven zonder dashboard, communitylaag of meetdruk. Voeg geen statistiek- of challengefeature toe als compensatie voor een lege startpagina. |
| Boekgebonden eigen notities kunnen een pauze overbruggen | Een andere directe vraag noemt willekeurige notities en screenshots en het vergeten van personages/details na een leesonderbreking. De kleinste vertaling is bestaande boekgebonden `Notitie`-capture, niet een aparte character-database of automatische spoilerrecap. | Laag-middel; één recente vraag met ontwikkelaarsreacties en Reddit-sample bias | Versterk R-03’s lichte hervatcontext: toon optioneel de laatste eigen notitie naast pagina/hoofdstuk. Houd de context door de lezer geschreven en laat capture-first zwaarder wegen dan een nieuw gestructureerd model. |
| Een custom rij moet één begrijpelijke focusroute hebben | Compose semantics laat custom componenten hun betekenis, rol, foutstatus en eventueel samengevoegde subtree expliciet maken. Compose focus targets maakt een klikbare component al focusbaar en waarschuwt tegen een tweede losse `focusable`-target. | Hoog voor platformrichtlijn, niet voor featurevraag | Maak boek- en Journalrijen semantisch voorspelbaar: één primaire openactie, afzonderlijke 48dp-doelen voor favoriet/overflow, geen dubbele TalkBack- of toetsenbordfocus. Gebruik dezelfde regel voor error states. |

## 3. Verbatim voice-of-reader

De citaten zijn kort gehouden; ze zijn signalen, geen requirements.

- “I’d love a nice straight forward and satisfying alternative.” — [r/books: Alternative to GoodReads](https://www.reddit.com/r/books/comments/1b4m6af/alternative_to_goodreads/) — `#pain` `#outcome`
- “I just want a better way to keep track of my books!” — [r/books: Best book trackers that are not Goodreads?](https://www.reddit.com/r/books/comments/1fpywe1/best_book_trackers_that_are_not_goodreads/) — `#outcome`
- “Individual book pages where I could add notes.” — [r/books: Best Apps for Books](https://www.reddit.com/r/books/comments/13jrguc/best_apps_for_books/) — `#outcome` `#language`
- “Is there somewhere I can see all my reviews or notes on books in one place?” — [r/TheStoryGraph: Site Tutorial?](https://www.reddit.com/r/TheStoryGraph/comments/y0pyjp/site_tutorial/) — `#pain`
- “export the highlights, annotations, notes as a markdown file” — [r/fossdroid: E-book reader with highlights/annotations export feature?](https://www.reddit.com/r/fossdroid/comments/1temdmp/ebook_reader_with_highlightsannotations_export/) — `#outcome`
- “I wish I could make different unique shelves.” — [r/TheStoryGraph: What features do you absolutely love or hate?](https://www.reddit.com/r/TheStoryGraph/comments/1vfyjyz/what-features-do-you-absolutely-love-or-hate/) — `#pain`
- “some of the reading information gives me a bit of anxiety” — [r/BookTrack: Some Wishes…](https://www.reddit.com/r/BookTrack/comments/1rct0bg/some-wishes/) — `#objection`

### 3.1 Nieuwe korte signalen — derde pass

Deze fragmenten zijn bewust kort; de datum is de datum van de bron of van de relevante commentaarreactie. Ze zijn illustratief en vormen op zichzelf geen requirements.

- “Can I download all my notes to a word document or something like that?” — [r/ereader: How does note taking work?](https://www.reddit.com/r/ereader/comments/1u4dhe5/how_does_note_taking_work/) — 2026-06-13; onzeker over eigenaarschap en export — `#outcome` `#pain`.
- “I’d like an e-reader where I could read books and then export the books along with my notes and highlights to the iPad.” — [r/kobo: Model for exporting books with notes](https://www.reddit.com/r/kobo/comments/1v5l9ro/model_for_exporting_books_with_notes/) — 2026-07-24; wil een concrete overdracht tussen leesapparaat en andere app — `#outcome` `#alternative`.
- “The only thing I wish for is a way to connect notes to specific quotes.” — [r/books: Book tracker/goal app??](https://www.reddit.com/r/books/comments/1018rvu/book_tracker_goal_app/) — 2025-12-15; positieve beoordeling van aparte quote-/notitievakken met één gemis — `#pain` `#outcome`.
- “Anything more intensive than this is too much of a bother for me, I would never follow through.” — [r/books: Weekly FAQ — Do you keep track of the books you read?](https://www.reddit.com/r/books/comments/1tfl7ep/weekly_faq_thread_may_17_2026_do_you_keep_track/) — 2026-05-17; lage tolerantie voor invoerfrictie bij een simpele persoonlijke lijst — `#pain` `#language`.

### 3.2 Nieuwe korte signalen — vierde pass

- “I love the re-read function on storygraph! I wish there was a better way to mark DNF-ing a re-read though!” — [r/TheStoryGraph: Superior Rereading Tracking](https://www.reddit.com/r/TheStoryGraph/comments/1r6h3ts/superior_rereading_tracking/) — 2026-02-16; positieve waardering voor aparte rereads met één specifieke randzaak — `#outcome` `#pain`.
- “I also love the ‘Up Next’ feature for my TBR list.” — [r/Romantasy: What app do you use to track your reading and discover new books?](https://www.reddit.com/r/Romantasy/comments/1w9rfpd/what_app_do_you_use_to_track_your_reading_and/) — 2026-09-07; bevestigt de waarde van een eenvoudige volgende-keuze, niet van een aanbevelingsfeed — `#outcome`.

### 3.3 Nieuwe korte signalen — vijfde pass

- “Deleting it would delete the pages read, though. :(” — [r/TheStoryGraph: Did a reread, DNF’ed the reread and now my original review is gone?](https://www.reddit.com/r/TheStoryGraph/comments/1u2vy6i/did_a_reread_dnfed_the_reread_and_now_my_original/) — 2026-06-11; de gebruiker ziet een directe trade-off tussen herstel van review en behoud van voortgang — `#pain` `#objection`.
- “I am constantly missing that a new book in a series I love has been released.” — [r/fantasybooks: How do you keep track of book series you are reading?](https://www.reddit.com/r/fantasybooks/comments/1o931hq/how_do_you_keep_track_of_book_series_you_are/) — 2025-10-17; serievolgorde en nieuwe delen worden buiten de tracker bijgehouden — `#pain` `#outcome`.

### 3.4 Nieuwe korte signalen — zesde pass

- “the DNF itself is a rating, just not in stars.” — [r/TheStoryGraph: Unrated DNFs](https://www.reddit.com/r/TheStoryGraph/comments/1s9fdfd/unrated_dnfs/) — 2026-04-01; een tegengeluid tegen verplichte sterrenrating laat zien dat `DNF` zelf betekenis draagt — `#objection` `#language`.

### 3.5 Nieuwe korte signalen — zevende pass

- “sometimes someone might suggest a book at work or from reddit or a friend” — [r/kobo: Best place for tracking books you read and want to read?](https://www.reddit.com/r/kobo/comments/1qc1sl7/best_place_for_tracking_books_you_read_and_want/) — 2026-01; een boekidee ontstaat vaak buiten het leesapparaat en vraagt om een snelle tijdelijke opslag — `#trigger` `#outcome`.
- “I want the right kind of balance between a place to organise my notes, and a place for just thinking in freely” — [r/ObsidianMD: How do you take notes for physical books?](https://www.reddit.com/r/ObsidianMD/comments/1tsq8d6/how_do_you_take_notes_for_physical_books_in/) — 2026-05-31; organiseren en vrij denken zijn verschillende gebruiksmomenten — `#pain` `#language`.

### 3.6 Nieuwe korte signalen — achtste pass

- “I use the free version of the Bookshelf app - you can batch scan the barcodes to log your books which is so quick.” — [r/HomeLibraries: What do you use to catalog your collection?](https://www.reddit.com/r/HomeLibraries/comments/1q6q8kb/what_do_you_use_to_catalog_your_collection_if_you/) — 2026-01-07; snelheid is vooral relevant bij het initialiseren van een grote fysieke collectie — `#outcome` `#alternative`.

### 3.7 Nieuwe korte signalen — negende pass

- “I usually have 1 or 2 physical books on the go at the same time as a kindle/libby app digital book.” — [r/Booktokreddit: Reading multiple books at once?](https://www.reddit.com/r/Booktokreddit/comments/1q3gm0z/reading_multiple_books_at_once/) — 2026-01-04; parallel lezen wordt gekoppeld aan verschillende formats — `#outcome` `#context`.
- “It’s the variety that keeps me on my Kobo instead of picking up my phone.” — [r/ReadingSuggestions: Multiple Books?](https://www.reddit.com/r/ReadingSuggestions/comments/1qxtd45/multiple_books/) — 2026-02-06; afwisseling kan een reden zijn om te blijven lezen, maar bewijst nog geen aparte feature — `#outcome` `#qol`.

### 3.8 Nieuwe korte signalen — tiende pass

- “without making it feel like another task” — [r/ereader: What are the best free book tracking apps for staying consistent with reading?](https://www.reddit.com/r/ereader/comments/1w9qdwx/what_are_the_best_free_book_tracking_apps_for/) — 2026-09-07; de gewenste hulp bij terugkeer moet de leeslast niet veranderen in administratie — `#pain` `#language`.
- “these are the books you're reading and this is your current progress” — [r/ereader: Are you using any type of ‘Reading Journal’?](https://www.reddit.com/r/ereader/comments/1w32df7/are_you_using_any_type_of_reading_journal/) — 2026-09; een minimale actuele lijst kan waardevoller zijn dan extra jaaroverzichten — `#outcome` `#qol`.
- “Verwijderd is precies voorgoed verwijderd.” — [r/boeken: verwijderde trackerfeedback](https://www.reddit.com/r/boeken/comments/1sk6k73/removed_by_moderator/) — 2026-04-13; één ervaring met onduidelijke statuscorrectie en herstelbaarheid — `#pain` `#objection`.

### 3.9 Nieuwe korte signalen — elfde pass

- “I wish I could just put what page I was on” — [Google Play: Bookly](https://play.google.com/store/apps/details?hl=en-US&id=com.twodoor.bookly) — 2026-08-16; directe absolute paginainvoer is eenvoudiger dan een dagelijkse sessie reconstrueren — `#pain` `#outcome`.
- “All of my audio book data was lost in the transfer” — [Google Play: Bookly](https://play.google.com/store/apps/details?hl=en-US&id=com.twodoor.bookly) — 2026-08-14; portability is ook behoud van eigen geschiedenis — `#pain` `#objection`.

### 3.10 Nieuwe korte signalen — twaalfde pass

- “Bonus points if the app comes with a widget for my home screen!” — [r/ReadingSuggestions: What app do you use to keep track of the books you've read?](https://www.reddit.com/r/ReadingSuggestions/comments/1w0z6yn/what_app_do_you_use_to_keep_track_of_the_books/) — 2026-09-07; een homescreen-widget wordt als convenience genoemd, niet als noodzakelijke kern — `#outcome` `#qol`.
- “all my information was wiped” — [r/ReadingSuggestions: What app do you use to keep track of the books you've read?](https://www.reddit.com/r/ReadingSuggestions/comments/1w0z6yn/what_app_do_you_use_to_keep_track_of_the_books/) — 2026-09-08; afhankelijkheid van een externe leesdienst kan jaren aan geschiedenis raken — `#pain` `#objection`.
- “text on my homescreen” — [r/ereader: Ereader Widget?](https://www.reddit.com/r/ereader/comments/1qz6qxx/ereader_widget/) — 2026-03 (ongeveer; bron toont circa zes maanden geleden); de widget is bedoeld om sneller bij het boek te blijven — `#outcome` `#qol`.

### 3.11 Nieuwe korte signalen — dertiende pass

- “No way to add your own book if it's not found. Useless to me.” — [Google Play: ReadList](https://play.google.com/store/apps/details?hl=en&id=com.booktracker.readlist) — 2026-03-28; catalogusuitval zonder handmatige fallback blokkeert de persoonlijke collectie — `#pain` `#outcome`.
- “If they added a dnf list with a place to add why it wasn't working, that would be perfect.” — [Google Play: Bookfolks](https://play.google.com/store/apps/details?hl=en_NZ&id=com.dailyreading.club) — 2026-07-25; DNF-context is gewenst, maar de review zegt niet dat dit een vierde hoofdstatus moet zijn — `#pain` `#outcome`.

### 3.12 Nieuwe korte signalen — vijftiende pass

- “And then I forget about it.” — [r/selfhosted: Looking for a to-read tracker/app](https://www.reddit.com/r/selfhosted/comments/1s0m42y/looking_for_a_toread_trackerapp/) — 2026-04 (ongeveer; bron toont vijf maanden geleden); een snelle externe capture moet later terugvindbaar blijven — `#pain` `#trigger`.
- “The only feature id be unable to do without is the automatic tracking.” — [r/Booktokreddit: Book tracking apps](https://www.reddit.com/r/Booktokreddit/comments/1w65g8b/what_is_it_that_you_like_the_most_about_book/) — 2026-09-03; automatische tracking verlaagt vergeten handmatige invoer, maar de reactie hangt aan Kobo/StoryGraph-integratie — `#pain` `#alternative`.
- “Differentiating search by author vs title is important.” — [r/Booktokreddit: A minimalist reading tracker](https://www.reddit.com/r/Booktokreddit/comments/1ubmsb3/a_minimalist_reading_tracker_for_people_who_just/) — 2026-07 (ongeveer; bron toont twee maanden geleden); zoeken en context moeten niet in één onduidelijke titelmatch samenvallen — `#pain` `#outcome`.
- “I’m blind and I use a screen reader, so the simpler and unclustered apps can be, the better.” — [r/Booktokreddit: Book tracking apps](https://www.reddit.com/r/Booktokreddit/comments/1upkuge/book_tracking_apps/) — 2026-07 (ongeveer; bron toont twee maanden geleden); toegankelijkheid is een directe gebruiksvoorwaarde, niet alleen een visuele voorkeur — `#pain` `#language`.
- “A journal becomes useful when you want to remember why a book mattered.” — [r/kindle: Are you using any type of “Reading Journal”?](https://www.reddit.com/r/kindle/comments/1w32ftl/are_you_using_any_type_of_reading_journal/) — 2026-08-31; de waarde zit in terugkijken, niet in een verplicht uitgebreid schema — `#outcome` `#language`.

### 3.13 Nieuwe korte signalen — zestiende pass

- “Not looking for reading trackers or challenges or stats” — [r/ebooks: Looking for a simple Bookshelf or Book Tracker App](https://www.reddit.com/r/ebooks/comments/1wlj9s9/looking_for_a_simple_bookshelf_or_book_tracker_app/) — 2026-09-20; een directe gebruiker wil tussen Kindle/Kobo alleen bezit, TBR en gelezen boeken eenvoudig bijhouden — `#outcome` `#objection`.
- “my current system is basically random notes and screenshots” — [r/ebooks: Is there a good book reading tracker app that helps you keep track of characters and details?](https://www.reddit.com/r/ebooks/comments/1wgyihb/is_there_a_good_book_reading_tracker_app_that/) — 2026-09 (ongeveer; bron toonde 26 dagen geleden); eigen context raakt verspreid en wordt na een pauze moeilijk terug te vinden — `#pain`.
- “a “jump to page” or “fill up to here” on tap would help a lot.” — [r/TestersCommunity: I Need Testers for my Reader Tracker](https://www.reddit.com/r/TestersCommunity/comments/1x3rylm/i_need_testers_for_my_reader_tracker_a_clean_book/) — 2026-10-12; directe Android-testfeedback over voortgang zonder tientallen taps — `#pain` `#outcome`.
- “the keyboard covers Total Pages and the Save button” — [r/TestersCommunity: I Need Testers for my Reader Tracker](https://www.reddit.com/r/TestersCommunity/comments/1x3rylm/i_need_testers_for_my_reader_tracker_a_clean_book/) — 2026-10-12; IME- en validatiefouten blokkeren de kerninvoer — `#pain` `#language`.

## 4. Gerangschikte ideeënbacklog

Prioriteit is een volgorde voor productonderzoek, niet een belofte om te bouwen.

### P0 — eerst de kern betrouwbaar maken

#### R-01 — Zoeken in Mijn bibliotheek

**Probleem.** `Zoeken` in de huidige navigatie betekent nu vooral zoeken in de online catalogus. Een gebruiker die al een boek heeft toegevoegd moet daarnaast titel, auteur of ISBN in de eigen collectie kunnen vinden zonder door statussen of coverraster te bladeren.

**Kleinste nuttige versie.** Eén lokale zoekingang in Bibliotheek, gecombineerd met de bestaande statusfilters en één sorteermenu: Recent, Titel, Auteur. Zoekresultaten tonen de status en openen hetzelfde boekdetail als het grid.

De lokale bibliotheek moet resultaten direct uit lokale data tonen; een storing of trage verbinding bij de online catalogus mag deze route niet blokkeren.

**Niet meteen toevoegen.** Geen complexe querytaal, tientallen tags of aanbevelingsalgoritme. Voeg later alleen velden toe die echte zoekproblemen oplossen, zoals notitietekst of pagina-aantal.

**QOL-variant bij grote collecties (lage confidence).** Een alfabetische snelkoppeling of letterindex kan lange lijsten versnellen, maar pas nadat echte schaalpijn zichtbaar is. Het vervangt geen vrije lokale zoeking en voegt geen genre- of tagmodel toe.

**Bewijs.** De behoefte aan eigen bibliotheekzoeking, duidelijke lijsten en betere zoekresultaten komt terug in [r/TheStoryGraph](https://www.reddit.com/r/TheStoryGraph/comments/y0pyjp/site_tutorial/), [r/goodreads](https://www.reddit.com/r/goodreads/comments/gzpsp0/) en recente StoryGraph-feedback over search en cataloguskwaliteit. De letter-sprong komt uit één recente [Bookshelf-review op Google Play](https://play.google.com/store/apps/details?hl=pt_PT&id=com.bookshelf.prod). Confidence: hoog voor lokale zoeking; laag voor een letterindex.

De actuele [Android Compose-richtlijn voor SearchBar](https://developer.android.com/develop/ui/compose/components/search-bar?hl=en) raadt een blijvende zoekbalk aan wanneer zoeken de primaire taak van het scherm is. Voor Mijn bibliotheek en Journal betekent dit: query en resultaten mogen niet achter een onduidelijk icon-only pad verdwijnen; dit maakt nog geen tweede algemene zoekingang nodig.

#### R-02 — Lokale export en herstelbaar backupbestand

**Probleem.** Een local-only archief is pas betrouwbaar als een gebruiker het kan meenemen en herstellen. Reddit-gebruikers beschrijven verloren jaren aan tracking en exportflows die moeilijk te vinden of alleen op desktop beschikbaar zijn.

**Kleinste nuttige versie.** Vanuit Instellingen: “Exporteer mijn gegevens” naar een leesbare Markdown-export per boek plus één machineleesbaar JSON-backupbestand. Maak export en herstel zichtbaar vóór een gebruiker van toestel wisselt. Toon vóór restore een preview met aantallen, conflicten en de keuze tussen samenvoegen en vervangen; gebruik stabiele interne ID’s en overschrijf nooit stil. Eigen data mag niet verdwijnen doordat een abonnement afloopt.

**Open keuze.** CSV is handig voor boekenlijsten, maar JSON is geschikter voor notities, reviews, locatie en geschiedenis. Alleen CSV toevoegen als een concrete importbehoefte dat rechtvaardigt.

**Bewijs.** [r/goodreads over verloren/lastige exports](https://www.reddit.com/r/goodreads/comments/1vfqen4/exporting/), [r/goodreads over herstel na dataverlies](https://www.reddit.com/r/goodreads/comments/1w057ny/accidentally_deleted_all_books_no_help_from/), [Bookly op Google Play](https://play.google.com/store/apps/details?hl=en-US&id=com.twodoor.bookly), [Bookmory op Google Play](https://play.google.com/store/apps/details?id=net.tonysoft.bookmory), [r/ereader over overdraagbare Android-software](https://www.reddit.com/r/ereader/comments/1odbgmq/in_need_of_transferable_android_based_reading/) en [r/kobo over export naar andere apps](https://www.reddit.com/r/kobo/comments/1v5l9ro/model_for_exporting_books_with_notes/). Confidence: hoog binnen deze gecombineerde set.

De actuele Bookmory-vermelding noemt expliciet merge-in-plaats-van-overschrijven, herstel van foutieve einddatums en records die bij gesplitste importregels verloren gingen. Dat is een concurrent-changelog en geen gebruikerssurvey, maar het bevestigt dat R-02’s conflict-, datum- en behoudsregels echte foutmodi afdekken.

Recente [Bookly-reviews op Google Play](https://play.google.com/store/apps/details?hl=en-US&id=com.twodoor.bookly) maken de migratierisico’s concreet: gebruikers beschrijven verlies bij een toestelwissel en minder toegang tot eigen logs na afloop van een betaald plan. Dat is geen bewijs voor een account- of syncfunctie; het is wel extra reden om lokale export en restore vóór die overgang zichtbaar en controleerbaar te maken.

Een onafhankelijke [r/ReadingSuggestions-discussie](https://www.reddit.com/r/ReadingSuggestions/comments/1w0z6yn/what_app_do_you_use_to_keep_track_of_the_books/) bevat een vergelijkbare anekdote over verdwenen leesinformatie nadat een dienst niet meer werd ondersteund. Dit verhoogt de ernst van het eigenaarschapsprobleem, maar niet de behoefte aan een specifieke integratie.

#### R-03 — Eén-tap “Verder lezen” en snelle capture

**Probleem.** De kernlus is niet “een dashboard bekijken”, maar terugkeren naar een boek, voortgang bijwerken of een gedachte bewaren. Eén automatisch gekozen boek kan te smal zijn voor lezers die fysiek, digitaal en audio parallel gebruiken; een lange actieve lijst maakt terugkeren juist zwaarder.

**Kleinste nuttige versie.** Bovenaan Bibliotheek blijft één meest recent bijgewerkt boek de primaire `Verder lezen`-actie, met `Voortgang bijwerken` en `Notitie maken`. Wanneer meerdere boeken `Bezig` zijn, toont hetzelfde blok maximaal drie directe terugkeerkaarten: de primaire kaart plus hoogstens twee alternatieven, gesorteerd op laatste lokale update. Elke kaart toont minimaal titel en huidige pagina/totaal; een hoofdstuk wordt alleen getoond als het al bekend is. De overige `Bezig`-boeken blijven volledig bereikbaar via Bibliotheek en het bestaande statusfilter. Dit is geen harde limiet en geen nieuw statusmodel.

Voortgang accepteert direct een absolute huidige pagina (en eventueel hoofdstuk), niet alleen een sessieverschil of timer. Review- en notitievelden bewaren een concept bij teruggaan, rotatie of een tijdelijke fout, zonder een opgeslagen item te verwarren met een onafgemaakt concept. Na opslaan blijft de gebruiker op een voorspelbare plek en ziet die de nieuwe waarde direct.

De recente [Android-tracker-testfeedback](https://www.reddit.com/r/TestersCommunity/comments/1x3rylm/i_need_testers_for_my_reader_tracker_a_clean_book/) maakt de kleinste interactie concreet: een gebruiker moet naar een absolute pagina kunnen springen of `Vul tot pagina` kunnen kiezen. Een raster dat telkens alleen de volgende ongelezen pagina vult is geen primaire control voor een boek op pagina 120. Als de IME open is, blijven `Totaal pagina’s` en `Opslaan` bereikbaar; lege verplichte velden geven zichtbare foutfeedback. Gebruik op Bibliotheek en boekdetail dezelfde afrondingsregel voor percentages, zodat de voortgang niet op twee manieren wordt weergegeven. Confidence: laag-middel voor deze precieze interactie; de thread komt uit een testercommunity met sterke ontwikkelaars- en vroege-appbias.

**Capture versus verwerken.** Een quote of notitie moet eerst met boek, type en tekst kunnen worden opgeslagen. Titel, locatie en een latere interpretatie zijn optioneel en later bewerkbaar. Vraag niet om een perfecte samenvatting tijdens het moment waarop iemand alleen een gedachte wil bewaren.

**QOL-variant: lichte hervatcontext (hypothese).** Als iemand na een langere pauze terugkomt, mag boekdetail de meest recente eigen `Notitie`/`Samenvatting`, laatste pagina en eventueel hoofdstuk zichtbaar maken. Dit hergebruikt het bestaande Journal-model en vraagt geen automatisch verhaaloverzicht. De precieze trigger en de vraag of een notitiepreview helpt, moeten nog eerstehands worden getoetst.

Een recente [r/ebooks-vraag over personages en details](https://www.reddit.com/r/ebooks/comments/1wgyihb/is_there_a_good_book_reading_tracker_app_that/) beschrijft willekeurige notities en screenshots die na een pauze onvoldoende helpen om terug te keren in een groter verhaal. De kleinste nuttige vertaling blijft een boekgebonden `Notitie` met optionele pagina/hoofdstuklocatie; voeg geen aparte character-database, automatische recap of spoilergevoelige samenvatting toe zonder sterker bewijs. Confidence: laag-middel binnen één directe vraag.

De recente [Bookly-review over directe huidige paginainvoer](https://play.google.com/store/apps/details?hl=en-US&id=com.twodoor.bookly) maakt de keuze voor absolute pagina’s concreet: de gebruiker hoeft niet eerst een leessessie te reconstrueren om de juiste stand op te slaan.

Een recente Android-trackervermelding, [Reading Tracker & Page Counter op Google Play](https://play.google.com/store/apps/details?id=com.tenline.readingtracker), combineert die absolute pagina met een korte eigen notitie over wat er laatst gebeurde. Dat is concurrentpositionering en geen gebruikersreview, maar het is een bruikbare kleine vorm voor de al geparkeerde hervatcontext: pagina eerst, eigen context optioneel.

**Bewijs.** De wens voor een duidelijke currently-reading-optie, individuele boekpagina’s en een eenvoudige UI staat samen in [r/books: Best Apps for Books](https://www.reddit.com/r/books/comments/13jrguc/best_apps_for_books/) en in de bestaande succescriteria van [design.md](design.md). De uitbreiding naar meerdere boeken wordt ondersteund door [r/Booktokreddit over meerdere boeken](https://www.reddit.com/r/Booktokreddit/comments/1q3gm0z/reading_multiple_books_at_once/), [r/ReadingSuggestions over meerdere boeken](https://www.reddit.com/r/ReadingSuggestions/comments/1qxtd45/multiple_books/) en [r/books over hoeveel boeken lezers tegelijk lezen](https://www.reddit.com/r/books/comments/1t93u9v/weekly_faq_thread_may_10_2026_how_many_books_do/). De terugkeer na een onderbreking en de voorkeur voor een eenvoudige actuele voortgangsweergave staan in [r/ereader over gratis booktrackers](https://www.reddit.com/r/ereader/comments/1w9qdwx/what_are_the_best_free_book_tracking_apps_for/) en [r/ereader over een reading journal](https://www.reddit.com/r/ereader/comments/1w32df7/are_you_using_any_type_of_reading_journal/). De concrete signalen voor conceptbehoud en directe paginainvoer staan in [StoryGraph op Google Play](https://play.google.com/store/apps/details?id=com.thestorygraph.thestorygraph) en [Bookly op Google Play](https://play.google.com/store/apps/details?hl=en-US&id=com.twodoor.bookly). Confidence: hoog voor snelle terugkeer en directe capture; middel voor precies drie zichtbare kaarten; laag-middel voor hervatcontext.

Een recente [r/Booktokreddit-reactie](https://www.reddit.com/r/Booktokreddit/comments/1w65g8b/what_is_it_that_you_like_the_most_about_book/) noemt automatische tracking onmisbaar omdat handmatige invoer wordt vergeten. Dit bevestigt de invoerfrictie achter R-03, maar niet de keuze voor Kobo-/readerintegraties: die horen bij de bestaande local-only-scopewaarschuwing en blijven voorlopig geparkeerd.

Een recente [r/kindle-discussie over reading journals](https://www.reddit.com/r/kindle/comments/1w32ftl/are_you_using_any_type_of_reading_journal/) verdedigt een lichte terugblik boven een uitgebreid schema. R-03’s capture-first-regel blijft daarom: een quote of directe reactie mag waardevol zijn zonder verplicht weekritueel, statistiek of vaste template.

De nieuwe [r/ebooks-vraag om een eenvoudige bibliotheek](https://www.reddit.com/r/ebooks/comments/1wlj9s9/looking_for_a_simple_bookshelf_or_book_tracker_app/) ondersteunt dezelfde begrenzing vanuit een andere hoek: tussen Kindle en Kobo volstaan boeken, TBR en gelezen. De gebruiker wees juist challenges, statistieken en extra trackerbreedte af. Dit bevestigt de local-only kernrichting, maar is geen bewijs voor een aparte bezit-/leenlaag.

#### R-04 — Journal doorzoekbaar maken

**Probleem.** Een chronologische lijst is goed voor recente gedachten, maar slecht voor “waar schreef ik ook alweer over dit idee?”. De bron van een losse notitie moet zichtbaar blijven.

**Kleinste nuttige versie.** Zoek in eigen journaltekst en filter op boek en notitietype. Behoud de bestaande nieuwste-eerst-volgorde als standaard. Een quote-favoriet is een filter, geen nieuw sociaal systeem.

**Bewijs.** De vraag om alle reviews/notities op één plek en de wens voor boekgebonden notities staan in [Site Tutorial?](https://www.reddit.com/r/TheStoryGraph/comments/y0pyjp/site_tutorial/) en [Best Apps for Books](https://www.reddit.com/r/books/comments/13jrguc). Een recente r/kobo-thread vraagt daarnaast om highlights na het terugbrengen van een boek en om alle annotaties centraal te bekijken, zonder elk boek afzonderlijk te openen. Confidence: middel.

De actuele [PagePath-vermelding op Google Play](https://play.google.com/store/apps/details?id=com.kindredview.pagepath) noemt in de release notes ook zoeken in notities vanuit de bibliotheek. Dit is geen onafhankelijke gebruikersvraag, maar ondersteunt R-04’s keuze om notitietekst als lokaal retrievalveld te behandelen; het rechtvaardigt nog geen tweede, parallelle zoekingang.

### P1 — sterke uitbreidingen, na validatie

#### R-05 — Eén eenvoudige “Volgende” volgorde voor TBR

**Probleem.** Een grote TBR is niet hetzelfde als een bruikbare volgende-keuze. Een gebruiker beschreef een chronologische leesvolgorde naast een lange lijst en veel losse notities.

**Kleinste nuttige versie.** Een boek kan optioneel als primaire `Volgende` worden gemarkeerd; daarnaast kan een gebruiker een kleine handmatige shortlist bijhouden, bijvoorbeeld 3–15 boeken. Toon geen algoritmische aanbeveling en stuur geen pushbericht. Als meerdere boeken nodig blijken, gebruik een eenvoudige handmatige volgorde—geen systeem van exclusieve en overlappende shelves.

**QOL-variant: snel parkeren.** Als een suggestie nog niet in de catalogus is gevonden, mag de gebruiker een voorlopig TBR-item bewaren met titel/auteur en een optionele bron of korte gedachte. Toon duidelijk `Nog niet gekoppeld` en bied later koppeling aan een echt catalogusrecord; neem geen onbetrouwbare editie stil over.

**Bewijs.** De eerdere trackerdiscussie noemt de behoefte aan ordening; recente [r/boeken-discussie over een grote TBR](https://www.reddit.com/r/boeken/comments/1w7xbmo/ik_heb_zoveel_boeken_die_ik_wil_lezen_waar_begin/) laat zien dat een kleine shortlist en kunnen wisselen tussen boeken praktischer kunnen zijn dan één rigide volgorde. De vraag om aanbevelingen van werk, Reddit of vrienden eerst snel te noteren staat in [r/kobo: Best place for tracking books you read and want to read?](https://www.reddit.com/r/kobo/comments/1qc1sl7/best_place_for_tracking_books_you_read_and_want/). Confidence: middel-laag voor de QOL-variant; nog geen eerstehands validatie.

**QOL-variant: bewaren vanuit het Android-deelmenu.** Android kan een app als ontvanger van `text/plain` en URL’s tonen in de Sharesheet. Gebruik dit alleen als ingang naar dezelfde voorlopige capture als hierboven: ingevulde tekst blijft bewerkbaar, de gebruiker bevestigt vóór opslaan en een onzekere catalogusmatch wordt niet automatisch toegevoegd. Een widget is hiervoor niet nodig.

#### R-06 — Leesperioden voor pauze, DNF en herlezen

**Probleem.** Eén veranderbare status, voortgang en datumset per boek kan een nieuwe leesbeurt verwarren met de vorige. Daardoor kunnen oude voortgang, editie, journal en review worden overschreven. “Niet uitgelezen” is bovendien betekenisvolle leesgeschiedenis, maar niet hetzelfde als “wil ik lezen” of “bezig”.

**Voorstel.** Maak een leesperiode het historische record: start/eind, voortgang, gekozen editie, formaat en uitkomst (`Uitgelezen`, `Gepauzeerd` of `DNF`). `Herlezen` start een nieuwe periode; de vorige wordt niet gemuteerd. DNF behoudt de laatst bekende pagina en kan een optionele privéreden krijgen, zonder verplichte taxonomie. Laat DNF standaard zonder sterrenrating; een gebruiker mag alleen bewust een persoonlijke rating toevoegen. De bibliotheek kan de bestaande drie hoofdstatussen blijven tonen als samenvatting van de actuele situatie.

**Kleinste nuttige versie.** Voeg op boekdetail een benoemde actie `Nieuwe leesperiode` toe. Toon per boek maximaal één actieve periode, maar bewaar afgeronde/gepauzeerde/afgebroken perioden eronder als historie. Een foutieve startdatum of statuskeuze moet corrigeerbaar zijn zonder de periode opnieuw aan te maken of gegevens te verwijderen. Een DNF-periode kan niet stil worden verwijderd: toon vóór verwijderen welke pagina’s, notities en reviewrelaties verdwijnen en bied waar mogelijk archiveren aan. Laat review-per-periode en uitgebreide statistieken voorlopig open; bewaar eerst de historische voortgang en editie correct.

**Scopewaarschuwing.** De huidige [design.md](design.md) zegt expliciet: precies drie statussen. Dit is daarom een open productbeslissing, geen stille wijziging.

**Bewijs.** De concrete problemen met oude voortgang, editie en een DNF-herleesbeurt staan in [Superior Rereading Tracking](https://www.reddit.com/r/TheStoryGraph/comments/1r6h3ts/superior_rereading_tracking/) en de recente case [Did a reread, DNF’ed the reread and now my original review is gone?](https://www.reddit.com/r/TheStoryGraph/comments/1u2vy6i/did_a_reread_dnfed_the_reread_and_now_my_original/). Aanvullende DNF-context staat in [StoryGraph-profiel-/DNF-feedback](https://www.reddit.com/r/TheStoryGraph/comments/1o699hl/does_anyone_else_really_love-the-new-profile/) en [unrated DNFs](https://www.reddit.com/r/TheStoryGraph/comments/1s9fdfd/unrated_dnfs/). Confidence: middel-hoog; nog steeds geen eerstehands validatie.

Een recente [Bookfolks-review op Google Play](https://play.google.com/store/apps/details?hl=en_NZ&id=com.dailyreading.club) vraagt om een DNF-lijst met een plek om te noteren waarom het boek niet werkte. Dat versterkt de behoefte aan betekenisvolle DNF-context, maar de juiste vertaling voor deze app blijft een optionele reden binnen een leesperiode, niet een vierde hoofdstatus.

#### R-07 — Taal en editie kunnen corrigeren na toevoegen

**Probleem.** Catalogusmetadata, taal en edities zijn niet altijd correct of volledig. Een gebruiker kan een boek aan de verkeerde editie koppelen of een ontbrekende Nederlandstalige/ISBN-variant niet vinden, terwijl de eigen notities en voortgang wel behouden moeten blijven.

**Kleinste nuttige versie.** Toon vóór toevoegen de gevonden taal, het formaat, ISBN en pagina-aantal wanneer beschikbaar. Vanuit boekdetail kan de gebruiker een andere editie kiezen zonder boek, review, notities of leesgeschiedenis te verwijderen. Ontbreekt de juiste variant, bied dan handmatig toevoegen aan met behoud van de oorspronkelijke zoekopdracht. Maak onderscheid tussen werk en gekozen editie; laat pagina-aantal en cover per editie volgen en voorkom dubbele records op hetzelfde ISBN.

**Bewijs.** Gebruikers noemen edition-handling expliciet als plus- en pijnpunt in [StoryGraph-feedback](https://www.reddit.com/r/TheStoryGraph/comments/1vfyjyz/what-features-do-you-absolutely-love-or-hate/). Recente signalen over Nederlandstalige filtering staan in [r/boeken: Goodreads?](https://www.reddit.com/r/boeken/comments/1un0iwq/goodreads/) en signalen over ontbrekende ISBN-volumes en importvarianten in [Bookshelf op Google Play](https://play.google.com/store/apps/details/Bookshelf_Your_virtual_library?hl=en_GB&id=com.bookshelf.prod). Confidence: middel-hoog.

De recente [r/boeken-discussie over Goodreads](https://www.reddit.com/r/boeken/comments/1w39wwi/wie_zit_er_ook_op_goodreads/) bevestigt tegelijk de productgrens: Nederlandstalige dekking verschilt per dienst, handmatig toevoegen is een gewaardeerde fallback en sommige lezers gebruiken een tweede tracker uit angst data kwijt te raken. Dit verhoogt de waarde van correctie en export, niet van een verplicht sociaal profiel.

Twee recente [ReadList-reviews op Google Play](https://play.google.com/store/apps/details?hl=en&id=com.booktracker.readlist) beschrijven hetzelfde breekpunt concreter: boeken ontbreken in de catalogus en handmatig toevoegen is niet beschikbaar. Eén reviewer noemt het onbruikbaar wanneer alleen Open Library wordt doorzocht. Confidence: laag-middel binnen één app; de richting van R-07 wordt wel duidelijker.

#### R-08 — Export van één boek als leesbaar dossier

**Probleem.** Een volledige backup is voor herstel; een boekdossier is voor herlezen, delen met jezelf of archiveren in een Markdown-vault.

**Kleinste nuttige versie.** Export bevat titel/auteur/gekozen editie, hoofdstatus, leesperioden met start-/einddatum, formaat en voortgang, rating/review en notities chronologisch met pagina/hoofdstuk. Quotes blijven gewone tekst met bronvermelding van het boek; maak geen automatisch gegenereerde samenvatting.

**Waarom apart van R-02.** De technische backup en de menselijke leesexport hebben verschillende doelen. Ze kunnen dezelfde exportcode delen, maar de gebruiker hoeft geen JSON te lezen om eigen gedachten terug te vinden.

**Open keuze.** Als R-10 wordt gevalideerd, moet een boekdossier ook de relatie tussen quote en reflectie behouden. Dat is een eenvoudige verwijzing, geen automatisch samengestelde samenvatting.

#### R-09 — Grote collectie onderhoudbaar houden

**Probleem.** Individuele wijzigingen worden onwerkbaar zodra de collectie groot wordt: status corrigeren, meerdere boeken verwijderen of later een label toevoegen.

**Kleinste nuttige versie.** Pas na echte schaalpijn: multi-select voor één veilige bulkactie, bijvoorbeeld status wijzigen. Verwijderen vereist een expliciete bevestiging en een herstelpad. Na een geslaagde, herstelbare verwijdering kan een korte `Verwijderd`-Snackbar met `Ongedaan maken` de snelle terugweg bieden; bij twijfel blijft een restore-preview nodig.

**Bewijs.** Multi-select voor tags en onderhoud van grote TBR’s wordt herhaaldelijk genoemd in [StoryGraph-feedback](https://www.reddit.com/r/TheStoryGraph/comments/1vfyjyz/what-features-do-you-absolutely-love-or-hate/). Confidence: middel, maar pas relevant bij een grote lokale collectie.

De Nederlandstalige feedback op een verwijderde trackerpost laat een kleiner maar belangrijker schaalprobleem zien: een verkeerde statusactie leidde tot verwijderen omdat terugdraaien niet duidelijk was. Dat is geen bewijs voor bulkbewerking, wel voor een veilige individuele herstelroute vóór multi-select wordt overwogen. [r/boeken: verwijderde trackerfeedback](https://www.reddit.com/r/boeken/comments/1sk6k73/removed_by_moderator/)

#### R-11 — Serievolgorde als bibliografische context

**Probleem.** `Volgende` in R-05 beschrijft wat de gebruiker wil lezen, maar niet welk deel van een serie logisch volgt. Zonder serie- en volgnummer worden papieren lijstjes, notities of een tweede tracker gebruikt; een collectie of omnibus kan bovendien meerdere werken verbergen.

**Kleinste nuttige versie.** Toon op boekdetail en in eigen zoekresultaten de serienaam en het volgnummer wanneer de catalogus dit betrouwbaar levert. Voeg een niet-opdringerige `Volgende deel`-verwijzing toe wanneer het volgende werk al in de bibliotheek staat. Laat handmatige correctie toe; breid een serie niet automatisch uit en stuur geen release-notificaties. Markeer een omnibus als collectie zonder die stil te splitsen.

**Verschil met R-05.** R-05 is een persoonlijke shortlist of leeskeuze. R-11 is context die helpt voorkomen dat een boek uit een reeks of een vervolg vergeten wordt.

**Bewijs.** De behoefte om serievolgorde en nieuwe delen niet te missen staat expliciet in [How do you keep track of book series you are reading?](https://www.reddit.com/r/fantasybooks/comments/1o931hq/how_do_you_keep_track_of_book_series_you_are/) en komt terug in [Weekly FAQ: Do you keep track of the books you read?](https://www.reddit.com/r/books/comments/1pgfr8j/weekly_faq_thread_december_07_2025_do_you_keep/). Recente Nederlandstalige leesdiscussies tonen bovendien veel serie- en reread-context in de dagelijkse workflow, bijvoorbeeld [Welk boek herlees jij vaker?](https://www.reddit.com/r/boeken/comments/1w4cn6s/welk_boek_herlees_jij_vaker/). Confidence: middel; eerst nog catalogus- en gebruikersvarianten toetsen.

Een recente [r/Booktokreddit-reactie op een minimalistische tracker](https://www.reddit.com/r/Booktokreddit/comments/1ubmsb3/a_minimalist_reading_tracker_for_people_who_just/) maakt R-11 concreter: auteur en serie moeten niet alleen als metadata zichtbaar zijn, maar een route openen naar bekende werken en de rest van de reeks. Versterk daarom de kleinste versie met lokale doorklikcontext; confidence blijft laag-middel door één productfeedbackcommentaar.

#### R-13 — Lokale `Lezen voor de lijst`-modus (open scope)

**Probleem.** Nederlandse leerlingen kunnen een persoonlijk leesarchief willen gebruiken naast de onderwijscontext van `Lezen voor de lijst`, maar de huidige app heeft geen onderscheid tussen een algemeen boek en een boek dat voor zo’n lijst wordt gebruikt.

**Kleinste nuttige versie.** Een optionele lokale modus met een profiel, instelbaar aantal te lezen boeken, lijstlidmaatschap, status-/reflectiechecklist, een handmatig vastgelegd S/N-niveau en een expliciet advieslabel. Toon onbekend als onbekend; leid geen niveau af uit pagina-aantal, genre of titel. Een docent of officiële lijst blijft leidend voor geschiktheid.

**Bewijs en grens.** [Lezen voor de lijst — lezen](https://www.lezenvoordelijst.nl/voor-mediatheken-bibliotheken/lezen/) en [werken met niveaus](https://lezenvoordelijst.nl/docenteninformatie/werken-met-niveaus/) beschrijven de onderwijscontext en waarschuwen dat niveau niet één-op-één aan een leerjaar hangt. Dat ondersteunt correcte onzekerheid en handmatige controle, maar niet de vraag of de Reading-app deze doelgroep moet bedienen. Confidence: middel voor de bronregels, laag voor productvraag. Dit blijft een expliciete scopekeuze buiten de huidige drie-status-v1.

### P2 — parkeren tenzij nieuwe signalen het veranderen

- **Sociale feed, openbare reviews, vrienden en DM’s.** Sommige lezers willen dit, maar het botst met de huidige privé-archiefhouding en de expliciete wens om sociale media niet op te dringen.
- **Streaks, badges, confetti en dagelijkse doelen.** Ze bestaan in trackers, maar zijn geen bewijs dat deze app ze nodig heeft; ze kunnen leesdruk toevoegen.
- **AI-samenvattingen of automatisch gegenereerde notitietitels.** De gebruiker wil eigen woorden bewaren. De huidige spec verbiedt al automatisch AI-titeltjes; dat blijft een goede grens.
- **Een ingebouwde ebook/PDF-reader met highlights.** De exportbehoefte is relevant, maar volledige tekstweergave, DRM, annotatiesynchronisatie en bestandsbeheer zijn een ander product. Onderzoek hooguit een import/exportbrug voor handmatig ingevoerde notities.
- **Cloudsync, accounts en companion-apps.** De behoefte aan voortgang, annotaties en bibliotheek op meerdere apparaten, desktop of web komt terug in recente e-readerdiscussies. Automatische tracking via Kobo/readerintegraties is dezelfde categorie: minder invoer, maar afhankelijk van externe data en synchronisatie. Dit vereist een expliciet privacy-, conflict- en kostenbesluit. Gebruik R-02 als eenvoudige portability bridge en suggereer geen live sync zolang opslag lokaal blijft.
- **Aanbevelingsalgoritme en willekeurige Discover-tab.** Voeg pas discovery toe als er een concreet probleem is dat cataloguszoeken niet oplost. De app hoeft niet meteen een tweede sociale of commerciële startpagina te worden.
- **Uitgebreide vrije custom fields.** Bron, bezit, prijs, conditie, locatie of auteurkenmerken kunnen nuttig zijn voor power users, maar zijn nog geen kernbehoefte. Onderzoek eerst welke velden terugvinden of een concrete beheeractie verbeteren.
- **Barcode- of camerascan voor een fysieke collectie.** Dit kan de eerste catalogusinvoer versnellen, maar brengt camera-permission, verkeerde ISBN-/editieherkenning en een aparte bezit-/leenadministratie mee. Houd dit bij R-09 geparkeerd; geen camera in v1 en geen automatische toevoeging zonder controle.

#### R-10 — Quote en reflectie aan elkaar koppelen (geparkeerd)

**Probleem.** Een opgeslagen quote bewaart de passage, maar niet noodzakelijk waarom die voor de lezer belangrijk was. De huidige types `Quote`, `Gedachte` en `Notitie` houden capture overzichtelijk, maar zonder relatie raakt context verspreid.

**Kleinste nuttige versie.** Bij het opslaan van een quote kan de gebruiker optioneel één bestaande notitie koppelen of direct een korte reflectie toevoegen. Boekdetail en Journal tonen daarna een kleine `Gerelateerde notitie`-verwijzing aan beide kanten. Quotes en notities blijven afzonderlijk doorzoekbaar en exporteerbaar; er komt geen verplichte extra stap en geen automatisch gegenereerde interpretatie.

**Bewijs en reden voor parkeren.** Een commentaar in [r/books: Book tracker/goal app??](https://www.reddit.com/r/books/comments/1018rvu/book_tracker_goal_app/) noemt aparte secties voor quotes en notes als sterk punt en vraagt expliciet om quotes met specifieke notes te kunnen verbinden. Na zes onderzoekspassen is dit nog steeds één concrete bron; confidence blijft laag. Heropen alleen bij een tweede onafhankelijke bron of een eerstehands behoefte.

#### R-12 — Optionele homescreen-widget voor “Verder lezen” (geparkeerd)

**Probleem.** Een lezer kan een huidig boek sneller willen openen zonder eerst de app te zoeken. Dat is een terugkeeroptimalisatie bovenop R-03, geen nieuwe manier om leesgedrag te meten.

**Kleinste nuttige versie.** Een optionele Android-widget toont lokaal het primaire `Verder lezen`-boek met titel en huidige pagina/totaal; één tik opent het volledige boekdetail. Bij meerdere `Bezig`-boeken volgt de widget dezelfde primaire keuze als R-03. Geen directe voortgangsedit, timer, statistiek, notificatie of accountafhankelijkheid.

**Bewijs en randvoorwaarden.** In de recente [r/ReadingSuggestions-thread over lees-trackers](https://www.reddit.com/r/ReadingSuggestions/comments/1w0z6yn/what_app_do_you_use_to_keep_track_of_the_books/) wordt een homescreen-widget als bonus genoemd. Vergelijkbare terugkeer- of widgetwaarde verschijnt in [r/ereader: Ereader Widget?](https://www.reddit.com/r/ereader/comments/1qz6qxx/ereader_widget/) en [r/ebooks: ereading apps with bookshelves?](https://www.reddit.com/r/ebooks/comments/1w5i0n7/ereading_apps_with_bookshelves/), maar beide gaan over apps die de tekst zelf tonen. De [Android-richtlijn voor app widgets](https://developer.android.com/develop/ui/views/appwidgets/overview?authuser=0000) benadrukt compacte glanceable informatie, navigatie naar rijkere appdetails en aanpassing aan verschillende groottes. Confidence: laag-middel voor snelle homescreen-terugkeer, laag voor een tracker-specifieke widget en hoog voor de platformrandvoorwaarden. Heropen pas nadat R-03 in de app zelf aantoonbaar werkt en er directe Android-tracker-evidence is.

#### R-14 — Boekenlijstcontext in de homescreen-widget (geparkeerd)

**Probleem.** Als R-13 ooit wordt gekozen, kan een leerling de lijstmodus buiten de app willen hervatten; dit is een uitbreiding van R-12, geen tweede widgetconcept.

**Kleinste nuttige versie.** Toon hooguit de actieve boektitel/pagina, het aantal boeken in de gekozen lijst en één deep link naar de lijstmodus. Geen checklistbewerking, niveauadvies, timer of notificatie in de widget. R-14 kan pas bestaan als R-12 en R-13 afzonderlijk zijn gevalideerd.

**Bewijs.** De [Android-richtlijn voor app widgets](https://developer.android.com/develop/ui/views/appwidgets/overview?authuser=0000) ondersteunt glanceable informatie en navigatie; de onderwijscontext komt uit R-13. Confidence: laag.

#### R-15 — Launcher-logo (geen productfeature)

Dit is een visuele assetnotitie uit de log van 2026-09-12, geen gebruikersbehoefte of backlogfeature. Als een launcher-icoon later nodig is, hoort dat bij een expliciete ontwerp-/buildopdracht. De onderzoeksloop maakt hier geen mockup van en wijzigt `design.md` niet.

## 5. Ontwerpregels uit actuele Android-bronnen

Deze regels zijn praktische vertalingen voor de Reading-app; ze vervangen de bestaande tokens in [design.md](design.md) niet.

1. **Adaptive betekent hercomponeren, niet uitrekken.** Android adviseert window size classes en noemt op grote schermen een list-detail-layout; op compacte schermen blijft één paneel zichtbaar. Voor deze app ligt een bibliotheeklijst/covergrid naast boekdetail voor de hand op expanded width. [Android adaptive apps](https://developer.android.com/develop/ui/compose/layouts/adaptive).
2. **Bewaar context bij formaat- en configuratiewijzigingen.** Android noemt rotatie, foldable posture, window resizing, density en font changes als configuratiewijzigingen waarvoor state-continuïteit nodig is. Conceptueel betekent dit: zoektekst, geselecteerde filter, onafgemaakte notitie en scrollcontext mogen niet verdwijnen. [Android adaptive apps](https://developer.android.com/develop/ui/compose/layouts/adaptive).
3. **Maak betekenis expliciet voor assistive technology.** Compose-documentatie noemt semantics, traversal order, schaalbare content en accessibility checks. Journalrijen, statusfilters, sterren en favoriet-knoppen hebben dus duidelijke labels, staten en een logische TalkBack-volgorde nodig. [Compose accessibility](https://developer.android.com/develop/ui/compose/accessibility).
4. **Gebruik Material 3 als gedragsbasis, niet als visuele identiteit.** Material 3 centraliseert color scheme, typography en shapes en laat een kleine projectspecifieke typografieset toe. Dat ondersteunt de bestaande keuze voor native Android-componenten met het eigen Inktblauw-thema. [Material 3 in Compose](https://developer.android.com/develop/ui/compose/designsystems/material3).
5. **Ontwerp voor echte inhoud.** Lange titels, ontbrekende covers, lange notities, lege journalresultaten, foutieve catalogusdata en grote lettertypes zijn normale toestanden. Gebruik geen placeholderkaartjes of decoratieve statistieken om een scherm voller te laten lijken.
6. **Behoud een onderscheid tussen actie en metadata.** Een hele boekrij mag openen; een overflowknop en bookmark hebben afzonderlijke tapdoelen. Gebruik concrete labels zoals `Notitie opslaan` en `Opnieuw proberen`, niet algemene marketingtaal.
7. **Betrouwbaarheid is onderdeel van de feature.** Voor elke invoer-, import- of catalogusfunctie zijn laad-, lege-, fout- en hersteltoestanden onderdeel van de scope. Een crash, lege pagina, mislukte import of verdwenen concept mag nooit de enige uitkomst zijn.
8. **Lokaal eerst, netwerk secundair.** Bibliotheek en Journal moeten lokale data meteen kunnen lezen en eigen wijzigingen zonder netwerk kunnen bewaren. De online catalogus is een afzonderlijke bron die kan laden, leeg terugkomen of falen zonder de lokale archiefroute te blokkeren. Gebruik de lokale bron als canonieke waarheid voor de eigen collectie. [Android offline-first](https://developer.android.com/topic/architecture/data-layer/offline-first?hl=en).
9. **Maak hit areas expliciet.** Een 24dp-icoon is geen 24dp-interactie: reserveer minimaal 48dp per actie en voorkom dat automatisch uitgebreide targets van naast elkaar geplaatste iconen elkaar overlappen. Test elk aangrenzend actiegebied afzonderlijk met toetsenbord, TalkBack en aanraking. [Compose API defaults](https://developer.android.com/develop/ui/compose/accessibility/api-defaults?hl=en).
10. **Ontwerp tegen actuele systeeminsets.** Bij target SDK 35 wordt edge-to-edge op Android 15 en hoger afgedwongen. Laat achtergronden en scrollende inhoud desgewenst doorlopen, maar houd tekst, knoppen en gesture-gevoelige acties uit system bars, display cutouts en de IME. Gebruik runtime-insets, geen vaste statusbarhoogtes, en test zowel gesture- als 3-knopsnavigatie. [Android edge-to-edge design](https://developer.android.com/design/ui/mobile/guides/layout-and-content/edge-to-edge).
11. **Bevestig gevolgen, niet alleen knoppen.** Bij verwijderen, vervangen door een restore of het weggooien van een leesperiode moet de bevestiging de concrete consequentie benoemen en een duidelijke annuleeractie bieden. Dismiss via Back of buiten de dialoog is altijd veilig; er verschijnt geen succesfeedback vóór de lokale write echt gelukt is. [Android dialogs and user input](https://developer.android.com/develop/ui/compose/quick-guides/content/display-user-input?hl=en).
12. **Gebruik feedback die de volgende actie ondersteunt.** Een Snackbar is geschikt voor korte bevestiging van een geslaagde lokale write, offline-status of een herstelbare verwijdering. Geef alleen een actie als die werkelijk uitvoerbaar is; `Ongedaan maken` vervangt geen bevestigingsdialoog, restore-preview of expliciete foutmelding. [Android Snackbar](https://developer.android.com/develop/ui/compose/components/snackbar).
13. **Laat externe capture eerst bevestigen en bewerken.** Een toekomstige Android-share-target mag een gedeelde URL of tekst voorinvullen, maar nooit stil een boekrecord aanmaken. Toon de ruwe invoer, laat titel/auteur/bron corrigeren en maak de onzekere koppeling expliciet. Androids richtlijn voor [ontvangen van eenvoudige data](https://developer.android.com/develop/ui/compose/sharing/receive) noemt bevestigen en bewerken juist bij tekst een kernkwaliteit van een share target.
14. **Maak zoeken zichtbaar wanneer het de primaire taak is.** Gebruik op Bibliotheek en Journal geen icon-only zoekingang als de gebruiker daar lokaal zoekt. Bewaar query en resultaatcontext; houd cataloguszoeken en lokale archiefzoeking begrijpelijk gescheiden. [Compose SearchBar](https://developer.android.com/develop/ui/compose/components/search-bar?hl=en).
15. **Gebruik list-detail voor collectiecontext op grotere schermen.** Een boeklijst kan op compact scherm naar boekdetail navigeren en op expanded width naast detail blijven staan. Serie-/auteurcontext hoort daarbij als navigeerbare lijst, niet als decoratieve metadata. [Android list-detail](https://developer.android.com/develop/adaptive-apps/guides/list-detail).
16. **Maak samengestelde rijen en foutstatussen semantisch eenduidig.** Een boek- of Journalrij heeft één primaire openactie; favoriet en overflow blijven afzonderlijke 48dp-doelen. Gebruik semantics om custom inhoud, rol, staat en fouttekst betekenis te geven en voorkom een dubbele focusroute door `clickable` en `focusable` niet naast elkaar op hetzelfde element te zetten. [Compose semantics](https://developer.android.com/develop/ui/compose/accessibility/semantics?hl=en), [Focus targets](https://developer.android.com/develop/ui/compose/touch-input/focus/focus-target).
17. **Houd formulierinhoud bereikbaar wanneer de IME verschijnt.** Een toevoeg- of voortgangsformulier moet kunnen scrollen of zijn layout aan `WindowInsets.ime` aanpassen, zodat totaalpagina en opslaan niet achter het toetsenbord verdwijnen. Gebruik expliciete foutfeedback bij lege of ongeldige velden; een knop die niets doet zonder uitleg is geen herstelbare fouttoestand. [Set up window insets](https://developer.android.com/develop/ui/compose/system/insets-ui), [Use keyboard IME animations](https://developer.android.com/develop/ui/compose/system/keyboard-animations?hl=en).

## 6. Bekende documentatiegaten

- [design.md](design.md) zegt in de inleiding dat secties 9–23 schermen, gedrag, voorbeeldinhoud en overdracht bevatten, maar het huidige bestand eindigt bij §8.6. Dit moet vóór een bouwopdracht worden opgelost: ontbrekende secties aanvullen of de inleiding corrigeren.
- [design.md](design.md) verwijst naar `02-zoeken-journal.png`, `03-notitie-review.png`, `04-donker-voortgang.png` en `generation-prompts.txt`, maar in de huidige checkout staat alleen `01-bibliotheek-boekdetail.png`. Dit is een overdrachtsgat; de onderzoeksloop maakt de ontbrekende visualisaties niet automatisch aan.
- De huidige spec definieert online cataloguszoeken, maar niet expliciet zoeken binnen de eigen collectie. R-01 is daarom een echte productbeslissing, geen alleenstaande UI-polish.
- Er is geen beschreven export/restore-contract. Omdat opslag local-only is, is R-02 een betrouwbaarheidsgat en niet alleen een nice-to-have.
- De spec noemt state-behoud bij rotatie, maar beschrijft nog niet wanneer een review- of notitieconcept automatisch wordt bewaard, teruggezet of verwijderd. R-03 maakt dat onderscheid expliciet.
- Taal, formaat, ISBN-fallback en catalogusdekking zijn niet als add-flow beschreven. R-07 adresseert dit zonder meteen een volledig bibliotheekmetadata-model toe te voegen.
- De spec onderscheidt nog niet expliciet tussen tijdelijke UI-state en een duurzaam concept. Android merkt op dat saveable state niet behouden blijft zodra een composable door Back uit de navigatiebackstack wordt verwijderd; R-03 moet daarom vastleggen welke tekst als concept lokaal blijft bestaan. [Activity state changes](https://developer.android.com/guide/components/activities/state-changes).
- Er is nog geen offline-/catalogusfoutcontract: lokale Bibliotheek en Journal moeten onafhankelijk bruikbaar zijn van online zoeken. R-01 en ontwerpregel 8 maken dit een controlepunt.
- De spec definieert nog geen relatie tussen een quote en een eigen reflectie. R-10 blijft een lage-confidence-experiment en geen uitbreiding van de vaste journaltypes.
- De spec beschrijft nog geen voorlopig, niet-aan-een-editie-gekoppeld boekidee en maakt nog niet expliciet onderscheid tussen ruwe capture en latere verwerking. R-03 en R-05 houden dit bewust klein; een voorlopig item moet als onvolledig herkenbaar blijven.
- De spec maakt nog geen onderscheid tussen een persoonlijk leesarchief en een fysieke bezit-/leeninventaris. Barcode- of camerascan blijft daarom een P2-idee bij R-09 en geen reden om de local-only v1 met camera-toegang te belasten.
- De spec noemt runtime-insets, maar legt de Android-15 edge-to-edge-, display-cutout-, gesture- en IME-matrix nog niet uit. Ontwerpregel 10 maakt dit een expliciet controlepunt vóór implementatie.
- R-03 legt nog niet vast of voortgang via een absoluut paginaveld, `Vul tot pagina` of een andere directe sprong wordt ingevoerd, hoe een formulier onder de IME scrollt, hoe lege opslag wordt gemeld en welke afrondingsregel Bibliotheek en boekdetail delen.
- De spec definieert niet of een DNF een rating mag krijgen, hoe een DNF-reread wordt verwijderd of hoe de gevolgen aan de gebruiker worden getoond. R-06 en ontwerpregel 11 maken dit expliciete beslissingen.
- Serie-/omnibusrelaties, volgnummer en `Volgende deel` zijn nog niet beschreven. R-11 blijft een P1-onderzoek naast de persoonlijke keuzehulp van R-05.
- Er is nog geen expliciet feedback- en undo-contract: welke lokale writes een Snackbar tonen, wanneer `Ongedaan maken` veilig is en wanneer een restore-preview nodig blijft. Ontwerpregel 12 en R-09 maken dit controlepunt zichtbaar.
- De spec beschrijft nog niet hoe meerdere boeken met status `Bezig` op `Verder lezen` verschijnen. R-03 stelt maximaal drie zichtbare terugkeerkaarten voor zonder de onderliggende collectie te begrenzen; de precieze limiet vraagt nog eerstehands validatie.
- De spec beschrijft nog niet hoe een lezer na een lange pauze eigen context terugvindt. R-03 houdt dit voorlopig bij bestaande pagina-, hoofdstuk- en Journalgegevens; een aparte hervatsamenvatting is niet gevalideerd.
- De spec legt nog niet vast hoe een verkeerde startdatum, statuskeuze of importdatum wordt gecorrigeerd zonder verwijderen en opnieuw toevoegen. R-02, R-06 en R-09 maken dit een herstelcontract vóór verdere bulkfuncties.
- R-01 definieert lokale tekstzoeking en sortering, maar nog niet hoe navigatie zich gedraagt bij een uitzonderlijk grote collectie. De letterindex blijft daarom een lage-confidence QOL-variant, geen nieuwe kernfunctie.
- R-02 beschrijft nog niet hoe een import omgaat met velden die de app niet ondersteunt. Een toekomstige preview moet zulke velden zichtbaar als overgeslagen melden; stil verlies is geen acceptabele default.
- R-05 beschrijft voorlopig parkeren, maar de spec legt nog niet vast of een gedeelde URL/tekst via het Android-deelmenu als bewerkbare capture binnenkomt of alleen via handmatige invoer.
- R-01 noemt lokale tekstzoeking, maar de spec beschrijft nog niet of de zoekingang persistent zichtbaar blijft wanneer zoeken de primaire taak van Bibliotheek of Journal is.
- R-11 noemt serie-/omnibusmetadata, maar de spec legt nog niet vast dat auteur en serie navigeerbare contextlijsten openen in plaats van alleen tekstlabels te tonen.
- De spec noemt TalkBack en vergroot lettertype, maar heeft nog geen componentgerichte accessibility-acceptatiecheck voor labels, traversal order, tekstschaal, samengestelde rijen, semantische foutstatussen en het vermijden van dubbele focusdoelen.
- R-07 beschrijft handmatig toevoegen als fallback, maar de huidige spec tekent de `geen resultaat`-tak nog niet uit als gelijkwaardig aan een catalogusresultaat.
- R-04 heeft nog geen expliciete keuze tussen centraal zoeken in Journal en een tweede zoekveld in Bibliotheek; de huidige richting blijft één centrale Journal-route.
- R-06 legt nog niet vast waar een optionele DNF-reden leeft, hoe lang die zichtbaar is en of zij privé blijft; dit blijft een leesperiodebeslissing.
- R-12 is nog niet gevalideerd in de appcontext: er is geen beslissing over widgetplaatsing, stale lokale data, widgetgroottes of wat er gebeurt als er geen `Bezig`-boek is.
- De widgetsignalen buiten de trackerthread gaan over reader-apps; directe Android-evidence voor een lokale lees-tracker-widget ontbreekt nog. R-12 blijft daarom geparkeerd.
- De huidige spec zegt precies drie statussen; DNF, pauze en herlezen moeten als expliciete keuze worden behandeld.
- De huidige spec heeft één status-, voortgangs- en datumset per boek en geen leesperiodehistorie. R-06 beschrijft dit als open datamodelbeslissing vóór herlezen of DNF wordt toegevoegd.
- Er is nog geen eerstehands onderzoek onder de beoogde gebruiker. Reddit vormt richting, geen validatie.

## 7. Volgende onderzoekslus

De volgende lus moet klein blijven en maximaal enkele beslissingen toevoegen:

1. Lees alleen nieuwe 1–3-sterrenreviews, reviews van andere Android-trackers of directe Android-testfeedback; controleer specifiek of herstel, imports, absolute paginainvoer, IME-bereikbaarheid en invoerfrictie zich buiten deze eerste tester-/app-store-set herhalen.
2. Zoek Nederlandstalige lezers- en e-readercommunities om te testen of de huidige Nederlandse interface en terminologie natuurlijk zijn.
3. Vergelijk drie lokale dataflows: handmatige backup, JSON restore en Markdown-export. Noteer welk probleem elk formaat oplost en hoe quote-reflectierelaties daarin passen; voeg geen formaat toe zonder doel.
4. Zoek specifiek naar ervaringen met aparte leesperioden, DNF-rating, serievolgorde en verkeerde catalogusedities. Heropen R-10 alleen bij een tweede onafhankelijke bron of eerstehands signaal; beslis daarna of R-06, R-07 of R-11 verder komt.
5. Zoek bij andere tracker-apps naar eerstehands bewijs voor absolute pagina-invoer of `Vul tot pagina`, importmapping, dataherstel, catalogusuitval, DNF-redenen, externe capture, IME-/validatiegedrag en klikbare seriecontext; controleer specifiek of automatische tracking en widgetwaarde ook voor Android-trackers gelden en niet alleen voor reader-apps.
6. Toets tegelijk de precieze hervatcontext: helpt een eigen laatste notitie, of is alleen titel/pagina genoeg? Vergelijk dit met meerdere gelijktijdige `Bezig`-boeken en bewaak dat `Snel parkeren`, de share-target en capture-versus-verwerken geen verborgen tweede inbox worden.
7. Herzie de backlog: voeg alleen nieuwe ideeën toe als ze een bron, een concreet probleem en een kleinste nuttige versie hebben. Verwijder dubbele varianten en verlaag ideeën met alleen algemeen gebruikersgedrag naar hypothese.

## 8. Onderzoekslog

### 2026-09-09 — eerste pass

- **Gedaan:** Reddit-threads over Goodreads-alternatieven, reading trackers, StoryGraph, notitie-export en e-reader-sync bekeken; officiële Android-pagina’s voor mobile design, Material 3, accessibility en adaptive apps geraadpleegd.
- **Verwerkt:** R-01 t/m R-09, confidence-labels, design-checks en documentatiegaten.
- **Bewust niet gedaan:** geen appcode, geen nieuw visueel systeem, geen sociale of AI-feature toegevoegd.
- **Volgende stap:** app-store reviews en Nederlandstalige bronnen toevoegen voordat prioriteiten verder verschuiven.

### 2026-09-09 — tweede pass: app stores en Nederlandstalige signalen

- **Gedaan:** recente Google Play-pagina’s van Bookmory, StoryGraph, Bookly en Bookshelf bekeken; actuele r/boeken-discussies over Nederlandstalige catalogi, een IMDb-achtige boekenapp, highlights en TBR-keuze gelezen.
- **Nieuwe signalen:** dataverlies bij migratie of abonnementwissel, behoefte aan conceptbehoud en directe absolute paginainvoer, taal-/editieproblemen, kleine TBR-shortlists en prikkelarme defaults.
- **Verwerkt:** R-02, R-03, R-05 en R-07 aangescherpt; betrouwbaarheid als ontwerpregel toegevoegd; vrije custom fields bewust geparkeerd.
- **Bewust niet gedaan:** geen code, schermen, mockups, design.md-wijzigingen, accounts, cloudsync of notificaties toegevoegd.
- **Volgende stap:** dezelfde signalen buiten deze app-store/Reddit-steekproef toetsen en daarna dubbele of te brede backlogideeën snoeien.

### 2026-09-09 — derde pass: portability, workflow en local-first

- **Gedaan:** recente r/ereader-, r/kobo-, r/Onyx_Boox- en r/books-bronnen gelezen over synchronisatie, annotatie-export, gescheiden leesworkflows en quote/notitiegebruik; actuele Android-documentatie over offline-first en state-restoration gecontroleerd.
- **Nieuwe signalen:** meerdere apps en spreadsheets worden gecombineerd omdat geen enkele route tegelijk eenvoudig, persoonlijk en overdraagbaar voelt; plain-text export voorkomt lock-in; quote en reflectie kunnen bewust samen horen; live sync blijft een latere grens.
- **Verwerkt:** R-01 en R-02 aangescherpt, R-10 als laag-confidence-experiment toegevoegd, R-08 uitgebreid met een open relatiekeuze, en local-first als ontwerpregel vastgelegd.
- **Current-state check:** de spec verwijst naar vier ontwerpassets waarvan er drie afbeeldingen en één promptbestand in de checkout ontbreken; dit is als documentatiegat vastgelegd.
- **Bewust niet gedaan:** geen code, schermen, mockups, design.md-wijzigingen, sync, account, readerfunctie of vrije metadata toegevoegd.
- **Volgende stap:** de nieuwe relatiesuggestie en portability-behoefte met extra onafhankelijke bronnen toetsen, daarna de oudste/zwakste backlogitems snoeien.

### 2026-09-09 — vierde pass: herlezen, DNF en interactiedetails

- **Gedaan:** recente StoryGraph- en r/books-discussies over rereads, DNF, edities, formaten en eenvoudige trackers gelezen; actuele Compose-richtlijnen voor touch targets gecontroleerd.
- **Nieuwe signalen:** één mutable boekstatus kan eerdere reread-historie beschadigen; een DNF kan onderdeel zijn van een herleesperiode; formaat hoort bij een leesperiode; kleine iconen hebben expliciete, niet-overlappende hit areas nodig.
- **Verwerkt:** R-06 herwerkt naar een gefaseerd leesperiodemodel, R-07/R-08 afgestemd op historische perioden en ontwerpregel 9 toegevoegd.
- **Bewust niet gedaan:** geen code, schermen, mockups, design.md-wijzigingen, permanente statusuitbreiding, challenges, stats of live sync toegevoegd.
- **Volgende stap:** R-06 met extra onafhankelijke bronnen toetsen en daarna de oudste/zwakste ideeën snoeien in plaats van nieuwe scope toe te voegen.

### 2026-09-09 — vierde pass, vervolg: edge-to-edge

- **Gedaan:** de actuele Android-richtlijnen voor edge-to-edge, system bars, display cutouts en insets naast de bestaande Compose-layoutregels gelegd.
- **Nieuwe ontwerpregel:** achtergronden mogen de volledige window benutten, maar belangrijke tekst en interacties moeten tegen actuele runtime-insets worden beschermd; 24dp vaste systeemmaten zijn geen contract.
- **Verwerkt:** ontwerpregel 10 en het bijbehorende documentatiegat toegevoegd.
- **Bewust niet gedaan:** geen code, screenshots, mockups of `design.md`-wijzigingen; alleen het onderzoekscontract is bijgewerkt.
- **Volgende stap:** testmatrix voor smalle telefoon, toetsenbord, cutout en beide navigatiemodi als ontwerpcheck uitschrijven wanneer de Android-specificatie wordt aangevuld.

### 2026-09-09 — vijfde pass: reread-integriteit, series en bevestigingen

- **Gedaan:** recente StoryGraph-discussies over een verdwenen oorspronkelijke review na een DNF-reread en over rating van DNF’s gelezen; serievolgorde- en rereadsignalen uit r/fantasybooks, r/books en r/boeken bekeken; Android-richtlijn voor dialogen en bevestigde acties geraadpleegd.
- **Nieuwe signalen:** historische leesperioden moeten append-only aanvoelen; DNF-rating heeft geen consensus; serievolgorde is een aparte terugvindtaak; destructieve acties moeten hun concrete gevolgen tonen.
- **Verwerkt:** R-06 uitgebreid met rating- en verwijdersemantiek, R-11 als P1-onderzoek toegevoegd, R-08 afgestemd op leesperioden en ontwerpregel 11 toegevoegd.
- **Bewust niet gedaan:** geen code, schermen, mockups, design.md-wijzigingen, automatische serie-uitbreiding, release-notificaties of sociale functies toegevoegd.
- **Volgende stap:** R-06 en R-11 toetsen met meer onafhankelijke bronnen en daarna oudste/zwakste ideeën snoeien in plaats van de scope verder op te rekken.

### 2026-09-09 — zesde pass: feedbackpatroon en backlog-snoei

- **Gedaan:** de bestaande reread-, DNF- en seriebronnen opnieuw naast elkaar gelegd; de actuele Android-richtlijn voor Snackbars gecontroleerd; gezocht naar nieuwe onafhankelijke bevestiging van quote-reflectierelaties.
- **Nieuwe signalen:** een korte Snackbar kan een geslaagde lokale write, offline-status of echte Undo-route bevestigen; R-10 kreeg in deze sweep geen tweede concreet signaal.
- **Verwerkt:** R-09 aangevuld met een voorwaardelijke Undo-route, ontwerpregel 12 en het bijbehorende documentatiegat toegevoegd, en R-10 van P1 naar P2 verplaatst.
- **Bewust niet gedaan:** geen code, schermen, mockups, design.md-wijzigingen, automatische DNF-rating, serie-uitbreiding, release-notificaties of nieuwe vaste status toegevoegd.
- **Volgende stap:** nieuwe signalen buiten de bestaande StoryGraph-steekproef zoeken; R-06, R-07 en R-11 scherp houden; R-10 alleen heropenen bij nieuw bewijs.

### 2026-09-09 — zevende pass: capture buiten de leessessie

- **Gedaan:** recente r/kobo-discussies over snel boekideeën bewaren en centrale annotaties bekeken; een recente r/ObsidianMD-workflowdiscussie gelezen over ruwe capture, paginalocatie en latere synthese.
- **Nieuwe signalen:** een boekidee ontstaat geregeld buiten het leesapparaat; lezen/noteren en later verwerken zijn verschillende tempo’s; annotaties moeten onafhankelijk van een teruggegeven boek opnieuw vindbaar blijven.
- **Verwerkt:** R-05 aangevuld met een duidelijk gemarkeerd voorlopig `Snel parkeren`-item, R-03 aangescherpt met capture-versus-verwerken, en R-04 uitgebreid met centrale annotatieterugwinning.
- **Bewust niet gedaan:** geen nieuw statusmodel, readerfunctie, e-readerintegratie, kleurcodering, widget, sociale laag of wijziging aan design.md toegevoegd.
- **Volgende stap:** snel parkeren en capture-versus-verwerken met onafhankelijke bronnen toetsen; vooral letten op de grens tussen nuttige tijdelijke opslag en een tweede, verborgen inbox.

### 2026-09-09 — achtste pass: fysieke collectie en cameragrens

- **Gedaan:** een recente r/HomeLibraries-discussie over batch-scanning en fysieke collectie-invoer gelezen; actuele Android-richtlijnen voor camera- en runtime-permissions gecontroleerd.
- **Nieuwe signalen:** batch-scan kan nuttig zijn bij een grote fysieke collectie, maar een leesarchief is niet automatisch een bezit-/leeninventaris; camera-toegang moet altijd aan een expliciete actie gekoppeld zijn.
- **Verwerkt:** barcode-/camerascanning als P2-idee bij R-09 geparkeerd, de handmatige fallback en controle vóór toevoegen vastgelegd, en de permission-grens als documentatiepunt toegevoegd.
- **Bewust niet gedaan:** geen camera, scanner, bezit-/leenvelden, automatische ISBN-koppeling of wijziging aan design.md toegevoegd.
- **Volgende stap:** snel parkeren en capture-versus-verwerken met onafhankelijke bronnen toetsen; barcode-scan alleen heroverwegen bij duidelijke schaalpijn in de eigen collectie.

### 2026-09-09 — negende pass: meerdere lopende boeken en terugkeercontext

- **Gedaan:** drie recente Reddit-discussies over parallel lezen, verschillende leesformats en leesrotaties naast de bestaande R-03-gedachte gelegd.
- **Nieuwe signalen:** meerdere `Bezig`-boeken zijn een terugkerend gebruikspatroon, vaak gekoppeld aan plek, medium of stemming; de gewenste omvang verschilt sterk en te veel keuzes kunnen overzicht kosten.
- **Verwerkt:** R-03 verbreed naar één primaire terugkeeractie met maximaal drie zichtbare kaarten; de drie bestaande statussen, volledige Bibliotheek en statusfilter blijven intact. De nieuwe uitbreiding is middel-confidence, niet automatisch bouwscope.
- **Bewust niet gedaan:** geen nieuw statusmodel, harde limiet op actieve boeken, automatische samenvatting, sessietimer, widget, notificatie of wijziging aan design.md toegevoegd.
- **Volgende stap:** eerstehands of trackerreview-bewijs zoeken voor de precieze terugkeerweergave en tegelijk de nog ongetoetste capture-/parkeerhypotheses bewaken.

### 2026-09-09 — tiende pass: hervatten zonder extra taak en herstel van metadata

- **Gedaan:** recente r/ereader- en r/boeken-discussies over hervatten na een pauze, minimale voortgangsweergave, Nederlandse catalogusdekking en herstel van status/importdata gelezen; de actuele Bookmory-vermelding gecontroleerd.
- **Nieuwe signalen:** lezers willen soms belangrijke eigen context naast pagina/voortgang, maar zonder extra administratie; verkeerde statuskeuzes, datums en imports kunnen tot onnodig verwijderen of dubbele trackers leiden.
- **Verwerkt:** R-03 aangevuld met een lage-confidence `lichte hervatcontext`-hypothese; R-02, R-06, R-07 en R-09 aangescherpt rond corrigeren, behouden en importconflicten. De bestaande drie statussen en local-only grens blijven intact.
- **Bewust niet gedaan:** geen AI-recap, audio-/tijdvoortgang, account, cloudsync, nieuwe status, sociale laag of wijziging aan design.md toegevoegd.
- **Volgende stap:** eerstehands of trackerreview-bewijs zoeken voor de precieze hervatcontext en de herstelinteractie; geen aparte feature prioriteren op basis van de verwijderde discussie alleen.

### 2026-09-09 — elfde pass: app-store-breekpunten en lokale navigatie

- **Gedaan:** recente Google Play-reviews van Bookly en Bookshelf naast de actuele Bookmory-release notes gelegd; gelet op toestelwissel, absolute paginainvoer, grote collecties en commerciële frictie.
- **Nieuwe signalen:** verlies van logs of audioboekdata bij migratie, behoefte aan direct invoeren van de huidige pagina en een lage-confidence vraag naar letter-navigatie bij grote bibliotheken; reviewprompts en advertenties onderbreken zoeken.
- **Verwerkt:** R-01 kreeg een schaalafhankelijke letterindex-hypothese; R-02 en R-03 zijn aangescherpt rond zichtbare restore en absolute voortgang. Niet-ondersteunde importvelden zijn als toekomstig preview-/waarschuwingspunt vastgelegd.
- **Bewust niet gedaan:** geen audiofunctie, account, cloudsync, advertenties, reviewprompts, letterindex als vaste scope, code of wijziging aan design.md toegevoegd.
- **Volgende stap:** dezelfde breekpunten bij andere trackers en eerstehands bronnen toetsen; daarna de hervatcontext en herstelinteractie verder vernauwen.

### 2026-09-09 — twaalfde pass: terugkeer buiten de app en eigenaarschap

- **Gedaan:** een nieuwe r/ReadingSuggestions-discussie over lees-trackers en widgetvoorkeuren gelezen; onafhankelijke r/ereader- en r/ebooks-context over homescreen-terugkeer vergeleken; de dataverlies-anekdote eruit gehaald; officiële Android-richtlijnen voor glanceable en responsieve widgets gecontroleerd.
- **Nieuwe signalen:** een homescreen-widget is voor één trackerlezer een aantrekkelijke snelkoppeling en blijft in readercontext soms een doorslaggevende reden om een app te gebruiken, maar directe tracker-evidence op Android ontbreekt; verdwenen leesinformatie bevestigt opnieuw dat eigen data niet aan een dienst of toestel mag vastzitten.
- **Verwerkt:** R-12 als geparkeerde Android-widgethypothese toegevoegd; R-02 aangescherpt met onafhankelijk eigenaarschapsbewijs; widgetrandvoorwaarden beperkt tot titel, pagina/totaal en deep link; de confidence van R-12 bewust laag gehouden omdat reader- en trackercontext niet hetzelfde zijn.
- **Bewust niet gedaan:** geen widget gebouwd, geen notificaties, timer, statistieken, integraties, cloudsync of wijziging aan design.md toegevoegd.
- **Volgende stap:** directe Android-tracker-evidence zoeken en eerst R-03 in de appcontext valideren voordat R-12 hoger komt.

### 2026-09-09 — dertiende pass: catalogusuitval en minimale leesgeschiedenis

- **Gedaan:** recente Google Play-pagina’s van Bookfolks, ReadList, Reading Tracker & Page Counter en PagePath gelezen; DNF-, handmatige-invoer-, absolute-pagina- en notitiezoeksignalen vergeleken.
- **Nieuwe signalen:** een ontbrekend catalogusrecord kan een tracker onbruikbaar maken; concurrenten combineren exacte pagina met een korte eigen terugkeerhint; DNF met reden wordt gevraagd zonder dat een vierde status nodig is.
- **Verwerkt:** R-03, R-04, R-06 en R-07 aangescherpt; handmatige `geen resultaat`-invoer en centrale notitiezoeking als expliciete productkeuzes vastgelegd.
- **Bewust niet gedaan:** geen vierde status, aparte DNF-inbox, scanner, timer, tweede zoekingang, code of wijziging aan design.md toegevoegd.
- **Volgende stap:** directe Android-trackerreviews buiten ReadList zoeken en de `geen resultaat`-/DNF-ervaring alleen hoger prioriteren bij herhaling.

### 2026-09-12 — veertiende pass: boekenlijstmodus, leesniveaus en widget

- **Gedaan:** de officiële informatie van [Lezen voor de lijst](https://www.lezenvoordelijst.nl/voor-mediatheken-bibliotheken/lezen/), [Werken met niveaus](https://lezenvoordelijst.nl/docenteninformatie/werken-met-niveaus/), de 15–19-niveaukaart en de Android-richtlijnen voor [app widgets](https://developer.android.com/develop/ui/views/appwidgets/overview?authuser=0000) en [Glance/widgets](https://developer.android.com/develop/ui/compose/glance/create-app-widget/) naast de huidige app gelegd. Voor de visuele richting zijn Mobbin-referenties bekeken voor een verzadigde dark-mode bibliotheek, waaronder [Life Reset](https://mobbin.com/screens/c68ed0a3-309b-4e13-acfa-44f65e4246c1) en [Matter](https://mobbin.com/screens/e67d58bb-292d-4cfc-af54-ddb45124a44b).
- **Nieuwe signalen:** Lezen voor de lijst werkt met niveaus S en N1–N6; de genoemde basisnormen zijn minimaal N2 voor onderbouw/vmbo, N3 voor havo 5 en N4 voor vwo 6, met respectievelijk N4 en N5 als streefniveau voor havo 5 en vwo 6. De bron waarschuwt dat niveau niet één-op-één aan een leerjaar hangt en dat een nieuwe aanpak voor 2026/27 in ontwikkeling is. Android-widgets zijn bedoeld als glanceable snack met beperkte interactie, snelle navigatie en ondersteuning voor verschillende groottes.
- **Verwerkt:** R-13 toegevoegd voor een lokale `Lezen voor de lijst`-modus met profiel, instelbaar aantal boeken, lijstlidmaatschap, status/reflectie-checklist, handmatig vastgelegd S/N-niveau en expliciet advieslabel. De niveaucheck inferreert niets uit pagina-aantal; onbekend blijft onbekend en de gebruiker ziet altijd dat docentcontrole leidend is. R-14 breidt de bestaande widget uit met actieve titel/pagina, boekenlijstteller en deep link naar de lijstmodus. R-15 voegt een gegenereerd open-book launcher-logo toe zonder de bestaande donkere app-shell te mengen met een lichte variant.
- **Bewust niet gedaan:** geen officiële automatische slagingsbeslissing, automatische boekclassificatie, verborgen catalogusclaim, docentaccount, cloud-dataset, Glance-migratie of tweede concurrerende widget toegevoegd. De huidige klassieke RemoteViews-widget blijft passend voor de bestaande native implementatie en is inhoudelijk beperkt gehouden voor het glanceable gebruik.
- **Volgende stap:** build/lint/APK, emulator-smoke van de lijstmodus en widget, persist/export/reset-controle en visuele controle op een echte Android-render. Daarna alleen uitbreiden met schoolregels die de gebruiker of docent zelf kan onderbouwen.

### 2026-09-18 — vijftiende pass: capture buiten de app, contextnavigatie en toegankelijkheid

- **Gedaan:** recente Reddit-discussies over trackerkeuze, externe TBR-capture, series, accessibility en reading journals gelezen; actuele Android-documentatie voor share targets, SearchBar en list-detail-layouts gecontroleerd.
- **Nieuwe signalen:** boekideeën ontstaan buiten de app en verdwijnen in losse notities; automatische tracking vermindert vergeten invoer maar botst met local-only; serie-/auteursmetadata moet navigeerbaar zijn; eenvoudige, gelabelde UI is voor screenreadergebruikers een harde voorwaarde; een lichte Journal-capture kan genoeg zijn.
- **Verwerkt:** R-01, R-03, R-05 en R-11 aangescherpt; Android-share-target, zichtbare lokale zoekingang en componentgerichte accessibility-criteria toegevoegd; R-13 t/m R-15 uit de vorige log nu als backlog-/scope-items gedocumenteerd, waarbij R-15 expliciet geen productfeature is.
- **Bewust niet gedaan:** geen automatische readerintegratie, cloudsync, widgetuitbreiding, sociale laag, niveau-inferentie, mockup, code of wijziging aan design.md toegevoegd.
- **Volgende stap:** herhaling zoeken in directe Android-trackerreviews en Nederlandstalige lezersbronnen; pas daarna bepalen of externe capture of seriecontext boven de huidige P1-volgorde komt.

### 2026-10-12 — zestiende pass: directe pagina-invoer en rustige Android-UX

- **Gedaan:** nieuwe Reddit-signalen gelezen over een sobere bibliotheek, eigen context na een leesonderbreking en een actuele Android-tracker-test; actuele Android-documentatie gecontroleerd voor Compose semantics, focus targets, IME/insets en list-detail.
- **Nieuwe signalen:** een simpele boekenlijst zonder challenges/statistieken is voor sommige lezers het hele doel; willekeurige notities en screenshots helpen onvoldoende bij hervatten; een paginaladder en door de IME bedekte opslagknop maken directe voortgang onbruikbaar.
- **Verwerkt:** de P0-basis van R-03 aangescherpt met absolute paginainvoer of `Vul tot pagina`, toetsenbordbereikbaarheid, foutfeedback en consistente percentageweergave; de bestaande lichte hervatcontext bevestigd zonder character-database of automatische recap. Android-regels 16–17 en de bijbehorende documentatiegaten toegevoegd.
- **Bias en confidence:** de Android-testfeedback is laag-middel voor de precieze control door de tester-/ontwikkelaarssteekproef; de IME-, semantics- en focusregels zijn hoog als platformrichtlijn. De sobere bibliotheek- en hervatvragen blijven Reddit-signalen, geen brede marktschatting.
- **Bewust niet gedaan:** geen appcode, design.md, mockup, readerintegratie, cloudsync, sociale laag, statistiekdashboard, automatische samenvatting of extra status toegevoegd.
- **Volgende stap:** directe Android-trackerreviews en Nederlandstalige bronnen blijven toetsen; kijk vooral of de page-jump/IME-foutpatronen en de voorkeur voor minimale lokale archieven onafhankelijk terugkomen.

## 9. Onderhoudsritme

Deze onderzoeksloop draait zelfstandig wekelijks op maandagochtend in dezelfde Codex-taak. Een run:

- leest eerst de projectgrenzen en dit bestand;
- voegt alleen nieuwe, onderbouwde signalen of duidelijke QOL-ideeën toe;
- snoeit dubbele of zwakke ideeën;
- wijzigt alleen dit onderzoeksbestand;
- blijft stil als er geen betekenisvolle nieuwe informatie of prioriteitswijziging is.

Een wijziging aan [design.md](design.md) blijft een expliciete open beslissing; de loop voert die niet automatisch door.

## Bronnen

- [Reddit — Alternative to GoodReads?](https://www.reddit.com/r/books/comments/1b4m6af/alternative_to_goodreads/)
- [Reddit — What would you look for in a reading tracker app?](https://www.reddit.com/r/androidapps/comments/i7ftae/what_would_you_look_for_in_a_reading_tracker_app/)
- [Reddit — Best book trackers that are not Goodreads?](https://www.reddit.com/r/books/comments/1fpywe1/best_book_trackers_that_are_not_goodreads/)
- [Reddit — Best Apps for Books](https://www.reddit.com/r/books/comments/13jrguc/best_apps_for_books/)
- [Reddit — What features do you absolutely love or hate?](https://www.reddit.com/r/TheStoryGraph/comments/1vfyjyz/what-features-do-you-absolutely-love-or-hate/)
- [Reddit — Site Tutorial?](https://www.reddit.com/r/TheStoryGraph/comments/y0pyjp/site_tutorial/)
- [Reddit — E-book reader with highlights/annotations export feature?](https://www.reddit.com/r/fossdroid/comments/1temdmp/ebook_reader_with_highlightsannotations_export/)
- [Reddit — Exporting](https://www.reddit.com/r/goodreads/comments/1vfqen4/exporting/)
- [Reddit — Accidentally deleted all books](https://www.reddit.com/r/goodreads/comments/1w057ny/accidentally_deleted_all_books_no_help_from/)
- [Google Play — Bookmory](https://play.google.com/store/apps/details?id=net.tonysoft.bookmory)
- [Google Play — The StoryGraph](https://play.google.com/store/apps/details?id=com.thestorygraph.thestorygraph)
- [Google Play — Bookly](https://play.google.com/store/apps/details?hl=en-US&id=com.twodoor.bookly)
- [Google Play — Bookshelf](https://play.google.com/store/apps/details/Bookshelf_Your_virtual_library?hl=en_GB&id=com.bookshelf.prod)
- [Google Play — Bookfolks](https://play.google.com/store/apps/details?hl=en_NZ&id=com.dailyreading.club)
- [Google Play — ReadList](https://play.google.com/store/apps/details?hl=en&id=com.booktracker.readlist)
- [Google Play — Reading Tracker & Page Counter](https://play.google.com/store/apps/details?id=com.tenline.readingtracker)
- [Google Play — PagePath](https://play.google.com/store/apps/details?id=com.kindredview.pagepath)
- [Google Play — Bookshelf, letter-navigatie-review](https://play.google.com/store/apps/details?hl=pt_PT&id=com.bookshelf.prod)
- [Reddit — Goodreads? (r/boeken)](https://www.reddit.com/r/boeken/comments/1un0iwq/goodreads/)
- [Reddit — Een soort IMDb-app voor boeken? (r/boeken)](https://www.reddit.com/r/boeken/comments/1ui73sz/een_soort_van_imdbapp_voor_boeken/)
- [Reddit — Highlights uit e-boeken organiseren (r/boeken)](https://www.reddit.com/r/boeken/comments/1l37zag/ik_heb_een_tool_gemaakt_om_highlights_uit_eboeken_te_organiseren/)
- [Reddit — Veel boeken op de TBR, waar begin ik? (r/boeken)](https://www.reddit.com/r/boeken/comments/1w7xbmo/ik_heb_zoveel_boeken_die_ik_wil_lezen_waar_begin/)
- [Reddit — Highlighting that will save across platforms (r/ereader)](https://www.reddit.com/r/ereader/comments/1w9e9j8/highlighting_that_will_save_across_platforms/)
- [Reddit — April 2026 UX Feedback & Feature Improvements (r/Onyx_Boox)](https://www.reddit.com/r/Onyx_Boox/comments/1sk6uip/april_2026_megathread_ux_feedback_feature/)
- [Reddit — Sync progress between different e-readers (r/ereader)](https://www.reddit.com/r/ereader/comments/1v6zahw/is_there_any_sensible_way_to_sync_progress/)
- [Reddit — How does note taking work? (r/ereader)](https://www.reddit.com/r/ereader/comments/1u4dhe5/how_does_note_taking_work/)
- [Reddit — Book tracker/goal app?? (r/books)](https://www.reddit.com/r/books/comments/1018rvu/book_tracker_goal_app/)
- [Reddit — Weekly FAQ: Do you keep track of the books you read? (r/books)](https://www.reddit.com/r/books/comments/1tfl7ep/weekly_faq_thread_may_17_2026_do_you_keep_track/)
- [Reddit — Model for exporting books with notes (r/kobo)](https://www.reddit.com/r/kobo/comments/1v5l9ro/model_for_exporting_books_with_notes/)
- [Reddit — In need of transferable Android-based reading software (r/ereader)](https://www.reddit.com/r/ereader/comments/1odbgmq/in_need_of_transferable_android_based_reading/)
- [Reddit — Superior Rereading Tracking (r/TheStoryGraph)](https://www.reddit.com/r/TheStoryGraph/comments/1r6h3ts/superior_rereading_tracking/)
- [Reddit — Profile redesign and DNF feedback (r/TheStoryGraph)](https://www.reddit.com/r/TheStoryGraph/comments/1o699hl/does_anyone_else_really_love_the_new_profile/)
- [Reddit — Book tracking apps (r/books)](https://www.reddit.com/r/books/comments/1k3hgg9/book_tracking_apps/)
- [Reddit — Reading tracker and discovery (r/Romantasy)](https://www.reddit.com/r/Romantasy/comments/1w9rfpd/what_app_do_you_use_to_track_your_reading_and/)
- [Reddit — Did a reread, DNF’ed the reread and now my original review is gone? (r/TheStoryGraph)](https://www.reddit.com/r/TheStoryGraph/comments/1u2vy6i/did_a_reread_dnfed_the_reread_and_now_my_original/)
- [Reddit — Unrated DNFs (r/TheStoryGraph)](https://www.reddit.com/r/TheStoryGraph/comments/1s9fdfd/unrated_dnfs/)
- [Reddit — How do you keep track of book series you are reading? (r/fantasybooks)](https://www.reddit.com/r/fantasybooks/comments/1o931hq/how_do_you_keep_track_of_book_series_you_are/)
- [Reddit — Weekly FAQ: Do you keep track of the books you read? (r/books)](https://www.reddit.com/r/books/comments/1pgfr8j/weekly_faq_thread_december_07_2025_do_you_keep/)
- [Reddit — Welk boek herlees jij vaker? (r/boeken)](https://www.reddit.com/r/boeken/comments/1w4cn6s/welk_boek_herlees_jij_vaker/)
- [Reddit — Best place for tracking books you read and want to read? (r/kobo)](https://www.reddit.com/r/kobo/comments/1qc1sl7/best_place_for_tracking_books_you_read_and_want/)
- [Reddit — How do you take notes for physical books? (r/ObsidianMD)](https://www.reddit.com/r/ObsidianMD/comments/1tsq8d6/how_do_you_take_notes_for_physical_books_in/)
- [Reddit — What Kobo features would you like to see?](https://www.reddit.com/r/kobo/comments/1toi2z3/what_kobo_features_would_you_like_to_see/)
- [Reddit — What do you use to catalog your collection? (r/HomeLibraries)](https://www.reddit.com/r/HomeLibraries/comments/1q6q8kb/what_do_you_use_to_catalog_your_collection_if_you/)
- [Reddit — Reading multiple books at once? (r/Booktokreddit)](https://www.reddit.com/r/Booktokreddit/comments/1q3gm0z/reading_multiple_books_at_once/)
- [Reddit — Multiple Books? (r/ReadingSuggestions)](https://www.reddit.com/r/ReadingSuggestions/comments/1qxtd45/multiple_books/)
- [Reddit — How many books do you read at a time? (r/books)](https://www.reddit.com/r/books/comments/1t93u9v/weekly_faq_thread_may_10_2026_how_many_books_do/)
- [Reddit — What are the best free book tracking apps for staying consistent with reading? (r/ereader)](https://www.reddit.com/r/ereader/comments/1w9qdwx/what_are_the_best_free_book_tracking_apps_for/)
- [Reddit — Are you using any type of “Reading Journal”? (r/ereader)](https://www.reddit.com/r/ereader/comments/1w32df7/are_you_using_any_type_of_reading_journal/)
- [Reddit — Verwijderde trackerfeedback (r/boeken)](https://www.reddit.com/r/boeken/comments/1sk6k73/removed_by_moderator/)
- [Reddit — Wie zit er ook op Goodreads? (r/boeken)](https://www.reddit.com/r/boeken/comments/1w39wwi/wie_zit_er_ook_op_goodreads/)
- [Reddit — What app do you use to keep track of the books you've read? (r/ReadingSuggestions)](https://www.reddit.com/r/ReadingSuggestions/comments/1w0z6yn/what_app_do_you_use_to_keep_track_of_the_books/)
- [Reddit — Ereader Widget? (r/ereader)](https://www.reddit.com/r/ereader/comments/1qz6qxx/ereader_widget/)
- [Reddit — ereading apps with bookshelves? (r/ebooks)](https://www.reddit.com/r/ebooks/comments/1w5i0n7/ereading_apps_with_bookshelves/)
- [Reddit — Looking for a to-read tracker/app (r/selfhosted)](https://www.reddit.com/r/selfhosted/comments/1s0m42y/looking_for_a_toread_trackerapp/)
- [Reddit — What do you like most about book tracking apps? (r/Booktokreddit)](https://www.reddit.com/r/Booktokreddit/comments/1w65g8b/what_is_it_that_you_like_the_most_about_book/)
- [Reddit — A minimalist reading tracker (r/Booktokreddit)](https://www.reddit.com/r/Booktokreddit/comments/1ubmsb3/a_minimalist_reading_tracker_for_people_who_just/)
- [Reddit — Book tracking apps? (r/Booktokreddit)](https://www.reddit.com/r/Booktokreddit/comments/1upkuge/book_tracking_apps/)
- [Reddit — Are you using any type of “Reading Journal”? (r/kindle)](https://www.reddit.com/r/kindle/comments/1w32ftl/are_you_using_any_type_of_reading_journal/)
- [Reddit — Looking for a simple Bookshelf or Book Tracker App (r/ebooks)](https://www.reddit.com/r/ebooks/comments/1wlj9s9/looking_for_a_simple_bookshelf_or_book_tracker_app/)
- [Reddit — Is there a good book reading tracker app that helps you keep track of characters and details? (r/ebooks)](https://www.reddit.com/r/ebooks/comments/1wgyihb/is_there_a_good_book_reading_tracker_app_that/)
- [Reddit — I Need Testers for my Reader Tracker (r/TestersCommunity)](https://www.reddit.com/r/TestersCommunity/comments/1x3rylm/i_need_testers_for_my_reader_tracker_a_clean_book/)
- [Android — Mobile UI design](https://developer.android.com/design/ui/mobile)
- [Android — Material 3 in Compose](https://developer.android.com/develop/ui/compose/designsystems/material3)
- [Android — Accessibility in Jetpack Compose](https://developer.android.com/develop/ui/compose/accessibility)
- [Android — Get started with adaptive apps](https://developer.android.com/develop/ui/compose/layouts/adaptive)
- [Android — Save UI state in Compose](https://developer.android.com/develop/ui/compose/state-saving?hl=en)
- [Android — Build an offline-first app](https://developer.android.com/topic/architecture/data-layer/offline-first?hl=en)
- [Android — Activity state changes](https://developer.android.com/guide/components/activities/state-changes)
- [Android — Compose API defaults and touch targets](https://developer.android.com/develop/ui/compose/accessibility/api-defaults?hl=en)
- [Android — Edge-to-edge design](https://developer.android.com/design/ui/mobile/guides/layout-and-content/edge-to-edge)
- [Android — About window insets](https://developer.android.com/develop/ui/compose/system/insets)
- [Android — Display pop-up messages or requests for user input](https://developer.android.com/develop/ui/compose/quick-guides/content/display-user-input?hl=en)
- [Android — Snackbar](https://developer.android.com/develop/ui/compose/components/snackbar)
- [Android — App widgets overview](https://developer.android.com/develop/ui/views/appwidgets/overview?authuser=0000)
- [Android — Create an app widget with Glance](https://developer.android.com/develop/ui/compose/glance/create-app-widget)
- [Android — Request runtime permissions](https://developer.android.com/training/permissions/requesting)
- [Android — Receive simple data from other apps](https://developer.android.com/develop/ui/compose/sharing/receive)
- [Android — Compose SearchBar](https://developer.android.com/develop/ui/compose/components/search-bar?hl=en)
- [Android — Common mobile layouts](https://developer.android.com/design/ui/mobile/guides/layout-and-content/common-layouts?hl=en)
- [Android — Compose semantics](https://developer.android.com/develop/ui/compose/accessibility/semantics?hl=en)
- [Android — Focus targets](https://developer.android.com/develop/ui/compose/touch-input/focus/focus-target)
- [Android — Set up window insets](https://developer.android.com/develop/ui/compose/system/insets-ui)
- [Android — Use keyboard IME animations](https://developer.android.com/develop/ui/compose/system/keyboard-animations?hl=en)
- [Android — Build a list-detail layout](https://developer.android.com/develop/adaptive-apps/guides/list-detail)
- [Lezen voor de lijst — Lezen](https://www.lezenvoordelijst.nl/voor-mediatheken-bibliotheken/lezen/)
- [Lezen voor de lijst — Werken met niveaus](https://lezenvoordelijst.nl/docenteninformatie/werken-met-niveaus/)
- [Lezen voor de lijst — niveaus 15–19](https://www.lezenvoordelijst.nl/media/660277/pdf_leesniveaus15tm19.pdf)
- [Lezen voor de lijst — niveaus 12–15](https://www.lezenvoordelijst.nl/media/660274/pdf_leesniveaus_12tm15.pdf)
- [Mobbin — Life Reset screen reference](https://mobbin.com/screens/c68ed0a3-309b-4e13-acfa-44f65e4246c1)
- [Mobbin — Matter screen reference](https://mobbin.com/screens/e67d58bb-292d-4cfc-af54-ddb45124a44b)
