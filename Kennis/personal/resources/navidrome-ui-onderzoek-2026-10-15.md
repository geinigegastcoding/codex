# Navidrome frontend: onderzoek en vijf designrichtingen

Datum: 15 oktober 2026. Status: onderzoek en beeldconcepten, geen gebouwde app.

Update: de gebruiker heeft inmiddels **Android, playlists, sterke offline ondersteuning, klankmatching en mp3-import vanaf de telefoon** bevestigd. De tijdelijke desktopaanname hieronder is vervallen. Zie het [actuele Android-onderzoek](<C:/Users/Daniël/Desktop/Codex/Kennis/personal/resources/navidrome-android-ui-onderzoek-2026-10-15.md>); de eerdere desktopbeelden blijven als verkenning bewaard.

## Brief en onzekerheden

Een persoonlijke frontend voor een eigen Navidrome-muziekcollectie. Eerst functies en interactiepatronen onderzoeken, daarna vijf onafhankelijke UI-beelden maken. De platformvraag en luistervoorkeuren zijn aan de gebruiker gesteld. Tot antwoord geldt de expliciet gemelde werkhypothese: desktop/web, Nederlandse bediening, fictieve artiesten en albums. De lokale Navidrome-versie, bibliotheekomvang en plugins zijn onbekend. Er is geen Navidrome-project aangetroffen in `projecten/` en geen relevante bestaande context gevonden in `Kennis/`. Er is geen project aangemaakt en geen andere projecthuisstijl gebruikt.

## Belangrijkste conclusie

De kans ligt bij prettig luisteren naar muziek die je al bezit: snel iets vinden, bewust een album kiezen, een wachtrij begrijpen en de eigen collectie opnieuw ontdekken. De interface moet duidelijk maken wat meteen gaat spelen en wat pas later volgt. Grote covers helpen bij oriënteren; compacte lijsten helpen bij gericht zoeken en samenstellen. Die twee behoeften verdienen verschillende weergaven, geen overvloed aan vaste panelen. De vijf beelden onderzoeken daarom ook verschillende primaire taken. Ze vormen geen volledige schermenset en bewijzen nog geen interactie, toegankelijkheid of audiokwaliteit.

## Functies en haalbaarheid

| Prioriteit | Functie | Ontwerpbesluit en praktische grens |
|---|---|---|
| Basis | Albums, artiesten, nummers, genres | Duidelijke bibliotheek; wisselen tussen covers en lijst. |
| Basis | Eén zoekingang | Resultaten groeperen per type; aparte zoekopdracht binnen een lijst herkenbaar houden. |
| Basis | Vaste speler | Vorige, pauze, volgende, scrubben, verstreken/totale tijd, volume en wachtrij bereikbaar tijdens bladeren. |
| Basis | Wachtrij | Afspelen, speel hierna en voeg achteraan toe afzonderlijk benoemen; volgorde aanpassen, verwijderen en herstellen. Dit zijn voorgestelde clientinteracties. |
| Basis | Playlists | Maken, hernoemen, nummers toevoegen/verwijderen en volgorde aanpassen; eigenaarschap en alleen-lezenstatus respecteren. |
| Basis | Favorieten | Eén eenvoudige hartactie; ratings alleen prominent maken als de gebruiker die echt gebruikt. |
| Basis | Weer verder luisteren | Positie en wachtrij herstellen; geen automatische start beloven na een browserherstart. |
| Basis | Herontdekken | Recent toegevoegd, recent afgespeeld, favorieten en willekeurige selectie uit eigen muziek. |
| Verdieping | Lyrics | Tonen als de server tekst levert; synchronisatie alleen met timinggegevens. |
| Verdieping | Smart playlists afspelen | Serverregels kunnen dynamische lijsten leveren; de editor is een afzonderlijke integratiekeuze. |
| Verdieping | Meerdere bibliotheken | Selector tonen wanneer er werkelijk meerdere toegankelijke bibliotheken zijn. |
| Verdieping | Albumversies en credits | Meerdere artiesten, compilaties en meerdere discs leesbaar houden; metadata niet door de frontend laten verzinnen. |
| Verdieping | Scrobbling | Aansluiten op serverinstellingen; geen dubbele afspeelregistraties veroorzaken. |
| Afhankelijk | Offline luisteren | Downloaden is niet hetzelfde als offline afspelen; vraagt lokale opslag, status, ruimtebeheer en een passende runtime. |
| Afhankelijk | Gapless, ReplayGain, EQ | Afhankelijk van afspeelbackend, browser en aanwezige tags; apart testen vóór een kwaliteitsclaim. |
| Afhankelijk | Cast, jukebox, apparaatwissel | Verschillende mechanismen; niet presenteren als een universele Connect-knop. |
| Later | Geavanceerde regels, sonic similarity | Alleen zinvol na bevestiging van behoefte en servermogelijkheden. |

