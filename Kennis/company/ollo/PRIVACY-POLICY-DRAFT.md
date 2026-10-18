---
title: Ollo privacy policy draft
created: 2026-10-17
updated: 2026-10-17
type: project
status: internal-draft-not-published
tags: [ollo, android, privacy, draft]
sources: [https://github.com/geinigegastcoding/Ollo]
---

# Privacy policy draft — Ollo

**Internal preparation only. Do not publish as-is.** The public copy below describes the current offline, accountless Android implementation. Owner details, public hosting and audience inputs are not yet known.

## Interne voorbereiding — niet opnemen in publieke tekst

| Required input before publication | Current status |
|---|---|
| Legal developer/owner name, consistent with the intended Play listing | **Required from owner; unknown.** The app name Ollo is used in the draft, but is not a legal entity. |
| Privacy contact or inquiry mechanism | **Required from owner; unknown.** Do not invent an email or contact URL. |
| Public policy URL and hosting owner | **Required from owner; unknown.** Must be an active, public, non-geofenced, non-editable web page (not a PDF) if used for Play; this Markdown file is not a hosted policy. |
| Effective date | **Required before publication; unknown.** The document creation date is not an effective date. |
| Intended countries/regions and audience/age declaration | **Required from owner; unknown.** No age restriction or target audience is inferred here. |
| Legal review, including applicable legal basis and jurisdictional requirements | **Not assessed.** This draft makes no legal-basis or compliance claim. |

## Voorgestelde publieke tekst (Nederlands)

# Privacybeleid Ollo

*Concepttekst voor de huidige Android-versie. Nog aan te vullen met de eigenaar, contactgegevens en ingangsdatum.*

De huidige Ollo-app werkt zonder account of eigen server en gebruikt zelf geen internettoegang. De huidige Android-app bevat geen advertenties, analytics-, crashrapportage- of betaal-SDK. Ollo verwerkt app- en gebruiksgegevens lokaal op je toestel om jouw gekozen regels toe te passen en je gebruiksoverzicht te tonen.

### Welke gegevens Ollo verwerkt

Om apps te kunnen kiezen, vraagt Ollo Android om de lijst met startbare apps. Ollo gebruikt de pakketnaam en de zichtbare appnaam; de lijst wordt in het geheugen bijgewerkt. De pakketten die je kiest en je regels worden lokaal opgeslagen.

Als je Toegankelijkheid aanzet, ontvangt Ollo meldingen wanneer de voorgrond-app of het venster verandert. Ollo gebruikt de pakketnaam om regels toe te passen. Voor eigen gebruiksintervallen verwerkt Ollo ook voorgrondgebruik van andere apps dan alleen de apps die je hebt gekozen. Ollo slaat zulke intervallen lokaal op met pakketnaam, begin- en eindtijd, duur en tijdzone. Ollo slaat geen scherminhoud, berichten, ingevoerde tekst of screenshots op. Ollo haalt geen vensterinhoud op.

Als je Android-gebruikstoegang verleent, kan Ollo daarnaast Androids eigen daggegevens lezen: pakketnamen, het tijdvak van een dagcijfer en de totale tijd op de voorgrond. Ollo gebruikt beschikbare gegevens voor een overzicht van maximaal 30 voorgaande dagen. Je kunt ook zelf de zeven dagen vóór vandaag importeren als beginpunt; Ollo bewaart dan de beschikbare daggegevens met de appfilters die op dat moment gelden. Dit is een aparte bron naast Ollo’s eigen intervalmeting. Android beheert zijn gebruikshistorie; Ollo kan die niet wissen.

Ollo bewaart lokaal ook je gekozen appregels, timers, schema’s, doelen, routine- en quizvoorkeuren, favorieten, geïmporteerde beginpunt en dagresultaten. Deze gegevens staan in de privéopslag van Ollo op je toestel.

### Bewaren en verwijderen

Bij het verwerken van een nieuwe dag verwijdert Ollo eigen gebruiksintervallen die ouder zijn dan 32 dagen. Als Ollo intussen geen nieuwe dag verwerkt, wacht deze opruiming tot een volgende verwerking. Ollo bewaart maximaal 370 dagresultaten en maximaal 370 ochtendstarts; dit zijn aantallen registraties, geen vaste bewaartermijn in dagen.

Kies **Instellingen → Wis Ollo-meetgegevens** om alleen Ollo-intervalgegevens, het geïmporteerde beginpunt, dagresultaten en meettellers te verwijderen. Je appregels, overige instellingen en operationele gegevens die nodig zijn om ingestelde regels uit te voeren blijven staan; ook opgeslagen ochtendstarts worden niet door deze knop verwijderd. Daarna kan Ollo Androids nog beschikbare gebruikshistorie opnieuw lezen en in het overzicht tonen. Deze actie wist Androids eigen historie of eerder opgeslagen exportbestanden niet. Wil je de lokale Ollo-opslag helemaal verwijderen, dan kun je Ollo via Android verwijderen; Android-gebruikshistorie en geëxporteerde bestanden vallen daarbuiten.

Je kunt Gebruikstoegang of Toegankelijkheid op elk moment uitschakelen via Android-instellingen. Dat stopt verdere toegang via die voorziening, maar wist niet automatisch gegevens die Ollo al lokaal heeft opgeslagen.

### Export, back-up en overdracht

Exporteren is handmatig. Bij **Exporteer dagcijfers (CSV)** maakt Ollo een bestand met dagen, pakketnamen, voorgrondtijd, gegevensbron en classificatieversie, op basis van de beschikbare geschiedenis en vandaag. **Exporteer gegevens (JSON)** bevat je configuratie, een eventueel geïmporteerd beginpunt en dagresultaten. Android laat jou de bestemming kiezen. Die kan lokaal zijn of bij een cloudprovider; Ollo geeft het bestand aan de gekozen bestemming en beheert niet hoe die aanbieder het opslaat, synchroniseert of verwijdert. Ollo kan een opgeslagen export niet wissen.

De huidige Android-configuratie sluit Ollo-appgegevens uit van Android-cloudback-up en toesteloverdracht. Als je Ollo verwijdert, vallen eerder geëxporteerde bestanden buiten Ollo’s beheer.

## Source-backed preparation notes — internal

- The description of collection and sharing should match both the app and Play disclosures. Google Play’s [User Data policy](https://support.google.com/googleplay/android-developer/answer/10144311?hl=en) requires a policy that explains data access, use, handling, sharing, security, retention and deletion; it specifically calls out installed-app inventory and security-related apps. The page also says a Play policy must name the app or listing entity, include developer/privacy contact details, and be publicly accessible at an active non-PDF URL. **This is a preparation checklist, not legal approval.**
- Google Play’s [Data safety section guidance](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en) distinguishes local-only processing from off-device collection and explains user-directed transfers. This draft therefore describes the document-provider handoff and possible cloud destination without promising the provider’s practices. **The final Data safety classification remains a separate owner/developer decision.**
- Repository evidence reviewed: `PlatformAccess.apps`; `OlloAccessibilityService.onAccessibilityEvent`; `accessibility_service.xml`; `UsageReader` and `UsageHistoryReader`; `AppController.account`, `readUsage`, `finalizeDay`, `clearMeasurement`, `exportCsv`, and `exportSettings`; `Models.Config` / `StoredState`; `OlloDatabase`; `OlloApp.SettingsScreen` / `PrivacyScreen`; `AndroidManifest.xml`; Gradle dependencies; `backup_rules.xml` and `data_extraction_rules.xml`.
- Android documents that app-specific storage is removed when the app is uninstalled: [app-specific storage](https://developer.android.com/training/data-storage/app-specific). This does not remove shared document exports or OS-owned UsageStats. Parent review also corrected the usage-bucket description: `firstTimeStamp` / `lastTimeStamp` identify the aggregation window, not exact first/last app-open events.
- Recheck the exact release artifact, manifest, SDK inventory and permission/export flows before publishing. The text does not certify compliance or resolve the legal classification of package and usage data.

---
**Public copy word count:** 575 words (Unicode letter/number tokens, including headings).

