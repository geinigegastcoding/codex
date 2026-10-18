# Ollo — concept Google Play-vermelding

**Status: concept voor een toekomstige openbare release; niet gepubliceerd en niet ingediend.** De enige gebouwde distributie die in het huidige project is vastgelegd, is versie 0.2.0-review: een privé-review-APK, geen openbare Play Store-release. Deze tekst beschrijft de momenteel geïmplementeerde Android-app en verandert die status niet.

De eerste doelgroep en listing zijn Nederlands. Een Engelstalige fallback is nu niet opgenomen: productinterface, startinstructies en beoogde eerste markt zijn Nederlandstalig. Voeg pas een Engelse vertaling toe wanneer de interface, setup-uitleg, ondersteuning en de complete listing lokaal gecontroleerd zijn.

## Nederlandse tekstvoorstellen

De blokken hieronder zijn de exacte velden die je kunt kopiëren. De telling gebruikt het aantal Unicode-codepoints in elk blok, inclusief spaties en leestekens, exclusief de code fences. Deze telling is apart met code gecontroleerd op 17 oktober 2026. Google Play publiceert maxima van 30 tekens voor de appnaam, 80 voor de korte beschrijving en 4.000 voor de volledige beschrijving.

### Appnaam — 21 / 30 tekens

```text
Ollo: pauze voor apps
```

### Korte beschrijving — 75 / 80 tekens

```text
Pauzeer gekozen apps met routines, inzichten en een optionele offline quiz.
```

### Volledige beschrijving — 1.575 / 4.000 tekens

```text
Ollo helpt je even pauzeren voordat je een app opent die jij hebt gekozen.

Kies zelf welke apps Ollo onderbreekt. Stel korte sessies, dagdoelen en terugkerende routines in. Met een beslismoment bij openen kies je bewust of je verdergaat. Je kunt ook optioneel drie vragen beantwoorden: schaken, rekenen of wist-je-dat. De quiz staat standaard uit. Je kiest zelf of je daarna opent; een quiz heft een vaste blokkade niet op.

Laat bellen, je wekker, Android-instellingen en apps die jij als essentieel kiest bereikbaar. Ollo is vrijwillige appbescherming: je kunt Android-rechten uitschakelen en de app verwijderen. Ollo kan een hele app pauzeren. Selectief blokkeren van Instagram Reels, YouTube Shorts en websites is niet beschikbaar.

Bekijk beschikbare Android-gebruiksgegevens met bron- en dekkingsinformatie. Ontbrekende gegevens worden niet als nul ingevuld. Je kunt je Ollo-gegevens exporteren of meetgegevens wissen.

Privacy en toegang
Ollo heeft geen account, advertenties, server of internettoegang. Ollo bewaart instellingen en meetgegevens op dit toestel. Bij export kies je zelf de opslagplek; dat kan ook een clouddienst zijn. Voor gebruiksinzichten vraagt Ollo om Android-gebruikstoegang. Voor het herkennen en pauzeren van gekozen apps vraagt Ollo om Android-Toegankelijkheid. De service gebruikt app- en vensterwissels om jouw regels toe te passen; scherminhoud, berichten, ingevoerde tekst en screenshots worden niet gelezen of opgeslagen. Je schakelt deze toegang zelf in Android in en kunt die daar weer uitzetten.

Ollo ondersteunt Android 10 en hoger.
```

## Conceptfeaturegraphic —17 oktober

[PNG openen](assets/release/feature-graphic-v1/feature-graphic.png): “Ollo / Een pauze. Jouw keuze.” met de bestaande oranje pixelmascotte. Lokaal gemaakt en visueel gecontroleerd; niet ingediend. De 1024×500 PNG heeft RGB-kleur zonder alpha, volgens Google's [formaatvereisten](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en-en). Hoofdtekst en mascotte staan rond het midden, decoratie aan de randen. Cropping in specifieke Play-oppervlakken en goedkeuring zijn niet vastgesteld.

Nederlandse alt-tekst (98 tekens, onder 140):

```text
De oranje pixelmascotte van Ollo naast de tekst ‘Een pauze. Jouw keuze.’ op een crèmekleurig vlak.
```

[Renderbron](assets/release/feature-graphic-v1/render.mjs), [brief](assets/release/feature-graphic-v1/brief.md) en [controle met hashes](assets/release/feature-graphic-v1/verification.json) zijn bewaard. Mascotte-input is bytegelijk aan de appbron; geen UI of prestatieresultaten zijn nagebootst. Dit voegt één conceptasset toe; eigenaar-invoer en bestaande releasecontroles blijven nodig.