De basis voor zoeken, playlists, favorieten, afspelen en downloaden staat in de [Navidrome API-compatibiliteitstabel](https://navidrome.org/docs/developers/subsonic-api/). Daar staat ook dat echte mapnavigatie geen gewone Navidrome-functie is en dat sommige vergelijkbare-muziekfuncties Last.fm vereisen. Daarom ontwerpen we geen bestandsbeheer of wereldwijde muziekwinkel.

Smart playlists zijn dynamische `.nsp`-regels. De [documentatie](https://navidrome.org/docs/usage/features/smart-playlists/) noemt de functie beta en verwijst voor een grafische editor naar Feishin. Een [recente featureaanvraag](https://github.com/navidrome/navidrome/issues/6073) laat zien dat een editor in de eigen Navidrome-webinterface nog een ontwikkelwens is. Een custom editor niet verwarren met iets dat iedere OpenSubsonic-server standaard aanbiedt.

[OpenSubsonic lyrics](https://opensubsonic.netlify.app/docs/extensions/songlyrics/) onderscheidt tekst per regel en uitgebreidere timing/taallagen. De frontend hoort de [door de server gemelde extensies](https://opensubsonic.netlify.app/docs/endpoints/getopensubsonicextensions/) te controleren. In de beelden gebruikte lyrics zijn zelfbedachte demonstratietekst, geen inhoud uit de bibliotheek van de gebruiker.

De [index-based queue-extensie](https://opensubsonic.netlify.app/docs/extensions/indexbasedqueue/) kan herhaalde nummers in een opgeslagen wachtrij eenduidig aanwijzen. Dat is iets anders dan continu apparaten op afstand bedienen. [Apparaatoverdracht](https://github.com/navidrome/navidrome/discussions/5154) is als aparte productwens besproken. De nieuwe [Navidrome API v1](https://navidrome.org/docs/developers/api-v1/) staat bovendien als work in progress beschreven; toekomstige integratie moet de daadwerkelijk geïnstalleerde server volgen.

## UX-problemen: bewijs en interpretatie

Dit is een gerichte deskresearch, geen representatieve gebruikerstest. Afzonderlijke issues tonen risico's en wensen; ze bewijzen geen frequentie onder alle gebruikers.

| Rang | Observatie en bron | Ernst / bewijskracht | Voorgestelde productkeuze |
|---|---|---|---|
| 1 | Een [zoekdiscussie](https://github.com/navidrome/navidrome/discussions/3555) vraagt expliciet om artiesten, albums en nummers samen te vinden. | Groot effect op vinden; directe maar beperkte gebruikersmelding. | Eén globale zoekingang, herkenbare resultaatgroepen, toetsenbordbediening en filters die behouden blijven. |
| 2 | Een [wachtrijbug in 0.61.1](https://github.com/navidrome/navidrome/issues/5331) beschrijft onverwacht herstarten na leegmaken; het issue is gesloten. | Playback onderbreken is ernstig; historisch voorbeeld, geen claim over huidige versies. | Queue-acties voorspelbaar definiëren; expliciet onderscheid tussen huidige track, handmatig volgende nummers en albumcontext. |
| 3 | Een [smart-playlistverzoek van september 2026](https://github.com/navidrome/navidrome/issues/6073) benoemt de drempel van handmatig JSON schrijven. | Middel; duidelijk verzoek, frequentie onbekend. | Smart lijsten kunnen afspelen; een visuele regeleditor als optionele verdieping beoordelen. |
| 4 | [Taggingrichtlijnen](https://navidrome.org/docs/usage/library/tagging/) verklaren albumgroepering en meerdere artiesten; de server leest bestandsmetadata. | Middel; sterke technische bron. | Albumartiest en trackartiest onderscheiden, compilaties en ontbrekende gegevens afhandelen; geen fictieve tag-editor tonen. |
| 5 | [Supersonic](https://github.com/supersonic-app/supersonic/blob/main/README.md) koppelt gapless aan MPV; [Feishin](https://github.com/jeffvli/feishin) onderscheidt desktop- en webbackend. | Groot voor audiofielen; sterke productdocumentatie. | Visuele kwaliteit niet verwarren met audiocapaciteiten; pas na runtimekeuze functies beloven. |

Ontwerpinferentie: een goede wachtrij en snel zoeken leveren waarschijnlijk meer dagelijkse waarde dan veel decoratieve homeblokken. Deze prioriteit moet later tegen de persoonlijke luistergewoontes worden getoetst.

## Mobbin: wat daadwerkelijk is bekeken

Acht schermpreviews bekeken uit vier gerichte zoekopdrachten. Vijf bruikbare bronnen als originele referentiebeelden lokaal opgeslagen. Het zijn productpatronen ter inspiratie, geen opdracht om een bestaand merk te kopiëren.

| Bron | Zichtbaar patroon | Meenemen | Bewust niet overnemen |
|---|---|---|---|
| [Spotify playlist, web](https://mobbin.com/screens/2fa96991-87fe-4f02-ad49-b5e961974bbe) | Bibliotheek links, playlist en tracklijst centraal, vaste speler onderaan. | Continuïteit tussen bladeren en luisteren. | Podcasts, commerciële homepage en apparaatclaims. |
| [Apple Music playlist, iOS](https://mobbin.com/screens/a426b1ab-57e7-411e-b4d5-1c3c7c366b60) | Grote cover, titel, play/shuffle en lijst; speler blijft beschikbaar. | Rustige hiërarchie, cover als herkenningspunt. | Telefoonvorm en het volledige mobiele navigatiemodel voor desktop. |
| [TIDAL album, web](https://mobbin.com/screens/3f5c3037-07b2-4921-9401-9ad7e24ca8d1) | Albumkop, één hoofdactie, tracks met artiest en duur, vaste speler. | Albumcontext en duidelijke huidige track. | Ongeteste kwaliteitsbadges en marketingnavigatie. |
| [TIDAL acties, web](https://mobbin.com/screens/76a11d4b-80e8-43d1-a396-fbea7f111285) | Contextmenu onderscheidt direct afspelen, hierna en playlist toevoegen. | Concrete werkwoorden voor de uitkomst van een actie. | Een stapeling van zwevende menu's in ieder concept. |
| [Spotify queue, iOS](https://mobbin.com/screens/05495a0a-5a18-4253-aaea-f88ba572826c) | Huidig nummer boven volgende nummers, zichtbare versleephandvatten. | Scheiding huidig/hierna en ordenen. | Een telefoon-sheet als vaste desktoplayout. |

## Structuur en cruciale flows

Voorgestelde hoofdingangen: Bibliotheek, Playlists en Favorieten; globale zoekingang en speler blijven bereikbaar. Albums, artiesten en nummers zijn weergaven binnen de bibliotheek. Instellingen blijven buiten de luistertaak. Een startpagina is alleen nuttig als zij aantoonbaar sneller naar muziek leidt.

Te valideren flows bij een latere bouw:

1. Zoek term → kies album/nummer → speel af → ga terug zonder scroll- of filterverlies.
2. Album kiezen → afspelen → ander nummer hierna zetten → wachtrij aanpassen zonder huidige track te onderbreken.
3. Nummers selecteren → bestaande/nieuwe playlist → bevestiging met direct herstel bij een fout.
4. Speler openen → lyrics bekijken indien beschikbaar → terug naar dezelfde bibliotheekpositie.
5. Server tijdelijk onbereikbaar → duidelijke status → opnieuw proberen, met wachtrij behouden waar mogelijk.

Acceptatie voor latere implementatie: belangrijke acties ook zonder hover of slepen; zichtbare toetsenbordfocus; voldoende contrast; leesbare volledige titel via detail/tooltip; informatieve lege, laad- en fouttoestanden. Ontwerpdoel: minimaal 14–16px lopende UI-tekst en ruime bedieningsdoelen. Een gegenereerd beeld bewijst die waarden niet.

## Vijf afzonderlijke richtingen

De conceptnamen zijn werktitels voor vergelijking, geen voorgestelde definitieve appnaam. Elk beeld toont één hoofdtaak; de overige functies blijven elders in de app.

| Richting | Primair scherm | Visueel systeem | Sterk voor / afweging |
|---|---|---|---|
| Platenkamer | Album openen en luisteren | Warm ivoor, inkt, baksteenrood; redactionele serifkop; horizontale navigatie. | Bewust hele albums luisteren; minder nummers tegelijk zichtbaar. |
| Nachtdienst | Geconcentreerd luisteren | Bijna zwart, warm albumlicht, groot artwork en lyrics; smalle navigatierail. | Sfeer en aandacht; bibliotheek ligt een stap verder. |
| Index | Gericht zoeken en bladeren | Helder wit, koele grijstinten, blauw; kolommen voor artiest, album en tracks. | Grote collectie en precisie; meer informatie op één scherm. |
| Mixtape | Playlist en wachtrij samenstellen | Aubergine, koraal, warme lichte queue; stevige grotesk en compacte trackrijen. | Actief kiezen wat volgt; de queue vraagt schermruimte. |
| Panorama | Visueel door albums bladeren | Saliegroen, bosgroene tekst, royale covergalerij en lage speler. | Herkennen aan artwork; metadata is secundair. |

Alle beelden: desktopdoel 1440 × 1024, Nederlandse bediening, originele fictieve covers/metadata, geen browservenster of telefoonframe. De referenties worden als echte beeldbestanden aan ImageGen meegegeven. Generatie via de ingebouwde ImageGen-tool; geen appcode of werkend prototype.

## Vervolg en verificatie

Eerst de vijf beelden visueel controleren op leesbaarheid, afsnijding, consistente spelerstatus, uitvoerbare functies en werkelijk verschillende composities. Daarna persoonlijke platformkeuze en luistergewoontes verwerken en één richting verfijnen. De schermen verschillen bewust in hoofdtaak; voor een strikte vergelijking kan later hetzelfde albumdetail in de gekozen richtingen worden uitgewerkt.

Open: primaire apparaten, bibliotheekomvang, Navidrome-versie, favoriete luisterapps, noodzaak van offline/lyrics, gewenste informatiedichtheid en definitieve beeldkeuze. Er is niets gebouwd, geïnstalleerd of gepubliceerd.

## Geleverde beelden en eindcontrole

De vijf onafhankelijke beelden zijn met ingebouwde ImageGen gegenereerd, opgeslagen en in de hoofdchat visueel bekeken. De onderstaande nummers volgen de daadwerkelijke weergavevolgorde in de chat.

| Nummer | Beeld | Werkelijke PNG-afmeting |
|---|---|---|
| 1 | [Nachtdienst](<C:/Users/Daniël/Desktop/Codex/screenshots/navidrome-ui-2026-10-15/nachtdienst.png>) | 1487 × 1058 |
| 2 | [Platenkamer](<C:/Users/Daniël/Desktop/Codex/screenshots/navidrome-ui-2026-10-15/platenkamer-v2.png>) | 1486 × 1059 |
| 3 | [Index](<C:/Users/Daniël/Desktop/Codex/screenshots/navidrome-ui-2026-10-15/index-v2.png>) | 1486 × 1059 |
| 4 | [Panorama](<C:/Users/Daniël/Desktop/Codex/screenshots/navidrome-ui-2026-10-15/panorama.png>) | 1487 × 1058 |
| 5 | [Mixtape](<C:/Users/Daniël/Desktop/Codex/screenshots/navidrome-ui-2026-10-15/mixtape-v2.png>) | 1488 × 1057 |

[Volledige generatieprompts](<C:/Users/Daniël/Desktop/Codex/screenshots/navidrome-ui-2026-10-15/prompts.json>) · [Manifest met exacte correctieprompts en bronbestanden](<C:/Users/Daniël/Desktop/Codex/screenshots/navidrome-ui-2026-10-15/manifest.json>) · [Bronnenregister](<C:/Users/Daniël/Desktop/Codex/screenshots/navidrome-ui-2026-10-15/references/sources.json>).

Geverifieerd: vijf leesbare, niet-lege PNG-bestanden; verschillende layouts en visuele systemen; huidige track en speeltijd herkenbaar. Twee tegenstrijdige afspeellabels en een verkeerde artiestselectie zijn via gerichte ImageGen-edits hersteld. De oorspronkelijke bestanden zijn behouden. De streefmaat was 1440 × 1024; de werkelijke maten staan hierboven. Er is niet bijgesneden of herschaald om die maat kunstmatig af te dwingen.

Bekende beeldbeperkingen: gedempte lyrics vragen nog contrastmeting; een kleine volgende-trackcover verschilt van de albumcover; de queue-bediening in Index staat krap tegen de rechterrand; de Panorama-covers zijn niet exact vierkant. In Mixtape staat een gegenereerde wachtrijduur van 18:13; de vier zichtbare trackduren tellen op tot **17:39**. Fictieve jaartallen en kleine artworkdetails verschillen tussen concepten. Deze details moeten bij verfijning worden vastgezet; de beelden zijn geen bewijs van correcte softwareberekeningen of toegankelijkheid.

Afgerond: onderzoek, vijf beelden, visuele controle en opslag. Open: persoonlijke voorkeur voor platform/luistergedrag en keuze van een richting om verder te verfijnen. Er is geen app gebouwd of gepubliceerd.

