---
title: Reading-app — zelfstandig native Android UI-systeem
created: 2026-09-08
updated: 2026-09-08
type: project
tags: [personal, reading-app, android, design]
status: proposal
sources:
  - https://developer.android.com/design/ui/mobile
  - https://developer.android.com/develop/ui/compose/designsystems/material3
  - https://impeccable.style/slop/
  - https://openlibrary.org/dev/docs/api/search
---

# Reading-app — design.md

Dit is de designspecificatie voor een nieuwe, zelfstandige, native Android-app. Er is in deze opdracht geen app gebouwd. De specificatie en schermbeelden leggen vast wat een volgende bouwer moet maken. Alle ontwerpbeslissingen zijn voorstellen binnen de door de gebruiker gedelegeerde ontwerpopdracht; geen reeds bestaande of door de gebruiker definitief goedgekeurde productidentiteit.

**Bindende afbakening:** uitsluitend Android, Kotlin en Jetpack Compose. Geen website, WebView, React Native, Flutter of gedeeld website-designsysteem. Geen stijlen, tokens, componenten of designspecificaties uit andere mappen in deze repository overnemen. De map `projecten/Reading-app` was bij aanvang leeg. Het algemene repository-contextcommando zag andere projecten; die zijn uitdrukkelijk geen visuele autoriteit voor deze app.

**Ontwerpnaam:** het UI-systeem heet hier *Leesarchief / Inktblauw*. Dit is een interne referentienaam, geen gekozen commerciële appnaam. Toon geen verzonnen merknaam, logo of slogan in de app.

**Lezen van dit document:** begin bij §1–4, gebruik vervolgens §5–8 voor alle componenten en §9–15 voor de schermen. §16–20 bepalen gedrag en technische randvoorwaarden. §21–23 geven voorbeeldinhoud, controlepunten en bronnen. De laatste sectie bevat de overdracht aan een uitvoerende agent.

## 1. Productopdracht en grenzen

### 1.1 Wat de gebruiker daadwerkelijk vraagt

Een persoonlijk leesarchief waarin boeken, leesstatus, voortgang, eigen ratings/reviews, gedachten, samenvattingen, theorieën, quotes en andere notities samenkomen. Een boek moet terug te vinden zijn via titel, auteur of ISBN in een grote online boekencatalogus. Het prettige collectiegevoel van Letterboxd is inspiratie voor het bekijken van boeken; er is geen sociale feed gevraagd.

De app moet zowel bij het vastleggen tijdens het lezen als bij het later teruglezen goed werken. Geen van die twee gebruikssituaties krijgt exclusieve prioriteit. De gebruiker heeft expliciet gevraagd nu alleen te ontwerpen.

### 1.2 Vastgelegde, eenvoudige v1-keuzes

| Onderwerp | Keuze voor dit ontwerp |
|---|---|
| Taal | Nederlandse interface, `nl-NL`; oorspronkelijke boektitels en eigen notities behouden hun taal. |
| Hoofdnavigatie | Bibliotheek, Zoeken, Journal. |
| Leesstatus | Wil ik lezen, Bezig, Uitgelezen. Precies één status per toegevoegd boek. |
| Voortgang | Huidige pagina en, indien bekend, totaal aantal pagina’s. Geen timer of dagelijkse doelen. |
| Rating | Optioneel 1–5 hele sterren; geen halve sterren. |
| Review | Eén optionele persoonlijke review per toegevoegd boek, aanpasbaar. |
| Journal | Meerdere notities per boek; type Gedachte, Samenvatting, Quote, Theorie of Notitie. |
| Locatie bij notitie | Optionele pagina OF hoofdstuk, zonder verplichte locatie. |
| Favorieten | Een quote kan als favoriet worden gemarkeerd. Geen extra favorietensysteem voor alle objecttypen. |
| Geschiedenis | Start- en einddatum bij een boek, plus gedateerde notities/review. Geen apart statistiekdashboard. |
| Opslag | Persoonlijke inhoud lokaal op het toestel. Cataloguszoekopdrachten online. |
| Thema | Systeeminstelling volgen; expliciete lichte en donkere variant. Keuze Systeem/Licht/Donker via instellingenblad. |
| Appnaam | Nog niet gekozen; niet nodig voor het ontwerpen van de interne schermen. |

Local-only is een bewuste vereenvoudiging van deze eerste designspecificatie, geen claim dat cloudsync onmogelijk of onwenselijk is. Laat de UI geen synchronisatie of account suggereren. Een toekomstige productopdracht kan deze grens wijzigen.