## Productfeiten achter de copy

- Gekozen apps en appregels, dagdoelen, korte sessies, routines, opening prompts, essentiële apps, noodroutes, lokale inzichten en export/wissen zijn aanwezig in 0.2.0-review.
- De quiz heeft drie optionele onderwerpen, staat uit tenzij aangezet en vereist drie juiste antwoorden plus een expliciete bewuste-openactie. Hij omzeilt geen harde blokkade.
- Ollo vereist geen account, server of internetpermission. Android-gebruikstoegang en Accessibility-toegang zijn vrijwillig door de gebruiker in te schakelen en nodig voor de bijbehorende functies.
- De Accessibility-service verwerkt het voorgrondpakket bij `TYPE_WINDOW_STATE_CHANGED`; `canRetrieveWindowContent=false`. De UI beschrijft lokaal gebruik en zegt dat scherminhoud, berichten en screenshots niet worden gelezen.
- Statistieken kunnen onvolledig zijn omdat Android dekkingsverschillen levert. De tekst zegt daarom “beschikbare … gegevens” en belooft geen besparing, verbetering of complete historie.
- Geselecteerde apps worden als geheel onderbroken. De listing sluit selectieve Reels/Shorts- en websiteblokkering uit.

## Vereiste eigenaar-invoer vóór indiening

- **Publieke listing-identiteit:** bevestig het bedoelde pakket `app.ollo` in de eigen Play Console en de exacte toekomstige listing-URL. Andere openbare apps gebruiken de naam Ollo; de bestaande beschrijvende titel blijft een hypothese. Publieke pakketbeschikbaarheid is niet vastgesteld. Zie [[MARKETING]] voor de beperkte naamcheck.
- **Developer name en support e-mailadres:** ontbreekt in de aangeleverde context; eigenaar moet de juiste openbare contactgegevens bevestigen.
- **Privacy policy URL:** ontbreekt. De app bevat wel een privacy-uitleg, maar dat vervangt geen aparte privacy-policy URL wanneer Play die voor de submission vereist.
- **Publieke distributiestatus en signing:** 0.2.0-review is een private APK. Bevestig de officiële release, eigenaar-beheerde signing, ondersteunde apparaten en updatepad voordat gebruikers naar een storelisting worden geleid.
- **Play Console declaration, Data safety en toestemmingsvideo:** nog niet ingediend of goedgekeurd. De Accessibility-service is niet als accessibility-tool gemarkeerd.
- **Locale en claims:** bevestig Nederland als eerste store-locale; check alle beweringen tegen precies de te uploaden release, inclusief fysieke toestellen.

## Bewust niet opgenomen

Geen claims over minder schermtijd, bespaarde uren, productiviteit, gezondheid, slaap, verslaving, testimonials, downloads, beoordelingen, feed-only blocking, cloudsync of een openbare Play Store-release. Geen ontwikkelaarscontact, prijs of privacy-URL is verzonnen.

## Bronnen

Geraadpleegd op **16 oktober 2026**. Google Play noemt 30 tekens voor de appnaam, 80 voor de korte tekst en 4.000 voor de volledige tekst. De listing is een concept; naleving/goedkeuring is niet vastgesteld.

- Google Play Console Help, [Create and set up your app](https://support.google.com/googleplay/android-developer/answer/9859152?hl=en-EN) — veldlimieten.
- Google Play Console Help, [Use of the AccessibilityService API](https://support.google.com/googleplay/android-developer/answer/10964491?hl=en) — verklaring en disclosure voor apps die geen accessibility-tool zijn.
- Google Play Console Help, [Best practices for prominent disclosure and consent](https://support.google.com/googleplay/android-developer/answer/11150561?hl=en) — disclosure hoort in de app vlak vóór de relevante toegangsvraag.

Bronnen voor productfeiten: repository `README.md`, `docs/VERIFICATION.md`, `app/src/main/java/app/ollo/ui/Onboarding.kt`, `app/src/main/java/app/ollo/ui/OlloApp.kt`, `app/src/main/java/app/ollo/platform/OlloAccessibilityService.kt`, `app/src/main/res/xml/accessibility_service.xml` en `app/src/main/res/values/strings.xml`, lokaal gecontroleerd op 16 oktober 2026.

**Controle 17 oktober:** exportcopy verduidelijkt aan de hand van de bestaande Settings/Privacy-uitleg en Android-bestandskiezer. Appnaam, korte tekst en volledige tekst opnieuw geteld; Google's veldlimieten en previewformaat zijn opnieuw geopend. Bestaande afbeeldingsexports zijn ongewijzigd.
