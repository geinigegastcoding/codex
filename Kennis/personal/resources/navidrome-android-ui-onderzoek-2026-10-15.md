# Navidrome Android: brief, onderzoek en mobiele designrichtingen

Datum: 15 oktober 2026. Status: ontwerpverkenning; er wordt geen app gebouwd.

## Bevestigde behoefte

De gebruiker luistert vooral op **Android**. Playlists zijn leidend, de bibliotheek is groot, shuffle moet goed zijn, nummers moeten muzikaal op elkaar aansluiten, offline luisteren moet zeer goed werken en de app moet er aantrekkelijk uitzien. Eigen mp3-bestanden moeten rechtstreeks vanaf de telefoon toegevoegd en gebruikt kunnen worden. Gevraagd resultaat: vijf echte ImageGen-beelden met verschillende designrichtingen.

Bevestigde correctie: mp3-bestanden worden **uitsluitend lokaal aan de app toegevoegd en afgespeeld**. Er is geen upload naar Navidrome gevraagd. De lokale muziek en Navidrome-muziek krijgen dezelfde luisterinterface.

Deze brief vervangt de eerdere tijdelijke desktopaanname. De desktopbeelden blijven als eerdere verkenning bewaard. De daadwerkelijke serverversie, plugins, bibliotheekomvang en het Android-toestel zijn nog onbekend. Er is geen server bezocht en geen werkend gedrag geclaimd.

Interpretatie van “matchen”: op klank en energie passende opvolgers kiezen. Dat is iets anders dan metadata bij een bestand zoeken, puur willekeurige shuffle of automatisch beats mixen. Eventueel later tegen de luistervoorkeur van de gebruiker toetsen.

## Drie productkeuzes

1. **Playlist als hoofdtaak.** Snelle toegang tot eigen lijsten, zoeken in een grote collectie en één herkenbare speler. Geen commerciële homepage of eindeloze suggesties.
2. **Offline hoort bij de basis.** Opgeslagen audio, covers, trackgegevens en playlistvolgorde moeten lokaal bruikbaar blijven. Een downloadicoon alleen bewijst dit niet.
3. **Navidrome en lokale mp3's in één app.** Navidrome levert de serverbibliotheek. De Android-app importeert eigen bestanden van de telefoon en speelt die lokaal af. Voor deze import is geen serveruitbreiding of uploaddienst nodig.

## Shuffle en muzikaal passende volgorde

| Modus | Gewenst gedrag | Wat expliciet voorkomen moet worden |
|---|---|---|
| Shuffle | Willekeurig zonder terugleggen binnen een luisterronde, over de volledige geschikte selectie. Ronde en positie bewaren. | Steeds opnieuw dezelfde kleine eerste pagina kiezen; na iedere herstart dezelfde nummers; onverwacht de handmatige wachtrij vervangen. |
| Mix op klank | Opvolgers kiezen die qua klank/energie bij de huidige muziek passen; genoeg afwisseling houden. | Doen alsof genre of alleen BPM voldoende is; onverklaarbare matchpercentages; dezelfde artiest steeds herhalen. |
| Offline | Alleen lokaal afspeelbare nummers gebruiken; eerder voorbereide volgorde en analysegegevens benutten. | Tijdens het luisteren afhankelijk zijn van een serververzoek voor iedere volgende track. |

Dit zijn voorgestelde productregels, nog geen geteste algoritmes. Willekeurige selectie en harde regels horen in gewone deterministische software. Analyse kan muzikale kenmerken leveren; een taalmodel is niet nodig om iedere volgende track of een downloadstatus te bepalen.