### 1.3 Wat niet binnen dit ontwerp valt

Geen e-booklezer, e-books kopen/downloaden, accounts, vrienden, openbare reviews, aanbevelingsalgoritme, AI-samenvattingen, flashcards, leesstreaks, badges, confetti, pushmeldingen, abonnementscherm, onboardingcarrousel of boekenscan met camera. Er is een groot metadata-aanbod gevraagd, geen toegang tot volledige boekteksten. Geen van deze onderdelen tijdens het bouwen toevoegen om een leeg vlak te vullen.

### 1.4 Succescriteria

1. Een boek kan vanuit Zoeken worden gevonden, bekeken en in een van de drie statussen worden toegevoegd.
2. Vanuit het meest recent bijgewerkte huidige boek zijn voortgang en een nieuwe notitie zonder omwegen bereikbaar.
3. Maanden later zijn notities leesbaar per boek én doorzoekbaar in het algemene Journal.
4. Dezelfde kleurrol, tekstrol, ruimte en component ziet er overal hetzelfde uit.
5. Invoer blijft behouden bij toetsenbord, rotatie, teruggaan en een schrijffout. Er verschijnt nooit ten onrechte een succesmelding.
6. De interface blijft bruikbaar op een smalle telefoon, in donker thema, met TalkBack en vergroot lettertype.

## 2. Online onderzoek en ontwerpbesluit

### 2.1 Android-fundament