De officiële [OpenSubsonic sonicSimilarity-extensie](https://opensubsonic.netlify.app/docs/extensions/sonicsimilarity/) definieert vergelijkbare nummers en een muzikaal pad tussen nummers. [AudioMuse-AI's Navidrome-plugin](https://github.com/NeptuneHub/AudioMuse-AI-NV-plugin) ondersteunt deze uitbreiding naast Instant Mix en artiestgelijkenis. Dit maakt het een concrete onderzoeksroute voor de gevraagde matching. Ondersteuning op de eigen server en de kwaliteit op de eigen muziek moeten later worden geverifieerd. Offline matching vraagt voorbereiding en lokale gegevens; dat volgt niet automatisch uit deze server-API.

Ontwerpkeuze: “Shuffle” en “Mix op klank” blijven twee begrijpelijke keuzes. Een ontbrekende analyse krijgt een eerlijke uitleg of fallback; geen ogenschijnlijk actieve knop die eigenlijk willekeurig afspeelt. De beelden tonen een fictieve situatie waarin de gewenste modus al beschikbaar is.

Lokale mp3's zijn niet automatisch bekend bij een analyseplugin op de Navidrome-server. Klankmatching voor deze bestanden vraagt lokale analyse of andere beschikbare kenmerken. Gewone shuffle en afspelen moeten daar onafhankelijk van bruikbaar blijven. De app mag lokale muziek niet ongemerkt buiten een gekozen selectie laten.

## Wat “heel goed offline” moet betekenen

| Situatie | Vereist gedrag en bewijs bij een latere bouw |
|---|---|
| Playlist downloaden | Voortgang per lijst en nummer; voltooid, wachtend en mislukt onderscheiden. Pas “Offline beschikbaar” na bevestigde opslag. |
| Vliegtuigstand en herstart | Een koude start opent de lokale bibliotheek, toont artwork en speelt volledige opgeslagen nummers. Ook scrubben en volgende track werken. |
| App op achtergrond / scherm vergrendeld | Muziek blijft spelen; systeemmediaknoppen bedienen dezelfde speler. |
| Onderbroken download | Zichtbare toestand, opnieuw proberen en hervatten waar de bron dat toelaat; geen stilzwijgend verdwenen bestanden. |
| Opslag bijna vol | Betrouwbare melding en beheerbare downloads; vastgezette muziek wordt niet door een gewone afspeelcache verdrongen. |
| Playlist offline aanpassen | Wijzigingen lokaal bewaren en later herkenbaar synchroniseren; een fout niet als succes presenteren. |
| Offline mix | Alleen opgeslagen en bruikbare audio in de selectie; geen netwerk-time-outs tussen tracks. |

[Android Media3](https://developer.android.com/media/media3/exoplayer/downloading-media) beschrijft downloadbeheer, opgeslagen downloadstatussen, netwerkvereisten en afspelen vanuit de downloadcache. De documentatie raadt een downloadcache zonder automatische verdringing aan. Dat is een goed uitgangspunt voor de gekozen offline-eis, geen bewijs dat onze app dit al doet.

Voor afspelen buiten het zichtbare scherm beschrijft Android een aparte [mediaservice en sessie](https://developer.android.com/media/media3/session/background-playback). Ontwerpinferentie: een Android-app met toegang tot deze platformmogelijkheden is hier een sterker uitgangspunt dan alleen een online muziekscherm. De definitieve techniek wordt pas bij een bouwbesluit gekozen.

## Mp3 vanaf de telefoon toevoegen

Voorgestelde flow:

1. Tik op “Mp3 toevoegen” en kies één of meerdere bestanden via de Android-bestandskiezer.
2. Lees aanwezige tags en artwork; gebruik een herkenbare fallback bij ontbrekende informatie. Bewaar een lokale kopie die de app zelfstandig kan blijven afspelen.
3. Toon het nummer direct in de lokale appbibliotheek, met de bron “Op dit apparaat”. Het moet zonder netwerk afspeelbaar zijn.
4. Laat de gebruiker het nummer toevoegen aan playlists en de wachtrij in de app, naast beschikbare Navidrome-muziek.
5. Bewaar gemengde playlists met lokale bestanden in de app. Stuur geen lokale bestandsverwijzingen naar Navidrome alsof dit servernummers zijn. Beschikbaarheid op een ander apparaat wordt niet beloofd.

Relevante toestanden: **bezig met toevoegen**, **klaar voor afspelen**, **bestand bestaat al** en **toevoegen mislukt**. Er is geen upload- of serververwerkingsstap. Metadata mag niet stilzwijgend worden overschreven en fouten mogen niet uit de lijst verdwijnen.

Androids [Storage Access Framework](https://developer.android.com/training/data-storage/shared/documents-files) ondersteunt door de gebruiker gekozen bestanden via de systeemkiezer. De app kan gerichte toegang krijgen. Voor betrouwbaar later gebruik zijn een lokale kopie of passend bewaarde bestandsrechten nodig. Deze keuze blijft buiten de normale luisterinterface.

## Grote bibliotheek en mobiele bediening

Zoeken moet lokaal kunnen zoeken in beschikbare gegevens en online de volledige servercollectie bereiken. Filter op playlists, artiesten, albums of nummers zonder de zoekterm kwijt te raken. Scrollpositie, selectie en sorteervolgorde blijven behouden. Grote lijsten vragen gefaseerd laden en beperkte artworkdownloads; een scherm mag niet eerst alle covers ophalen.

Voorgestelde navigatie: Bibliotheek, Zoeken en Offline. Playlists krijgen in de bibliotheek de hoofdrol. Een duidelijke importactie opent de mp3-flow. De minispeler blijft boven de navigatie bereikbaar. De huidige track, gekozen mixmodus en downloadstatus zijn herkenbaar zonder uitsluitend kleur te gebruiken.

Android adviseert voldoende grote aanraakdoelen; de [Compose-toegankelijkheidsdocumentatie](https://developer.android.com/develop/ui/compose/accessibility/api-defaults) bespreekt onder meer 48 dp. In de concepten zijn dit ontwerpdoelen. Werkelijke TalkBack-ondersteuning, tekstvergroting, contrast en aanraakvlakken moeten in software worden getest.

## Mobbin-bronnen en wat ze bijdragen

De geraadpleegde mobiele Mobbin-schermen zijn **iOS-referenties**. Ze leveren muziekpatronen; de nieuwe beelden krijgen Android-bediening en geen iOS-systeemonderdelen. De eerder onderzochte uploadflow is vervallen door de verduidelijking over lokale import.

| Referentie | Zichtbaar bruikbaar patroon |
|---|---|
| [Spotify: download bezig](https://mobbin.com/screens/19b25d60-7a9b-4ba5-b024-f78800c8e04c) | Voortgang verschilt zichtbaar van voltooid downloaden. |
| [Spotify: offline playlist](https://mobbin.com/screens/bd50673f-8bc3-4b9e-8f80-4fcaf435f61c) | Downloadstatus naast playlistacties en bij de afzonderlijke nummers. |
| [Spotify: bibliotheek](https://mobbin.com/screens/768254d2-404f-4ef7-b44e-445c297dda7c) | Zoeken en typefilters boven een scanbare collectie. |
| [TIDAL: playlist](https://mobbin.com/screens/06d24dee-d5f1-41cb-b8db-9592acacbf96) | Duidelijke hiërarchie van artwork, titel, afspelen/shuffle en tracks. |
| [SoundCloud: compacte playlist](https://mobbin.com/screens/48ab5685-3b18-478c-a4fa-8f5cdacc8df3) | Kleinere playlistkop laat meer nummers zien; tekstuele downloadstatus. |
| [SoundCloud: speler](https://mobbin.com/screens/13b9a098-e675-4166-b4b4-20102e5e4703) | Dezelfde speler blijft bereikbaar tijdens bladeren. |
| [Dropbox: uploadvoortgang](https://mobbin.com/screens/0344b16a-a8e5-442b-a8f9-efddae1ab159) | Historische referentie uit de eerdere uploadaanname; geen functionele eis voor de lokale import. |

## Vijf te vergelijken richtingen

Alle vijf tonen dezelfde fictieve Android-playlist **Onderweg**, met 36 nummers en offline beschikbaarheid, de keuze tussen Shuffle en Mix op klank, toegang tot mp3-import en dezelfde huidige track Window Seat van Mara Vale. Niet iedere toekomstige flow wordt in één screenshot gepropt.

| Werktitel | Visuele richting | Belangrijkste afweging |
|---|---|---|
| Obsidiaan | Diep houtskool, warm koper, cinematografische coverkop, heldere bediening. | Sfeer en artwork krijgen veel ruimte. |
| Papier | Warm wit, inkt en vermiljoen, redactionele serifkop, lichte lijst. | Persoonlijk en rustig; geen standaard streaminguitstraling. |
| Volt | Fris blauw, elektrisch kobalt en een beheerste limekleur; expressieve Android-vormen. | Speels en direct, met stevige hiërarchie. |
| Raster | Zeer compacte, precieze typografie; grafiet en ijsblauw; meer trackrijen. | Snel overzicht voor grote collecties. |
| Mos | Zacht salie en diep groen, luchtige compositie en natuurlijke beelden. | Rust en een herkenbare eigen identiteit. |

Doelviewport 390 × 844; een hogere rasterresolutie mag dezelfde verhouding gebruiken. Alleen appinhoud: geen telefoonbehuizing, notch, statusbalk of browser. Vijf afzonderlijke ingebouwde ImageGen-generaties, met daadwerkelijk meegestuurde visuele referenties. Geen HTML-nabootsing, collage of gebouwde app.

## Vervolg en grenzen

Eerst vijf beelden genereren en beoordelen op leesbaarheid, afsnijding, downloadstatus, consistente afspeelknoppen en wezenlijk andere vormgeving. De bronbeelden, prompts, werkelijke afmetingen en eventueel resterende afwijkingen worden opgeslagen. Daarna één gekozen richting verfijnen, eventueel met aparte offline- en importschermen. Pas later een bouwplan en uitvoering.

Dit onderzoek maakt gewenste functies en technische afhankelijkheden concreet. Het is geen representatieve gebruikerstest en geen meting van shufflekwaliteit, offline betrouwbaarheid of prestaties op de eigen bibliotheek.

## Geleverd en gecontroleerd

Vijf nieuwe mobiele beelden gemaakt met **vijf afzonderlijke ingebouwde ImageGen-generaties**, alle met de volledige opgeslagen prompt en de opgegeven echte referentiebeelden. In de hoofdchat getoond en visueel beoordeeld. De nummers hieronder volgen de daadwerkelijke weergavevolgorde van deze nieuwe mobiele reeks.

| Nummer | Richting en bestand | Werkelijk raster |
|---|---|---|
| 1 | [Obsidiaan](<C:/Users/Daniël/Desktop/Codex/screenshots/navidrome-android-ui-2026-10-15/obsidiaan.png>) | 853 × 1844 |
| 2 | [Papier](<C:/Users/Daniël/Desktop/Codex/screenshots/navidrome-android-ui-2026-10-15/papier.png>) | 853 × 1844 |
| 3 | [Volt](<C:/Users/Daniël/Desktop/Codex/screenshots/navidrome-android-ui-2026-10-15/volt.png>) | 853 × 1844 |
| 4 | [Mos](<C:/Users/Daniël/Desktop/Codex/screenshots/navidrome-android-ui-2026-10-15/mos.png>) | 853 × 1844 |
| 5 | [Raster](<C:/Users/Daniël/Desktop/Codex/screenshots/navidrome-android-ui-2026-10-15/raster.png>) | 852 × 1846 |

[Alle volledige generatieprompts](<C:/Users/Daniël/Desktop/Codex/screenshots/navidrome-android-ui-2026-10-15/prompts.json>) · [Manifest en beeldbeperkingen](<C:/Users/Daniël/Desktop/Codex/screenshots/navidrome-android-ui-2026-10-15/manifest.json>) · [Bronnenregister](<C:/Users/Daniël/Desktop/Codex/screenshots/navidrome-android-ui-2026-10-15/references/sources.json>).

Geverifieerd: vijf niet-lege leesbare PNG's, portretverhouding, geen telefoon- of systeemchrome, complete zichtbare trackrijen, dezelfde huidige track, geselecteerde klankmix, offline-status en bereikbare minispeler/navigatie. Bestanden zijn ongewijzigd gekopieerd; niet bijgesneden of handmatig herschaald. De werkelijke resolutie verschilt iets van de rasterrichtmaat; 390 × 844 blijft het logische ontwerpdoel.

Kleine resterende beeldafwijkingen: Papier gebruikt een chevron als terugicoon; Papier en Volt hebben een vrij krappe titelruimte; sommige richtingen herhalen de offlinezin bij iedere track; Raster gebruikt niet overal even grote miniaturen. Bij verfijning de Android-terugpijl, marges, uniforme artworkmaten en herhaalde statuslabels aanscherpen. Contrast, TalkBack, aanraakdoelen, offline betrouwbaarheid en shufflekwaliteit zijn nog niet in software getest.

Afgerond: aangepast Android-onderzoek, vijf echte beeldrichtingen en visuele controle. Open: keuze van de gewenste richting. Pas daarna die richting verfijnen met bijvoorbeeld een offline-scherm en mp3-importflow. Er is geen app gebouwd.

Weergavecorrectie: de eerdere toolweergave was voor de gebruiker niet zichtbaar. De vijf bestaande gegenereerde PNG's worden daarom rechtstreeks in het chatantwoord ingebed. “Mp3 toevoegen” in deze beelden betekent volgens de bevestigde brief lokale import. Het pictogram kan bij verfijning een map-met-plus worden om dat duidelijker te maken. De oorspronkelijke generatieprompts blijven als historische, exact gebruikte prompts bewaard; hun eerdere uploadaanname is door deze correctie vervangen.