Gekozen: **Material 3 als native component- en gedragsfundament, met een volledig eigen visueel thema en eigen boek/journal-composities.** Androids officiële ontwerprichtlijnen verwijzen naar Material 3 en de Android UI kit. Material 3 ondersteunt themawaarden voor kleur, typografie en vorm in Compose. Daarmee blijven onder meer terugnavigatie, invoer, focus en toegankelijkheid herkenbaar. [Android design](https://developer.android.com/design/ui/mobile), [Material 3 in Compose](https://developer.android.com/develop/ui/compose/designsystems/material3).

| Optie | Beoordeling voor dit project |
|---|---|
| Eigen themalaag op Material 3 | Gekozen. Native bediening met vaste, onafhankelijke visuele regels. |
| Standaard Material-schermen zonder eigen compositie | Te algemeen: geeft geen uitgewerkt boekarchief en laat te veel beslissingen aan de bouwer. |
| Alle controls zelf tekenen | Onnodig werk en meer risico rond invoer, focus, semantiek en systeemgedrag. |
| Web-UI-kits zoals shadcn/Tailwind of bestaande projectstijlen | Afgewezen: de verkeerde platformbasis of niet van dit project. |

De actuele Android-documentatie beschrijft ook Material 3 Expressive. Dit ontwerp vereist geen experimentele expressieve widgets. Gebruik stabiele Material-componenten; verander hun maatvoering expliciet volgens dit document en neem geen voorbeeldscherm als compleet thema over.

### 2.2 Visuele richting

Een bruikbare, nauwkeurig geordende boekcollectie: helder koel papier, donker inktblauw, echte omslagverhoudingen, rustige rijen met leesbare notities. Boekomslagen leveren kleurvariatie. Een functionele voortgangsbalk is toegestaan omdat hij werkelijk leesvoortgang weergeeft.

Het lichte thema is de hoofdreferentie voor dagelijks gebruik onder wisselend licht. Het donkere thema volgt dezelfde geometrie en biedt een rustige variant bij weinig licht. De daadwerkelijke standaard volgt Androids systeemthema. Dit is een ontwerpkeuze, geen veronderstelling over de persoonlijke lichtvoorkeur van de gebruiker.

**Herkenbare compositie:** de bibliotheek begint met één doorleesblok, daarna een echte omslagcollectie. Boekdetail begint met omslag en bibliografische identiteit, gevolgd door eigen voortgang en journal. De verzameling en eigen woorden zijn het beeld; er is geen decoratieve hero nodig.

### 2.3 Onderzochte “AI slop” en concrete regels

“AI slop” is hier een informele ontwerpkritiek, geen objectieve test waarmee je kunt vaststellen of iets door AI is gemaakt. De online bronnen noemen terugkerende patronen; onderstaande toepassingsregels zijn onze vertaling voor déze app. Impeccable beschrijft onder meer decoratieve glows, herhaalde kaarten, overmatige afronding en gedachteloze standaardpaletten. [Impeccable: Slop](https://impeccable.style/slop/).

| Vermijden | Regel voor Reading-app |
|---|---|
| Paarse/blauwe gradients, gekleurde gloed, glastegels | Alle UI-vlakken hebben één effen kleur; geen blur of glow. |
| Beige plus een opvallende serif als automatisch “boeken”-thema | Koele neutrale vlakken. Roboto voor interface; Literata uitsluitend voor opgeslagen langere leesinhoud. |
| Kaart om ieder tekstblok, geneste kaarten | Journal en zoekresultaten zijn open rijen. Alleen het doorleesblok en echte tijdelijke lagen krijgen een oppervlak. |
| Alles een capsule of badge | Statusfilters zijn chips; metadata blijft gewone tekst. Omslagen hebben 4 dp hoeken. |
| Decoratieve statistiekpanelen, ringen, streaks | Alleen huidige pagina, totaal en functionele lineaire voortgang. |
| Reusachtige koppen en grote lege hero | Hoofdtitel 30/36 sp; meteen daarna echte inhoud. |
| Willekeurige icoontjes naast iedere kop | Iconen alleen als bediening of herkenning van navigatie. Eén iconenfamilie. |
| Nietszeggende knoppen | Schrijf “Notitie opslaan”, “Toevoegen” en “Opnieuw proberen”; geen “Ontdek meer”. |
| Overdreven opgewekte lege schermen | Leg kort uit wat ontbreekt en geef de volgende passende actie. |
| Fake beoordelingen of sociaal bewijs | Alleen eigen, werkelijk opgeslagen rating. Alle ontwerpvoorbeelden zijn demonstratiegegevens. |
| iOS-interface in een Android-frame | Android Back, native tekstselectie, Material-dialogen, 48 dp bediening en correcte systeeminsets. |
| Nieuwe features om schermen voller te maken | De afgesproken basis bepaalt de inhoud. Lege ruimte mag bestaan. |

Een omslaggrid is **wel** correct: het toont een verzameling vergelijkbare objecten. Het anti-patroon is betekenisloos herhaalde feature-kaarten, niet iedere herhaling. Gebruik ook niet een nieuwe “anti-slop”-stijl als sjabloon voor alles. De bron van het frontend-design-project benadrukt concrete actietekst en bruikbare herstelstappen bij fouten en leegte; die discipline nemen we over. [Frontend design — bron](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md).

## 3. Ontwerpbestanden en autoriteit

De canonieke specificatie staat in `Kennis/personal/areas/reading-app/design.md`, conform de vaultregels. De beelden horen bij `projecten/Reading-app/design/`. Paden hieronder zijn relatief aan dit document en blijven werken als de hele repository tussen computers verhuist.

| Bestand | Wat het toont |
|---|---|
| [01-bibliotheek-boekdetail.png](../../../../../projecten/Reading-app/design/01-bibliotheek-boekdetail.png) | Bibliotheek en boekdetail, licht. |
| [02-zoeken-journal.png](../../../../../projecten/Reading-app/design/02-zoeken-journal.png) | Catalogusresultaten en algemeen Journal, licht. |
| [03-notitie-review.png](../../../../../projecten/Reading-app/design/03-notitie-review.png) | Notitie-invoer en review-invoer, licht. |
| [04-donker-voortgang.png](../../../../../projecten/Reading-app/design/04-donker-voortgang.png) | Bibliotheek donker en voortgangsblad donker. |
| [generation-prompts.txt](../../../../../projecten/Reading-app/design/generation-prompts.txt) | Exacte beeldprompts en herkomst. Geen appcode. |

**Volgorde bij conflicten:** expliciete nieuwe gebruikersinstructie → exacte regels/tokens en correcties in dit document → ruimtelijke schermcompositie van de beelden → standaardgedrag van de genoemde native componenten. Gegenereerde beelden kunnen een label, getal of kleine afstand anders tekenen. Neem zulke afwijkingen niet over en ga geen maten uit een telefoonframe afleiden. Het Android-toestelframe, de slagschaduw en de bijschriften onder de telefoons horen niet bij de app.

Beelden zijn ontwerpvisualisaties, geen screenshots van een geïmplementeerde of geteste app. Coverillustraties zijn conceptillustraties van bekende titels, geen geverifieerde omslagen of edities. Vervang ze in productie met de opgehaalde cover van de gekozen editie. Voor vaste ontwerpscreenshots mag de hieronder vastgelegde demonstratieset worden gebruikt.

## 4. Navigatie en schermstructuur

### 4.1 Exacte hoofdnavigatie

| Volgorde | Label | Material Symbol | Startinhoud |
|---|---|---|---|
| 1 | Bibliotheek | `book_2` | Eigen boeken, filter Alles, sortering Recent. |
| 2 | Zoeken | `search` | Leeg zoekveld en korte instructie; geen willekeurige aanbevelingen. |
| 3 | Journal | `book` | Alle opgeslagen notities, nieuwste bovenaan. |

Elke bestemming heeft een zichtbare tekstlabel. Alleen actieve bestemming krijgt de indicator. Een tweede tik op de actieve bestemming reset geen filter of scrollpositie. Een wissel behoudt zoektekst, filter en scrollpositie van de andere bestemmingen.

### 4.2 Schermboom

```text
Bibliotheek / Zoeken / Journal   [roots, navigatiebalk zichtbaar]
  → Boekdetail(bookId of catalogusselectie, gekozen tab)
      → Notitie lezen(noteId)
          → Notitie bewerken(noteId)
      → Notitie maken(bookId)
      → Review maken/bewerken(bookId)
      → Voortgang bijwerken [modal bottom sheet]
      → Status kiezen [modal bottom sheet]
      → Editie kiezen [pushed lijst, alleen bij toevoegen vanuit een werk]
  → Notitie lezen(noteId)        [ook rechtstreeks uit algemeen Journal]
  → Boek handmatig toevoegen    [vanuit Zoeken bij ontbrekend resultaat]
  → Instellingen               [klein modal bottom sheet vanuit Bibliotheek]
```

Boekdetail, leesdetail en editors zijn verdiepingen; verberg daar de root-navigatiebalk. Terug gaat naar de daadwerkelijke oorsprong met behouden context, dus ook van een notitie rechtstreeks terug naar Journal. Geen vaste terugroute naar Bibliotheek.

### 4.3 Back en tijdelijke lagen

1. Android Back sluit eerst een geopend toetsenbord.
2. Daarna sluit Back een menu of sheet. Een gewijzigde sheet volgt de bewaarinstructie in §16.
3. Daarna wordt het huidige detail/editor-scherm verlaten volgens de conceptregels.
4. Op een root-bestemming gaat Back normaal naar Bibliotheek als die niet actief is; op Bibliotheek krijgt het systeem de actie zodat de app kan worden verlaten. Geen “druk nogmaals om te sluiten”.

Gebruik Navigation 3 en normale platform-backafhandeling. Geen onzichtbare tapzones, eigen swipe-backanimatie of blokkade van de systeem-backgesture.

## 5. Kleurrollen

Alle waarden zijn opaque sRGB-hex. In Compose worden ze ARGB met `FF` als alpha. Gebruik in componenten alleen semantische rollen, nooit een losse hex. Onderstaande tabel is de volledige projectmapping; laat geen paarse library-default over.

| Material-rol | Licht | Donker |
|---|---|---|
| `primary` | `#244A73` | `#B1CFF4` |
| `onPrimary` | `#FFFFFF` | `#112E4D` |
| `primaryContainer` | `#DFEAF6` | `#254463` |
| `onPrimaryContainer` | `#193B5D` | `#D5E7FF` |
| `inversePrimary` | `#B1CFF4` | `#244A73` |
| `secondary` | `#526170` | `#B7C6D6` |
| `onSecondary` | `#FFFFFF` | `#223140` |
| `secondaryContainer` | `#E5EAF0` | `#344454` |
| `onSecondaryContainer` | `#263441` | `#DAE5F0` |
| `tertiary` | `#76551B` | `#E5C17F` |
| `onTertiary` | `#FFFFFF` | `#402D08` |
| `tertiaryContainer` | `#F4E3BF` | `#58431A` |
| `onTertiaryContainer` | `#4C360B` | `#F8E4BD` |
| `background`, `surface`, `surfaceDim` | `#F5F7FA` | `#121B27` |
| `onBackground`, `onSurface` | `#192633` | `#E4EAF2` |
| `surfaceBright` | `#F5F7FA` | `#344152` |
| `surfaceContainerLowest` | `#FFFFFF` | `#0E1620` |
| `surfaceContainerLow` | `#EEF2F7` | `#182331` |
| `surfaceContainer` | `#E9EFF6` | `#202D3D` |
| `surfaceContainerHigh` | `#E1E8F1` | `#293749` |
| `surfaceContainerHighest` | `#D9E2EC` | `#344152` |
| `surfaceVariant` | `#E1E8F1` | `#293749` |
| `onSurfaceVariant` | `#526170` | `#AFBDCC` |
| `outline` | `#758393` | `#8191A4` |
| `outlineVariant` | `#DCE3EB` | `#344456` |
| `error` | `#A62934` | `#FFB2B8` |
| `onError` | `#FFFFFF` | `#5A101C` |
| `errorContainer` | `#FFE0E3` | `#792432` |
| `onErrorContainer` | `#6E1021` | `#FFDADF` |
| `inverseSurface` | `#263441` | `#E4EAF2` |
| `inverseOnSurface` | `#EEF3F8` | `#192633` |
| `surfaceTint` | `#244A73` | `#B1CFF4` |
| `scrim` | `#000000` | `#000000` |

Als de stabiele API fixed color roles vereist: `primaryFixed=#DFEAF6`, `primaryFixedDim=#B1CFF4`, `onPrimaryFixed=#112E4D`, `onPrimaryFixedVariant=#244A73`; secondary equivalent `#E5EAF0/#B7C6D6/#223140/#526170`; tertiary equivalent `#F4E3BF/#E5C17F/#402D08/#76551B`. Deze fixed rollen worden niet voor de beschreven schermen gebruikt.

### 5.1 Gebruik per functie

| Functie | Rol |
|---|---|
| Pagina, top bar | `surface`; geen automatische kleuromslag bij scroll. |
| Doorleesblok | `surfaceContainer`; tekst `onSurface`. |
| Zoek- en invoerveld | `surfaceContainerLow`; label/placeholder `onSurfaceVariant`. |
| Primaire knop | `primary` + `onPrimary`. |
| Actieve filter/navigation indicator | `primaryContainer` + `onPrimaryContainer`. |
| Actieve tab, gewone actie, voortgang | `primary`. |
| Inactieve iconen en secundaire tekst | `onSurfaceVariant`. |
| Essentiële invoergrens | `outline`; focus 2 dp `primary`. |
| Decoratieve scheidingslijn | 1 dp `outlineVariant`; nooit enige indicatie van een invoerveld. |
| Bottom sheet | `surfaceContainerLow`; scrim zwart 32%. |
| Snackbar | `inverseSurface`, tekst `inverseOnSurface`, actie `inversePrimary`. |
| Ratingster | `primary` gevuld, ongevuld `onSurfaceVariant`. |
| Favoriete quote | Bookmark gevuld in `tertiary`; ook semantisch “favoriet”. |

Tertiary is een kleine functionele markering, geen tweede merkaccent voor grote vlakken. Omslagkleuren beïnvloeden geen andere UI-kleuren. Dynamic Color staat uit: dezelfde projectkleuren gelden ongeacht wallpaper. Thema Systeem verandert alleen licht/donker.

### 5.2 Contrastcontrole, berekend op 8 september 2026

| Paar | Contrast |
|---|---|
| Licht hoofdtekst / achtergrond | 14,32:1 |
| Licht secundaire tekst / achtergrond | 5,92:1 |
| Licht knoplabel / primary | 9,12:1 |
| Licht geselecteerde tekst / container | 9,45:1 |
| Licht outline / achtergrond | 3,61:1 |
| Licht fouttekst / achtergrond | 6,55:1 |
| Donker hoofdtekst / achtergrond | 14,32:1 |
| Donker secundaire tekst / achtergrond | 9,06:1 |
| Donker knoplabel / primary | 8,61:1 |
| Donker geselecteerde tekst / container | 8,01:1 |
| Donker outline / achtergrond | 5,38:1 |
| Donker fouttekst / achtergrond | 10,16:1 |

Berekening: WCAG-relatieve sRGB-luminantie, `(Llicht+0.05)/(Ldonker+0.05)`. Norm voor normale tekst is minimaal 4,5:1, voor grote tekst en essentiële grafische controls minimaal 3:1. De zwakkere `outlineVariant` is alleen decoratie. Dit is een controle van tokens; runtime-semantiek en uiteindelijke samengestelde kleuren moeten de bouwer nog toetsen.

## 6. Typografie

### 6.1 Fontkeuze

**Roboto** voor navigatie, titels, labels, metadata en invoer. Gebruik voor consistente toestelweergave gebundelde statische Roboto Regular 400, Medium 500 en Bold 700 fontbestanden. Geen netwerkfont bij opstart. **Literata Regular 400** uitsluitend voor opgeslagen journalbody, langere opgeslagen reviewtekst en quote-tekst. Literata is ontworpen voor langer lezen. Gebruik dezelfde serif niet voor knoppen of grote schermkoppen. [Literata — officiële bron](https://github.com/googlefonts/literata).

Letterspacing is 0 sp voor alle gebruikte rollen. Gebruik echte fontgewichten, geen kunstmatige vet/italic. Niet automatisch afbreken met koppelteken. Nederlandstalige boektitels mogen op natuurlijke woordgrenzen afbreken; alleen grids gebruiken ellipsis na het opgegeven aantal regels. Bewaar fontlicenties naast toekomstige fontassets.

### 6.2 Exacte tekstrollen

| Rol in het ontwerp | Compose-rol | Font/gewicht | Grootte / regelhoogte | Gebruik |
|---|---|---|---|---|
| ScreenTitle | `headlineLarge` aangepast | Roboto 700 | 30 / 36 sp | Bibliotheek, Zoeken, Journal. |
| BookTitle | `headlineMedium` aangepast | Roboto 700 | 26 / 32 sp | Volledige titel op boekdetail. |
| EditorTitle | `titleLarge` | Roboto 500 | 22 / 28 sp | Nieuwe notitie, Mijn review. |
| SectionTitle | `headlineSmall` aangepast | Roboto 700 | 20 / 28 sp | Verder lezen, Je boeken. |
| EntryTitle | `titleMedium` aangepast | Roboto 700 | 18 / 24 sp | Notitietitel, titel zoekresultaat. |
| Body | `bodyLarge` | Roboto 400 | 16 / 24 sp | Invoer, uitleg, keuzelijst. |
| BodyMedium | `bodyMedium` | Roboto 400 | 14 / 20 sp | Auteur, datum, metadata. |
| CoverTitle | `titleSmall` | Roboto 500 | 14 / 20 sp | Titel onder cover. |
| Control | `labelLarge` | Roboto 500 | 14 / 20 sp | Knoppen, chips, tablabels. |
| NavLabel | `labelMedium` | Roboto 500 | 12 / 16 sp | Bottom navigation, nooit hoofdinhoud. |
| ReadingBody | eigen `ReadingTextStyle` | Literata 400 | 17 / 26 sp | Notitiepreview en opgeslagen review. |
| ReadingDetail | eigen `ReadingDetailStyle` | Literata 400 | 18 / 28 sp | Geopende volledige notitie/quote. |

Gebruik `sp`, geen pixelmaat of tekst die met de schermbreedte wordt geschaald. De ontwerpreferentie gebruikt fontscale 1,0. Bij grotere lettertypen groeit de lay-out; verklein het font nooit om tekst passend te maken. Invoerdocumenten gebruiken Roboto 16/24 om cursor- en selectiemetriek eenvoudig te houden; pas opgeslagen tekst krijgt Literata.

Niet-gebruikte Material-typerollen mogen de native standaardwaarde behouden, maar geen scherm mag ze zonder specificatie gebruiken. De twee Reading-rollen zijn benoemde stijlen, geen losse per-scherminstellingen.

## 7. Ruimte, vorm, schermmaten en iconen

### 7.1 Maatvoering

Alle hierna genoemde geometrie is in **dp binnen het appvenster**, niet in de pixels van het gegenereerde beeld.

| Token | Waarde |
|---|---|
| Referentietelefoon | 412 × 892 dp inclusief voorbeeld-systeeminsets. |
| Referentie statusbalk | 24 dp; runtime altijd actuele `WindowInsets`. |
| Referentie gesture-inset | 24 dp; runtime actuele `navigationBars`. |
| Contentgutter | 20 dp links/rechts bij 360–599 dp breedte. |
| Gutter bij 320–359 dp | 16 dp. |
| Ruimte-eenheden | 4, 8, 12, 16, 20, 24, 32, 40, 48 dp. |
| Afstand tussen secties | 24 dp; 32 dp alleen na een volledige identiteit-/invoercluster. |
| Kop naar eigen inhoud | 12 dp. |
| Titel naar auteur/metadata | 4 dp. |
| Icoon naar knoplabel | 8 dp. |
| Top bar op detail/editor | 64 dp exclusief status-inset. |
| Bottom NavigationBar | 80 dp exclusief onderste systeeminset. |
| Kleinste tapvlak | 48 × 48 dp. |
| Knoppen/tekstknoppen | Minimaal 48 dp hoog; brede primaire knop 52 dp in editors/sheets. |
| Search/text field | Minimaal 56 dp hoog, groeit bij fontscale. |
| Chip zichtbaar vlak | 36 dp hoog in 48 dp hoog interactieraster. |
| Cover grid | 3 kolommen bij 360–599 dp, 12 dp tussenruimte. |
| Coververhouding | 2:3; gridcovers vullen een vaste 2:3-box met `ContentScale.Fit`. |
| Cover radii | 4 dp. Geen schaduw in grids. |
| Doorleesblok radius | 12 dp. |
| Invoerveld radius | 12 dp. |
| Buttons/nav-indicator | Capsule, helft van visuele hoogte. |
| Sheet/dialog radius | 28 dp bovenhoeken sheet / alle dialoghoeken. |
| Voortgang | 4 dp hoog, afgeronde uiteinden, track `surfaceContainerHighest`. |
| Divider | 1 dp. |

Voor een grid op 412 dp: beschikbare breedte `412−40=372`; coverbreedte `(372−24)/3=116` dp; coverhoogte `174` dp. Alle drie kolommen dezelfde breedte. Onder iedere cover 8 dp ruimte, titel maximaal 2 regels, auteur maximaal 1 regel. De volgende gridrij begint na de hoogste tekstcel van de vorige rij plus 20 dp. De voorbeeldafbeelding benadert deze maten; de formule bepaalt de implementatie.

### 7.2 Algemene layoutregels

Gebruik `Scaffold`, `LazyColumn` en `LazyVerticalGrid`; geen screenshot namaken met absoluut gepositioneerde pixels. Bibliotheek gebruikt één `LazyVerticalGrid` met full-span headeritems. Geen verticaal scrollbare grid in een verticaal scrollende kolom. Alle rijen hebben stabiele IDs.

Top/root headers scrollen met de inhoud; bottom navigation blijft staan. De detail-topbar blijft staan. Een sheet mag zelf scrollen en wordt maximaal tot de beschikbare hoogte uitgeklapt. Formulieren blijven boven de IME bereikbaar. Pas `Scaffold`-padding en systeeminsets precies eenmaal toe. Achtergronden mogen edge-to-edge doorlopen; tekst en bediening mogen niet onder systeem- of camerainsets vallen.

Geen optisch zwevende bottom bar. Geen schaduw rond alle content. Zet `tonalElevation=0.dp` waar de tabel een exact oppervlak voorschrijft, zodat automatische tonal tint de kleur niet verandert. Gebruik standaard elevation alleen voor menus/sheets waar de native component dat nodig heeft.

### 7.3 Iconencontract

Material Symbols **Outlined**, optische maat 24, gewicht 400, grade 0. Download alleen gebruikte Android VectorDrawable-assets en bundel ze. Niet de volledige extended-iconsbibliotheek laden; geen emoji, tekstglyph of eigen half passende SVG-tekening gebruiken. [Material Symbols](https://developers.google.com/fonts/docs/material_symbols).

| Actie | Symbol | TalkBack-label |
|---|---|---|
| Bibliotheek | `book_2` | Bibliotheek; geselecteerd via componentsemantiek. |
| Zoeken | `search` | Zoeken. |
| Journal | `book` | Journal. |
| Terug | `arrow_back` | Terug. |
| Sluiten editor | `close` | Sluiten. |
| Instellingen | `settings` | Instellingen. |
| Extra acties | `more_vert` | Meer opties; bij rijen objectnaam toevoegen. |
| Toevoegen | `add` | Weglaten als zichtbaar knoplabel dezelfde actie uitspreekt. |
| Aanpassen | `edit` | Voortgang bijwerken / Notitie bewerken, afhankelijk van context. |
| Dropdown | `expand_more` | Decoratief binnen gelabelde control. |
| Sorteren | `swap_vert` | Sorteervolgorde kiezen. |
| Opgeslagen/in bibliotheek | `check` | In bibliotheek. |
| Rating | `star` | N van 5 sterren; elke target als selectie-optie. |
| Quote favoriet | `bookmark` outlined/filled | Als favoriet bewaren / Uit favorieten verwijderen. |
| Wissen veld | `close` | Zoektekst wissen. |
| Verwijderen | `delete` | Notitie verwijderen. |

Gevulde state is alleen voor geselecteerde navigatie, gekozen ratingsterren en favoriete bookmark. Gebruik waar nodig de filled variant van hetzelfde symbool. RTL backpijl auto-mirrors; boekomslagen en sterren veranderen niet van vorm.

## 8. Componentcontracten

### 8.1 Buttons en feedback

Primaire knop: Material `Button`, minHeight 48, horizontale padding 20, Control-stijl. Maximaal één prominente primaire actie per zichtbaar taakcluster. Tekstknop: `TextButton`, dezelfde minimumhoogte, geen onzichtbaar kleiner tapvlak. Vermijd knoppen-in-knoppen: cover/titel en “Voortgang” in het doorleesblok zijn aparte, niet overlappende doelen.

Disabled: native Material disabledkleuren (12% `onSurface` container, 38% content); semantisch disabled; maak benodigde uitleg zichtbaar. Busy: behoud breedte en label, voeg 18 dp spinner toe met 8 dp afstand, blokkeer dubbele submits. Na een geslaagde lokale write verschijnt de nieuwe inhoud; Snackbar “Notitie opgeslagen” of “Review opgeslagen”. Error blijft bij het betrokken veld of formulier; geen succesachtige toast bij een fout.

### 8.2 Statusfilters

Vier `FilterChip`s in één horizontaal scrollende rij: Alles, Wil ik lezen, Bezig, Uitgelezen. Single-selection; Alles is de bibliotheekdefault. Tussen tapvlakken 8 dp. Actief: `primaryContainer`; inactief: `surface` met 1 dp `outline`. Geen tellers in chips. Laat een scrollbare chiprij bewegen in plaats van labels af te snijden. De geselecteerde chip moet na wijziging zichtbaar zijn.

### 8.3 Boekcover en zoekrij

Coverbox heeft altijd een vaste verhouding. Toon volledige omslag met Fit, eventuele letterbox krijgt `surfaceContainer`. Tijdens laden dezelfde neutrale box, geen shimmer. Bij ontbrekende/kapotte cover: effen container met gecentreerd `book_2`-icoon van 24 dp; titel/auteur buiten de cover blijven zichtbaar. Geef cover `contentDescription=null` als de rij al titel/auteur uitspreekt.

Zoekrij: horizontale layout met 56 × 84 dp cover, 16 dp tussenruimte, tekstkolom met titel 18/24 max 2 regels, auteur 14/20 max 2 regels, jaar en taal 14/20 max 1 regel. MinHeight 116 dp; groeit bij lange tekst. 12 dp verticale padding; divider start bij de tekstkolom. Hele rij opent detail. Rechts alleen een niet-interactieve “In bibliotheek”-check als het boek al bestaat; geen geneste snelle add-knop.

### 8.4 Journalrij

Volledige breedte, geen card. Bovenaan metadata type + locatie, daaronder optionele titel, daaronder bodypreview, daaronder datum. 16 dp verticale padding; 4/8/8 dp tussen tekstgroepen. Preview maximaal 3 regels in ReadingBody. Zonder eigen titel vervalt de titelregel; geen automatisch AI-titeltje maken. Rij opent leesdetail, overflow heeft een afzonderlijk 48 dp doel. Een quote toont een bookmarkdoel in plaats van extra gekleurde badge.

Algemeen Journal voegt vóór de type/locatie-regel de boektitel toe (CoverTitle), zodat losse gedachten hun bron houden. Bookdetail laat die herhaling weg. Alleen het geopende leesdetail toont onbeperkte notitietekst.

### 8.5 Invoer en keuzebladen

Zoekveld: `OutlinedTextField` met search-icon, placeholder “Titel, auteur of ISBN”, trailing clear zodra niet leeg, `ImeAction.Search`; geen autofocus bij het openen van de root. Multilinebody: gewone native Compose `TextField`, transparante container en zonder onderlijn; wel zichtbaar label boven het veld. Cursor `primary`, native selectiemenu en handles.

Selectie met drie tot vijf keuzes: `ModalBottomSheet` met drag handle 32 × 4 dp, titel EditorTitle, keuzerijen minstens 56 dp hoog en een radio/check-icoon. Geen custom carousel of dropdownwebmenu. Bij uitsluitend een keuzeselectie commit een rijtap meteen en sluit het blad; bij een formulier commit uitsluitend de knop onderaan.

### 8.6 Sterrating

Vijf afzonderlijke 48 × 48 dp `IconToggleButton`/selectable doelen in één rij, 8 dp tussenruimte, ster zelf 28 dp. Een tik op N selecteert N hele sterren. Nogmaals tikken op dezelfde ster verandert niets. “Rating wissen” zet de waarde naar null. Onder de rij staat “N van 5 sterren” of “Nog geen rating”. Geen interactieve mini-sterren op de covergrid.

Op een opgeslagen review worden sterren op 20 dp getoond met één leeslabel “4 van 5 sterren”; bewerken gebeurt via de benoemde actie. Geen externe gemiddelde rating of aantal publieke reviews weergeven.
